const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "skilledperson";

const constants = require("../constants/index");
const URL = constants.IMAGE_URL;

module.exports = {
  //adding new user
  addSkilledPerson: async (skilledPerson) => {
    try {
      const [personId] = await knex(tableName).insert(skilledPerson);
      return personId;
    } catch (error) {
      console.error("Error adding skilledPerson:", error);
      throw error;
    }
  },

  // Get all skilled personss
  getAllSkilledPerson: async ({
    searchTerm,
    sortBy,
    sortOrder,
    page,
    pageSize,
    selectedVillage,
  }) => {
    let query = knex(tableName)
    .select(
      'skilledperson.personId',
      'skilledperson.fullName',
      'skilledperson.email',
      'contact',
      'profession',
      'intrests',
      'dob',
      'village',
      'comment',
      'gender',
      'users.password',
      'contactMode',
      'users.user_profile',
      'pincode',
      'address_line1',
      'address_line2',
      'state',
      'skilledperson.isdeleted',
      'skilledperson.isactivated',
      'skilledperson.deletedOn',
      'skilledperson.activatedOn',
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
    .join('users', 'skilledperson.userId', 'users.user_id')
    .join('userRole', 'skilledperson.userId', 'userRole.userId')
    .join('roles', 'userRole.roleId', 'roles.roleId')
    .leftJoin('socialMedia', 'skilledperson.userId', 'socialMedia.userId')
    .where('roles.roleName', 'skilled person');

    if (searchTerm) {
      query = query.where((builder) => {
        builder
          .where("skilledperson.fullName", "like", `%${searchTerm}%`)
          .orWhere("skilledperson.email", "like", `%${searchTerm}%`)
          .orWhere("skilledperson.contact", "like", `%${searchTerm}%`);
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
  getSkilledPersonsById: async (personId) => {
    return knex(tableName)
      .select(`${tableName}.*`, "users.user_profile", "users.password")
      .join("users", `${tableName}.userId`, "users.user_id")
      .where(`${tableName}.personId`, personId)
      .first();
  },

  // Update Skilled Person by ID
  updateSkilledPersonById: async (personId, updatedSkilledPersonData) => {
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
        "userProfile"
      ];

      const filteredData = Object.keys(updatedSkilledPersonData)
        .filter((key) => validFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updatedSkilledPersonData[key];
          return obj;
        }, {});

      const updatedSkilledPerson = await knex(tableName)
        .where("personId", personId)
        .update(filteredData);

      if (updatedSkilledPerson === 0) {
        return null;
      }

      return updatedSkilledPersonData;
    } catch (error) {
      throw error;
    }
  },

  // Delete user by ID
  deleteSkilledPersonById: async (personId) => {
    return knex(tableName).where("personId", personId).del();
  },

  // Get user by email
  getSkilledPersonByEmail: async (email) => {
    return knex
      .select("skilledperson.*", "roles.roleName")
      .from("skilledperson")
      .where("skilledperson.email", email)
      .leftJoin("userRole", "skilledperson.personId", "userRole.userId")
      .leftJoin("roles", "userRole.roleId", "roles.roleId")
      .first();
  },
};
