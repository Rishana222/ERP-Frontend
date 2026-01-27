
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
  total: number;
}

interface PurchaseReturnData {
  key: React.Key;
  shop: string;
  vendor: string;
  purchase: string;
  totalAmount: number;
  returnDate: string;
}

const columns: TableColumnsType<PurchaseReturnData> = [
  { title: "Shop", dataIndex: "shop", width: 150 },
  { title: "Vendor", dataIndex: "vendor", width: 150 },
  { title: "Purchase", dataIndex: "purchase", width: 150 },
  { title: "Total Amount", dataIndex: "totalAmount", width: 120 },
  { title: "Return Date", dataIndex: "returnDate", width: 150 },
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

const PurchaseReturn: React.FC = () => {
  const { styles } = useStyle();

  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  // Empty table for now
  const dataSource: PurchaseReturnData[] = [];

  const handleAddReturn = (values: any) => {
    console.log("New Purchase Return:", values);
    setOpenModal(false);
    form.resetFields();
  };

  return (
    <div>
      {/* Header + Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Purchase Returns</h2>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => setOpenModal(true)}>
            Add Purchase Return
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table<PurchaseReturnData>
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
        title="Add Purchase Return"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleAddReturn}>
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

          <Form.Item label="Purchase" name="purchase" rules={[{ required: true }]}>
            <Select placeholder="Select Purchase">
              <Option value="purchase1">Purchase 1</Option>
              <Option value="purchase2">Purchase 2</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Total Amount" name="totalAmount" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Return Date" name="returnDate" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Note" name="note">
            <Input.TextArea placeholder="Optional note" />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Save Return
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default PurchaseReturn;
