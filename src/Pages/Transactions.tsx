import React from "react";
import { Table } from "antd";
import { useGetTransactions } from "../Utils/TransactionApi";


interface TransactionEntry {
  account: string;
  accountId: string;
  debit: number;
  credit: number;
}

interface Transaction {
  _id: string;
  description: string;
  referenceType: string;
  referenceId?: string;
  entries: TransactionEntry[];
  date: string;
  createdAt: string;
}

const TransactionsPage: React.FC = () => {
  const { data: transactions = [], isLoading } = useGetTransactions();

  const columns = [
    { title: "Description", dataIndex: "description" },
    { title: "Reference Type", dataIndex: "referenceType" },
    {
      title: "Entries",
      render: (_: any, record: Transaction) =>
        record.entries
          .map((e) => `${e.account}: D${e.debit}/C${e.credit}`)
          .join(", "),
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (val: string) => new Date(val).toLocaleString(),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (val: string) => new Date(val).toLocaleString(),
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>

      <Table<Transaction>
        rowKey="_id"
        dataSource={transactions}
        columns={columns}
        loading={isLoading}
        bordered
        className="erp-table"
      />
    </div>
  );
};

export default TransactionsPage;