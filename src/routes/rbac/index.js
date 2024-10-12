const {
  createRole,
  listRole,
  createResource,
  listResource,
} = require('../../controllers/rbac.controller');
const { asyncHandler } = require('../../helpers/asyncHandle');

const router = require('express').Router();

// router.use(authenticationV2);

router.post('/roles', asyncHandler(createRole));
router.get('/roles', asyncHandler(listRole));

router.post('/resources', asyncHandler(createResource));
router.get('/resources', asyncHandler(listResource));

module.exports = router;
