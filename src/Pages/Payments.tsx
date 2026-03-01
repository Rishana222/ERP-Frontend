import { useState } from "react";
import { Table, Select, Spin, Alert } from "antd";
import { useGetCustomers } from "../Utils/customerApi";
import { useGetCustomerLedger } from "../Utils/CustomerLedgerApi";

const { Option } = Select;

const CustomerLedgerPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  const { data: customers, isLoading: isCustomersLoading, error: customersError } = useGetCustomers();
  const { data, isLoading: isLedgerLoading, error: ledgerError } = useGetCustomerLedger(selectedCustomer);


  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (v?: string) => (v ? new Date(v).toLocaleDateString() : "-"),
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Debit (Sale)",
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
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Customer Ledger</h2>

        {isCustomersLoading ? (
          <Spin />
        ) : customersError ? (
          <Alert type="error" message="Failed to load customers" />
        ) : (
          <Select
            style={{ width: 260 }}
            placeholder="Select Customer"
            onChange={(val) => setSelectedCustomer(val)}
            value={selectedCustomer || undefined}
          >
            {customers?.map((c: any) => (
              <Option key={c._id} value={c._id}>
                {c.name}
              </Option>
            ))}
          </Select>
        )}
      </div>

      {data && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-3 border rounded bg-white">
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-lg font-semibold">₹{data.totalSalesAmount}</p>
          </div>

          <div className="p-3 border rounded bg-white">
            <p className="text-sm text-gray-500">Total Received</p>
            <p className="text-lg font-semibold">₹{data.totalReceivedAmount}</p>
          </div>

          <div className="p-3 border rounded bg-white">
            <p className="text-sm text-gray-500">Balance</p>
            <p className="text-lg font-semibold">₹{data.balance}</p>
          </div>
        </div>
      )}

      {ledgerError && <Alert message="Failed to load ledger" type="error" className="mb-4" />}

      <Table
        rowKey={(record, i) => (record.date || "") + record.type + record.debit + i}
        columns={columns}
        dataSource={data?.ledger || []}
        loading={isLedgerLoading}
        bordered
        className="erp-table"
        pagination={false}
        locale={{
          emptyText: selectedCustomer
            ? "No ledger data for this customer"
            : "Select a customer to view ledger",
        }}
      />
    </div>
  );
};

export default CustomerLedgerPage;