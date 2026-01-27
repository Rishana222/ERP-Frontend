import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
} from "antd";
import type { ColumnsType } from "antd/es/table";

const { Option } = Select;

/* ---------- Types ---------- */
interface CustomerData {
  key: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  shop: string;
  openingBalance: number;
  creditLimit: number;
  isActive: boolean;
}

const Customers: React.FC = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<CustomerData | null>(null);

  const [addForm] = Form.useForm<CustomerData>();
  const [editForm] = Form.useForm<CustomerData>();

  /* ---------- Columns ---------- */
  const columns: ColumnsType<CustomerData> = [
    { title: "Customer Name", dataIndex: "name", width: 200 },
    { title: "Phone", dataIndex: "phone", width: 150 },
    { title: "Email", dataIndex: "email", width: 200 },
    { title: "Shop", dataIndex: "shop", width: 150 },
    {
      title: "Opening Balance",
      dataIndex: "openingBalance",
      width: 150,
    },
    {
      title: "Credit Limit",
      dataIndex: "creditLimit",
      width: 150,
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
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setEditingCustomer(record);
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
        <h2 className="text-xl font-semibold">Customers</h2>
        <Button type="primary" onClick={() => setOpenAddModal(true)}>
          Add Customer
        </Button>
      </div>

      {/* Table */}
      <Table<CustomerData>
        bordered
        columns={columns}
        dataSource={[]} // API later
        pagination={false}
        scroll={{ x: "max-content" }}
        style={{ marginTop: 16 }}
      />

      {/* Add Customer Modal */}
      <Modal
        title="Add Customer"
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
            console.log("ADD CUSTOMER:", values);
            setOpenAddModal(false);
            addForm.resetFields();
          }}
        >
          <Form.Item name="name" label="Customer Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input type="email" />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item name="shop" label="Shop" rules={[{ required: true }]}>
            <Select placeholder="Select shop">
              {/* API later */}
              <Option value="Main Shop">Main Shop</Option>
              <Option value="Branch Shop">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item name="openingBalance" label="Opening Balance">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="creditLimit" label="Credit Limit">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Save
          </Button>
        </Form>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        title="Edit Customer"
        open={openEditModal}
        onCancel={() => {
          setOpenEditModal(false);
          setEditingCustomer(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={editForm}
          onFinish={(values) => {
            console.log("UPDATE CUSTOMER:", {
              ...editingCustomer,
              ...values,
            });
            setOpenEditModal(false);
          }}
        >
          <Form.Item name="name" label="Customer Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input type="email" />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item name="shop" label="Shop" rules={[{ required: true }]}>
            <Select>
              <Option value="Main Shop">Main Shop</Option>
              <Option value="Branch Shop">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item name="openingBalance" label="Opening Balance">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="creditLimit" label="Credit Limit">
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

export default Customers;
