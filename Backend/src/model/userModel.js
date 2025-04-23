const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const bcrypt = require("bcryptjs");
const tableName = "users";

module.exports = {
  //adding new user
  addUser: async (user) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      const userWithHashedPassword = {
        ...user,
        password: hashedPassword,
      };
      const [userId] = await knex(tableName).insert(userWithHashedPassword);
      return userId;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  },

  // Update user by ID including related tables
  updateUserById: async (userId, updatedUserData) => {
    try {
      // Update user data
      await knex(tableName).where("userId", userId).update(updatedUserData);

      // Check if the user exists in the skilled table
      const skilledPersonExists = await knex("skilledperson")
        .where("userId", userId)
        .first();

      // Check if the user exists in the volunteer table
      const volunteerExists = await knex("volunteers")
        .where("userId", userId)
        .first();

      // Update skilled person data if exists
      if (skilledPersonExists) {
        await knex("skilledperson")
          .where("userId", userId)
          .update(updatedUserData.skilledPersonData);
      }

      // Update volunteer data if exists
      if (volunteerExists) {
        await knex("volunteers")
          .where("userId", userId)
          .update(updatedUserData.volunteerData);
      }

      // Return updated user data
      return await knex(tableName).where("userId", userId).first();
    } catch (error) {
      console.error("Error updating user by ID:", error);
      throw error;
    }
  },

  // Delete user by ID
  deleteUserById: async (userId) => {
    return knex(tableName).where("userId", userId).del();
  },

  getUserByEmail: async (email) => {
    return knex
      .select("users.*", "roles.roleName")
      .from("users")  
      .leftJoin("userRole", function () {
        this.on("users.user_id", "=", "userRole.userId");
      })
      .leftJoin("roles", function () {
        this.on("userRole.roleId", "=", "roles.roleId");
      })
      .where("users.email", email)
      .first()
      .then(async (user) => {
        if (user) {
          if (user.roleName === "volunteer") {
            // Retrieve additional data for volunteers
            const volunteerData = await knex
              .select("volunteers.*")
              .from("volunteers")
              .where("volunteers.userId", user.userId)
              .first();
            user.volunteerData = volunteerData;
          } else if (user.roleName === "skilledperson") {
            // Retrieve additional data for skilled persons
            const skilledPersonData = await knex
              .select("skilledperson.*")
              .from("skilledperson")
              .where("skilledperson.userId", user.userId)
              .first();
            user.skilledPersonData = skilledPersonData;
          } else if (user.roleName === "admin") {
            // Check in both tables for admin role
            const volunteerData = await knex
              .select("volunteers.*")
              .from("volunteers")
              .where("volunteers.userId", user.userId)
              .first();
            const skilledPersonData = await knex
              .select("skilledperson.*")
              .from("skilledperson")
              .where("skilledperson.userId", user.userId)
              .first();
            user.volunteerData = volunteerData;
            user.skilledPersonData = skilledPersonData;
          }
        }
        return user;
      });
  },

  //role om the basis of email
  getRoleNameByEmail: async (email) => {
    try {
      const roleName = await knex("userRole")
        .select("roles.roleName")
        .join("roles", "userRole.roleId", "=", "roles.roleId")
        .join("users", "userRole.userId", "=", "users.user_id")
        .where("users.email", email);

      if (!roleName) {
        return null;
      }
      return roleName;
    } catch (error) {
      console.error("Error getting role name by email:", error);
      throw error;
    }
  },

  // Get donor by ID
  getUserById: async (userId) => {
    return knex(tableName).where("userId", userId).first();
  },

  //user role on the basis of id
  getUserRoleById: async (userId) => {
    try {
      const userRole = await knex("user_roles")
        .select("roles.role_name")
        .leftJoin("roles", "user_roles.role_id", "roles.role_id")
        .where("user_roles.user_id", userId)
        .first();

      if (!userRole) {
        return null; // User role not found
      }

      return userRole.roleName;
    } catch (error) {
      console.error("Error getting user role by ID:", error);
      throw error;
    }
  },

  //updateuser password
  updateUserPassword: async (userId, newPassword) => {
    try {
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update the password in the database
      await knex(tableName)
        .where("userId", userId)
        .update({ password: hashedPassword });

      return true; // Password updated successfully
    } catch (error) {
      console.error("Error updating user password:", error);
      throw error;
    }
  },

  // Add this function to your module
  updateUserProfileById: async (userId, newProfileData) => {
    try {
      // Update the userProfile field in the database
      await knex(tableName)
        .where("userId", userId)
        .update({ userProfile: newProfileData });

      return true; // UserProfile updated successfully
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  updateAdminDetailsAsync: async (userId, data) => {
    try {
      // Update the userProfile field in the database
      await knex(tableName)
        .where("user_id", userId)
        .update({ full_name: data.name });

      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  //verify User Account
  verifyUserAccount: async (userId) => {
    try {
      await knex(tableName)
        .where("userId", userId)
        .update({ isactivated: true });

      return true;
    } catch (error) {
      console.error("Verify Account:", error);
      throw error;
    }
  },

};
