
import { Table, Button } from "antd";
import { useGetSales, useDeleteSale } from "../Utils/salesAPI";

const Invoices = () => {
  const { data: sales = [], isLoading } = useGetSales();
  const deleteSale = useDeleteSale();

  const columns = [
    { title: "Invoice No", dataIndex: "invoiceNumber" }, // or use a proper invoice number field
    { title: "Customer", dataIndex: "customer" },
    { title: "Total", dataIndex: "grandTotal" },
    {
      title: "Balance",
      render: (_, record) => record.grandTotal - (record.paidAmount || 0),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (d) => new Date(d).toLocaleDateString(),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button type="link" onClick={() => deleteSale.mutate(record._id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Table
      rowKey="_id"
      dataSource={sales}
      columns={columns}
      loading={isLoading}
    />
  );
};

export default Invoices;
