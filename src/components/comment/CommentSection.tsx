import {Box} from '@mantine/core';
import {useRouter} from 'next/router';
import React from 'react';
import formatComments from '../../helpers/formatComments';
import {trpc} from '../../utils/trpc';
import CommentForm from './CommentForm';
import ListComments from './ListComments';

const CommentSection = () => {
  const router = useRouter();
  const permalink = router.query.permalink as string;
  const {data} = trpc.useQuery([
    'comments.all-comments',
    {
      permalink,
    },
  ]);

  return (
    <Box>
      <CommentForm />

      {data && <ListComments comments={formatComments(data || [])} />}
    </Box>
  );
};

export default CommentSection;
