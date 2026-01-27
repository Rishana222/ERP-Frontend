import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, InputNumber, DatePicker } from "antd";
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

interface SalesData {
  key: React.Key;
  invoice: string;
  customer: string;
  shop: string;
  totalAmount: number;
  discount: number;
  tax: number;
  netAmount: number;
  paymentStatus: string;
  saleDate: string;
}

const columns: TableColumnsType<SalesData> = [
  { title: "Invoice", dataIndex: "invoice", width: 150 },
  { title: "Customer", dataIndex: "customer", width: 150 },
  { title: "Shop", dataIndex: "shop", width: 150 },
  { title: "Total Amount", dataIndex: "totalAmount", width: 120 },
  { title: "Discount", dataIndex: "discount", width: 100 },
  { title: "Tax", dataIndex: "tax", width: 100 },
  { title: "Net Amount", dataIndex: "netAmount", width: 120 },
  { title: "Payment Status", dataIndex: "paymentStatus", width: 120 },
  { title: "Sale Date", dataIndex: "saleDate", width: 150 },
  {
    title: "Action",
    fixed: "end",
    width: 120,
    render: () => <a style={{ color: "red" }}>Delete</a>,
  },
];

const SalesDashboard: React.FC = () => {
  const { styles } = useStyle();
  const [items, ] = useState<SalesData[]>([]); 

  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sales Dashboard</h2>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => setOpenModal(true)}>
            Add Sale
          </Button>
        </div>
      </div>

      <Table<SalesData>
        bordered
        className={styles.customTable}
        columns={columns}
        dataSource={items} 
        scroll={{ x: "max-content" }}
        pagination={false}
        rowKey="key"
      />

      <Modal
        title="Add Sale"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Invoice" name="invoice">
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
          <Form.Item label="Total Amount" name="totalAmount">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Discount" name="discount">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Tax" name="tax">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Net Amount" name="netAmount">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Payment Status" name="paymentStatus">
            <Select>
              <Option value="paid">Paid</Option>
              <Option value="partial">Partial</Option>
              <Option value="unpaid">Unpaid</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Sale Date" name="saleDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Button type="primary" className="w-full mt-2">
            Save Sale
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default SalesDashboard;
