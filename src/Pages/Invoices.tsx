import React from "react";
import { Table, Button, Popconfirm, message, Tag } from "antd";
import { useGetSales, useDeleteSale } from "../Utils/salesAPI";

// Types
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
    { title: "Invoice No", dataIndex: "invoiceNumber" },
    {
      title: "Customer",
      render: (_: any, record: Sale) => record.customer?.name || "N/A",
    },
    {
      title: "Total",
      dataIndex: "grandTotal",
      render: (val: number) => `₹${val}`,
    },
    {
      title: "Paid",
      dataIndex: "paidAmount",
      render: (val: number) => `₹${val || 0}`,
    },
    {
      title: "Balance",
      render: (_: any, record: Sale) =>
        `₹${record.grandTotal - (record.paidAmount || 0)}`,
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
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
      render: (val: string) => new Date(val).toLocaleDateString(),
    },
    {
      title: "Action",
      render: (_: any, record: Sale) => (
        <Popconfirm
          title="Are you sure to delete this sale?"
          onConfirm={() => handleDelete(record._id)}
        >
          <Button type="link" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Invoices</h2>
      </div>

      <Table<Sale>
        rowKey="_id"
        dataSource={Array.isArray(sales) ? sales : []}
        columns={columns}
        loading={isLoading}
        bordered
        className="erp-table"
      />
    </>
  );
};

export default Invoices;