 const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "volunteers";
const auditServices = require('../services/auditServices');
const constants = require("../constants/index");
const URL = constants.IMAGE_URL;

class VolunteerServices {
  async addVolunteerAsync(userId, data) {
    try {
      const newVolunteer = {
        profession: data.professionId,
        user_id: data.volUserId
      }

      const [vol_id] = await knex(tableName).insert(newVolunteer);
      var insertedVolunteer = await knex(tableName).where({ vol_id: vol_id }).first();

      await auditServices.afterInsertAsync(userId, tableName, vol_id, insertedVolunteer);
      return {      
        message: "Volunteer Added Successfully",
        statusCode: 201,
        success: true,
        data: vol_id
      };
    }
    catch (error) {
      return {
        message: error.message,
        statusCode: 400,
        success: false,
        data: null
      };
    }
  }

  async getAllVolunteersAsync({ page = 1, pageSize = 10, search, selectedVillage, isActive = null, sortBy = 'vol_id', sortOrder = 'desc' }) {
    try {
      const offset = (page - 1) * pageSize;
      let query = knex(tableName)
        .select(
          'users.full_name as name',
          'users.email as email',
          'users.mobile as mobile',
          'users.dob as dob',
          'users.gender as gender',
          'users.user_profile as userProfile',
          'users.contact_mode as contactMode',
          'villages.village_name as village',
          'users.address_line1 as addressLine1',
          'users.address_line2 as addressLine2',
          'users.pincode as pincode',
          'users.state as state',
          'users.about as about',
          'volunteers.vol_id as volunteerId',
          'professions.profession_name as profession',
          'interests.interest as interests',
        )
        .leftJoin('users', 'volunteers.user_id', 'users.user_id')
        .leftJoin('villages', 'users.village', 'villages.vill_id')
        .leftJoin('professions', 'volunteers.profession', 'professions.profession_id')
        .leftJoin('interests', 'volunteers.interests', 'interests.interest_id')
        .where('users.is_deleted', false).andWhere('volunteers.is_deleted', false);

      let countQuery = knex(tableName)
        .count('vol_id as count')
        .leftJoin('users', 'volunteers.user_id', 'users.user_id')
        .where('volunteers.is_deleted', false);

      if (search) {
        query = query.andWhere(builder => {
          builder.where('users.full_name', 'like', `%${search}%`)
            .orWhere('users.email', 'like', `%${search}%`);
        });
        countQuery = countQuery.andWhere(builder => {
          builder.where('users.full_name', 'like', `%${search}%`)
            .orWhere('users.email', 'like', `%${search}%`);
        });
      }

      if (selectedVillage) {
        query = query.andWhere('users.village', selectedVillage);
        countQuery = countQuery.andWhere('users.village', selectedVillage);
      }

      if (isActive) {
        query = query.andWhere('users.is_active', true);
        countQuery = countQuery.andWhere('users.is_active', true);
      }

      query = query.orderBy(sortBy, sortOrder);
      query = query.limit(pageSize).offset(offset);

      let volunteers = await query;
      const [{ count }] = await countQuery;

      const processedVolunteers = volunteers.map(vol => {
        vol.userProfile = vol.userProfile
          ? `${URL}/userProfile/${vol.userProfile}`
          : null;

        return vol;
      });

      return {
        message: "Fetched Successfully",
        statusCode: 200,
        success: true,
        data: {
          volunteers: processedVolunteers,
          pagination: {
            total: parseInt(count, 10),
            currentPage: page,
            totalPages: Math.ceil(count / pageSize)
          }
        }
      };
    }
    catch (error) {
      return {
        message: error.message,
        statusCode: 400,
        success: false,
        data: null
      };
    }
  }

  async getVolunteerAsync(volId) {
    try {
      let volunteer = await knex(tableName)
        .select(
          'volunteers.vol_id as volunteerId',
          'professions.profession_name as profession',
          'interests.interest as interests',
          'volunteers.user_id as userId',
          'users.full_name as name',
          'users.email as email',
          'users.mobile as mobile',
          'users.dob as dob',
          'users.gender as gender',
          'users.user_profile as userProfile',
          'users.contact_mode as contactMode',
          'villages.village_name as village',
          'users.address_line1 as addressLine1',
          'users.address_line2 as addressLine2',
          'users.pincode as pincode',
          'users.state as state',
          'users.about as about',
          knex.raw(`
            JSON_OBJECT(
              'Instagram', socialMedia.Instagram,
              'facebook', socialMedia.facebook,
              'linkedin', socialMedia.linkedin,
              'youtube', socialMedia.youtube,
              'twitter', socialMedia.twitter
            ) AS socialMedia
          `)
        )
        .leftJoin('users', 'volunteers.user_id', 'users.user_id')
        .leftJoin('villages', 'users.village', 'villages.vill_id')
        .leftJoin('professions', 'volunteers.profession', 'professions.profession_id')
        .leftJoin('interests', 'volunteers.interests', 'interests.interest_id')
        .leftJoin('socialMedia', 'volunteers.user_id', 'socialMedia.userId')
        .where('users.is_deleted', false).andWhere('volunteers.is_deleted', false).andWhere('volunteers.vol_id', volId)
        .first();

      if (volunteer) {
        volunteer.userProfile = volunteer.userProfile
          ? `${URL}/userProfile/${volunteer.userProfile}`
          : null;

        return {
          message: "Fetched Successfully",
          statusCode: 200,
          success: true,
          data: volunteer,
        };
      }
    } catch (err) {
      return {
        message: err.message,
        statusCode: 400,
        success: false,
        data: null,
      };
    }
  }

  async updateVolunteerAsync(userId, volId, data) {
    try {
      const volBeforeUpdate = await knex(tableName).where({ vol_id: volId }).first();

      await knex(tableName)
        .where('vol_id', volId)
        .update({
          profession: data.profession,
          interests: data.interests,
        });

      const volAfterUpdate = await knex(tableName).where({ vol_id: volId }).first();

      await auditServices.afterUpdateAsync(userId, tableName, volId, volBeforeUpdate, volAfterUpdate);

      return {
        message: "Updated Successfully",
        statusCode: 200,
        success: true,
      };

    } catch (err) {
      return {
        message: err.message,
        statusCode: 400,
        success: false
      };
    }
  }

  async updateVolunteerByUserIdAsync(userId, data) {
    try {
      await knex(tableName)
        .where('user_id', userId)
        .update({
          profession: data.profession,
          interests: data.interests,
        });

      return {
        message: "Updated Successfully",
        statusCode: 200,
        success: true,
      };

    } catch (err) {
      return {
        message: err.message,
        statusCode: 400,
        success: false
      };
    }
  }

  async deleteVolunteerAsync(userId, volId) {
    try {
      await knex(tableName)
        .where('vol_id', volId)
        .update({
          is_deleted: true,
          deleted_on: new Date(),
        });

      await auditServices.afterDeleteAsync(userId, tableName, volId);

      return {
        message: "Deleted Successfully",
        statusCode: 200,
        success: true,
      };

    } catch (err) {
      return {
        message: err.message,
        statusCode: 400,
        success: false
      };
    }
  }

  async getVolunteerByUserIdAsync(userId) {
    try {
      const volunteer = await knex(tableName)
        .select(
          'volunteers.vol_id as volunteerId',
          'professions.profession_name as profession',
          'interests.interest as interests',
          'volunteers.user_id as userId',
          'users.full_name as name',
          'users.email as email',
          'users.mobile as mobile',
          'users.dob as dob',
          'users.gender as gender',
          'users.user_profile as userProfile',
          'users.contact_mode as contactMode',
          'villages.village_name as village',
          'users.address_line1 as addressLine1',
          'users.address_line2 as addressLine2',
          'users.pincode as pincode',
          'users.state as state',
          'users.about as about'
        )
        .leftJoin('users', 'volunteers.user_id', 'users.user_id')
        .leftJoin('villages', 'users.village', 'villages.vill_id')
        .leftJoin('professions', 'volunteers.profession', 'professions.profession_id')
        .leftJoin('interests', 'volunteers.interests', 'interests.interest_id')
        .where('users.is_deleted', false)
        .andWhere('volunteers.is_deleted', false)
        .andWhere('volunteers.user_id', userId)
        .first();
  
      if (volunteer) {
        volunteer.userProfile = volunteer.userProfile
          ? `${URL}/userProfile/${volunteer.userProfile}`
          : null;
  
        return {
          message: "Fetched Successfully",
          statusCode: 200,
          success: true,
          data: volunteer,
        };
      } else {
        return {
          message: "Volunteer not found",
          statusCode: 404,
          success: false,
          data: null,
        };
      }
    } catch (error) {
      return {
        message: error.message,
        statusCode: 400,
        success: false,
        data: null,
      };
    }
  }
}

module.exports = new VolunteerServices();