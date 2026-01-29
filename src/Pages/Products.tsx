<<<<<<< HEAD
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
import type { TableColumnsType } from "antd";
import { useState } from "react";
import { createStyles } from "antd-style";

const { Option } = Select;

/* -------------------- Styles -------------------- */
const useStyle = createStyles(({ css }) => ({
  customTable: css`
    .ant-table {
      .ant-table-body,
      .ant-table-content {
        scrollbar-width: thin;
      }
    }
  `,
}));

/* -------------------- Types -------------------- */
=======
import { Button,Form,Input,InputNumber,Modal,Select,Switch,Table,} from "antd";
 import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
 const { Option } = Select; 
>>>>>>> 9d8d001ee0ab36aa988effcf4c9dcca03a991081
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
<<<<<<< HEAD
}

/* -------------------- Component -------------------- */
=======
}  
>>>>>>> 9d8d001ee0ab36aa988effcf4c9dcca03a991081
const Products: React.FC = () => {
  const { styles } = useStyle();

  const [products, setProducts] = useState<Product[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form] = Form.useForm<Product>();
  const [updateForm] = Form.useForm<Product>();

  /* -------------------- Columns -------------------- */
  const columns: TableColumnsType<Product> = [
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
      render: (val) => (val ? "Yes" : "No"),
    },
    {
      title: "Action",
      width: 150,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            danger
            size="small"
            onClick={() =>
              setProducts((prev) =>
                prev.filter((item) => item.key !== record.key)
              )
            }
          >
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

      {/* Table */}
      <Table<Product>
        bordered
        className={styles.customTable}
        columns={columns}
        dataSource={products}
        rowKey="key"
        pagination={false}
        scroll={{ x: "max-content" }}
        style={{ marginTop: 16 }}
      />

      {/* -------------------- Add Product Modal -------------------- */}
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
            setProducts((prev) => [
              ...prev,
              { ...values, key: Date.now().toString() },
            ]);
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
            <Input />
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

          <Form.Item name="purchasePrice" label="Purchase Price">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="sellingPrice" label="Selling Price">
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

      {/* -------------------- Update Product Modal -------------------- */}
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
            setProducts((prev) =>
              prev.map((p) =>
                p.key === editingProduct?.key
                  ? { ...p, ...values }
                  : p
              )
            );
            setOpenUpdateModal(false);
          }}
        >
          <Form.Item name="name" label="Product Name">
            <Input />
          </Form.Item>

          <Form.Item name="sellingPrice" label="Selling Price">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Update
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;