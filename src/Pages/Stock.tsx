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

interface StockData {
  key: React.Key;
  product: string;
  shop: string;
  quantity: number;
}

const columns: TableColumnsType<StockData> = [
  { title: "Product", dataIndex: "product", width: 150 },
  { title: "Shop", dataIndex: "shop", width: 150 },
  { title: "Quantity", dataIndex: "quantity", width: 100 },
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

const Stock: React.FC = () => {
  const { styles } = useStyle();

  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  const dataSource: StockData[] = [];

  const handleAddStock = (values: any) => {
    console.log("New Stock:", values);
    setOpenModal(false);
    form.resetFields();
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Stocks</h2>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => setOpenModal(true)}>
            Add Stock
          </Button>
        </div>
      </div>

      <Table<StockData>
        bordered
        className={styles.customTable}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: "max-content" }}
        pagination={false}
        rowKey="key"
      />

      <Modal
        title="Add Stock"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleAddStock}>
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
            label="Quantity"
            name="quantity"
            rules={[{ required: true }]}
            initialValue={0}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Add Stock
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Stock;
