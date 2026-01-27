import { Button, Form, Input, InputNumber, Modal, Select, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
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
  taxPercent?: number;
  stock?: number;
  isActive: boolean;
}

const Products: React.FC = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form] = Form.useForm<Product>();
  const [updateForm] = Form.useForm<Product>();

  const columns: ColumnsType<Product> = [
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
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button danger type="primary">
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
      {/* Header */}
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={() => setOpenCreateModal(true)}>
          Add Product
        </Button>
      </div>

      {/* Table */}
      <Table<Product> columns={columns} dataSource={[]} />

      {/* Create Modal */}
      <Modal
        title="Add Product"
        open={openCreateModal}
        onCancel={() => setOpenCreateModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => {
            console.log("Create product:", values);
            setOpenCreateModal(false);
            form.resetFields();
          }}
        >
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="shop" label="Shop" rules={[{ required: true }]}>
            <Select>
              <Option value="Main Shop">Main Shop</Option>
              <Option value="Branch Shop">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select>
              <Option value="Mobile">Mobile</Option>
              <Option value="Laptop">Laptop</Option>
            </Select>
          </Form.Item>

          <Form.Item name="subCategory" label="Sub Category">
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

          <Form.Item name="isActive" label="Active" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Add Product
          </Button>
        </Form>
      </Modal>

      {/* Update Modal */}
      <Modal
        title="Update Product"
        open={openUpdateModal}
        onCancel={() => setOpenUpdateModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={updateForm}
          onFinish={(values) => {
            if (!editingProduct) return;

            console.log("Updating product:", editingProduct.key, values);
            setOpenUpdateModal(false);
            setEditingProduct(null);
          }}
        >
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="shop" label="Shop" rules={[{ required: true }]}>
            <Select>
              <Option value="Main Shop">Main Shop</Option>
              <Option value="Branch Shop">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select>
              <Option value="Mobile">Mobile</Option>
              <Option value="Laptop">Laptop</Option>
            </Select>
          </Form.Item>

          <Form.Item name="subCategory" label="Sub Category">
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

          <Button type="primary" htmlType="submit" className="w-full">
            Update Product
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default Products;
