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

// --- Table Row Type ---
interface InvoiceData {
  key: React.Key;
  invoiceNumber: string;
  customer: string;
  shop: string;
  subTotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMode: string;
  status: string;
  invoiceDate: string;
}

// --- Table Columns ---
const columns: TableColumnsType<InvoiceData> = [
  { title: "Invoice No", dataIndex: "invoiceNumber", width: 120 },
  { title: "Customer", dataIndex: "customer", width: 150 },
  { title: "Shop", dataIndex: "shop", width: 150 },
  { title: "SubTotal", dataIndex: "subTotal", width: 100 },
  { title: "Tax", dataIndex: "taxAmount", width: 100 },
  { title: "Total", dataIndex: "totalAmount", width: 100 },
  { title: "Paid", dataIndex: "paidAmount", width: 100 },
  { title: "Balance", dataIndex: "balanceAmount", width: 100 },
  { title: "Payment Mode", dataIndex: "paymentMode", width: 120 },
  { title: "Status", dataIndex: "status", width: 100 },
  { title: "Invoice Date", dataIndex: "invoiceDate", width: 150 },
  { 
    title: "Action",
    fixed: "end",
    width: 120,
    render: (_record) => <a style={{ color: "red" }}>Delete</a>
  },
];

const invoices: React.FC = () => {
  const { styles } = useStyle();
  const [items,] = useState<InvoiceData[]>([]);

  // Optional: Add dummy modal to create invoice later
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Invoice</h2>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => setOpenModal(true)}>
            Add Invoice
          </Button>
        </div>
      </div>

      <Table<InvoiceData>
        bordered
        className={styles.customTable}
        columns={columns}
        dataSource={items} // Empty table for now
        scroll={{ x: "max-content" }}
        pagination={false}
        rowKey="key"
      />

      {/* Add Invoice Modal (optional, form fields only) */}
      <Modal
        title="Add Invoice"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Invoice Number" name="invoiceNumber">
            <Input />
          </Form.Item>
          <Form.Item label="Customer" name="customer">
            <Select placeholder="Select Customer">
              <Option value="cust1">Customer 1</Option>
              <Option value="cust2">Customer 2</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Shop" name="shop">
            <Select placeholder="Select Shop">
              <Option value="shop1">Main Shop</Option>
              <Option value="shop2">Branch Shop</Option>
            </Select>
          </Form.Item>
          <Form.Item label="SubTotal" name="subTotal">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Tax Amount" name="taxAmount">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Total Amount" name="totalAmount">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Paid Amount" name="paidAmount">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Balance Amount" name="balanceAmount">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Payment Mode" name="paymentMode">
            <Select>
              <Option value="cash">Cash</Option>
              <Option value="upi">UPI</Option>
              <Option value="card">Card</Option>
              <Option value="bank">Bank</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select>
              <Option value="paid">Paid</Option>
              <Option value="partial">Partial</Option>
              <Option value="unpaid">Unpaid</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Invoice Date" name="invoiceDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Button type="primary" className="w-full mt-2">
            Save Invoice
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default invoices;
