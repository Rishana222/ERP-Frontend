import { Table, Tag } from "antd";
import { useGetAllStockHistory } from "../Utils/stockHistoryAPI";

function StockHistoryPage() {
  const { data, isLoading } = useGetAllStockHistory();

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Product",
      dataIndex: ["product", "name"],
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type: string) => {
        let color = "default";

        if (type === "PURCHASE") color = "green";
        if (type === "SALE") color = "red";
        if (type === "ADJUSTMENT") color = "orange";
        if (type === "SALE_CANCEL") color = "blue";
        if (type === "PURCHASE_CANCEL") color = "volcano";

        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (qty: number) => (
        <span style={{ color: qty > 0 ? "green" : "red" }}>
          {qty > 0 ? `+${qty}` : qty}
        </span>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Stock History</h2>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={Array.isArray(data) ? data : []}
        loading={isLoading}
        bordered
      />
    </>
  );
}

export default StockHistoryPage;
