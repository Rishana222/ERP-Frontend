import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
} from "antd";
import type { ColumnsType } from "antd/es/table";

const { Option } = Select;

/* ---------- Types ---------- */
interface CategoryData {
  key: string;
  name: string;
  shop: string;
  description?: string;
  isActive: boolean;
}

/* ---------- Component ---------- */
const Categories: React.FC = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryData | null>(null);

  const [addForm] = Form.useForm<CategoryData>();
  const [editForm] = Form.useForm<CategoryData>();

  /* ---------- Columns ---------- */
  const columns: ColumnsType<CategoryData> = [
    { title: "Category Name", dataIndex: "name", width: 200 },
    { title: "Shop", dataIndex: "shop", width: 200 },
    { title: "Description", dataIndex: "description" },
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
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setEditingCategory(record);
              editForm.setFieldsValue(record);
              setOpenEditModal(true);
            }}
          >
            Edit
          </Button>
          <Button size="small" danger>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button type="primary" onClick={() => setOpenAddModal(true)}>
          Add Category
        </Button>
      </div>

      {/* Table */}
      <Table<CategoryData>
        bordered
        columns={columns}
        dataSource={[]}
        pagination={false}
        scroll={{ x: "max-content" }}
        style={{ marginTop: 16 }}
      />

      {/* Add Category Modal */}
      <Modal
        title="Add Category"
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
            console.log("ADD CATEGORY:", values);
            setOpenAddModal(false);
            addForm.resetFields();
          }}
        >
          <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="shop" label="Shop" rules={[{ required: true }]}>
            <Select placeholder="Select shop">
              <Option value="Main Shop">Main Shop</Option>
              <Option value="Branch Shop">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Save
          </Button>
        </Form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        title="Edit Category"
        open={openEditModal}
        onCancel={() => {
          setOpenEditModal(false);
          setEditingCategory(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={editForm}
          onFinish={(values) => {
            console.log("UPDATE CATEGORY:", {
              ...editingCategory,
              ...values,
            });
            setOpenEditModal(false);
          }}
        >
          <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="shop" label="Shop" rules={[{ required: true }]}>
            <Select>
              <Option value="Main Shop">Main Shop</Option>
              <Option value="Branch Shop">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Active"
            valuePropName="checked"
          >
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

export default Categories;
