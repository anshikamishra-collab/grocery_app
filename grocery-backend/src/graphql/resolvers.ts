import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    getMyLists: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      const auth0Id = context.user.sub;
      const email = context.user.email || "noemail@placeholder.com";

      // 🔥 1. Check if user exists
      let user = await prisma.user.findUnique({
        where: { auth0Id },
      });

      // 🔥 2. Auto-create user if first login
      if (!user) {
        user = await prisma.user.create({
          data: {
            auth0Id,
            email,
          },
        });
      }

      // 🔥 3. Return all lists with items
      return prisma.groceryList.findMany({
        where: { userId: user.id },
        include: { items: true },
      });
    },
  },

  Mutation: {
    createList: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      const auth0Id = context.user.sub;

      // 🔥 Find user
      const user = await prisma.user.findUnique({
        where: { auth0Id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // 🔥 Create grocery list
      return prisma.groceryList.create({
        data: {
          userId: user.id,
          date: new Date(),
        },
        include: { items: true },
      });
    },

    addItem: async (
      _: any,
      args: { listId: string; name: string; price: number },
      context: any
    ) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      const { listId, name, price } = args;

      // 🔥 Optional: Verify list belongs to user (extra security)
      const auth0Id = context.user.sub;

      const user = await prisma.user.findUnique({
        where: { auth0Id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const list = await prisma.groceryList.findUnique({
        where: { id: listId },
      });

      if (!list || list.userId !== user.id) {
        throw new Error("Not allowed");
      }

      // 🔥 Add item
      return prisma.groceryItem.create({
        data: {
          listId,
          name,
          price,
        },
      });
    },
  },
};