import { PrismaClient, Transaction } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export type SerializableTransaction = Omit<Transaction, "createdAt"> & {
  createdAt: string;
};

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { publicKey } = req.query;
      if (!publicKey) {
        res.status(400).json({ message: "Public key not found" });
        return;
      }
      const transactions = await prisma.transaction.findMany({
        where: {
          OR: [
            { from: publicKey.toString() },
            { to: publicKey.toString() },
          ]
        }
      });
      const serializableTransactions: SerializableTransaction[] = transactions.map((transaction: Transaction) => ({
        ...transaction,
        createdAt: transaction.createdAt.toDateString(),
      }));
      res.status(200).json(serializableTransactions);
    } catch (e) {
      console.log(`Error: ${e}`);
      res.status(500).json({ message: "Something went wrong", error: e });
    }
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
