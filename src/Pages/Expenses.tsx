import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber } from "antd";
import type { TableColumnsType } from "antd";
import { createStyles } from "antd-style";

const { Option } = Select;

const useStyle = createStyles(({ css }) => ({
  customTable: css`
    .ant-table {
      .ant-table-body,
      .ant-table-content {
        scrollbar-width: thin;
        scrollbar-color: #eaeaea transparent;
      }
    }
  `,
}));

interface ExpenseData {
  key: React.Key;
  expenseNo: string;
  expenseDate: string;
  vendor: string;
  category: string;
  paymentMode: string;
  amount: number;
  status: string;
}

const columns: TableColumnsType<ExpenseData> = [
  { title: "Expense No", dataIndex: "expenseNo", width: 120 },
  { title: "Date", dataIndex: "expenseDate", width: 120 },
  { title: "Vendor", dataIndex: "vendor", width: 150 },
  { title: "Category", dataIndex: "category", width: 150 },
  { title: "Payment Mode", dataIndex: "paymentMode", width: 120 },
  { title: "Amount", dataIndex: "amount", width: 100 },
  { title: "Status", dataIndex: "status", width: 100 },
  {
    title: "Action",
    fixed: "end",
    width: 120,
    render: () => (
      <div className="flex gap-2">
        <a>Edit</a>
        <a style={{ color: "red" }}>Delete</a>
      </div>
    ),
  },
];

const Expenses: React.FC = () => {
  const { styles } = useStyle();

  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  // Empty table for now
  const dataSource: ExpenseData[] = [];

  const handleAddExpense = (values: any) => {
    console.log("New Expense:", values);
    setOpenModal(false);
    form.resetFields();
  };

  return (
    <div>
      {/* Header + Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Expenses</h2>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => setOpenModal(true)}>
            Add Expense
          </Button>
        </div>
      </div>

      <Table<ExpenseData>
        bordered
        className={styles.customTable}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: "max-content" }}
        pagination={false}
        rowKey="key"
      />

      <Modal
        title="Add Expense"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleAddExpense}>
          <Form.Item label="Expense No" name="expenseNo" rules={[{ required: true }]}>
            <Input placeholder="EXP001" />
          </Form.Item>

          <Form.Item label="Expense Date" name="expenseDate" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Vendor" name="vendor" rules={[{ required: true }]}>
            <Select placeholder="Select Vendor">
              <Option value="vendor1">Vendor 1</Option>
              <Option value="vendor2">Vendor 2</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Category" name="category" rules={[{ required: true }]}>
            <Select placeholder="Select Category">
              <Option value="cat1">Category 1</Option>
              <Option value="cat2">Category 2</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Payment Mode" name="paymentMode" rules={[{ required: true }]}>
            <Select placeholder="Select Payment Mode">
              <Option value="cash">Cash</Option>
              <Option value="credit_card">Credit Card</Option>
              <Option value="bank_transfer">Bank Transfer</Option>
              <Option value="mobile_payment">Mobile Payment</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Optional" />
          </Form.Item>

          <Form.Item label="Reference" name="reference">
            <Input placeholder="Optional Reference" />
          </Form.Item>

          <Form.Item label="Account" name="account" rules={[{ required: true }]}>
            <Select placeholder="Select Account">
              <Option value="acc1">Account 1</Option>
              <Option value="acc2">Account 2</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Status" name="status" initialValue="pending">
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="paid">Paid</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Add Expense
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Expenses;
