import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Switch } from "antd";
import type { ColumnsType } from "antd/es/table";

const { Option } = Select;

/* ---------- Types ---------- */
interface ShopData {
  key: string;
  name: string;
  owner: string;
  phone?: string;
  email?: string;
  address?: string;
  gstNumber?: string;
  isActive: boolean;
}

/* ---------- Columns ---------- */
const columns: ColumnsType<ShopData> = [
  {
    title: "Shop Name",
    dataIndex: "name",
    width: 200,
  },
  {
    title: "Owner",
    dataIndex: "owner",
    width: 200,
  },
  {
    title: "Phone",
    dataIndex: "phone",
    width: 150,
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 200,
  },
  {
    title: "GST Number",
    dataIndex: "gstNumber",
    width: 180,
  },
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

const Shop: React.FC = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Shop Master</h2>
        <Button type="primary" onClick={() => setOpenAddModal(true)}>
          Add Shop
        </Button>
      </div>

      {/* Table */}
      <Table<ShopData>
        bordered
        columns={columns}
        dataSource={[]} // API later
        pagination={false}
        scroll={{ x: "max-content" }}
        style={{ marginTop: 16 }}
      />

      {/* Add Shop Modal */}
      <Modal
        title="Add Shop"
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
            console.log("ADD SHOP:", values);
            setOpenAddModal(false);
            addForm.resetFields();
          }}
        >
          <Form.Item label="Shop Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Owner" name="owner" rules={[{ required: true }]}>
            <Select placeholder="Select Owner">
              {/* API later */}
              <Option value="user1">User 1</Option>
              <Option value="user2">User 2</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input type="email" />
          </Form.Item>

          <Form.Item label="GST Number" name="gstNumber">
            <Input />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item label="Active" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Save
          </Button>
        </Form>
      </Modal>

      {/* Edit Shop Modal */}
      <Modal
        title="Edit Shop"
        open={openEditModal}
        onCancel={() => setOpenEditModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={editForm}
          onFinish={(values) => {
            console.log("EDIT SHOP:", values);
            setOpenEditModal(false);
          }}
        >
          <Form.Item label="Shop Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Owner" name="owner" rules={[{ required: true }]}>
            <Select>
              <Option value="user1">User 1</Option>
              <Option value="user2">User 2</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input type="email" />
          </Form.Item>

          <Form.Item label="GST Number" name="gstNumber">
            <Input />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input.TextArea rows={2} />
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

export default Shop;
