import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { createStyles } from "antd-style";

const { Option } = Select;

/* -------------------- Styles -------------------- */
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

/* ---------- Types ---------- */
interface VariantData {
  key: string;
  name: string;
  value: string;
  product: string;
  shop: string;
  price: number;
  stock: number;
  isActive: boolean;
}

/* ---------- Columns ---------- */
const columns: ColumnsType<VariantData> = [
  { title: "Variant Name", dataIndex: "name", width: 150 },
  { title: "Value", dataIndex: "value", width: 150 },
  { title: "Product", dataIndex: "product", width: 200 },
  { title: "Shop", dataIndex: "shop", width: 180 },
  { title: "Price", dataIndex: "price", width: 100 },
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
    render: () => (
      <div className="flex gap-2">
        <a>Edit</a>
        <a style={{ color: "red" }}>Delete</a>
      </div>
    ),
  },
];

const Variants: React.FC = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { styles } = useStyle();

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Variant Master</h2>
        <Button type="primary" onClick={() => setOpenAddModal(true)}>
          Add Variant
        </Button>
      </div>

      {/* Table */}
      <div className={styles.customTable}>
        <Table<VariantData>
          bordered
          columns={columns}
          dataSource={[]} // Replace with API later
          rowKey="key"
          pagination={false}
          scroll={{ x: "max-content" }}
          style={{ marginTop: 16 }}
        />
      </div>

      {/* Add Variant Modal */}
      <Modal
        title="Add Variant"
        open={openAddModal}
        onCancel={() => setOpenAddModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={addForm}
          initialValues={{ isActive: true }}
          onFinish={(values) => {
            console.log("ADD VARIANT:", values);
            setOpenAddModal(false);
            addForm.resetFields();
          }}
        >
          <Form.Item
            label="Variant Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Eg: Size / Color" />
          </Form.Item>

          <Form.Item label="Value" name="value" rules={[{ required: true }]}>
            <Input placeholder="Eg: Small / Red" />
          </Form.Item>

          <Form.Item
            label="Product"
            name="product"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Product">
              <Option value="product1">Product 1</Option>
              <Option value="product2">Product 2</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Shop" name="shop" rules={[{ required: true }]}>
            <Select placeholder="Select Shop">
              <Option value="shop1">Main Shop</Option>
              <Option value="shop2">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Extra Price" name="price">
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item label="Stock" name="stock">
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item label="Active" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Save
          </Button>
        </Form>
      </Modal>

      {/* Edit Variant Modal */}
      <Modal
        title="Edit Variant"
        open={openEditModal}
        onCancel={() => setOpenEditModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={editForm}
          onFinish={(values) => {
            console.log("EDIT VARIANT:", values);
            setOpenEditModal(false);
          }}
        >
          <Form.Item
            label="Variant Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Value" name="value" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Product"
            name="product"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="product1">Product 1</Option>
              <Option value="product2">Product 2</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Shop" name="shop" rules={[{ required: true }]}>
            <Select>
              <Option value="shop1">Main Shop</Option>
              <Option value="shop2">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Extra Price" name="price">
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item label="Stock" name="stock">
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item label="Active" name="isActive" valuePropName="checked">
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

export default Variants;
