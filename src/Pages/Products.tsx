
import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Select, Switch, Table } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";

const { Option } = Select;

interface Product {
  key: string;
  name: string;
  sku: string;
  shop: string;
  category: string;
  subCategory?: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  taxPercent: number;
  stock: number;
  isActive: boolean;
}

const Products: React.FC = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Table columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "SKU", dataIndex: "sku", key: "sku" },
    { title: "Shop", dataIndex: "shop", key: "shop" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "SubCategory", dataIndex: "subCategory", key: "subCategory" },
    { title: "Unit", dataIndex: "unit", key: "unit" },
    { title: "Purchase Price", dataIndex: "purchasePrice", key: "purchasePrice" },
    { title: "Selling Price", dataIndex: "sellingPrice", key: "sellingPrice" },
    { title: "Tax (%)", dataIndex: "taxPercent", key: "taxPercent" },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (val: boolean) => (val ? "Yes" : "No"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Product) => (
        <div className="flex space-x-2">
          <Button
            type="primary"
            danger
            onClick={() => console.log("Delete action for", record)}
          >
            Delete
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setEditingProduct(record);
              updateForm.setFieldsValue(record);
              setOpenUpdateModal(true);
            }}
          >
            Update
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={() => setOpenCreateModal(true)}>
          Add Product
        </Button>
      </div>

      <Table<Product> columns={columns} dataSource={[]} /> {/* Empty, just design */}

      {/* Create Modal */}
      <Modal
        title="Add Product"
        open={openCreateModal}
        onCancel={() => setOpenCreateModal(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={(values) => console.log(values)}>
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="shop" label="Shop" rules={[{ required: true }]}>
            <Select>
              <Option value="Shop A">Shop A</Option>
              <Option value="Shop B">Shop B</Option>
            </Select>
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select>
              <Option value="Mobile">Mobile</Option>
              <Option value="Laptop">Laptop</Option>
            </Select>
          </Form.Item>
          <Form.Item name="subCategory" label="SubCategory">
            <Input />
          </Form.Item>
          <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
            <Select>
              <Option value="pcs">pcs</Option>
              <Option value="kg">kg</Option>
            </Select>
          </Form.Item>
          <Form.Item name="purchasePrice" label="Purchase Price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="sellingPrice" label="Selling Price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="taxPercent" label="Tax (%)">
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="stock" label="Stock">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Modal */}
      <Modal
        title="Update Product"
        open={openUpdateModal}
        onCancel={() => setOpenUpdateModal(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          form={updateForm}
          onFinish={(values) => console.log("Update values:", values)}
        >
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="shop" label="Shop" rules={[{ required: true }]}>
            <Select>
              <Option value="Shop A">Shop A</Option>
              <Option value="Shop B">Shop B</Option>
            </Select>
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select>
              <Option value="Mobile">Mobile</Option>
              <Option value="Laptop">Laptop</Option>
            </Select>
          </Form.Item>
          <Form.Item name="subCategory" label="SubCategory">
            <Input />
          </Form.Item>
          <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
            <Select>
              <Option value="pcs">pcs</Option>
              <Option value="kg">kg</Option>
            </Select>
          </Form.Item>
          <Form.Item name="purchasePrice" label="Purchase Price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="sellingPrice" label="Selling Price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="taxPercent" label="Tax (%)">
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="stock" label="Stock">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Products;
