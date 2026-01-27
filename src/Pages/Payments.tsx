import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber } from "antd";
import type { TableColumnsType } from "antd";
import { createStyles } from "antd-style";

const { Option } = Select;

// --- Styles ---
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

// --- Table row type ---
interface PaymentData {
  key: React.Key;
  paymentNo: string;
  vendor?: string;
  expense?: string;
  account: string;
  amount: number;
  paymentMode: string;
  transactionDate: string;
}

const columns: TableColumnsType<PaymentData> = [
  { title: "Payment No", dataIndex: "paymentNo", width: 120 },
  { title: "Vendor", dataIndex: "vendor", width: 150 },
  { title: "Expense", dataIndex: "expense", width: 150 },
  { title: "Account", dataIndex: "account", width: 150 },
  { title: "Amount", dataIndex: "amount", width: 120 },
  { title: "Payment Mode", dataIndex: "paymentMode", width: 120 },
  { title: "Transaction Date", dataIndex: "transactionDate", width: 150 },
  {
    title: "Action",
    fixed: "end",
    width: 150,
    render: () => (
      <div className="flex gap-2">
        <a>Edit</a>
        <a style={{ color: "red" }}>Delete</a>
      </div>
    ),
  },
];

const Payments: React.FC = () => {
  const { styles } = useStyle();

  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  // Empty table for now
  const dataSource: PaymentData[] = [];

  const handleAddPayment = (values: any) => {
    console.log("New Payment:", values);
    setOpenModal(false);
    form.resetFields();
  };

  return (
    <div>
      {/* Header + Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Payments</h2>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => setOpenModal(true)}>
            Add Payment
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table<PaymentData>
        bordered
        className={styles.customTable}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: "max-content" }}
        pagination={false}
        rowKey="key"
      />

      {/* Add Modal */}
      <Modal
        title="Add Payment"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleAddPayment}>
          <Form.Item label="Payment No" name="paymentNo" rules={[{ required: true }]}>
            <Input placeholder="Payment Number" />
          </Form.Item>

          <Form.Item label="Vendor" name="vendor">
            <Select placeholder="Select Vendor">
              <Option value="vendor1">Vendor 1</Option>
              <Option value="vendor2">Vendor 2</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Expense" name="expense">
            <Select placeholder="Select Expense">
              <Option value="expense1">Expense 1</Option>
              <Option value="expense2">Expense 2</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Account" name="account" rules={[{ required: true }]}>
            <Select placeholder="Select Account">
              <Option value="account1">Account 1</Option>
              <Option value="account2">Account 2</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Payment Mode" name="paymentMode" rules={[{ required: true }]}>
            <Select placeholder="Select Payment Mode">
              <Option value="Cash">Cash</Option>
              <Option value="Bank">Bank</Option>
              <Option value="UPI">UPI</Option>
              <Option value="Cheque">Cheque</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Transaction Date" name="transactionDate" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Save Payment
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Payments;
