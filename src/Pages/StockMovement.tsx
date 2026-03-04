import { Table, Tag } from "antd";
import { useGetAllStockHistory } from "../Utils/stockHistoryAPI";

function StockHistoryPage() {
  const { data, isLoading } = useGetAllStockHistory();

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      ellipsis: true,
      render: (date: string) =>
        new Date(date).toLocaleString(),
    },
    {
      title: "Product",
      dataIndex: ["product", "name"],
      ellipsis: true,
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 130,
      render: (type: string) => {
        let color = "default";

        if (type === "PURCHASE") color = "green";
        if (type === "SALE") color = "red";
        if (type === "ADJUSTMENT") color = "orange";
        if (type === "SALE_CANCEL") color = "blue";
        if (type === "PURCHASE_CANCEL") color = "volcano";
        if (type === "PURCHASE_RETURN") color = "red";
        if (type === "SALE_RETURN") color = "green";

        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Qty",
      width: 90,
      render: (_: any, record: any) => {
        const { quantity, type } = record;

        const negativeTypes = [
          "SALE",
          "PURCHASE_RETURN",
          "PURCHASE_CANCEL",
        ];

        const isNegative = negativeTypes.includes(type);
        const displayQty = Math.abs(quantity);

        return (
          <span
            style={{
              color: isNegative ? "red" : "green",
              fontWeight: 500,
            }}
          >
            {isNegative ? `-${displayQty}` : `+${displayQty}`}
          </span>
        );
      },
    },
    {
      title: "Balance",
      dataIndex: "balance",
      width: 100,
      ellipsis: true,
    },
  ];

  return (
    <div className="w-full min-w-0 px-2 sm:px-4 py-3">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          Stock History
        </h2>
      </div>

      {/* Table Wrapper (CRITICAL for 320px) */}
      <div className="w-full min-w-0 overflow-x-auto">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={Array.isArray(data) ? data : []}
          loading={isLoading}
          bordered
          size="small"
          pagination={{
            pageSize: 8,
            size: "small",
          }}
          scroll={{ x: 700 }}
          className="erp-table"
        />
      </div>
    </div>
  );
}

export default StockHistoryPage;