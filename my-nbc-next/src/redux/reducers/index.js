import { combineReducers } from "redux";
import authRegisterReducer from "../../Slice/authRegister";
import authLoginReducer from "../../Slice/authLogin";
import donorReducer from "../../Slice/bloodDonation";
import userReducer from "../../Slice/volunteers";
import contactReducer from "../../Slice/contactRequest";
import masterSlice from "../../Slice/master";
import eventReducer from "../../Slice/events"
import personReducer from "../../Slice/skilledPerson"
import blogReducers from "../../Slice/blogs"
import commentReducers from '../../Slice/comment'
import faqReducers from '../../Slice/faq'
import imageReducers from '../../Slice/gallery'
import socialMediaReducers from "../../Slice/socialMediaSlice"
import heroSlice from "../../Slice/heroSlice";
import GuestUserReducers from "../../Slice/guestUser"
import NewsReducers from "../../Slice/news"
import BloodRequirementReducers from "../../Slice/bloodRequirement"
import FeedbackReducers from "../../Slice/feedback"
import PersonSpecializedSkillReducers from "../../Slice/personSpecializedSkill";
import eventCategoryReducers from "../../Slice/eventCategory";

const rootReducer = combineReducers({
  userRegister: authRegisterReducer,
  userLogin: authLoginReducer,
  donor: donorReducer,
  user: userReducer,
  contact: contactReducer,
  masterSlice: masterSlice,
  event: eventReducer,
  person: personReducer,
  blog: blogReducers,
  comment: commentReducers,
  faq: faqReducers,
  image: imageReducers,
  socialMedia: socialMediaReducers,
  hero: heroSlice,
  GuestUser: GuestUserReducers,
  news: NewsReducers,
  bloodRequirement: BloodRequirementReducers,
  feedback: FeedbackReducers,
  PersonSkills: PersonSpecializedSkillReducers,
  eventCategory: eventCategoryReducers,

});

export default rootReducer;
