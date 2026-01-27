import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Table,
} from "antd";
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
    { title: "Name", dataIndex: "name", width: 150 },
    { title: "SKU", dataIndex: "sku", width: 120 },
    { title: "Shop", dataIndex: "shop", width: 150 },
    { title: "Category", dataIndex: "category", width: 150 },
    { title: "Sub Category", dataIndex: "subCategory", width: 150 },
    { title: "Unit", dataIndex: "unit", width: 100 },
    { title: "Purchase Price", dataIndex: "purchasePrice", width: 150 },
    { title: "Selling Price", dataIndex: "sellingPrice", width: 150 },
    { title: "Tax (%)", dataIndex: "taxPercent", width: 100 },
    { title: "Stock", dataIndex: "stock", width: 100 },
    {
      title: "Active",
      dataIndex: "isActive",
      width: 100,
      render: (val: boolean) => (val ? "Yes" : "No"),
    },
    {
      title: "Action",
      width: 150,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button danger size="small">
            Delete
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setEditingProduct(record);
              updateForm.setFieldsValue(record);
              setOpenUpdateModal(true);
            }}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <Button type="primary" onClick={() => setOpenCreateModal(true)}>
          Add Product
        </Button>
      </div>

      {/* Table (with gap) */}
      <Table<Product>
        bordered
        columns={columns}
        dataSource={[]}
        pagination={false}
        scroll={{ x: "max-content" }}
        style={{ marginTop: 16 }} // 👈 GAP HERE
      />

      {/* Add Product Modal */}
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
          initialValues={{ isActive: true }}
          onFinish={(values) => {
            console.log("Create product:", values);
            setOpenCreateModal(false);
            form.resetFields();
          }}
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="shop" label="Shop" rules={[{ required: true }]}>
            <Select placeholder="Select shop">
              <Option value="Main Shop">Main Shop</Option>
              <Option value="Branch Shop">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select category"
              allowClear
              showSearch
              optionFilterProp="label"
            >
              {/* Categories will come from API */}
            </Select>
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select category"
              allowClear
              showSearch
              optionFilterProp="label"
            >
              {/* Categories will come from API */}
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

          <Form.Item
            name="purchasePrice"
            label="Purchase Price"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="sellingPrice"
            label="Selling Price"
            rules={[{ required: true }]}
          >
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
            Save
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
