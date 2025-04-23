// Define characters to use in the encoding
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Function to convert a number to a string with a minimum length
export function numberToString(number, minLength = 4) {
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
export function stringToNumber(str) {
    let number = 0;
    for (let i = 0; i < str.length; i++) {
        number = number * chars.length + chars.indexOf(str[i]);
    }
    return number;
}