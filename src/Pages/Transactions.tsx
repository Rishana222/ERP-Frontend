import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
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

  const columns: ColumnsType<Transaction> = [
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
      width: 180,
    },
    {
      title: "Reference",
      dataIndex: "referenceType",
      ellipsis: true,
      width: 130,
    },
    {
      title: "Entries",
      width: 250,
      render: (_: any, record: Transaction) => (
        <div className="whitespace-normal break-words text-xs sm:text-sm">
          {record.entries
            .map(
              (e) =>
                `${e.account}: D${e.debit}/C${e.credit}`
            )
            .join(", ")}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      width: 160,
      render: (val: string) =>
        new Date(val).toLocaleString(),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      width: 160,
      render: (val: string) =>
        new Date(val).toLocaleString(),
    },
  ];

  return (
    <div className="w-full min-w-0 px-2 sm:px-4 py-3">
      
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          Transactions
        </h2>
      </div>

      {/* Table Wrapper (Important for 320px) */}
      <div className="w-full min-w-0 overflow-x-auto">
        <Table<Transaction>
          rowKey="_id"
          dataSource={transactions}
          columns={columns}
          loading={isLoading}
          bordered
          size="small"
          pagination={{ pageSize: 8, size: "small" }}
          scroll={{ x: 900 }}
          className="erp-table"
        />
      </div>
    </div>
  );
};

export default TransactionsPage;