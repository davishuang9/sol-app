import { PrismaClient, Transaction } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export type SerializableTranaction = Omit<Transaction, "createdAt"> & {
  createdAt: string;
};

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST" && req.body.hydrateTable) {
    const { publicKey } = req.body;
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { from: publicKey.toString() },
          { to: publicKey.toString() },
        ]
      }
    });
    const serializableTransactions: SerializableTranaction[] = transactions.map((transaction: Transaction) => ({
      ...transaction,
      createdAt: transaction.createdAt.toDateString(),
    }));
    res.status(200).json(serializableTransactions);
  } else if (req.method === "POST") {
    try {
      // TODO: boundary checking for decimal amount of sol
      // persist transaction details to our DB
      const { signature, amount, from, to } = req.body;
      const transaction = await prisma.transaction.create({
        data: { signature, amount: parseInt(amount), from, to }
      });
      res.status(200).json(transaction);
    } catch (e) {
      console.log(`Error: ${e}`);
      res.status(500).json({ message: "Something went wrong", error: e });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
