import { useState } from "react";
import { Table, Select } from "antd";
import { useGetVendors } from "../Utils/vendorApi";
import { useGetVendorLedger } from "../Utils/vendoracAPI";

const { Option } = Select;

const VendorLedgerPage = () => {
  const [selectedVendor, setSelectedVendor] = useState<string>("");

  const { data: vendors } = useGetVendors();
  const { data, isLoading } = useGetVendorLedger(selectedVendor);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      responsive: ["sm"],
      render: (v: string) => new Date(v).toLocaleDateString(),
    },
    {
      title: "Type",
      dataIndex: "type",
      responsive: ["sm"],
    },
    {
      title: "Debit",
      dataIndex: "debit",
      render: (v: number) => `₹${v || 0}`,
    },
    {
      title: "Credit",
      dataIndex: "credit",
      render: (v: number) => `₹${v || 0}`,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (v: number) => `₹${v || 0}`,
    },
  ];

  return (
    <div className="w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          Vendor Ledger
        </h2>

        <Select
          className="w-full sm:w-64"
          placeholder="Select Vendor"
          onChange={(val) => setSelectedVendor(val)}
          value={selectedVendor || undefined}
          allowClear
        >
          {vendors?.map((v: any) => (
            <Option key={v._id} value={v._id}>
              {v.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Summary Cards */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="p-3 border rounded bg-white">
            <p className="text-xs sm:text-sm text-gray-500">
              Total Purchase
            </p>
            <p className="text-base sm:text-lg font-semibold break-words">
              ₹{data.totalPurchaseAmount}
            </p>
          </div>

          <div className="p-3 border rounded bg-white">
            <p className="text-xs sm:text-sm text-gray-500">
              Total Paid
            </p>
            <p className="text-base sm:text-lg font-semibold break-words">
              ₹{data.totalPaidAmount}
            </p>
          </div>

          <div className="p-3 border rounded bg-white">
            <p className="text-xs sm:text-sm text-gray-500">
              Balance
            </p>
            <p className="text-base sm:text-lg font-semibold break-words">
              ₹{data.balance}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <Table
          rowKey={(_, i) => i!.toString()}
          columns={columns}
          dataSource={data?.ledger || []}
          loading={isLoading}
          bordered
          pagination={false}
          scroll={{ x: 600 }}
          className="erp-table"
        />
      </div>
    </div>
  );
};

export default VendorLedgerPage;