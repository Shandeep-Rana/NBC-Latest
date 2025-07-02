const express = require("express");
const DonorController = require("../controllers/donorController");
const {
  userMulter,
  upload,
  galleryMulter,
  combinedMulter,
  heroMulter,
  copyToDonorProfile,
  Eventupload,
  newsUpload,
  competetionMulter,
} = require("../../middelware/fileUploadMiddelware");
const evenController = require("../controllers/eventController");
const contactController = require("../controllers/contactController");
const MasterController = require("../controllers/masterController");
const eventController = require("../controllers/eventController");
const volunteerController = require("../controllers/volunteerController");
const skilledPersonController = require("../controllers/skilledPersonController");
const BlogController = require("../controllers/blogController");
const CommentController = require("../controllers/commentsController");
const FaqController = require("../controllers/faqController");
const galleryController = require("../controllers/galleryController");
const UserController = require("../controllers/userController");
const mediaController = require("../controllers/socialMediaController");
const heroController = require('../controllers/heroControllers');
const NewsController = require("../controllers/newsController");
const BloodRequirementController = require("../controllers/bloodRequirementController");
const FeedbackController = require("../controllers/feedbackController");
const ParticipantController = require("../controllers/eventParticipantsController");
const SpecializedCategoryController = require("../controllers/specializedCategoryController");
const PersonSpecializedSkillController = require("../controllers/personSpecializedSkillController");
const EventCategoryController = require("../controllers/eventCategoryController");
const guestUserController = require("../controllers/guestUserController");
const router = express.Router();

// User login 
router.post("/loginUser", UserController.loginUser);
router.post("/forget-password", UserController.forgotPassword);
router.post("/reset-password", UserController.resetPassword);
router.post("/verify-account", UserController.verifyOtp);
router.post("/resendVerifyOtp", UserController.resendVerifyOtp);
router.get("/userbyemail/:email", UserController.getUserDetailsByEmail);

// Get user by email
router.get("/userbyid/:email", UserController.getUserDetailsByEmail);
router.put('/update-user/:id', userMulter.single("userProfile"), UserController.updateUserById);
router.put("/update-Password/:id", UserController.changePassword);
router.put("/update-userProfile/:id", userMulter.single("userProfile"), UserController.updateUserProfileById);
router.put("/update-admindetails/:id", UserController.updateAdminDetails);
router.post("/verifyDonor", UserController.VerifyEmailForVolunteer);

//Add category
router.post("/add-category", SpecializedCategoryController.createCategory);

// Add village
router.post("/add-village", MasterController.AddVillage);

// Add profession
router.post("/add-profession", MasterController.AddProfession);

// Add interest
router.post("/add-intrest", MasterController.AddIntrest);

// Get all categories
router.get("/all-categories", SpecializedCategoryController.getAllCategories);

// Get all villages
router.get("/all-villages", MasterController.getAllVillages);

// Get all interests
router.get("/all-intrests", MasterController.getAllIntrests);

// Get all professions
router.get("/all-professions", MasterController.getAllProfession);

// Volunteer CRUD
router.post("/add-volunteer", userMulter.single("userProfile"), volunteerController.addVolunteer);
router.get("/all-volunteers", volunteerController.getAllVolunteers);
router.get("/volunteer/:id", volunteerController.getVolunteer);
router.put("/update-volunteer/:id", userMulter.single("userProfile"), volunteerController.updateVolunteer);
router.delete("/delete-volunteer/:id", volunteerController.deleteVolunteer);
router.post("/upgradeTovolunteer", volunteerController.UpgradeToVolunteer);

//Skilled Person CRUD
router.post("/add-skilledperson", userMulter.single("userProfile"), skilledPersonController.addSkilledPerson);
router.get("/all-skilledPersons", skilledPersonController.getAllSkilledPersons);
router.get("/skilledPerson/:id", skilledPersonController.getSkilledPerson);
router.put("/update-skilledPerson/:id", skilledPersonController.updateSkilledPerson);
router.delete("/delete-skilledPerson/:id", skilledPersonController.deleteSkilledPerson);
router.post("/upgradeToMember", skilledPersonController.UpgradeToMember);

// Blood Donor CRUD
router.post("/add-donor", userMulter.single("userProfile"), DonorController.createdonor);
router.get("/all-donors", DonorController.getAllDonors);
router.get("/donor/:id", DonorController.getDonor);
router.put("/update-donor/:id", userMulter.single("userProfile"), DonorController.updateDonor);
router.delete("/delete-donor/:id", DonorController.deleteDonor);
router.post("/upgradeTodonor", DonorController.upgradeTodonor);

// Contact CRUD
router.post("/add-contact", contactController.createContact);
router.get("/all-contactRequests", contactController.getAllContactRequests);
router.get("/request/:id", contactController.getContactById);
router.put("/update-request/:id", contactController.updateContactById);
router.delete("/delete-request/:id", contactController.deleteContactById);

// Event CRUD       
router.post("/add-event", Eventupload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'additionalThumbnail', maxCount: 10 }]), evenController.createEvent);
router.get("/all-events", eventController.getAllevents);
router.get("/all-RequestEvents", eventController.getAllrequestevents);
router.put("/approveEvent/:id", evenController.updateEventActivation);
router.get("/event/:id", eventController.geteventById);
router.get("/User-event/:id", eventController.getAllEventsByOrganiserId);
router.delete("/delete-event/:id", evenController.deleteEventById);
router.put("/update-event/:id", Eventupload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'additionalThumbnail', maxCount: 10 }]), evenController.updateEventById);
router.get("/get-paginated-events", eventController.getPaginatedEvents);
router.get("/get-Allevents", eventController.getAllForEvents);
router.post("/get-event", eventController.getEventByTitle);
router.get("/get/allEventCategories", EventCategoryController.getAllEventCategories)

//event participants
router.post("/add-eventParticipant", competetionMulter.single("upload"), ParticipantController.createParticipant);
router.get("/get-all/Eventparticipants", ParticipantController.getAllParticipants);
router.get("/get-all/Eventparticipantswithoutpagination", ParticipantController.getAllParticipantswithoutpagination);
router.get("/get-all/Eventparticipantswithoutpaginationartgallery", ParticipantController.getAllArtGalleryParticipantswithoutpagination);
router.get("/get/Eventparticipant/:id", ParticipantController.getEventParticipant);
router.post("/update/Eventparticipant/:id", ParticipantController.updateEventParticipant);
router.post("/delete-eventParticipant/:id", ParticipantController.deleteEventParticipantById);
router.post("/get/e-certificates", ParticipantController.getAllIssuedCertificates);
router.post("/attendedEvent", ParticipantController.attendedEvent);
router.post("/attendedEvent", ParticipantController.attendedEvent);

// Blog CRUD
router.post("/add-news", newsUpload.fields([{ name: 'thumbnail', maxCount: 1 }]), NewsController.addNews);
router.get("/paginated-news", NewsController.getPaginatedNews);
router.get("/get-news/:title", NewsController.getNewsByTitle);
router.get("/getNewsById/:id", NewsController.getNewsById);
router.post("/update-news/:id", newsUpload.fields([{ name: 'thumbnail', maxCount: 1 }]), NewsController.updateNews);
router.delete("/delete-news/:id", NewsController.deleteNews);
router.post('/approve-news', NewsController.approveNews);
router.post('/disapprove-news', NewsController.disapproveNews);
router.post('/publish-news', NewsController.publishNews);
router.post('/Unpublish-news', NewsController.UnpublishNews);
router.post('/add-newscomment', NewsController.addNewsComment);
router.get('/news-allcomments', NewsController.getAllNewsComments);

// Blog CRUD
router.post("/add-blog", upload.fields([{ name: 'thumbnail', maxCount: 1 }]), BlogController.addBlog);
router.get("/paginated-blogs", BlogController.getPaginatedBlogs);
router.get("/get-blog/:title", BlogController.getBlogByTitle);
router.get("/getBlogById/:id", BlogController.getBlogById);
router.post("/update-blog/:id", upload.fields([{ name: 'thumbnail', maxCount: 1 }]), BlogController.updateBlog);
router.delete("/delete-blog/:id", BlogController.deleteBlog);
router.post('/approve-blog', BlogController.approveBlog);
router.post('/disapprove-blog', BlogController.disApproveBlog);
router.post('/publish-blog', BlogController.publishBlog);
router.post('/Unpublish-blog', BlogController.UnpublishBlog);
router.post('/add-blogcomment', BlogController.addBlogComment);
router.get('/blog-allcomments', BlogController.getAllBlogComments);

// Comment CRUD
router.post('/add-comment', CommentController.addComment);
router.get("/comments", CommentController.getAllComments);
router.get("/blog-comment/:id", CommentController.getCommentBlogById);
router.get("/comment/:id", CommentController.getCommentById)

// FAQ CRUD
router.post("/add-question", FaqController.createFaq);
router.get("/all-faqs", FaqController.getAllFaqs);
router.get("/faq/:id", FaqController.getFaqById);
router.put("/answer-faq/:id", FaqController.updateFaqById);
router.delete("/delete-faq/:id", FaqController.deleteFaqById);

//GALLERY CRUD
router.post("/add-image", galleryMulter.single("image"), galleryController.createImage);
router.get("/images", galleryController.getPaginatedImages);
router.get("/all-images", galleryController.getAllImages);
router.delete('/delete-image/:id', galleryController.deleteImageById);
router.post('/approve-image', galleryController.approveImage);
router.post('/disapprove-image', galleryController.disApproveImage);

//adding both donor and volunteer
router.post("/add-Both", userMulter.single("userProfile"), UserController.registerAsBoth);

//SOCIAL MEDIA CRUD
router.get("/links", mediaController.getAllLinks);
router.get("/user-links/:id", mediaController.getLinksByUserId);
router.post("/userlink/:id", mediaController.AddOrUpdateUrl);

//Audit Logs
router.get("/all-auditlogs", MasterController.getAllAuditLogs);

//Nangal Heroes
router.post("/add-hero", heroMulter.single("photo_url"), heroController.addHero);
router.get("/heroes", heroController.getPaginatedHeroes);
router.get("/hero-detail/:id", heroController.getHero);
router.post("/update-hero/:id", heroMulter.single("photo_url"), heroController.updateHero);
router.delete("/delete-hero/:id", heroController.deleteHero);

//Master
router.get("/get-community-stats", MasterController.getCommunityStats);

//Blood Requirement Crud
router.post("/add-requirement", BloodRequirementController.createRequest);
router.get("/all-requirements", BloodRequirementController.getAllBloodRequirementRequests);
router.get("/get-requirement/:id", BloodRequirementController.getBloodRequirement);
router.post("/update-requirement/:id", BloodRequirementController.updateBloodRequirement);
router.delete("/delete-requirement/:id", BloodRequirementController.deleteBloodRequirementRequestById);
router.post('/approve-requirement', BloodRequirementController.approveBloodRequirementRequest);
router.post('/disapprove-requirement', BloodRequirementController.disApproveBloodRequirementRequest);

//feedback Crud
router.post("/add-feedback", FeedbackController.addFeedback);
router.get("/all-feedbacks", FeedbackController.getPaginatedFeedbacks);

// person specialized skills crud
router.post("/addSkills", PersonSpecializedSkillController.addPersonSpecializedSkill);
router.post("/getskillsofperson", PersonSpecializedSkillController.getSkillsForPerson);
router.post("/deleteskillofperson", PersonSpecializedSkillController.deletePersonSpecializedSkill);
router.get("/getallpersonhavingskill", PersonSpecializedSkillController.getAllPersonhavingSpecializedSkill);

// guest users crud
router.post("/addGuestUser", guestUserController.addGuestUser);

module.exports = router;