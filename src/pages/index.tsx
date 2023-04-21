import { PrismaClient, Transaction } from "@prisma/client";
import SolanaHelper from "@/src/components/SolanaHelper";
import Table from "@/src/components/Table";

// export type SerializableTranaction = Omit<Transaction, "createdAt" | "updatedAt"> & {
//   createdAt: string;
// };

// const prisma = new PrismaClient();
// export async function getServerSideProps() {
//   const transactions = await prisma.transaction.findMany();
//   const serializableTransactions: SerializableTranaction[] = transactions.map((transaction: Transaction) => ({
//     ...transaction,
//     createdAt: transaction.createdAt.toDateString(),
//   }));
//   return {
//     props: {
//       transactions: serializableTransactions
//     }
//   };
// }

export default function Home() {
  return (
    <div>
      <SolanaHelper />
      <br />
      <Table />
    </div>
  );
}
