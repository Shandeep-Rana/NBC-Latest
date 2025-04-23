const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "blogs";
const constants = require("../constants/index");
const URL = constants.IMAGE_URL;
const userServices = require('../services/userServices');
const commentTableName = "blog_comments";
const auditServices = require('../services/auditServices');
const rolesServices = require("./rolesServices");
const mailServices = require("./mailServices");

class BlogServices {

    async addBlogAsync(data) {
        try {

            const newBlog = {
                title: data.title,
                content: data.content,
                author: data.author,
                thumbnail_url: data.thumbnail_url,
                publish_date: data.publish_date
            }

            const userResult = await userServices.getUserByIdAsync(data.author);
            if (!userResult.success)
                throw new Error('Invalid User');

            const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
            if (!roleResult.success)
                throw new Error('Invalid User');

            const userRoles = roleResult.data;
            if (userRoles.includes(constants.ROLES.Admin)) {
                newBlog.is_approved = true;
                newBlog.approved_on = new Date();
            }

            const [blog_id] = await knex(tableName).insert(newBlog);
            let insertedBlog = await knex(tableName).where({ blog_id: blog_id }).first();

            await auditServices.afterInsertAsync(data.author, tableName, blog_id, insertedBlog);

            insertedBlog.thumbnail_url = insertedBlog.thumbnail_url
                ? `${URL}/blogThumbnail/${insertedBlog.thumbnail_url}`
                : null;

            const blog = {
                blog_id: blog_id,
                title: data.title,
                content: data.content,
                author: data.author,
                thumbnail_url: data.thumbnail_url
                    ? `${URL}/blogThumbnail/${data.thumbnail_url}`
                    : null,
                published_on: data.publish_date
            }

            if (insertedBlog.is_approved && new Date(data.publish_date) <= new Date()) {
                await mailServices.sendBlogCreatedMail(blog);
            }

            return {
                message: "Blog Added Successfully",
                statusCode: 201,
                success: true,
                data: { insertedBlog }
            };

        } catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async getPaginatedBlogsAsync({ page = 1, pageSize = 10, search, userId = null, isPublished = null, isApproved = null, sortBy = 'created_on', sortOrder = 'desc' }) {
        try {
            const offset = (page - 1) * pageSize;

            let allBlogsQuery = knex(tableName)
                .select('blogs.*')
                .where('is_deleted', false);

            let allBlogs = await allBlogsQuery;

            for (const blog of allBlogs) {
                if (new Date(blog.publish_date) < new Date() && blog.is_approved && !blog.is_published) {
                    await knex(tableName)
                        .where('blog_id', blog.blog_id)
                        .update({
                            is_published: true,
                            published_on: blog.publish_date
                        });
                }
            }

            let query = knex(tableName)
                .select(
                    'blogs.*',
                    'users.full_name as author_name',
                    'users.user_profile as author_profile_url'
                )
                .leftJoin('users', 'blogs.author', 'users.user_id')
                .where('blogs.is_deleted', false);
            let countQuery = knex(tableName).count('blog_id as count').where('is_deleted', false);

            if (userId) {
                const userResult = await userServices.getUserByIdAsync(userId);
                if (!userResult.success)
                    throw new Error("Invalid User");

                const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
                if (!roleResult.success)
                    throw new Error("Invalid Error");
                const userRoles = roleResult.data;

                if (!userRoles.includes(constants.ROLES.Admin)) {
                    query = query.where('blogs.author', userId);
                    countQuery = countQuery.where('blogs.author', userId);
                }
            }

            if (search) {
                query = query.andWhere('blogs.title', 'like', `%${search}%`);
                countQuery = countQuery.andWhere('blogs.title', 'like', `%${search}%`);
            }

            if (isPublished) {
                query = query.andWhere('blogs.is_published', true);
                countQuery = countQuery.andWhere('blogs.is_published', true);
            }

            if (isApproved) {
                query = query.andWhere('blogs.is_approved', true);
                countQuery = countQuery.andWhere('blogs.is_approved', true);
            }

            query = query.orderBy(sortBy, sortOrder);
            query = query.limit(pageSize).offset(offset);

            let blogs = await query;
            const [{ count }] = await countQuery;

            const processedBlogs = blogs.map(blog => {
                blog.thumbnail_url = blog.thumbnail_url
                    ? `${URL}/blogThumbnail/${blog.thumbnail_url}`
                    : null;

                blog.author_profile_url = blog.author_profile_url
                    ? `${URL}/userProfile/${blog.author_profile_url}`
                    : null;

                return blog;
            });

            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: {
                    blogs: processedBlogs,
                    pagination: {
                        total: parseInt(count, 10),
                        currentPage: page,
                        totalPages: Math.ceil(count / pageSize)
                    }
                }
            };

        } catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async getBlogByIdAsync(id) {
        try {
            let query = knex(tableName)
                .select(
                    'blogs.*',
                    'users.full_name as author_name',
                    'users.user_profile as author_profile_url',
                    'users.about as author_about'
                )
                .leftJoin('users', 'blogs.author', 'users.user_id')
                .where('blog_id', id).first();

            let blog = await query;

            if (blog) {
                blog.thumbnail_url = blog.thumbnail_url
                    ? `${URL}/blogThumbnail/${blog.thumbnail_url}`
                    : null;

                blog.author_profile_url = blog.author_profile_url
                    ? `${URL}/userProfile/${blog.author_profile_url}`
                    : null;

                return {
                    message: "Fetched Successfully",
                    statusCode: 200,
                    success: true,
                    data: blog
                };
            }
            throw new Error('Fetch Failed');

        } catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async getBlogByTitleAsync(title) {
        try {
            let query = knex(tableName)
                .select(
                    'blogs.*',
                    'users.full_name as author_name',
                    'users.user_profile as author_profile_url'
                )
                .leftJoin('users', 'blogs.author', 'users.user_id')
                .where('blogs.title', title).andWhere('blogs.is_deleted', false).first();

            let blog = await query;

            if (blog) {
                blog.thumbnail_url = blog.thumbnail_url
                    ? `${URL}/blogThumbnail/${blog.thumbnail_url}`
                    : null;

                blog.author_profile_url = blog.author_profile_url
                    ? `${URL}/userProfile/${blog.author_profile_url}`
                    : null;

                return {
                    message: "Fetched Successfully",
                    statusCode: 200,
                    success: true,
                    data: blog
                };
            }
            return {
                message: "Fetched failed",
                statusCode: 400,
                success: false,
                data: null
            };

        } catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async updateBlogAsync(data, userId) {
        try {
            const existingBlogTitleQuery = knex(tableName).select('blog_id').where('title', data.title).where('blog_id', '!=', data.blog_id).andWhere("is_deleted", false);
            const blogTitle = await existingBlogTitleQuery.first();

            if (blogTitle)
                throw new Error('Blog already exist with this title');

            const blogResult = await this.getBlogByIdAsync(data.blog_id);
            const blog = blogResult.data;
            const userResult = await userServices.getUserByIdAsync(userId);

            if (!userResult.success)
                throw new Error('Invalid User');

            const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
            if (!roleResult.success)
                throw new Error('Invalid User');

            const userRoles = roleResult.data;
            if (!userRoles.includes(constants.ROLES.Admin) && blog.author !== parseInt(userId, 10)) {
                throw new Error('You are not permitted to update this blog');
            }

            const beforeUpdateBlog = await knex(tableName).where({ blog_id: data.blog_id }).first();

            const isPublished = new Date(data.publish_date) <= new Date();

            await knex(tableName)
                .where('blog_id', data.blog_id)
                .update({
                    title: data.title,
                    content: data.content,
                    thumbnail_url: data.thumbnail_url,
                    publish_date: data.publish_date,
                    is_published: isPublished,
                    updated_at: new Date(),
                });

            const afterUpdateBlog = await knex(tableName).where({ blog_id: data.blog_id }).first();

            await auditServices.afterUpdateAsync(userId, tableName, data.blog_id, beforeUpdateBlog, afterUpdateBlog);

            return {
                message: "Blog updated Successfully",
                statusCode: 200,
                success: true,
                data: null
            };

        } catch (err) {
            const resultObject = {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
            return resultObject;
        }
    }

    async deleteBlogAsync(blogId, userId) {
        try {
            const userResult = await userServices.getUserByIdAsync(userId);
            const blog = await knex(tableName).select('*').where('blog_id', blogId).first();
            if (!userResult.success)
                throw new Error("Invalid User");

            const user = userResult.data;
            const roleResult = await rolesServices.getUserRolesByIdAsync(user.Id);
            if (!roleResult.success)
                throw new Error("Invalid User Role");

            const userRoles = roleResult.data;
            if (!userRoles.includes(constants.ROLES.Admin)) {
                if (blog.author !== parseInt(userId, 10))
                    throw new Error('You are not permitted to delete this blog');

                if (blog.is_approved || blog.is_published) {
                    const beforeUpdateBlog = await knex(tableName).where({ blog_id: blogId }).first();

                    await knex(tableName)
                        .where('blog_id', blogId)
                        .update({
                            is_delete_requested: true,
                        });

                    const afterUpdateBlog = await knex(tableName).where({ blog_id: blogId }).first();

                    await auditServices.afterUpdateAsync(userId, tableName, blogId, beforeUpdateBlog, afterUpdateBlog);

                    const resultObject = {
                        message: "Your request has been submitted to the admin. They will review it and take the appropriate action.",
                        statusCode: 200,
                        success: true,
                        data: null
                    };
                    return resultObject;
                }
            }

            await knex(tableName)
                .where('blog_id', blogId)
                .update({
                    is_deleted: true,
                    deleted_on: new Date()
                });

            await auditServices.afterDeleteAsync(userId, tableName, blogId);

            const resultObject = {
                message: "Deleted Successfully",
                statusCode: 200,
                success: true,
                data: null
            };
            return resultObject;
        }
        catch (err) {
            const resultObject = {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
            return resultObject;
        }
    }

    async approveBlogAsync(blogId, userId) {
        try {
            const userResult = await userServices.getUserByIdAsync(userId);
            if (!userResult.success)
                throw new Error('Invalid User');

            const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
            if (!roleResult.success)
                throw new Error('Invalid User Role');

            const userRoles = roleResult.data;
            if (!userRoles.includes(constants.ROLES.Admin))
                throw new Error('Ask Admin to approve blog');

            const beforeApproveBlog = await knex(tableName).where({ blog_id: blogId }).first();

            await knex(tableName)
                .where('blog_id', blogId)
                .update({
                    is_approved: true,
                    approved_on: new Date()
                });

            const afterApproveBlog = await knex(tableName).where({ blog_id: blogId }).first();
            await auditServices.afterUpdateAsync(userId, tableName, blogId, beforeApproveBlog, afterApproveBlog);

            const currentDate = new Date();
            const publishDate = new Date(afterApproveBlog.publish_date);

            if (publishDate <= currentDate) {
                // If the publish date is less than or equal to the current date, publish the blog
                await knex(tableName)
                    .where('blog_id', blogId)
                    .update({
                        is_published: true,
                        publish_date: currentDate,
                        published_on: currentDate
                    });

                const afterPublishBlog = await knex(tableName).where({ blog_id: blogId }).first();
                await auditServices.afterUpdateAsync(userId, tableName, blogId, afterApproveBlog, afterPublishBlog);
            }

            return {
                message: "Approved Successfully",
                statusCode: 200,
                success: true,
                data: null
            };

        }

        catch (err) {
            const resultObject = {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
            return resultObject;
        }
    }

    async disApproveBlogAsync(blogId, userId) {
        try {
            const userResult = await userServices.getUserByIdAsync(userId);
            if (!userResult.success)
                throw new Error('Invalid User');

            const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
            if (!roleResult.success)
                throw new Error('Invalid User Role');

            const userRoles = roleResult.data;
            if (!userRoles.includes(constants.ROLES.Admin))
                throw new Error('Ask Admin to disapprove blog');

            const beforeDisApproveBlog = await knex(tableName).where({ blog_id: blogId }).first();

            await knex(tableName)
                .where('blog_id', blogId)
                .update({
                    is_approved: false,
                    approved_on: null
                });

            const afterDisApproveBlog = await knex(tableName).where({ blog_id: blogId }).first();

            await auditServices.afterUpdateAsync(userId, tableName, blogId, beforeDisApproveBlog, afterDisApproveBlog);

            return {
                message: "DisApproved Successfully",
                statusCode: 200,
                success: true,
                data: null
            };
        }
        catch (err) {
            const resultObject = {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
            return resultObject;
        }
    }

    async publishBlogAsync(blogId, userId) {
        try {
            const userResult = await userServices.getUserByIdAsync(userId);

            let blog = await knex(tableName).select('blog_id').where('blog_id', blogId).andWhere('is_approved', true).first();
            if (!blog)
                throw new Error('Blog is not approved to publish');

            if (!userResult.success)
                throw new Error('Ask Admin to publish blog');

            const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
            if (!roleResult.success)
                throw new Error("Invalid User Role");

            const userRoles = roleResult.data;
            if (!userRoles.includes(constants.ROLES.Admin))
                throw new Error('Ask Admin to publish blog');

            const beforePublishBlog = await knex(tableName).where({ blog_id: blogId }).first();

            await knex(tableName)
                .where('blog_id', blogId)
                .update({
                    is_published: true,
                    publish_date: new Date(),
                    published_on: new Date()
                });

            const afterPublishBlog = await knex(tableName).where({ blog_id: blogId }).first();
            await auditServices.afterUpdateAsync(userId, tableName, blogId, beforePublishBlog, afterPublishBlog);

            return {
                message: "Published Successfully",
                statusCode: 200,
                success: true,
                data: null
            };
        }
        catch (err) {
            const resultObject = {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
            return resultObject;
        }
    }

    async UnpublishBlogAsync(blogId, userId) {
        try {
            const userResult = await userServices.getUserByIdAsync(userId);

            let blog = await knex(tableName).select('blog_id').where('blog_id', blogId).andWhere('is_approved', true).first();
            if (!blog)
                throw new Error('Blog is not approved to publish');

            if (!userResult.success)
                throw new Error('Ask Admin to publish blog');

            const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
            if (!roleResult.success)
                throw new Error("Invalid User Role");

            const userRoles = roleResult.data;
            if (!userRoles.includes(constants.ROLES.Admin))
                throw new Error('Ask Admin to publish blog');

            const beforePublishBlog = await knex(tableName).where({ blog_id: blogId }).first();

            await knex(tableName)
                .where('blog_id', blogId)
                .update({
                    is_published: false,
                    // published_on: new Date()
                });

            const afterPublishBlog = await knex(tableName).where({ blog_id: blogId }).first();
            await auditServices.afterUpdateAsync(userId, tableName, blogId, beforePublishBlog, afterPublishBlog);

            return {
                message: "unPublished Successfully",
                statusCode: 200,
                success: true,
                data: null
            };
        }
        catch (err) {
            const resultObject = {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
            return resultObject;
        }
    }

    async addBlogCommentAsync(data) {
        try {
            const newBlogComment = {
                content: data.content,
                blog_id: data.blogId,
                parent_id: data.parentId ? data.parentId : null,
                author_name: data.authorName,
                author_email: data.authorEmail
            }

            const [comment_id] = await knex(commentTableName).insert(newBlogComment);
            let addedComment = await knex(commentTableName).where({ comment_id: comment_id }).first();

            await auditServices.afterInsertAsync(null, commentTableName, comment_id, addedComment);

            return {
                message: "Added Successfully",
                statusCode: 201,
                success: true,
                data: { addedComment }
            };
        }
        catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async getAllBlogCommentsAsync(blogId) {
        try {

            let allComments = await knex(commentTableName)
                .select('*')
                .where('blog_id', blogId)
                .orderBy('created_at', 'desc');

            return {
                message: "Fetched Successfully",
                statusCode: 201,
                success: true,
                data: { allComments }
            };
        }
        catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }
}
module.exports = new BlogServices();