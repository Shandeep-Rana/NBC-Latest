const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "galleryImages";
const constants = require("../constants/index");
const URL = constants.IMAGE_URL;
const path = require('path');
const userServices = require('../services/userServices');
const auditServices = require('../services/auditServices');
const rolesServices = require("./rolesServices");

class GalleryServices {

    async addImageAsync(data) {
        try {
            const newImage = {
                title: path.parse(data.name).name,
                description: data.description ? data.description : "",
                image_url: data.image,
                uploaded_by: data.userId
            }

            const userResult = await userServices.getUserByIdAsync(data.userId);
            if (!userResult.success)
                throw new Error("User not found");

            const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
            if (!roleResult.success)
                throw new Error("Invalid User Role");
            const userRoles = roleResult.data;
            if (userRoles.includes(constants.ROLES.Admin)) {
                newImage.is_approved = true;
                newImage.approved_on = new Date();
            }

            const [image_id] = await knex(tableName).insert(newImage);
            var insertedImage = await knex(tableName).where({ image_id: image_id }).first();

            await auditServices.afterInsertAsync(data.userId, tableName, image_id, insertedImage);

            insertedImage.image_url = insertedImage.image_url
                ? `${URL}/gallery/${insertedImage.image_url}`
                : null;

            const resultObject = {
                message: "Image Added Successfully",
                statusCode: 201,
                success: true,
                data: { insertedImage }
            };
            return resultObject;
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

    async getPaginatedImagesAsync({ page = 1, pageSize = 10, search, userId = null, sortBy = 'uploaded_at', sortOrder = 'desc' }) {
        try {
            const offset = (page - 1) * pageSize;

            let query = knex(tableName).select('*').where('is_deleted', false).andWhere("is_approved", true);
            let countQuery = knex(tableName).count('image_id as count').where('is_deleted', false).andWhere("is_approved", true);
            if (userId) {
                const userResult = await userServices.getUserByIdAsync(userId);
                if (!userResult.success)
                    throw new Error("User not found");

                const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
                if (!roleResult.success)
                    throw new Error("Invalid User Role");

                const userRoles = roleResult.data;
                if (!userRoles.includes(constants.ROLES.Admin)) {
                    query = query.where('uploaded_by', userId);
                    countQuery = countQuery.where('uploaded_by', userId);
                }
            }

            if (search) {
                query = query.where('title', 'like', `%${search}%`);
                countQuery = countQuery.where('title', 'like', `%${search}%`);
            }

            query = query.orderBy(sortBy, sortOrder);
            query = query.limit(pageSize).offset(offset);

            var images = await query;
            const [{ count }] = await countQuery;

            images = images.map(img => {
                img.image_url = img.image_url
                    ? `${URL}/gallery/${img.image_url}`
                    : null;
                return img;
            });

            const resultObject = {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: {
                    images,
                    pagination: {
                        total: parseInt(count, 10),
                        currentPage: page,
                        totalPages: Math.ceil(count / pageSize)
                    }
                }
            };

            return resultObject;
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

    async deleteImagesAsync(imageIds, userId) {
        try {
            const userResult = await userServices.getUserByIdAsync(userId);
            if (!userResult.success)
                throw new Error("User not found");

            const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
            if (!roleResult.success)
                throw new Error("Invalid User Role");

            const userRoles = roleResult.data;
            if (!userRoles.includes(constants.ROLES.Admin)) {
                const images = await knex(tableName).select('image_id', 'uploaded_by', 'is_approved').whereIn('image_id', imageIds);
                const unauthorizedImages = images.filter(image => image.uploaded_by !== parseInt(userId, 10));
                if (unauthorizedImages.length > 0) {
                    throw new Error('You are not permitted to delete these images');
                }

                if (images.length > 1) {
                    for (const image of images) {
                        if (image.is_approved) {
                            const beforeUpdateImage = await knex(tableName).where('image_id', image.image_id).first();
                            await knex(tableName)
                                .where('image_id', image.image_id)
                                .update({
                                    is_delete_requested: true,
                                });
                            const afterUpdateImage = await knex(tableName).where('image_id', image.image_id).first();
                            await auditServices.afterUpdateAsync(userId, tableName, image.image_id, beforeUpdateImage, afterUpdateImage);
                        }
                        else {
                            await knex(tableName)
                                .where('image_id', image.image_id)
                                .update({
                                    is_deleted: true,
                                    deleted_on: new Date()
                                });

                            await auditServices.afterDeleteAsync(userId, tableName, image.image_id);
                        }
                    }

                    return {
                        message: "For Approved images, your request has been submitted to the admin. They will review it and take the appropriate action.",
                        statusCode: 200,
                        success: true,
                        data: null
                    };
                }
                else {
                    if (images[0].is_approved) {
                        const beforeUpdateImage = await knex(tableName).where('image_id', images[0].image_id).first();
                        await knex(tableName)
                            .where('image_id', images[0].image_id)
                            .update({
                                is_delete_requested: true,
                            });
                        const afterUpdateImage = await knex(tableName).where('image_id', images[0].image_id).first();
                        await auditServices.afterUpdateAsync(userId, tableName, images[0].image_id, beforeUpdateImage, afterUpdateImage);

                        return {
                            message: "Your request has been submitted to the admin. They will review it and take the appropriate action.",
                            statusCode: 200,
                            success: true,
                            data: null
                        };

                    } else {
                        await knex(tableName)
                            .where('image_id', images[0].image_id)
                            .update({
                                is_deleted: true,
                                deleted_on: new Date()
                            });

                        await auditServices.afterDeleteAsync(userId, tableName, images[0].image_id);

                        return {
                            message: "Deleted Successfully",
                            statusCode: 200,
                            success: true,
                            data: null
                        };
                    }
                }
            }
            else {
                await knex(tableName)
                    .whereIn('image_id', imageIds)
                    .update({
                        is_deleted: true,
                        deleted_on: new Date()
                    });

                for (let imageId of imageIds) {
                    await auditServices.afterDeleteAsync(userId, tableName, imageId);
                }

                const resultObject = {
                    message: "Deleted Successfully",
                    statusCode: 200,
                    success: true,
                    data: null
                };
                return resultObject;
            }
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

    async approveImagesAsync(imageId, userId) {
        try {
            const userResult = await userServices.getUserByIdAsync(userId);
            if (!userResult.success)
                throw new Error("User not found");

            const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
            if (!roleResult.success)
                throw new Error("Invalid user role");

            const userRoles = roleResult.data;
            if (!userRoles.includes(constants.ROLES.Admin))
                throw new Error('Ask Admin to approve image');

            const beforeApprovalImage = await knex(tableName).where({ image_id: imageId }).first();

            await knex(tableName)
                .where('image_id', imageId)
                .update({
                    is_approved: true,
                    approved_on: new Date()
                });

            const afterApprovalImage = await knex(tableName).where({ image_id: imageId }).first();

            await auditServices.afterUpdateAsync(userId, tableName, imageId, beforeApprovalImage, afterApprovalImage);

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

    async diApproveImagesAsync(imageId, userId) {
        try {
            const userResult = await userServices.getUserByIdAsync(userId);
            if (!userResult.success)
                throw new Error("User not found");

            const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
            if (!roleResult.success)
                throw new Error("Invalid User Role");

            const userRoles = roleResult.data;
            if (!userRoles.includes(constants.ROLES.Admin))
                throw new Error('Ask Admin to diApprove image');

            const beforeDisApprovalImage = await knex(tableName).where({ image_id: imageId }).first();

            await knex(tableName)
                .where('image_id', imageId)
                .update({
                    is_approved: false,
                    approved_on: null
                });

            const afterDisApprovalImage = await knex(tableName).where({ image_id: imageId }).first();

            await auditServices.afterUpdateAsync(userId, tableName, imageId, beforeDisApprovalImage, afterDisApprovalImage);

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

    async getAllImagesAsync(sortBy = 'uploaded_at', sortOrder = 'desc', category_id = null) {
        try {
            // 👉 Use category_id = 1 as default if none is passed or empty
            const effectiveCategoryId = category_id === null || category_id === undefined || category_id === '' ? 1 : category_id;

            // 1. Build image query
            let query = knex(tableName)
                .select(
                    'galleryImages.image_id',
                    'galleryImages.title',
                    'galleryImages.image_url',
                    'users.full_name as uploaded_by',
                    'gallery_category.name as category_name',
                    'galleryImages.category_id'
                )
                .leftJoin('users', 'galleryImages.uploaded_by', 'users.user_id')
                .leftJoin('gallery_category', 'galleryImages.category_id', 'gallery_category.id')
                .where('galleryImages.is_deleted', false)
                .where('galleryImages.is_approved', true);

            if (effectiveCategoryId !== 'all') {
                query = query.andWhere('galleryImages.category_id', effectiveCategoryId);
            }

            query = query.orderBy(sortBy, sortOrder);

            let images = await query;

            images = images.map(img => {
                img.image_url = img.image_url ? `${URL}/gallery/${img.image_url}` : null;
                return img;
            });

            const categories = await knex('gallery_category')
                .select('id', 'name')
                .where('is_deleted', false);

            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: {
                    images,
                    categories,
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
}

module.exports = new GalleryServices();