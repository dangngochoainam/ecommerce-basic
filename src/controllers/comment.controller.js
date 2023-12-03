const { SuccessResponse } = require('../core/success.response');
const CommentService = require('../services/comment.service');

class CommentController {
  createComment = async (req, res, next) => {
    return new SuccessResponse({
      message: 'create comment ok!!',
      statusCode: 201,
      metadata: await CommentService.createComment(req.body),
    }).send(res);
  };
  deleteComment = async (req, res, next) => {
    return new SuccessResponse({
      message: 'delete comment ok!!',
      statusCode: 204,
      metadata: await CommentService.deleteComment(req.body),
    }).send(res);
  };
  getCommentByParentId = async (req, res, next) => {
    return new SuccessResponse({
      message: 'get comment ok!!',
      statusCode: 201,
      metadata: await CommentService.getCommentByParentId(req.query),
    }).send(res);
  };
}

module.exports = new CommentController();
