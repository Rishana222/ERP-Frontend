import React, { useState } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  message,
  Select,
  DatePicker,
} from "antd";
import moment from "moment";
import { useGetExpenses, useCreateExpense } from "../Utils/ExpenseAPI";
import { useGetCategories } from "../Utils/ExpenseCategoryAPI";
import { useGetAccounts } from "../Utils/AccountsAPI";
import { useGetVendors } from "../Utils/vendorApi";

const ExpensePage: React.FC = () => {
  const { data: expenses = [], isLoading } = useGetExpenses();
  const { data: categories = [] } = useGetCategories();
  const { data: accounts = [] } = useGetAccounts();
  const { data: vendors = [] } = useGetVendors();
  const createMutation = useCreateExpense();

  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const openModal = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSave = async (values: any) => {
    try {
      await createMutation.mutateAsync({
        category: values.category,
        account: values.account,
        vendor: values.vendor,
        amount: Number(values.amount),
        paymentMethod: values.paymentMethod,
        date: values.date ? values.date.toISOString() : undefined,
      });

      message.success("Expense created successfully");
      form.resetFields();
      setModalVisible(false);
    } catch (err: any) {
      message.error(err?.response?.data?.message || err.message);
    }
  };

  const columns = [
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Account",
      dataIndex: ["account", "name"],
      key: "account",
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Vendor",
      dataIndex: ["vendor", "name"],
      key: "vendor",
      render: (v: string) => v || "-",
      responsive: ["md", "lg"],
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (d: string) => moment(d).format("YYYY-MM-DD"),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">Expenses</h2>

        <button
          className="w-full sm:w-auto px-4 py-2 bg-[#00264d] text-white rounded hover:bg-[#001a33]"
          onClick={openModal}
        >
          Add Expense
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table
          dataSource={expenses}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          bordered
          pagination={{ pageSize: 8 }}
          scroll={{ x: "max-content" }}
          className="erp-table"
        />
      </div>

      {/* Modal */}
      <Modal
        title="Add Expense"
        open={modalVisible}
        width={window.innerWidth < 640 ? "95%" : 500}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true }]}
          >
            <Select
              options={categories.map((c) => ({
                value: c._id,
                label: c.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Account"
            name="account"
            rules={[{ required: true }]}
          >
            <Select
              options={accounts.map((a) => ({
                value: a._id,
                label: a.name,
              }))}
            />
          </Form.Item>

          <Form.Item label="Vendor" name="vendor">
            <Select
              allowClear
              options={vendors.map((v) => ({
                value: v._id,
                label: v.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Payment Method"
            name="paymentMethod"
            rules={[{ required: true }]}
          >
            <Select
              options={["Cash", "Bank", "UPI"].map((pm) => ({
                value: pm,
                label: pm,
              }))}
            />
          </Form.Item>

          <Form.Item label="Date" name="date">
            <DatePicker className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExpensePage;