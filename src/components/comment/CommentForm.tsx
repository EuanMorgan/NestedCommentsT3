import {Box, Button, Group, Textarea} from '@mantine/core';
import {useForm} from '@mantine/form';
import {useRouter} from 'next/router';
import {trpc} from '../../utils/trpc';

const CommentForm = ({parentId}: {parentId?: string}) => {
  const router = useRouter();

  const permalink = router.query.permalink as string;

  const utils = trpc.useContext();

  const {mutate, isLoading} = trpc.useMutation(['comments.add-comment'], {
    onSuccess: () => {
      // Reset the form on submit and invalidate the all comments query to refetch
      form.reset();
      utils.invalidateQueries([
        'comments.all-comments',
        {
          permalink,
        },
      ]);
    },
  });

  const form = useForm({
    initialValues: {
      body: '',
    },
  });

  const handleSubmit = (values: {body: string}) => {
    const payload = {
      ...values,
      permalink,
      parentId,
    };

    mutate(payload);
  };

  return (
    <Box mt='md' mb='md'>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Textarea
          required
          placeholder='Your comment'
          label='Comment'
          {...form.getInputProps('body')}
        />

        <Group position='right' mt='md'>
          <Button loading={isLoading} type='submit'>
            {parentId ? 'Post Reply' : 'Post Comment'}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default CommentForm;
