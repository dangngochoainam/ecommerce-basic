const { authentication, authenticationV2 } = require('../../auth/authUtils');
const commentController = require('../../controllers/comment.controller');
const { asyncHandler } = require('../../helpers/asyncHandle');

const router = require('express').Router();

router.use(authenticationV2);

router.get('', asyncHandler(commentController.getCommentByParentId));
router.post('', asyncHandler(commentController.createComment));
router.delete('', asyncHandler(commentController.deleteComment));

module.exports = router;
