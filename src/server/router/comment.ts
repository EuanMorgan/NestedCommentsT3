import {createRouter} from './context';
import {z} from 'zod';
import {TRPCError} from '@trpc/server';

export const commentRouter = createRouter()
  .query('all-comments', {
    input: z.object({
      permalink: z.string(),
    }),
    async resolve({ctx, input}) {
      const {permalink} = input;
      try {
        const comments = await ctx.prisma.comment.findMany({
          where: {
            Post: {
              permalink,
            },
          },
          include: {
            user: true,
          },
        });

        return comments;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: 'BAD_REQUEST',
        });
      }
    },
  })
  //   Anything below middleware must be auth
  .middleware(async ({ctx, next}) => {
    if (!ctx?.session?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to do that',
      });
    }
    return next();
  })
  .mutation('add-comment', {
    input: z.object({
      body: z.string(),
      permalink: z.string(),
      parentId: z.string().optional(),
    }),
    async resolve({ctx, input}) {
      const {body, permalink, parentId} = input;

      const user = ctx.session?.user;

      try {
        const comment = await ctx.prisma.comment.create({
          data: {
            body,
            Post: {
              connect: {
                permalink,
              },
            },
            user: {
              connect: {
                id: user?.id,
              },
            },
            // If we have a parent, spread this
            ...(parentId && {
              parent: {
                connect: {
                  id: parentId,
                },
              },
            }),
          },
        });

        return comment;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Something went wrong',
        });
      }
    },
  });
