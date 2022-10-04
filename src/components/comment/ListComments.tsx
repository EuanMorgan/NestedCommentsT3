import {Avatar, Box, Button, Group, Paper, Text} from '@mantine/core';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import {CommentWithChildren, trpc} from '../../utils/trpc';
import CommentForm from './CommentForm';

const getReplyCountText = (count: number) => {
  if (count === 0) {
    return 'No replies';
  }

  if (count === 1) {
    return '1 reply';
  }

  return `${count} replies`;
};

const CommentActions = ({
  commentId,
  replyCount,
}: {
  commentId: string;
  replyCount: number;
}) => {
  const [replying, setReplying] = useState(false);
  // This renders the total replies number and a reply button which hides if you're replying already

  // If you are replying, it adds a text field underneath it to add the reply
  return (
    <>
      <Group position='apart' mt='md'>
        <Text>{getReplyCountText(replyCount)}</Text>
        <Button onClick={() => setReplying(!replying)}>Reply</Button>
      </Group>

      {replying && <CommentForm parentId={commentId} />}
    </>
  );
};

const Comment = ({comment}: {comment: CommentWithChildren}) => {
  // The comment component is relatively simple, it just displays the image, name, comment text etc
  return (
    <Paper withBorder radius='md' mb='md' p='md'>
      <Box
        sx={() => ({
          display: 'flex',
        })}
      >
        <Avatar />
        <Box
          pl='md'
          sx={() => ({
            display: 'flex',
            flexDirection: 'column',
          })}
        >
          <Group>
            <Text>{comment.user.name}</Text>
            <Text>{comment.createdAt.toISOString()}</Text>
          </Group>
          {comment.body}
        </Box>
      </Box>
      <CommentActions
        commentId={comment.id}
        replyCount={comment.children.length}
      />

{/* This is th emain part, for each child, if any, of this comment we return yet another list comments component so we are recursively rendering the children */}
      {comment.children && comment.children.length > 0 && (
        <ListComments comments={comment.children} />
      )}
    </Paper>
  );
};

const ListComments = ({comments}: {comments: CommentWithChildren[]}) => {
  // The base comment list, this maps through each 'root' comments and returns a comment component for each
  return (
    <Box>
      {comments.map(comment => {
        return <Comment key={comment.id} comment={comment} />;
      })}
    </Box>
  );
};

export default ListComments;
