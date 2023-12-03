const { BadRequestError, NotFoundError } = require('../core/error.response');
const { Comment } = require('../models/comment.model');
const { findProductById } = require('../models/repositories/product.repo');
const { convertStringToObjectId } = require('../utils');

class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      const parentComment = await Comment.findById(
        convertStringToObjectId(parentCommentId)
      );
      if (!parentComment) {
        throw new BadRequestError('Parent Comment Not Found');
      }
      rightValue = parentComment.comment_right;
      await Comment.updateMany(
        {
          comment_productId: convertStringToObjectId(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: {
            comment_right: 2,
          },
        }
      );

      await Comment.updateMany(
        {
          comment_productId: convertStringToObjectId(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: {
            comment_left: 2,
          },
        }
      );
    } else {
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: convertStringToObjectId(productId),
        },
        'comment_right',
        {
          sort: { comment_right: -1 },
        }
      );

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();

    return comment;
  }

  static async getCommentByParentId({
    limit = 50,
    offset = 0,
    page = 1,
    sort = 'createdAt',
    filter = { isDeleted: false },
    productId,
    parentCommentId = null,
  }) {
    if (parentCommentId) {
      const parent = await Comment.findById(
        convertStringToObjectId(parentCommentId)
      );
      if (!parent) {
        throw new BadRequestError('Parent commnet not found');
      }
      const comments = await Comment.find({
        comment_productId: convertStringToObjectId(productId),
        comment_parentId: convertStringToObjectId(parentCommentId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lt: parent.comment_right },
      }).sort({
        createdAt: 1,
      });
      return comments;
    }
    return Comment.find({
      comment_productId: convertStringToObjectId(productId),
    }).sort({
      createdAt: 1,
    });
  }

  static async deleteComment({ productId, commentId }) {
    const product = await findProductById({
      product_id: convertStringToObjectId(productId),
    });
    if (!product) throw new NotFoundError('Product not found');

    const comment = await Comment.findById(commentId);
    if (!comment) throw new NotFoundError('Commecnt not found');

    const { comment_left: leftValue, comment_right: rightValue } = comment;
    const width = rightValue - leftValue + 1;

    // Delete comment child
    await Comment.deleteMany({
      comment_productId: convertStringToObjectId(productId),
      comment_left: {
        $gte: leftValue,
        $lte: rightValue,
      },
    });

    // update comment > width
    await Comment.updateMany(
      {
        comment_productId: convertStringToObjectId(productId),
        comment_left: { $gt: rightValue },
      },
      {
        $inc: {
          comment_left: -width,
        },
      }
    );

    await Comment.updateMany(
      {
        comment_productId: convertStringToObjectId(productId),
        comment_right: { $gt: rightValue },
      },
      {
        $inc: {
          comment_right: -width,
        },
      }
    );

    return true;
  }
}

module.exports = CommentService;
