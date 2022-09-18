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

      {comment.children && comment.children.length > 0 && (
        <ListComments comments={comment.children} />
      )}
    </Paper>
  );
};

const ListComments = ({comments}: {comments: CommentWithChildren[]}) => {
  return (
    <Box>
      {comments.map(comment => {
        return <Comment key={comment.id} comment={comment} />;
      })}
    </Box>
  );
};

export default ListComments;