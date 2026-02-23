import { useState } from "react";
import { Table, Select } from "antd";
import { useGetVendors } from "../Utils/vendorApi";
import { useGetVendorLedger } from "../Utils/vendoracAPI";

const { Option } = Select;

const VendorLedgerPage = () => {
  const [selectedVendor, setSelectedVendor] = useState<string>("");

  /* ================= API ================= */
  const { data: vendors } = useGetVendors();
  const { data, isLoading } = useGetVendorLedger(selectedVendor);

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (v: string) => new Date(v).toLocaleDateString(),
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Debit (Purchase)",
      dataIndex: "debit",
      render: (v: number) => `₹${v}`,
    },
    {
      title: "Credit (Payment)",
      dataIndex: "credit",
      render: (v: number) => `₹${v}`,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (v: number) => `₹${v}`,
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Vendor Ledger</h2>

        <Select
          style={{ width: 260 }}
          placeholder="Select Vendor"
          onChange={(val) => setSelectedVendor(val)}
          value={selectedVendor || undefined}
        >
          {vendors?.map((v: any) => (
            <Option key={v._id} value={v._id}>
              {v.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Summary Row */}
      {data && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-3 border rounded bg-white">
            <p className="text-sm text-gray-500">Total Purchase</p>
            <p className="text-lg font-semibold">₹{data.totalPurchaseAmount}</p>
          </div>

          <div className="p-3 border rounded bg-white">
            <p className="text-sm text-gray-500">Total Paid</p>
            <p className="text-lg font-semibold">₹{data.totalPaidAmount}</p>
          </div>

          <div className="p-3 border rounded bg-white">
            <p className="text-sm text-gray-500">Balance</p>
            <p className="text-lg font-semibold">₹{data.balance}</p>
          </div>
        </div>
      )}

      {/* Ledger Table */}
      <Table
        rowKey={(_, i) => i.toString()}
        columns={columns}
        dataSource={data?.ledger || []}
        loading={isLoading}
        bordered
        className="erp-table"
        pagination={false}
      />
    </>
  );
};

export default VendorLedgerPage;
