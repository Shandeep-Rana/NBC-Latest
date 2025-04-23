export const BloodGroupOptions = [
    { value: "", label: "Blood Group Type" },
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ];
  
  export const EventTypeOptions = [
    { value: "", label: "Event Type" },
    { value: "Virtual", label: "Virtual" },
    { value: "Physical", label: "Physical" },
  ];
  
  
  export const StatesAndUnionTerritories = [
    { value: "", label: "Select State" },
    { label: "Andhra Pradesh", value: "AndhraPradesh" },
    { label: "Arunachal Pradesh", value: "ArunachalPradesh" },
    { label: "Assam", value: "Assam" },
    { label: "Bihar", value: "Bihar" },
    { label: "Chhattisgarh", value: "Chhattisgarh" },
    { label: "Goa", value: "Goa" },
    { label: "Gujarat", value: "Gujarat" },
    { label: "Haryana", value: "Haryana" },
    { label: "Himachal Pradesh", value: "HimachalPradesh" },
    { label: "Jharkhand", value: "Jharkhand" },
    { label: "Karnataka", value: "Karnataka" },
    { label: "Kerala", value: "Kerala" },
    { label: "Madhya Pradesh", value: "MadhyaPradesh" },
    { label: "Maharashtra", value: "Maharashtra" },
    { label: "Manipur", value: "Manipur" },
    { label: "Meghalaya", value: "Meghalaya" },
    { label: "Mizoram", value: "Mizoram" },
    { label: "Nagaland", value: "Nagaland" },
    { label: "Odisha", value: "Odisha" },
    { label: "Punjab", value: "Punjab" },
    { label: "Rajasthan", value: "Rajasthan" },
    { label: "Sikkim", value: "Sikkim" },
    { label: "Tamil Nadu", value: "TamilNadu" },
    { label: "Telangana", value: "Telangana" },
    { label: "Tripura", value: "Tripura" },
    { label: "Uttar Pradesh", value: "UttarPradesh" },
    { label: "Uttarakhand", value: "Uttarakhand" },
    { label: "West Bengal", value: "WestBengal" },
    { label: "Andaman and Nicobar Islands", value: "AndamanAndNicobarIslands" },
    { label: "Chandigarh", value: "Chandigarh" },
    { label: "Dadra and Nagar Haveli and Daman and Diu", value: "DadraAndNagarHaveliAndDamanAndDiu" },
    { label: "Delhi", value: "Delhi" },
    { label: "Jammu and Kashmir", value: "JammuAndKashmir" },
    { label: "Ladakh", value: "Ladakh" },
    { label: "Lakshadweep", value: "Lakshadweep" },
    { label: "Puducherry", value: "Puducherry" },
  ];
  
  export const RegisterRoles = {
    Donor: "donor",
    Volunteer: "volunteer",
    Both: 'both'
  };
  
  export const commonPaginatedState = {
    search: "",
    page: 1,
    pagesize: 10,
  }

  export const emailrgx =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;

export const pinCodergx = /^[1-9][0-9]{5}$/

export const getUserInfoFromToken = () => {
  const data = JSON.parse(localStorage.getItem("user"));
  const token = data?.token
  if (token) {
    const decodedToken = jwt_decode(token)
    const userId = decodedToken.userId;
    const roleName = data.roleName;
    const email = decodedToken.email;
    const expirationTimeInSeconds = decodedToken.exp;
    const expirationDate = new Date(expirationTimeInSeconds * 1000); 
    const expirationTime = expirationDate.toLocaleString();
    return { userId, roleName, email, expirationTime };
  }
  return { userId: null, roleName: null, email: null, expirationTime: null };
};

export const linkedinrgx =  /([\w]+\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?/;
export const facebookrgx = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w-]*\/)?(?:profile\.php\?id=(\d.*))?([\w-]*)?/;
export const youtubergx = /^https?:\/\/(www\.)?youtube\.com\/(channel\/[a-zA-Z0-9_-]+|c\/[a-zA-Z0-9_-]+|user\/[a-zA-Z0-9_-]+|@[a-zA-Z0-9_-]+)(\/.*)?$/;
export const instagramrgx = /\bhttps?:\/\/(?:www\.)?instagram\.com\/(?:[a-zA-Z0-9_]+\/?)\b/;
export const twitterrgx = /^https?:\/\/(www\.)?x\.com\/([a-zA-Z0-9_]{1,15})\/?$/;

export const rewriteUrl = (url) => {
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

  return url.split('').map(char => charMap[char] || char).join('');
};

import { jwtDecode as jwt_decode } from 'jwt-decode';
;

export const ROLES = {
  Admin: "admin",
  Volunteer: "volunteer",
  SkilledPerson: "skilled person"
};
