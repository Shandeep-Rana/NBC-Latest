const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "news";
const constants = require("../constants/index");
const URL = constants.IMAGE_URL;
const userServices = require('../services/userServices');
const commentTableName = "blog_comments";
const auditServices = require('../services/auditServices');
const rolesServices = require("./rolesServices");

class NewsServices {

    async addNewsAsync(data) {
        try {
            const existingNewsResult = await this.getNewsByTitleAsync(data.title);

            if (existingNewsResult.success && existingNewsResult.data.is_deleted !== 1) {
                throw new Error("News already exist with this title");
            }

            const newNews = {
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
                newNews.is_approved = true;
                newNews.approved_on = new Date();
            }

            const [news_id] = await knex(tableName).insert(newNews);
            let insertedNews = await knex(tableName).where({ news_id: news_id }).first();

            await auditServices.afterInsertAsync(data.author, tableName, news_id, insertedNews);

            insertedNews.thumbnail_url = insertedNews.thumbnail_url
                ? `${URL}/gallery/${insertedNews.thumbnail_url}`
                : null;

            return {
                message: "News Added Successfully",
                statusCode: 201,
                success: true,
                data: { insertedNews }
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

    async getPaginatedNewsAsync({ page = 1, pageSize = 10, search, userId = null, isPublished = null, isApproved = null, sortBy = 'created_on', sortOrder = 'desc' }) {
        try {
            const offset = (page - 1) * pageSize;

            let allNewsQuery = knex(tableName)
                .select('news.*')
                .where('is_deleted', false);

            let allNews = await allNewsQuery;

            for (const news of allNews) {
                if (new Date(news.publish_date) < new Date() && news.is_approved && !news.is_published) {
                    await knex(tableName)
                        .where('news_id', news.news_id)
                        .update({
                            is_published: true,
                            published_on: news.publish_date
                        });
                }
            }

            let query = knex(tableName)
                .select(
                    'news.*',
                    'users.full_name as author_name',
                    'users.user_profile as author_profile_url'
                )
                .leftJoin('users', 'news.author', 'users.user_id')
                .where('news.is_deleted', false);
            let countQuery = knex(tableName).count('news_id as count').where('is_deleted', false);

            if (userId) {
                const userResult = await userServices.getUserByIdAsync(userId);
                if (!userResult.success)
                    throw new Error("Invalid User");

                const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
                if (!roleResult.success)
                    throw new Error("Invalid Error");
                const userRoles = roleResult.data;

                if (!userRoles.includes(constants.ROLES.Admin)) {
                    query = query.where('news.author', userId);
                    countQuery = countQuery.where('news.author', userId);
                }
            }

            if (search) {
                query = query.andWhere('news.title', 'like', `%${search}%`);
                countQuery = countQuery.andWhere('news.title', 'like', `%${search}%`);
            }

            if (isPublished) {
                query = query.andWhere('news.is_published', true);
                countQuery = countQuery.andWhere('news.is_published', true);
            }

            if (isApproved) {
                query = query.andWhere('news.is_approved', true);
                countQuery = countQuery.andWhere('news.is_approved', true);
            }

            query = query.orderBy(sortBy, sortOrder);
            query = query.limit(pageSize).offset(offset);

            let news = await query;
            const [{ count }] = await countQuery;

            const processednews = news.map(news => {
                news.thumbnail_url = news.thumbnail_url
                    ? `${URL}/newsThumbnail/${news.thumbnail_url}`
                    : null;

                news.author_profile_url = news.author_profile_url
                    ? `${URL}/userProfile/${news.author_profile_url}`
                    : null;

                return news;
            });

            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: {
                    news: processednews,
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

    async getNewsByIdAsync(id) {
        try {
            let query = knex(tableName)
                .select(
                    'news.*',
                    'users.full_name as author_name',
                    'users.full_name as author_name',
                    'users.user_profile as author_profile_url'
                )
                .leftJoin('users', 'news.author', 'users.user_id')
                .where('news_id', id).first();

            let news = await query;

            if (news) {
                news.thumbnail_url = news.thumbnail_url
                    ? `${URL}/newsThumbnail/${news.thumbnail_url}`
                    : null;

                news.author_profile_url = news.author_profile_url
                    ? `${URL}/userProfile/${news.author_profile_url}`
                    : null;

                return {
                    message: "Fetched Successfully",
                    statusCode: 200,
                    success: true,
                    data: news
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

    async getNewsByTitleAsync(title) {
        try {
            let query = knex(tableName)
                .select(
                    'news.*',
                    'users.full_name as author_name',
                    'users.user_profile as author_profile_url'
                )
                .leftJoin('users', 'news.author', 'users.user_id')
                .where('title', title).first();

            let news = await query;

            if (news) {
                news.thumbnail_url = news.thumbnail_url
                    ? `${URL}/newsThumbnail/${news.thumbnail_url}`
                    : null;

                news.author_profile_url = news.author_profile_url
                    ? `${URL}/userProfile/${news.author_profile_url}`
                    : null;

                return {
                    message: "Fetched Successfully",
                    statusCode: 200,
                    success: true,
                    data: news
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

    async updateNewsAsync(data, userId) {
        try {
            const existingNewsTitleQuery = knex(tableName).select('news_id').where('title', data.title).where('news_id', '!=', data.news_id).andWhere("is_deleted", false);
            const newsTitle = await existingNewsTitleQuery.first();

            if (newsTitle)
                throw new Error('News already exist with this title');

            const newsResult = await this.getNewsByIdAsync(data.news_id);
            const news = newsResult.data;
            const userResult = await userServices.getUserByIdAsync(userId);

            if (!userResult.success)
                throw new Error('Invalid User');

            const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
            if (!roleResult.success)
                throw new Error('Invalid User');

            const userRoles = roleResult.data;
            if (!userRoles.includes(constants.ROLES.Admin) && news.author !== parseInt(userId, 10)) {
                throw new Error('You are not permitted to update this news');
            }

            const beforeupdateNews = await knex(tableName).where({ news_id: data.news_id }).first();

            const isPublished = new Date(data.publish_date) <= new Date();

            await knex(tableName)
                .where('news_id', data.news_id)
                .update({
                    title: data.title,
                    content: data.content,
                    thumbnail_url: data.thumbnail_url,
                    publish_date: data.publish_date,
                    is_published: isPublished,
                    updated_at: new Date(),
                });

            const afterupdateNews = await knex(tableName).where({ news_id: data.news_id }).first();

            await auditServices.afterUpdateAsync(userId, tableName, data.news_id, beforeupdateNews, afterupdateNews);

            return {
                message: "News updated Successfully",
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

    async deleteNewsAsync(newsId, userId) {
        try {
            const userResult = await userServices.getUserByIdAsync(userId);
            const news = await knex(tableName).select('*').where('news_id', newsId).first();
            if (!userResult.success)
                throw new Error("Invalid User");

            const user = userResult.data;
            const roleResult = await rolesServices.getUserRolesByIdAsync(user.Id);
            if (!roleResult.success)
                throw new Error("Invalid User Role");

            const userRoles = roleResult.data;
            if (!userRoles.includes(constants.ROLES.Admin)) {
                if (news.author !== parseInt(userId, 10))
                    throw new Error('You are not permitted to delete this news');

                if (news.is_approved || news.is_published) {
                    const beforeupdateNews = await knex(tableName).where({ news_id: newsId }).first();

                    await knex(tableName)
                        .where('news_id', newsId)
                        .update({
                            is_delete_requested: true,
                        });

                    const afterupdateNews = await knex(tableName).where({ news_id: newsId }).first();

                    await auditServices.afterUpdateAsync(userId, tableName, newsId, beforeupdateNews, afterupdateNews);

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
                .where('news_id', newsId)
                .update({
                    is_deleted: true,
                    deleted_on: new Date()
                });

            await auditServices.afterDeleteAsync(userId, tableName, newsId);

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

    async approveNewsAsync(newsId, userId) {
        try {
            const userResult = await userServices.getUserByIdAsync(userId);
            if (!userResult.success)
                throw new Error('Invalid User');

            const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
            if (!roleResult.success)
                throw new Error('Invalid User Role');

            const userRoles = roleResult.data;
            if (!userRoles.includes(constants.ROLES.Admin))
                throw new Error('Ask Admin to approve news');

            const beforeapproveNews = await knex(tableName).where({ news_id: newsId }).first();

            await knex(tableName)
                .where('news_id', newsId)
                .update({
                    is_approved: true,
                    approved_on: new Date()
                });

            const afterapproveNews = await knex(tableName).where({ news_id: newsId }).first();

            await auditServices.afterUpdateAsync(userId, tableName, newsId, beforeapproveNews, afterapproveNews);

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

    async disapproveNewsAsync(newsId, userId) {
        try {
            const userResult = await userServices.getUserByIdAsync(userId);
            if (!userResult.success)
                throw new Error('Invalid User');

            const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
            if (!roleResult.success)
                throw new Error('Invalid User Role');

            const userRoles = roleResult.data;
            if (!userRoles.includes(constants.ROLES.Admin))
                throw new Error('Ask Admin to disapprove news');

            const beforeDisapproveNews = await knex(tableName).where({ news_id: newsId }).first();

            await knex(tableName)
                .where('news_id', newsId)
                .update({
                    is_approved: false,
                    approved_on: null
                });

            const afterDisapproveNews = await knex(tableName).where({ news_id: newsId }).first();

            await auditServices.afterUpdateAsync(userId, tableName, newsId, beforeDisapproveNews, afterDisapproveNews);

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

    async publishNewsAsync(newsId, userId) {
        try {
            const userResult = await userServices.getUserByIdAsync(userId);

            let news = await knex(tableName).select('news_id').where('news_id', newsId).andWhere('is_approved', true).first();
            if (!news)
                throw new Error('News is not approved to publish');

            if (!userResult.success)
                throw new Error('Ask Admin to publish news');

            const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
            if(!roleResult.success)
                throw new Error("Invalid User Role");

            const userRoles = roleResult.data;
            if (!userRoles.includes(constants.ROLES.Admin))
                throw new Error('Ask Admin to publish news');

            const beforepublishNews = await knex(tableName).where({ news_id: newsId }).first();

            await knex(tableName)
                .where('news_id', newsId)
                .update({
                    is_published: true,
                    publish_date: new Date()
                });

            const afterpublishNews = await knex(tableName).where({ news_id: newsId }).first();
            await auditServices.afterUpdateAsync(userId, tableName, newsId, beforepublishNews, afterpublishNews);

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

    async UnpublishNewsAsync(newsId, userId) {
        try {
            const userResult = await userServices.getUserByIdAsync(userId);

            let news = await knex(tableName).select('news_id').where('news_id', newsId).andWhere('is_approved', true).first();
            if (!news)
                throw new Error('News is not approved to publish');

            if (!userResult.success)
                throw new Error('Ask Admin to publish news');

            const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
            if(!roleResult.success)
                throw new Error("Invalid User Role");

            const userRoles = roleResult.data;
            if (!userRoles.includes(constants.ROLES.Admin))
                throw new Error('Ask Admin to publish news');

            const beforepublishNews = await knex(tableName).where({ news_id: newsId }).first();

            await knex(tableName)
                .where('news_id', newsId)
                .update({
                    is_published: false,
                    // published_on: new Date()
                });

            const afterpublishNews = await knex(tableName).where({ news_id: newsId }).first();
            await auditServices.afterUpdateAsync(userId, tableName, newsId, beforepublishNews, afterpublishNews);

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

    async addNewsCommentAsync(data) {
        try {
            const newNewsComment = {
                content: data.content,
                news_id: data.newsId,
                parent_id: data.parentId ? data.parentId : null,
                author_name: data.authorName,
                author_email: data.authorEmail
            }

            const [comment_id] = await knex(commentTableName).insert(newNewsComment);
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

    async getAllNewsCommentsAsync(newsId) {
        try {

            let allComments = await knex(commentTableName)
                .select('*')
                .where('news_id', newsId)
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
module.exports = new NewsServices();