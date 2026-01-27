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

interface SubCategoryFormValues {
  name: string;
  category: string;
  shop: string;
  description?: string;
  isActive: boolean;
}

const SubCategories: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm<SubCategoryFormValues>();

  const openAddModal = () => {
    setIsEdit(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = () => {
    setIsEdit(true);
    setModalVisible(true);
  };

  const handleSubmit = (values: SubCategoryFormValues) => {
    console.log(isEdit ? "UPDATE SUBCATEGORY:" : "ADD SUBCATEGORY:", values);
    setModalVisible(false);
  };

  const handleDelete = () => {
    console.log("DELETE SUBCATEGORY");
  };

  const columns = [
    { title: "SubCategory Name", dataIndex: "name" },
    { title: "Category", dataIndex: "category" },
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
            title="Are you sure to delete this subcategory?"
            onConfirm={handleDelete}
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
        Add SubCategory
      </Button>

      {/* Design only */}
      <Table columns={columns} dataSource={[]} />

      <Modal
        title={isEdit ? "Edit SubCategory" : "Add SubCategory"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText={isEdit ? "Update" : "Add"}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isActive: true }}
        >
          <Form.Item
            name="name"
            label="SubCategory Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Category">
              {/* options will come from API later */}
            </Select>
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

export default SubCategories;
