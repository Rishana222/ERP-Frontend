import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";

const { Option } = Select;

/* ---------- Types ---------- */
interface SubCategoryData {
  key: string;
  name: string;
  category: string;
  shop: string;
  description?: string;
  isActive: boolean;
}

const SubCategories: React.FC = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategoryData | null>(null);

  const [addForm] = Form.useForm<SubCategoryData>();
  const [editForm] = Form.useForm<SubCategoryData>();

  /* ---------- Columns ---------- */
  const columns: ColumnsType<SubCategoryData> = [
    { title: "SubCategory Name", dataIndex: "name", width: 200 },
    { title: "Category", dataIndex: "category", width: 200 },
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
              setEditingSubCategory(record);
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
        <h2 className="text-xl font-semibold">Sub Categories</h2>
        <Button type="primary" onClick={() => setOpenAddModal(true)}>
          Add SubCategory
        </Button>
      </div>

      {/* Table */}
      <Table<SubCategoryData>
        bordered
        columns={columns}
        dataSource={[]} // design only
        pagination={false}
        scroll={{ x: "max-content" }}
        style={{ marginTop: 16 }}
      />

      {/* Add SubCategory Modal */}
      <Modal
        title="Add SubCategory"
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
            console.log("ADD SUBCATEGORY:", values);
            setOpenAddModal(false);
            addForm.resetFields();
          }}
        >
          <Form.Item
            label="SubCategory Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
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
    {/* categories from API */}
  </Select>
</Form.Item>


          <Form.Item
            label="Shop"
            name="shop"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Shop">
              <Option value="Main Shop">Main Shop</Option>
              <Option value="Branch Shop">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Active"
            name="isActive"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Save
          </Button>
        </Form>
      </Modal>

      {/* Edit SubCategory Modal */}
      <Modal
        title="Edit SubCategory"
        open={openEditModal}
        onCancel={() => {
          setOpenEditModal(false);
          setEditingSubCategory(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={editForm}
          onFinish={(values) => {
            console.log("UPDATE SUBCATEGORY:", {
              ...editingSubCategory,
              ...values,
            });
            setOpenEditModal(false);
          }}
        >
          <Form.Item
            label="SubCategory Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
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
    {/* categories from API */}
  </Select>
</Form.Item>


          <Form.Item
            label="Shop"
            name="shop"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Main Shop">Main Shop</Option>
              <Option value="Branch Shop">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Active"
            name="isActive"
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

export default SubCategories;
