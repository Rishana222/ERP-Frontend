import React from "react";
import { Table, Popconfirm, message, Tag } from "antd";
import { useGetSales, useDeleteSale } from "../Utils/salesAPI";

interface Customer {
  _id: string;
  name: string;
}

interface SaleItem {
  product: { _id: string; name: string };
  unit: { _id: string; name: string };
  quantity: number;
  sellingPrice: number;
  total: number;
}

interface Sale {
  _id: string;
  invoiceNumber: string;
  customer: Customer;
  items: SaleItem[];
  grandTotal: number;
  paidAmount: number;
  paymentStatus: "PAID" | "PARTIAL" | "UNPAID";
  createdAt: string;
}

const Invoices: React.FC = () => {
  const { data: sales = [], isLoading } = useGetSales();
  const deleteSale = useDeleteSale();

  const handleDelete = (id: string) => {
    deleteSale.mutate(id, {
      onSuccess: () => message.success("Sale deleted successfully"),
      onError: () => message.error("Failed to delete sale"),
    });
  };

  const columns = [
    {
      title: "Invoice",
      dataIndex: "invoiceNumber",
      responsive: ["xs", "sm", "md", "lg"],
      render: (text: string) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
    },
    {
      title: "Customer",
      responsive: ["sm", "md", "lg"],
      render: (_: any, record: Sale) => record.customer?.name || "N/A",
    },
    {
      title: "Total",
      dataIndex: "grandTotal",
      responsive: ["md", "lg"],
      render: (val: number) => `₹${val}`,
    },
    {
      title: "Paid",
      dataIndex: "paidAmount",
      responsive: ["md", "lg"],
      render: (val: number) => `₹${val || 0}`,
    },
    {
      title: "Balance",
      responsive: ["lg"],
      render: (_: any, record: Sale) =>
        `₹${record.grandTotal - (record.paidAmount || 0)}`,
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      responsive: ["xs", "sm", "md", "lg"],
      render: (status: Sale["paymentStatus"]) => {
        let color = "default";
        if (status === "PAID") color = "green";
        if (status === "PARTIAL") color = "orange";
        if (status === "UNPAID") color = "red";

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      responsive: ["md", "lg"],
      render: (val: string) =>
        new Date(val).toLocaleDateString("en-IN"),
    },
    {
      title: "Action",
      responsive: ["xs", "sm", "md", "lg"],
      render: (_: any, record: Sale) => (
        <Popconfirm
          title="Delete this invoice?"
          onConfirm={() => handleDelete(record._id)}
        >
          <button className="px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-700 text-white">
            Delete
          </button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold">Invoices</h2>
      </div>

      <Table<Sale>
        rowKey="_id"
        dataSource={Array.isArray(sales) ? sales : []}
        columns={columns}
        loading={isLoading}
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}   // 🔥 enables horizontal scroll
        className="erp-table min-w-[800px]"
      />
    </div>
  );
};

export default Invoices;