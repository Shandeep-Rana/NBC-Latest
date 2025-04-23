const cron = require('node-cron');
const MailServices = require('../services/mailServices'); 

// Schedule a task to run every day at 9:00 AM
// cron.schedule('0 9 * * *', async () => {
//   try {
//     const result = await MailServices.sendBirthdayMail();
//     if (result.success) {
//       console.log(result.message);
//     } else {
//       console.error(`Failed to send birthday emails: ${result.message}`);
//     }
//   } catch (error) {
//     console.error(`Error in 9:00 AM cron job: ${error.message}`);
//   }
// }, {
//   timezone: "Asia/Kolkata" 
// });

// Schedule a task to run every day at 5:00 PM
cron.schedule('0 9 * * *', async () => {
  try {
    const result = await MailServices.sendBirthdayMail();
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(`Failed to send birthday emails: ${result.message}`);
    }
  } catch (error) {
    console.error(`Error in 5:00 PM cron job: ${error.message}`);
  }
}, {
  timezone: "Asia/Kolkata" 
});