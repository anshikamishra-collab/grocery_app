import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Helper: get verified user from context ───────────────────────────────────
async function getVerifiedUser(context: any) {
  if (!context.user) throw new Error("Unauthorized");
  const user = await prisma.user.findUnique({
    where: { auth0Id: context.user.sub },
  });
  if (!user) throw new Error("User not found");
  return user;
}

export const resolvers = {
  Query: {
    getMyLists: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");

      const auth0Id = context.user.sub;
      const email = context.user.email || "noemail@placeholder.com";

      let user = await prisma.user.findUnique({ where: { auth0Id } });

      if (!user) {
        user = await prisma.user.create({ data: { auth0Id, email } });
      }

      return prisma.groceryList.findMany({
        where: { userId: user.id },
        include: { items: true },
      });
    },
  },

  Mutation: {
    createList: async (_: any, __: any, context: any) => {
      const user = await getVerifiedUser(context);
      return prisma.groceryList.create({
        data: { userId: user.id, date: new Date() },
        include: { items: true },
      });
    },

    addItem: async (
      _: any,
      args: { listId: string; name: string; price: number },
      context: any
    ) => {
      const user = await getVerifiedUser(context);
      const { listId, name, price } = args;

      const list = await prisma.groceryList.findUnique({ where: { id: listId } });
      if (!list || list.userId !== user.id) throw new Error("Not allowed");

      return prisma.groceryItem.create({ data: { listId, name, price } });
    },

    // ── NEW: update an item's name and/or price ──────────────────────────────
    updateItem: async (
      _: any,
      args: { itemId: string; name: string; price: number },
      context: any
    ) => {
      const user = await getVerifiedUser(context);
      const { itemId, name, price } = args;

      // Verify item belongs to this user via the list
      const item = await prisma.groceryItem.findUnique({
        where: { id: itemId },
        include: { list: true },
      });
      if (!item || item.list.userId !== user.id) throw new Error("Not allowed");

      return prisma.groceryItem.update({
        where: { id: itemId },
        data: { name, price },
      });
    },

    // ── NEW: delete a single item ────────────────────────────────────────────
    deleteItem: async (
      _: any,
      args: { itemId: string },
      context: any
    ) => {
      const user = await getVerifiedUser(context);
      const { itemId } = args;

      const item = await prisma.groceryItem.findUnique({
        where: { id: itemId },
        include: { list: true },
      });
      if (!item || item.list.userId !== user.id) throw new Error("Not allowed");

      return prisma.groceryItem.delete({ where: { id: itemId } });
    },

    // ── NEW: delete an entire list (cascades items via Prisma schema) ────────
    deleteList: async (
      _: any,
      args: { listId: string },
      context: any
    ) => {
      const user = await getVerifiedUser(context);
      const { listId } = args;

      const list = await prisma.groceryList.findUnique({ where: { id: listId } });
      if (!list || list.userId !== user.id) throw new Error("Not allowed");

      // Delete items first, then list
      await prisma.groceryItem.deleteMany({ where: { listId } });
      return prisma.groceryList.delete({
        where: { id: listId },
        include: { items: true },
      });
    },
  },
};