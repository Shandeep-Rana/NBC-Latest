EncrptionPassword = "5th@swn7*jdnsw";
SMTP_MAIL_ADDRESS = "info@nangalbycycle.com";

const ROLES = {
  Admin: "admin",
  Volunteer: "volunteer",
  SkilledPerson: "skilled person",
  Donor: "donor",
  GuestUser: "guest user"
};
const DONOR_PASSWORD = "Donor2024";

//Development
// IMAGE_PATH = "/Work/NBC/NBC-Latest/Backend/src/public/uploads";
// STATIC_FILES_PATH = "public";
// IMAGE_URL = "http://localhost:5000/public/uploads";
// WEBAPP_PATH = "http://localhost:3000";
// HTML_PATH = "helpers/html";

//Production     
IMAGE_PATH = "src/public/uploads";
STATIC_FILES_PATH = "src/public";
IMAGE_URL = "https://api.nangalbycycle.com/src/public/uploads";
WEBAPP_PATH = "https://nangalbycycle.com";
HTML_PATH= "src/helpers/html";

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function numberToString(number, minLength = 4) {
    let result = '';
    while (number > 0) {
        result = chars[number % chars.length] + result;
        number = Math.floor(number / chars.length);
    }
    // Pad with 'A' to ensure minimum length
    while (result.length < minLength) {
        result = 'A' + result;
    }
    return result;
}

// Function to convert a string back to a number
function stringToNumber(str) {
    let number = 0;
    for (let i = 0; i < str.length; i++) {
        number = number * chars.length + chars.indexOf(str[i]);
    }
    return number;
}

 const rewriteUrl = (url) => {
    // Mapping of special characters to their replacements
    const charMap = {
      ' ': '-20',
      '!': '-21',
      '"': '-22',
      '#': '-23',
      '$': '-24',
      '%': '-25',
      '&': '-26',
      '\'': '-27',
      '(': '-28',
      ')': '-29',
      '*': '-2A',
      '+': '-2B',
      ',': '-2C',
      '/': '-2F',
      ':': '-3A',
      ';': '-3B',
      '<': '-3C',
      '=': '-3D',
      '>': '-3E',
      '?': '-3F',
      '@': '-40',
      '[': '-5B',
      '\\': '-5C',
      ']': '-5D',
      '^': '-5E',
      '_': '-5F',
      '`': '-60',
      '{': '-7B',
      '|': '-7C',
      '}': '-7D',
      '~': '-7E'
    };
  
    // Replace special characters
    return url.split('').map(char => charMap[char] || char).join('');
  };

module.exports = {
  IMAGE_PATH,
  STATIC_FILES_PATH,
  IMAGE_URL,
  EncrptionPassword,
  WEBAPP_PATH,
  HTML_PATH,
  ROLES,
  SMTP_MAIL_ADDRESS,
  DONOR_PASSWORD,
  numberToString,
  stringToNumber,
  rewriteUrl
};
