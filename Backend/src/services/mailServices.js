const otpServices = require('../services/otpServices');
const constants = require('../constants/index');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const { transporter, transporter2 } = require("../../middelware/emailTranspoter");
const commonFunc = require('../utils/common');
const donorServices = require('./donorServices');
const userServices = require('./userServices');

class MailServices {

  async sendEmail(mailOptions) {
    try {
      // Try sending the email using transporter1
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully via transporter1.");
    } catch (error) {
      console.error("Error sending email via transporter1:", error);
      try {
        // If an error occurs, fallback to transporter2
        await transporter2.sendMail(mailOptions);
        console.log("Email sent successfully via transporter2.");
      } catch (error) {
        console.error("Error sending email via transporter2:", error);
        throw new Error("Failed to send email using both transporters.");
      }
    }
  }

  async sendVerifyOtpMail(userId, email, id) {
    try {
      const otpCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
      const otpExpiryDate = new Date(Date.now() + 36 * 60 * 60 * 1000);

      const otpResult = await otpServices.savePasswordOtp({
        otp: otpCode,
        expiry_date: otpExpiryDate,
        user_id: userId,
      });

      if (!otpResult.success) {
        throw new Error(otpResult.message);
      }

      const encryptedUserId = commonFunc.encrypt(userId);
      let verifyLink = `${constants.WEBAPP_PATH}/auth/verify-account/${encryptedUserId}`;
      if (id !== "null") {
        verifyLink += `-${id}`;
      }

      const templatePath = path.join(constants.HTML_PATH, "verify-otp.html");
      const data = await fs.promises.readFile(templatePath, "utf8");
      const htmlContent = ejs.render(data, { otpCode, verifyLink });

      const mailOptions = {
        from: { name: "Nangal By Cycle", address: constants.SMTP_MAIL_ADDRESS },
        to: email,
        subject: "Account Verification",
        html: htmlContent,
      };
      try {
        await transporter.sendMail(mailOptions);
        console.log("OTP email sent successfully via transporter1.");
      } catch (error) {
        console.error("Error sending OTP email via transporter1:", error);
        try {
          await transporter2.sendMail(mailOptions);
        } catch (error) {
          console.error("Error sending OTP email via transporter2:", error);
          throw new Error("Failed to send OTP email using both transporters.");
        }
      }

      return {
        message: "Mail Sent Successfully",
        statusCode: 200,
        success: true,
      };
    } catch (error) {
      return {
        message: error.message,
        statusCode: 400,
        success: false,
      };
    }
  }

  async sendForgotPasswordMail(userId, email) {
    try {
      const otpCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
      const otpExpiryDate = new Date(Date.now() + 15 * 60 * 1000);
  
      const otpResult = await otpServices.savePasswordOtp({
        otp: otpCode,
        expiry_date: otpExpiryDate,
        user_id: userId,
      });
  
      if (!otpResult.success) {
        throw new Error(otpResult.message);
      }
  
      const encryptedUserId = commonFunc.encrypt(userId);
      const resetPasswordLink = `${constants.WEBAPP_PATH}/auth/reset-password/${encryptedUserId}`;
      const templatePath = path.join(constants.HTML_PATH, "forgot-password.html");
      const data = await fs.promises.readFile(templatePath, "utf8");
      const htmlContent = ejs.render(data, { otpCode, resetPasswordLink });
  
      const mailOptions = {
        from: { name: "Nangal By Cycle", address: constants.SMTP_MAIL_ADDRESS },
        to: email,
        subject: "Forgot Password OTP",
        html: htmlContent,
      };
  
      try {
        await transporter.sendMail(mailOptions);
        console.log("Forgot Password email sent successfully via transporter1.");
      } catch (error) {
        console.error("Error sending Forgot Password email via transporter1:", error);
        try {
          await transporter2.sendMail(mailOptions);
          console.log("Forgot Password email sent successfully via transporter2.");
        } catch (error) {
          console.error("Error sending Forgot Password email via transporter2:", error);
          throw new Error("Failed to send Forgot Password email using both transporters.");
        }
      }
  
      return {
        message: "Mail Sent Successfully",
        statusCode: 200,
        success: true,
      };
    } catch (error) {
      return {
        message: error.message,
        statusCode: 400,
        success: false,
      };
    }
  }

  // async sendVerifyOtpSms(mobile, otpCode = null) {
  //   try {
  //     if (!otpCode) {
  //       otpCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
  //     }

  //     const API_KEY = '896d2377-563b-11ef-8b60-0200cd936042';
  //     const response = await axios.post(
  //       `https://2factor.in/API/V1/${API_KEY}/SMS/+91${mobile}/${otpCode}`
  //     );

  //     if (response.data.Status !== 'Success') {
  //       throw new Error('Failed to send OTP via 2Factor');
  //     }

  //     return {
  //       message: "Otp Sent Successfully",
  //       statusCode: 200,
  //       success: true,
  //     };
  //   } catch (error) {
  //     return {
  //       message: error.message,
  //       statusCode: 400,
  //       success: false,
  //     };
  //   }
  // }

  // async sendOtpForBoth(userId, email, mobile) {
  //   try {
  //     const otpCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);

  //     const emailResult = await this.sendVerifyOtpMail(userId, email, otpCode);
  //     const smsResult = await this.sendVerifyOtpSms(mobile, otpCode);

  //     if (emailResult.success && smsResult.success) {
  //       return {
  //         message: "OTP sent successfully via both email and SMS.",
  //         statusCode: 200,
  //         success: true,
  //       };
  //     } else {
  //       throw new Error("Failed to send OTP via one or more channels.");
  //     }
  //   } catch (error) {
  //     return {
  //       message: error.message,
  //       statusCode: 400,
  //       success: false,
  //     };
  //   }
  // }


  async sendBloodRequirementMail(bloodType) {
    try {
      const donors = await donorServices.getDonorsByBloodType(bloodType);

      if (!donors || donors.length === 0) {
        return {
          message: `No donors found for blood type ${bloodType}`,
          statusCode: 404,
          success: false,
        };
      }

      const recipientEmails = donors.data.map(donor => donor?.email);
      const batchSize = 100;
      const emailBatches = [];
      for (let i = 0; i < recipientEmails.length; i += batchSize) {
        emailBatches.push(recipientEmails.slice(i, i + batchSize));
      }

      for (const emailBatch of emailBatches) {
        const mailOptions = {
          from: { name: "Nangal By Cycle", address: constants.SMTP_MAIL_ADDRESS },
          bcc: emailBatch.join(','), // Send to the batch of 100 users
          subject: `Urgent: Blood Requirement for ${bloodType}`,
          html: `
          <p>Dear Donor,</p>
          <p>We urgently need blood of type ${bloodType}. If you can help, please contact us as soon as possible.</p>
          <p>Thank you for your support!</p>`,
        };

        // Send email
        await this.sendEmail(mailOptions);
      }

      await this.sendEmail(mailOptions);
      return {
        message: "Blood Requirement Mails Sent Successfully",
        statusCode: 200,
        success: true,
      };
    } catch (error) {
      return {
        message: error.message,
        statusCode: 400,
        success: false,
      };
    }
  }

  async sendEventCreatedMail(eventDetails) {
    try {
      // Get all active users
      const users = await userServices.getAllActiveUsersAsync();

      if (!users || users.length === 0) {
        return {
          message: `No users found`,
          statusCode: 404,
          success: false,
        };
      }

      // Extract email addresses
      const recipientEmails = users.data.map(user => user.email);

      const batchSize = 100;
      const emailBatches = [];
      for (let i = 0; i < recipientEmails.length; i += batchSize) {
        emailBatches.push(recipientEmails.slice(i, i + batchSize));
      }

      const templatePath = path.join(constants.HTML_PATH, "event.html");
      const templateData = await fs.promises.readFile(templatePath, "utf8");

      const eventStartDate = eventDetails?.date?.split(" - ")[0];

      const EventIdConverted = constants.numberToString(eventDetails?.eventId)
      const titleConverted = constants.rewriteUrl(eventDetails?.title);
      const webPath = constants.WEBAPP_PATH
      const eventRegisterUrl = webPath + "/event/participation/" + EventIdConverted
      const eventUrl = webPath + "/event/" + titleConverted + "-" + EventIdConverted;

      const truncateText = (text, wordLimit) => {
        const words = text.split(' ');
        return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
      };

      const truncatedContent = truncateText(eventDetails?.description, 58);

      // Sanitize HTML content
      const sanitizedContent = truncatedContent.replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/g, '');

      const htmlContent = ejs.render(templateData, {
        eventTitle: eventDetails?.title,
        startDate: eventStartDate,
        location: eventDetails?.location,
        url: eventRegisterUrl,
        eventURL: eventUrl,
        organiser: eventDetails?.organiser,
        allowParticipants: eventDetails?.allowParticipants,
        content: sanitizedContent,
        thumbnailUrl: eventDetails?.thumbnail
      });

      for (const emailBatch of emailBatches) {
        const mailOptions = {
          from: { name: "Nangal By Cycle", address: constants.SMTP_MAIL_ADDRESS },
          bcc: emailBatch.join(','), // Send to the batch of 100 users
          subject: `New Event Added: ${eventDetails?.title}`,
          html: htmlContent,
        };

        // Send email
        await this.sendEmail(mailOptions);
      }

      return {
        message: "Event notification emails sent successfully",
        statusCode: 200,
        success: true,
      };
    } catch (error) {
      return {
        message: error.message,
        statusCode: 400,
        success: false,
      };
    }
  }

  async sendBlogCreatedMail(blogDetails) {
    try {
      // Get all active users
      const users = await userServices.getAllActiveUsersAsync();

      if (!users || users.length === 0) {
        return {
          message: `No users found`,
          statusCode: 404,
          success: false,
        };
      }

      // Extract email addresses
      const recipientEmails = users.data.map(user => user.email);

      const batchSize = 100;
      const emailBatches = [];
      for (let i = 0; i < recipientEmails.length; i += batchSize) {
        emailBatches.push(recipientEmails.slice(i, i + batchSize));
      }

      const truncateText = (text, wordLimit) => {
        const words = text.split(' ');
        return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
      };

      const truncatedContent = truncateText(blogDetails?.content, 58);

      // Sanitize HTML content
      const sanitizedContent = truncatedContent.replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/g, ''); // Removes HTML tags

      const templatePath = path.join(constants.HTML_PATH, "blog.html");
      const templateData = await fs.promises.readFile(templatePath, "utf8");

      const titleConverted = constants.rewriteUrl(blogDetails?.title);
      const blogIdConverted = constants.numberToString(blogDetails?.blog_id)
      const webPath = constants.WEBAPP_PATH

      const blogUrl = webPath + "/blog/" + titleConverted + "-" + blogIdConverted;

      const htmlContent = ejs.render(templateData, {
        blogTitle: blogDetails?.title,
        thumbnailUrl: blogDetails?.thumbnail_url,
        content: sanitizedContent, // Use sanitized content here
        url: blogUrl,
        webAppPath: constants.WEBAPP_PATH,
        supportEmail: constants.SMTP_MAIL_ADDRESS
      });

      // Define mail options
      for (const emailBatch of emailBatches) {
        const mailOptions = {
          from: { name: "Nangal By Cycle", address: constants.SMTP_MAIL_ADDRESS },
          bcc: emailBatch.join(','), // Send to the batch of 100 users
          subject: `New Blog Added: ${blogDetails?.title}`,
          html: htmlContent,
        };

        // Send email
        await this.sendEmail(mailOptions);
      }

      return {
        message: "Blog notification emails sent successfully",
        statusCode: 200,
        success: true,
      };
    } catch (error) {
      return {
        message: error.message,
        statusCode: 400,
        success: false,
      };
    }
  }

  async sendHeroCreatedMail(heroDetails) {
    try {

      const users = await userServices.getAllActiveUsersAsync();

      if (!users || users.length === 0) {
        return {
          message: `No users found`,
          statusCode: 404,
          success: false,
        };
      }

      const recipientEmails = users.data.map(user => user.email);

      // Email batching logic (100 emails per batch)
      const batchSize = 100;
      const emailBatches = [];
      for (let i = 0; i < recipientEmails.length; i += batchSize) {
        emailBatches.push(recipientEmails.slice(i, i + batchSize));
      }

      // Define the email content
      const heroName = heroDetails?.data?.insertedHero?.name;
      const htmlContent = `
      <p>Dear NBC Member,</p>
      <p>We are thrilled to announce the addition of a new hero to the Nangal By Cycle community! This individual has been recognized for their outstanding contributions, and we are proud to celebrate their achievements.</p>
      
      <p><strong>Hero Name:</strong> ${heroName}</p>
      
      <p>We believe that recognizing and honoring the heroes among us is crucial in fostering a sense of community and inspiring others to contribute to the greater good. We encourage you to learn more about this hero and their accomplishments on our website.</p>
      
      <p>For more details and to explore the stories of other heroes, please visit our website or reach out to us directly.</p>
      
      <p>Thank you for being a valued member of our community.</p>
      
      <p>Best regards,</p>
      <p>The Nangal By Cycle Team</p>
      
      <p><a href="${constants.WEBAPP_PATH}" target="_blank">Visit our website</a> | <a href="mailto:${constants.SMTP_MAIL_ADDRESS}">Contact us</a></p>
    `;

      // Send email for each batch
      for (const emailBatch of emailBatches) {
        const mailOptions = {
          from: { name: "Nangal By Cycle", address: constants.SMTP_MAIL_ADDRESS },
          bcc: emailBatch.join(','), // Send to the batch of 100 users
          subject: `New Hero Added: ${heroName}`,
          html: htmlContent,
        };

        // Send email
        await this.sendEmail(mailOptions);
      }

      return {
        message: "Hero notification emails sent successfully",
        statusCode: 200,
        success: true,
      };
    } catch (error) {
      return {
        message: error.message,
        statusCode: 400,
        success: false,
      };
    }
  }


  async sendBirthdayMail() {
    try {
      // Get today's date
      const today = new Date();
      const todayDateString = today.toISOString().slice(5, 10); // Format as MM-DD

      // Get all active users whose birthday is today
      const users = await userServices.getAllActiveUsersAsync();

      if (!users || users.length === 0) {
        return {
          message: `No users found`,
          statusCode: 404,
          success: false,
        };
      }

      const birthdayUsers = users.data.filter(user => {
        const userBirthdayString = new Date(user?.date_of_birth).toISOString().slice(5, 10);
        return userBirthdayString === todayDateString;
      });

      if (birthdayUsers.length === 0) {
        return {
          message: "No birthdays today",
          statusCode: 200,
          success: true,
        };
      }

      const templatePath = path.join(constants.HTML_PATH, "birthdayMail.html");
      const templateData = await fs.promises.readFile(templatePath, "utf8");

      // Define batch size
      const batchSize = 100; // Limit the number of emails sent concurrently
      const emailBatches = [];

      for (let i = 0; i < birthdayUsers.length; i += batchSize) {
        emailBatches.push(birthdayUsers.slice(i, i + batchSize));
      }


      for (const batch of emailBatches) {
        const emailPromises = batch.map(async user => {
          const htmlContent = ejs.render(templateData, { name: user?.name });
          const mailOptions = {
            from: { name: "Nangal By Cycle", address: constants.SMTP_MAIL_ADDRESS },
            to: user?.email,
            subject: `Happy Birthday, ${user?.name}!`,
            html: htmlContent
          };

          // Send email
          return this.sendEmail(mailOptions);
        });

        // Wait for the current batch of emails to be sent before moving to the next batch
        await Promise.all(emailPromises);
      }

      return {
        message: "Birthday emails sent successfully",
        statusCode: 200,
        success: true,
      };
    } catch (error) {
      return {
        message: error.message,
        statusCode: 400,
        success: false,
      };
    }
  }

}

module.exports = new MailServices();
