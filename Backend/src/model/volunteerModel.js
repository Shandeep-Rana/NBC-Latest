const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "volunteers";

const constants = require("../constants/index");
const URL = constants.IMAGE_URL;

module.exports = {
  //adding new user

  addVolunteer: async (volunteer) => {
    try {
      const [volunteerId] = await knex(tableName).insert(volunteer);
      return volunteerId;
    } catch (error) {
      console.error("Error adding volunteer:", error);
      throw error;
    }
  },

  // Get all volunteers
  getAllVolunteers: async ({
    searchTerm,
    sortBy,
    sortOrder,
    page,
    pageSize,
    selectedVillage,
  }) => {
    let query = knex('volunteers')
    .select(
      'volunteers.volunteerId',
      'volunteers.fullName',
      'volunteers.email',
      'volunteers.contact',
      'volunteers.profession',
      'volunteers.intrests',
      'volunteers.dob',
      'volunteers.village',
      'volunteers.comment',
      'volunteers.gender',
      'users.password',
      'users.user_profile',
      'volunteers.pincode',
      'volunteers.address_line1',
      'volunteers.address_line2',
      'volunteers.state',
      'volunteers.isdeleted',
      'volunteers.isactivated',
      'volunteers.deletedOn',
      'volunteers.activatedOn',
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
    .leftJoin('users', 'volunteers.userId', 'users.user_id')
    .join('userRole', 'users.user_id', 'userRole.userId')
    .join('roles', 'userRole.roleId', 'roles.roleId')
    .leftJoin('socialMedia', 'volunteers.userId', 'socialMedia.userId')
    .where('roles.roleName', 'volunteer');

    if (searchTerm) {
      query = query.where((builder) => {
        builder
          .where("volunteers.fullName", "like", `%${searchTerm}%`)
          .orWhere("volunteers.email", "like", `%${searchTerm}%`)
          .orWhere("volunteers.contact", "like", `%${searchTerm}%`);
      });
    }
    query = query.orderBy("activatedOn", "desc");

    if (selectedVillage) {
      query = query.where("village", selectedVillage);
    }

    // Sorting
    if (sortBy && sortOrder) {
      query = query.orderBy(sortBy, sortOrder);
    }

    // Pagination
    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query = query.offset(offset).limit(pageSize);
    }
    const totalCountQuery = knex(tableName).count("* as total");
    const totalCountResult = await totalCountQuery.first();

 const volunteerData = await query;

 // Modify each donor object to include imageUrl
 const volunteersWithImageUrl = volunteerData.map(volunteer => {
   const imageUrl = volunteer.userProfile
     ? `${URL}/userProfile/${volunteer.userProfile}`
     : null;
   return { ...volunteer, imageUrl };
 });

 return {
   data: volunteersWithImageUrl,
   totalCount: totalCountResult.total,
 };
},

  // Get user by ID
  getVolunteerById: async (volunteerId) => {
    return knex(tableName)
      .select(`${tableName}.*`, "users.user_profile", "users.password")
      .join("users", `${tableName}.userId`, "users.user_id")
      .where(`${tableName}.volunteerId`, volunteerId)
      .first();
  },

  // Update volunteer by ID
  updateVolunteerById: async (volunteerId, updatedVolunteerData) => {
    try {
      const validFields = [
        "fullName",
        "email",
        "contact",
        "gender",
        "address_line1",
        "address_line2",
        "village",
        "pincode",
        "state",
        "dob",
        "intrests",
        "profession",
        "contactMode",
        "comment",
      ];

      const filteredData = Object.keys(updatedVolunteerData)
        .filter((key) => validFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updatedVolunteerData[key];
          return obj;
        }, {});

      const updatedVolunteer = await knex("volunteers")
        .where("volunteerId", volunteerId)
        .update(filteredData);

      if (updatedVolunteer === 0) {
        return null;
      }

      return updatedVolunteerData;
    } catch (error) {
      throw error;
    }
  },

  // Delete user by ID
  deleteVolunteerById: async (volunteerId) => {
    return knex(tableName).where("volunteerId", volunteerId).del();
  },

  // Get user by email
  getVolunteerByEmail: async (email) => {
    return knex
      .select("volunteers.*", "roles.roleName")
      .from("volunteers")
      .where("volunteers.email", email)
      .leftJoin("userRole", "volunteers.volunteerId", "userRole.userId")
      .leftJoin("roles", "userRole.roleId", "roles.roleId")
      .first();
  },
};
