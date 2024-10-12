const { resource } = require('../app');
const { BadRequestError } = require('../core/error.response');
const resourceModel = require('../models/resource.model');
const roleModel = require('../models/role.model');

const createResource = async ({
  name = 'profile',
  slug = 'p00001',
  description = '',
}) => {
  try {
    const isExists = await resourceModel.findOne({
      $or: [{ src_slug: slug }, { src_name: name }],
    });
    if (isExists) {
      throw new BadRequestError('Resource already exists');
    }
    const resourceCreated = await resourceModel.create({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });
    return resourceCreated;
  } catch (error) {
    throw error;
  }
};

const listResource = async ({
  userId = '9999',
  limit = 30,
  offset = 0,
  search = [],
}) => {
  try {
    const listResource = await resourceModel.aggregate([
      {
        $project: {
          _id: 0,
          name: '$src_name',
          slug: '$src_slug',
          description: '$src_description',
          resourceId: '$_id',
          createdAt: 1,
        },
      },
    ]);

    return listResource;
  } catch (error) {
    throw error;
  }
};

const createRole = async ({
  name = 'profile',
  slug = 'p00001',
  description = '',
  grants = [],
}) => {
  try {
    const isExists = await roleModel.findOne({
      $or: [{ src_slug: slug }, { src_name: name }],
    });
    if (isExists) {
      throw new BadRequestError('Role already exists');
    }
    const roleCreated = await roleModel.create({
      rol_name: name,
      rol_slug: slug,
      rol_description: description,
      rol_grants: grants,
    });
    return roleCreated;
  } catch (error) {
    throw error;
  }
};

const listRole = async ({
  userId = '9999',
  limit = 30,
  offset = 0,
  search = [],
}) => {
  try {
    const listRole = await roleModel.aggregate([
      {
        $unwind: '$rol_grants',
      },
      {
        $lookup: {
          from: 'Resources',
          localField: 'rol_grants.resource',
          foreignField: '_id',
          as: 'resource',
        },
      },
      {
        $unwind: '$resource',
      },
      {
        $project: {
          role: '$rol_name',
          resource: '$resource.src_name',
          action: '$rol_grants.actions',
          attributes: '$rol_grants.attributes',
        },
      },
      {
        $unwind: '$action',
      },
      {
        $project: {
          _id: 0,
          role: 1,
          resource: 1,
          action: 1,
          attributes: 1,
        },
      },
    ]);
    return listRole;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createResource,
  listResource,
  createRole,
  listRole,
};
