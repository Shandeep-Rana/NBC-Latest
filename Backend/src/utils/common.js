const crypto = require('crypto');
const constants = require('../constants/index');
const jwt = require("jsonwebtoken");
const puppeteer = require('puppeteer');

function encrypt(text) {
    const textStr = text.toString();
    const salt = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(constants.EncrptionPassword, salt, 100000, 32, 'sha256');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(textStr, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${salt.toString('hex')}:${iv.toString('hex')}:${encrypted}`;
}
function decrypt(encryptedData) {
    const parts = encryptedData.split(':');
    const salt = Buffer.from(parts[0], 'hex');
    const iv = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];
    const key = crypto.pbkdf2Sync(constants.EncrptionPassword, salt, 100000, 32, 'sha256');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function generateAuthToken(userId, email, roles) {
    return jwt.sign(
        { userId, email, roles },
        "your-secret-key",
        { expiresIn: "2d" }
    );
};

function extractUserProfile(url) {
    const regex = /\/userProfile\/([^\/]+)$/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

const generatePDF = async (htmlContent) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await page.close();
    await browser.close();
    return pdfBuffer;
};

module.exports = { encrypt, decrypt, generateAuthToken, extractUserProfile, generatePDF };