const feedbackServices = require("../services/feedbackServices");

const FeedbackController = {

    addFeedback: async (req, res) => {
        try {

            const { name, email, contact, description, stars } = req.body;

            await feedbackServices.addFeedbackAsync({
                name,
                email,
                contact,
                description,
                stars,
                addedOn: new Date()
            });
            res.status(200).json({ message: "FeedBack added successfully" });
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getPaginatedFeedbacks: async (req, res) => {
        try {
            const { page = 1, pageSize = 10, search } = req.query; 

            const result = await feedbackServices.getAllFeedbacksPaginatedAsync({
                page: parseInt(page, 10),
                pageSize: parseInt(pageSize, 10),
                search
            });

            res.status(200).json(result);
        } catch (error) {
            const resultObject = {
                message: error.message,
                statusCode: 500, 
                success: false,
                data: null,
            };
            res.status(500).json(resultObject);
        }
    },

    getBlogById: async (req, res) => {
        try {
            const id = req.params.id;
            const blogResult = await blogServices.getBlogByIdAsync(id);

            const authorId = blogResult.data.author;

            const userRolesRes = await rolesServices.getUserRolesByIdAsync(authorId);
            if (!userRolesRes.success)
                throw new Error(userRolesRes.message);

            let profession = null;

            if (userRolesRes.data.includes("volunteer")) {
                const volunteer = await volunteerServices.getVolunteerByUserIdAsync(authorId);
                if (volunteer.success) {
                    profession = volunteer.data.profession;
                }
            } else if (userRolesRes.data.includes("skilled person")) {
                const person = await skilledPersonServices.getSkilledPersonByUserIdAsync(authorId);
                if (person.success) {
                    profession = person.data.profession;
                }
            }

            // Only add profession to the response if it's available
            if (profession !== null) {
                blogResult.data.profession = profession;
            }

            res.status(200).json(blogResult);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getBlogByTitle: async (req, res) => {
        try {
            const title = req.params.title;
            const blogResult = await blogServices.getBlogByTitleAsync(title);

            const authorId = blogResult.data.author;

            const userRolesRes = await rolesServices.getUserRolesByIdAsync(authorId);
            if (!userRolesRes.success)
                throw new Error(userRolesRes.message);

            let profession = null;

            if (userRolesRes.data.includes("volunteer")) {
                const volunteer = await volunteerServices.getVolunteerByUserIdAsync(authorId);
                if (volunteer.success) {
                    profession = volunteer.data.profession;
                }
            } else if (userRolesRes.data.includes("skilled person")) {
                const person = await skilledPersonServices.getSkilledPersonByUserIdAsync(authorId);
                if (person.success) {
                    profession = person.data.profession;
                }
            }

            // Only add profession to the response if it's available
            if (profession !== null) {
                blogResult.data.profession = profession;
            }

            res.status(200).json(blogResult);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateBlog: async (req, res) => {
        try {
            const blogId = req.params.id;
            const ecryptedUserId = req.headers["user-id"];
            const userId = ecryptedUserId ? commFunctions.decrypt(ecryptedUserId) : null;

            const thumbnail_url = req?.files["thumbnail"]
                ? req.files["thumbnail"][0].filename
                : null;

            const { title, content, publish_date } = req.body;
            const result = await blogServices.updateBlogAsync({ title, blog_id: blogId, content, thumbnail_url, publish_date }, userId);

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteBlog: async (req, res) => {
        try {
            const blogId = req.params.id;
            const ecryptedUserId = req.headers["user-id"];
            const userId = ecryptedUserId ? commFunctions.decrypt(ecryptedUserId) : null;

            const result = await blogServices.deleteBlogAsync(blogId, userId);

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    approveBlog: async (req, res) => {
        try {
            const { blogId, userId } = req.body;
            const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;
            const result = await blogServices.approveBlogAsync(blogId, decryptedUserId);
            res.status(200).json(result);

        } catch (error) {
            const resultObject = {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
            res.status(500).json(resultObject);
        }
    },

    disApproveBlog: async (req, res) => {
        try {
            const { blogId, userId } = req.body;
            const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;
            const result = await blogServices.disApproveBlogAsync(blogId, decryptedUserId);
            res.status(200).json(result);

        } catch (error) {
            const resultObject = {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
            res.status(500).json(resultObject);
        }
    },

    publishBlog: async (req, res) => {
        try {
            const { blogId, userId } = req.body;
            const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;
            const result = await blogServices.publishBlogAsync(blogId, decryptedUserId);

            const blog = await blogServices.getBlogByIdAsync(decryptedUserId);

            if (blog) {
                await mailServices.sendBlogCreatedMail(blog)
            }
            res.status(200).json(result);

        } catch (error) {
            const resultObject = {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
            res.status(500).json(resultObject);
        }
    },

    UnpublishBlog: async (req, res) => {
        try {
            const { blogId, userId } = req.body;
            const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;
            const result = await blogServices.UnpublishBlogAsync(blogId, decryptedUserId);
            console.log(req.body)
            res.status(200).json(result);

        } catch (error) {
            const resultObject = {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
            res.status(500).json(resultObject);
        }
    },

    addBlogComment: async (req, res) => {
        try {
            const { content, blogId, parentId, authorName, authorEmail } = req.body;

            var blogResult = await blogServices.addBlogCommentAsync({
                content,
                blogId,
                parentId,
                authorName,
                authorEmail,
            });
            res.status(200).json(blogResult);

        } catch (error) {
            const resultObject = {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
            res.status(500).json(resultObject);
        }
    },

    getAllBlogComments: async (req, res) => {
        try {
            const { blogId } = req.query;
            const result = await blogServices.getAllBlogCommentsAsync(blogId);

            res.status(200).json(result);

        } catch (error) {
            const resultObject = {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
            res.status(500).json(resultObject);
        }
    },
};

module.exports = FeedbackController;
