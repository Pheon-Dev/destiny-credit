/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '../createRouter';
import { prisma } from '../prisma';

/* const defaultPaymentSelect = Prisma.validator<Prisma.PaymentSelect>()({ */
/*   id: true, */
/*   title: true, */
/*   text: true, */
/*   createdAt: true, */
/*   updatedAt: true, */
/* }); */
export const paymentRouter = () => {}
/* export const paymentRouter = createRouter() */
/*   // create */
  /* .mutation('add', { */
  /*   input: z.object({ */
  /*     id: z.string().uuid().optional(), */
  /*     title: z.string().min(1).max(32), */
  /*     text: z.string().min(1), */
  /*   }), */
  /*   async resolve({ input }) { */
  /*     const payment = await prisma.payments.create({ */
  /*       data: input, */
  /*       select: defaultPaymentSelect, */
  /*     }); */
  /*     return payment; */
  /*   }, */
  /* }) */
  /* // read */
  /* .query('all', { */
  /*   async resolve() { */
  /*     /** */
  /*      * For pagination you can have a look at this docs site */
  /*      * @link https://trpc.io/docs/useInfiniteQuery */
  /*      */ 
  /**/
  /*     return prisma.payment.findMany({ */
  /*       select: defaultPaymentSelect, */
  /*     }); */
  /*   }, */
  /* }) */
  /* .query('byId', { */
  /*   input: z.object({ */
  /*     id: z.string(), */
  /*   }), */
  /*   async resolve({ input }) { */
  /*     const { id } = input; */
  /*     const payment = await prisma.payment.findUnique({ */
  /*       where: { id }, */
  /*       select: defaultPaymentSelect, */
  /*     }); */
  /*     if (!payment) { */
  /*       throw new TRPCError({ */
  /*         code: 'NOT_FOUND', */
  /*         message: `No payment with id '${id}'`, */
  /*       }); */
  /*     } */
  /*     return payment; */
  /*   }, */
  /* }) */
  /* // update */
  /* .mutation('edit', { */
  /*   input: z.object({ */
  /*     id: z.string().uuid(), */
  /*     data: z.object({ */
  /*       title: z.string().min(1).max(32).optional(), */
  /*       text: z.string().min(1).optional(), */
  /*     }), */
  /*   }), */
  /*   async resolve({ input }) { */
  /*     const { id, data } = input; */
  /*     const payment = await prisma.payment.update({ */
  /*       where: { id }, */
  /*       data, */
  /*       select: defaultPaymentSelect, */
  /*     }); */
  /*     return payment; */
  /*   }, */
  /* }) */
  /* // delete */
  /* .mutation('delete', { */
  /*   input: z.object({ */
  /*     id: z.string(), */
  /*   }), */
  /*   async resolve({ input }) { */
  /*     const { id } = input; */
  /*     await prisma.payment.delete({ where: { id } }); */
  /*     return { */
  /*       id, */
  /*     }; */
  /*   }, */
  /* }); */
