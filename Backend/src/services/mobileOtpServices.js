const axios = require('axios');

class MobileOtpServices {

    //     async sendVerifyOtpSms(mobile) {
    //         try {
    //             const otpCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    //             const API_KEY = '896d2377-563b-11ef-8b60-0200cd936042'; 
    //             const response = await axios.post(
    //                 `https://2factor.in/API/V1/${API_KEY}/SMS/+91${mobile}/${otpCode}`
    //             );

    //             if (response.data.Status !== 'Success') {
    //                 throw new Error('Failed to send OTP via 2Factor');
    //             }

    //             return {
    //                 message: "Otp Sent Successfully",
    //                 statusCode: 200,
    //                 success: true,  
    //             };
    //         } catch (error) {
    //             return {
    //                 message: error.message,
    //                 statusCode: 400,
    //                 success: false,
    //             };
    //         }
    //     }
    // }

    async sendVerifyOtpSms(mobile, otpCode = null) {
        try {
            if (!otpCode) {
                otpCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
            }

            const API_KEY = '896d2377-563b-11ef-8b60-0200cd936042';
            const response = await axios.post(
                `https://2factor.in/API/V1/${API_KEY}/SMS/+91${mobile}/${otpCode}`
            );

            if (response.data.Status !== 'Success') {
                throw new Error('Failed to send OTP via 2Factor');
            }

            return {
                message: "Otp Sent Successfully",
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

module.exports = new MobileOtpServices();
