import React, { useState } from "react";
import { Table, Button, Modal, Form, Select, InputNumber } from "antd";
import type { TableColumnsType } from "antd";

const { Option } = Select;

interface StockData {
  key: React.Key;
  product: string;
  shop: string;
  quantity: number;
}

const Stock: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  const dataSource: StockData[] = [];

  const handleAddStock = (values: any) => {
    console.log(values);
    setOpenModal(false);
    form.resetFields();
  };

  const columns: TableColumnsType<StockData> = [
    {
      title: "Product",
      dataIndex: "product",
      ellipsis: true,
    },
    {
      title: "Shop",
      dataIndex: "shop",
      ellipsis: true,
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      width: 70,
    },
    {
      title: "Action",
      width: 90,
      render: () => (
        <div className="flex flex-col gap-1 text-xs">
          <a>Edit</a>
          <a className="text-red-600">Delete</a>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-w-0 px-2 py-3">
      
      {/* Header */}
      <div className="flex flex-col gap-2 mb-3">
        <h2 className="text-lg font-semibold">Stocks</h2>

        <Button
          type="primary"
          block
          size="middle"
          onClick={() => setOpenModal(true)}
        >
          Add Stock
        </Button>
      </div>

      {/* Table wrapper IMPORTANT */}
      <div className="w-full min-w-0 overflow-x-auto">
        <Table<StockData>
          bordered
          size="small"
          columns={columns}
          dataSource={dataSource}
          rowKey="key"
          pagination={{
            pageSize: 5,
            size: "small",
          }}
          scroll={{ x: 500 }}
        />
      </div>

      {/* Modal */}
      <Modal
        title="Add Stock"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        destroyOnClose
        width="95%"
        style={{ maxWidth: 400 }}
      >
        <Form layout="vertical" form={form} onFinish={handleAddStock}>
          <Form.Item
            label="Product"
            name="product"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Product" size="middle">
              <Option value="prod1">Product 1</Option>
              <Option value="prod2">Product 2</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Shop"
            name="shop"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Shop" size="middle">
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
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Add Stock
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Stock;