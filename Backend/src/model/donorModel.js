const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "donor";

const constants = require("../constants/index");
const URL = constants.IMAGE_URL;

module.exports = {
  //adding new donor
  addDonor: async (donor) => {
    try {
      const [donorId] = await knex(tableName).insert(donor);
      return donorId;
    } catch (error) {
      console.error("Error adding donor:", error);
      throw error;
    }
  },

  // Get all donor
  getAllDonors: async ({
    searchTerm,
    sortBy,
    sortOrder,
    page,
    pageSize,
    selectedBloodGroup,
  }) => {
    const decodedBloodGroup = decodeURIComponent(selectedBloodGroup);
    let query = knex(tableName).select(
      "donorId",
      "fullName",
      "email",
      "dob",
      "gender",
      "medicalhistory",
      "contact",
      "blood_type",
      "village",
      "pincode",
      "address_line1",
      "address_line2",
      "state",
      "isdeleted",
      "isactivated",
      "deletedOn",
      "activatedOn",
      "donorProfile"
    );

    // Searching
    if (searchTerm) {
      query = query.where((builder) => {
        builder
          .where("fullName", "like", `%${searchTerm}%`)
          .orWhere("email", "like", `%${searchTerm}%`)
          .orWhere("contact", "like", `%${searchTerm}%`)
          .orWhere("village", "like", `%${searchTerm}%`)
          .orWhere("address_line1", "like", `%${searchTerm}%`)
          .orWhere("state", "like", `%${searchTerm}%`)
      });
    }

    if (decodedBloodGroup) {
      query = query.where("blood_type", decodedBloodGroup);
    }
    query = query.orderBy("activatedOn", "desc");

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

   // Fetch donors' data
  const donorsData = await query;

  // Modify each donor object to include imageUrl
  const donorsWithImageUrl = donorsData.map(donor => {
    const imageUrl = donor.donorProfile
      ? `${URL}/donorProfile/${donor.donorProfile}`
      : null;
    return { ...donor, imageUrl };
  });

  return {
    data: donorsWithImageUrl,
    totalCount: totalCountResult.total,
  };
},

  // Get donor by ID
  getdonorById: async (donorId) => {
    return knex(tableName).where("donorId", donorId).first();
  },

  // Update donor by ID
  updateDonorById: async (donorId, updatedDonorData) => {
    return knex(tableName).where("donorId", donorId).update(updatedDonorData);
  },

  // Delete donor by ID
  deletedonorById: async (donorId) => {
    return knex(tableName).where("donorId", donorId).del();
  },

  // Get donor by email
  getdonorByEmail: async (email) => {
    return knex(tableName).where("email", email).first();
  },
};
