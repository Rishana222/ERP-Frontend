
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
interface ProductItem {
  key: React.Key;
  product: string;
  quantity: number;
  purchasePrice: number;
  taxPercent?: number;
  total?: number;
}

interface PurchaseData {
  key: React.Key;
  shop: string;
  vendor: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  purchaseDate: string;
}

const columns: TableColumnsType<PurchaseData> = [
  { title: "Shop", dataIndex: "shop", width: 150 },
  { title: "Vendor", dataIndex: "vendor", width: 150 },
  { title: "Total Amount", dataIndex: "totalAmount", width: 120 },
  { title: "Paid Amount", dataIndex: "paidAmount", width: 120 },
  { title: "Balance Amount", dataIndex: "balanceAmount", width: 120 },
  { title: "Purchase Date", dataIndex: "purchaseDate", width: 150 },
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

const Purchase: React.FC = () => {
  const { styles } = useStyle();

  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  // Dummy empty data for now
  const dataSource: PurchaseData[] = [];

  const handleAddPurchase = (values: any) => {
    console.log("New Purchase:", values);
    setOpenModal(false);
    form.resetFields();
  };

  return (
    <div>
      {/* Header + Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Purchases</h2>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => setOpenModal(true)}>
            Add Purchase
          </Button>
        </div>
      </div>

      {/* Purchase Table */}
      <Table<PurchaseData>
        bordered
        className={styles.customTable}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: "max-content" }}
        pagination={false}
        rowKey="key"
      />

      {/* Add Purchase Modal */}
      <Modal
        title="Add Purchase"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleAddPurchase}>
          <Form.Item label="Shop" name="shop" rules={[{ required: true }]}>
            <Select placeholder="Select Shop">
              <Option value="shop1">Main Shop</Option>
              <Option value="shop2">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Vendor" name="vendor" rules={[{ required: true }]}>
            <Select placeholder="Select Vendor">
              <Option value="vendor1">Vendor 1</Option>
              <Option value="vendor2">Vendor 2</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Total Amount" name="totalAmount" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Paid Amount" name="paidAmount" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Balance Amount" name="balanceAmount" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Purchase Date" name="purchaseDate" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Note" name="note">
            <Input.TextArea placeholder="Optional note" />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Save Purchase
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Purchase;
