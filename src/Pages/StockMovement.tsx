import React, { useState } from "react";
import { Table, Button, Modal, Form, Select, InputNumber } from "antd";
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

interface StockMovementData {
  key: React.Key;
  product: string;
  shop: string;
  type: "IN" | "OUT";
  quantity: number;
  referenceType: "PURCHASE" | "SALE" | "PURCHASE_RETURN" | "SALE_RETURN" | "ADJUSTMENT";
}

const columns: TableColumnsType<StockMovementData> = [
  { title: "Product", dataIndex: "product", width: 150 },
  { title: "Shop", dataIndex: "shop", width: 150 },
  { title: "Type", dataIndex: "type", width: 100 },
  { title: "Quantity", dataIndex: "quantity", width: 100 },
  { title: "Reference Type", dataIndex: "referenceType", width: 150 },
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

const StockMovement: React.FC = () => {
  const { styles } = useStyle();

  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  const dataSource: StockMovementData[] = [];

  const handleAddMovement = (values: any) => {
    console.log("New Stock Movement:", values);
    setOpenModal(false);
    form.resetFields();
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Stock History</h2>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => setOpenModal(true)}>
            Add Movement
          </Button>
        </div>
      </div>

      <Table<StockMovementData>
        bordered
        className={styles.customTable}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: "max-content" }}
        pagination={false}
        rowKey="key"
      />

      <Modal
        title="Add Stock Movement"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleAddMovement}>
          <Form.Item
            label="Product"
            name="product"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Product">
              <Option value="prod1">Product 1</Option>
              <Option value="prod2">Product 2</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Shop"
            name="shop"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Shop">
              <Option value="shop1">Main Shop</Option>
              <Option value="shop2">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Type">
              <Option value="IN">IN</Option>
              <Option value="OUT">OUT</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Reference Type"
            name="referenceType"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Reference Type">
              <Option value="PURCHASE">PURCHASE</Option>
              <Option value="SALE">SALE</Option>
              <Option value="PURCHASE_RETURN">PURCHASE RETURN</Option>
              <Option value="SALE_RETURN">SALE RETURN</Option>
              <Option value="ADJUSTMENT">ADJUSTMENT</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Reference ID"
            name="referenceId"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} placeholder="Reference ID" />
          </Form.Item>

          <Form.Item
            label="Opening Stock"
            name="openingStock"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Closing Stock"
            name="closingStock"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Add Movement
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default StockMovement;
