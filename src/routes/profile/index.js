const { profiles, profile } = require('../../controllers/profile.controller');
const grantAccess = require('../../middlewares/rbac');

const router = require('express').Router();

// router.use(authenticationV2);

router.get('/viewOwn', grantAccess('readOwn', 'profile'), profile);
router.get('/viewAny', grantAccess('readAny', 'profile'), profiles);

module.exports = router;
