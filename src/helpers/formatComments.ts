import {Comment, CommentWithChildren} from '../utils/trpc';

const formatComments = (comments: Comment[]) => {
  const map = new Map();

  //   Routes = comments without parent ID
  const roots: CommentWithChildren[] = [];

  for (let i = 0; i < comments.length; i++) {
    const commentId = comments[i]?.id;

    map.set(commentId, i);

    (comments[i] as CommentWithChildren).children = [];

    // If this comment has a parent
    if (typeof comments[i]?.parentId === 'string') {
      const parentCommentIndex: number = map.get(comments[i]?.parentId);
      // Push this comment to it's parents children
      (comments[parentCommentIndex] as CommentWithChildren).children.push(
        comments[i] as CommentWithChildren
      );

      continue;
    }

    // If we don't have a parentId, push this to the roots

    roots.push(comments[i] as CommentWithChildren);
  }

  return roots;
};

export default formatComments;
