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


interface ReceiptData {
  key: React.Key;
  receiptNo: string;
  customer: string;
  account: string;
  amount: number;
  receiptMode: string;
  receiptDate: string;
  note?: string;
}

const columns: TableColumnsType<ReceiptData> = [
  { title: "Receipt No", dataIndex: "receiptNo", width: 150 },
  { title: "Customer", dataIndex: "customer", width: 150 },
  { title: "Account", dataIndex: "account", width: 150 },
  { title: "Amount", dataIndex: "amount", width: 120 },
  { title: "Receipt Mode", dataIndex: "receiptMode", width: 120 },
  { title: "Receipt Date", dataIndex: "receiptDate", width: 150 },
  { title: "Note", dataIndex: "note", width: 150 },
  {
    title: "Action",
    fixed: "end",
    width: 120,
    render: () => <a style={{ color: "red" }}>Delete</a>,
  },
];

const Receipts: React.FC = () => {
  const { styles } = useStyle();
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  const dataSource: ReceiptData[] = [];

  const submitReceipt = (values: any) => {
    console.log("New Receipt:", values);
    setOpenModal(false);
    form.resetFields();
  };

  return (
    <div>
     <div className="flex justify-between items-center">
  <h2 className="text-xl font-semibold">Receipts</h2>

  <div style={{ marginBottom: 16 }}>
    <Button type="primary" onClick={() => setOpenModal(true)}>
      Add Receipt
    </Button>
  </div>
</div>

      <Table<ReceiptData>
        bordered
        className={styles.customTable}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: "max-content" }}
        rowKey="key"
      />

      <Modal
        title="Add Receipt"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={submitReceipt}>
          <Form.Item label="Receipt No" name="receiptNo">
            <Input placeholder="Enter Receipt Number" />
          </Form.Item>

          <Form.Item label="Customer" name="customer">
            <Select placeholder="Select Customer">
              <Option value="cust1">Customer 1</Option>
              <Option value="cust2">Customer 2</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Account" name="account" rules={[{ required: true }]}>
            <Select placeholder="Select Account">
              <Option value="acc1">Account 1</Option>
              <Option value="acc2">Account 2</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Receipt Mode" name="receiptMode" rules={[{ required: true }]}>
            <Select placeholder="Select Mode">
              <Option value="Cash">Cash</Option>
              <Option value="Bank">Bank</Option>
              <Option value="UPI">UPI</Option>
              <Option value="Cheque">Cheque</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Receipt Date" name="receiptDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Note" name="note">
            <Input placeholder="Optional Note" />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Save Receipt
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Receipts;
