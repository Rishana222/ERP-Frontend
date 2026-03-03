import { useState } from "react";
import { Table, Select, Spin, Alert } from "antd";
import { useGetCustomers } from "../Utils/customerApi";
import { useGetCustomerLedger } from "../Utils/CustomerLedgerApi";

const CustomerLedgerPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  const {
    data: customers,
    isLoading: isCustomersLoading,
    error: customersError,
  } = useGetCustomers();

  const {
    data,
    isLoading: isLedgerLoading,
    error: ledgerError,
  } = useGetCustomerLedger(selectedCustomer);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      responsive: ["xs", "sm", "md", "lg"],
      render: (v?: string) =>
        v ? new Date(v).toLocaleDateString("en-IN") : "-",
    },
    {
      title: "Type",
      dataIndex: "type",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Debit (Sale)",
      dataIndex: "debit",
      responsive: ["sm", "md", "lg"],
      render: (v: number) => `₹${v || 0}`,
    },
    {
      title: "Credit (Payment)",
      dataIndex: "credit",
      responsive: ["md", "lg"],
      render: (v: number) => `₹${v || 0}`,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      responsive: ["xs", "sm", "md", "lg"],
      render: (v: number) => (
        <span className="font-semibold">₹{v}</span>
      ),
    },
  ];

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          Customer Ledger
        </h2>

        {isCustomersLoading ? (
          <Spin />
        ) : customersError ? (
          <Alert type="error" message="Failed to load customers" />
        ) : (
          <Select
            className="w-full sm:w-72"
            placeholder="Select Customer"
            onChange={(val) => setSelectedCustomer(val)}
            value={selectedCustomer || undefined}
            allowClear
          >
            {customers?.map((c: any) => (
              <Select.Option key={c._id} value={c._id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </div>

      {/* SUMMARY CARDS */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="p-4 border rounded-xl bg-white shadow-sm">
            <p className="text-xs sm:text-sm text-gray-500">
              Total Sales
            </p>
            <p className="text-base sm:text-lg font-semibold">
              ₹{data.totalSalesAmount}
            </p>
          </div>

          <div className="p-4 border rounded-xl bg-white shadow-sm">
            <p className="text-xs sm:text-sm text-gray-500">
              Total Received
            </p>
            <p className="text-base sm:text-lg font-semibold">
              ₹{data.totalReceivedAmount}
            </p>
          </div>

          <div className="p-4 border rounded-xl bg-white shadow-sm">
            <p className="text-xs sm:text-sm text-gray-500">
              Balance
            </p>
            <p className="text-base sm:text-lg font-semibold text-red-600">
              ₹{data.balance}
            </p>
          </div>
        </div>
      )}

      {/* ERROR */}
      {ledgerError && (
        <Alert
          message="Failed to load ledger"
          type="error"
          className="mb-4"
        />
      )}

      {/* TABLE WRAPPER FOR SCROLL */}
      <div className="w-full overflow-x-auto">
        <Table
          rowKey={(record: any, i) =>
            (record.date || "") + record.type + record.debit + i
          }
          columns={columns}
          dataSource={data?.ledger || []}
          loading={isLedgerLoading}
          bordered
          pagination={false}
          scroll={{ x: "max-content" }}   // 🔥 horizontal scroll enabled
          className="min-w-[600px] erp-table"
          locale={{
            emptyText: selectedCustomer
              ? "No ledger data for this customer"
              : "Select a customer to view ledger",
          }}
        />
      </div>
    </div>
  );
};

export default CustomerLedgerPage;