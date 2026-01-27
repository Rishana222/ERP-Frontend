import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Select,
  Popconfirm,
} from "antd";

const { Option } = Select;

interface CategoryFormValues {
  name: string;
  shop: string;
  description?: string;
  isActive: boolean;
}

const Categories: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [form] = Form.useForm<CategoryFormValues>();

  const openAddModal = () => {
    setEditingCategory(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = () => {
    setEditingCategory(true);
    setModalVisible(true);
  };

  const handleSubmit = (values: CategoryFormValues) => {
    console.log(editingCategory ? "UPDATE CATEGORY:" : "ADD CATEGORY:", values);
    setModalVisible(false);
  };

  const handleDelete = (key: string) => {
    console.log("DELETE CATEGORY:", key);
  };

  const columns = [
    { title: "Category Name", dataIndex: "name" },
    { title: "Shop", dataIndex: "shop" },
    { title: "Description", dataIndex: "description" },
    {
      title: "Active",
      dataIndex: "isActive",
      render: (val: boolean) => (val ? "Yes" : "No"),
    },
    {
      title: "Action",
      render: () => (
        <>
          <Button type="link" onClick={openEditModal}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDelete("demo-key")}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={openAddModal}
      >
        Add Category
      </Button>

      {/* Design only table */}
      <Table columns={columns} dataSource={[]} />

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText={editingCategory ? "Update" : "Add"}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isActive: true }}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="shop" label="Shop" rules={[{ required: true }]}>
            <Select placeholder="Select Shop">
              <Option value="Main Shop">Main Shop</Option>
              <Option value="Branch Shop">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
