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
interface VendorData {
  key: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  gstNumber?: string;
  shop: string;
  openingBalance: number;
  isActive: boolean;
}

const Vendors: React.FC = () => {
  const { styles } = useStyle();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorData | null>(null);

  const [addForm] = Form.useForm<VendorData>();
  const [editForm] = Form.useForm<VendorData>();

  /* ---------- Columns ---------- */
  const columns: ColumnsType<VendorData> = [
    { title: "Vendor Name", dataIndex: "name", width: 200 },
    { title: "Phone", dataIndex: "phone", width: 150 },
    { title: "Email", dataIndex: "email", width: 200 },
    { title: "GST No", dataIndex: "gstNumber", width: 180 },
    { title: "Shop", dataIndex: "shop", width: 150 },
    { title: "Opening Balance", dataIndex: "openingBalance", width: 150 },
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
              setEditingVendor(record);
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
        <h2 className="text-xl font-semibold">Vendors</h2>
        <Button type="primary" onClick={() => setOpenAddModal(true)}>
          Add Vendor
        </Button>
      </div>

      {/* Table */}
      <div className={styles.customTable}>
        <Table<VendorData>
          bordered
          columns={columns}
          dataSource={[]} // design only
          rowKey="key"
          pagination={false}
          scroll={{ x: "max-content" }}
          style={{ marginTop: 16 }}
        />
      </div>

      {/* Add Vendor Modal */}
      <Modal
        title="Add Vendor"
        open={openAddModal}
        onCancel={() => setOpenAddModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={addForm}
          initialValues={{ isActive: true, openingBalance: 0 }}
          onFinish={(values) => {
            console.log("ADD VENDOR:", values);
            setOpenAddModal(false);
            addForm.resetFields();
          }}
        >
          <Form.Item name="name" label="Vendor Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input type="email" />
          </Form.Item>

          <Form.Item name="gstNumber" label="GST Number">
            <Input placeholder="29ABCDE1234F1Z5" />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item name="shop" label="Shop" rules={[{ required: true }]}>
            <Select placeholder="Select shop">
              <Option value="Main Shop">Main Shop</Option>
              <Option value="Branch Shop">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item name="openingBalance" label="Opening Balance">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Save
          </Button>
        </Form>
      </Modal>

      {/* Edit Vendor Modal */}
      <Modal
        title="Edit Vendor"
        open={openEditModal}
        onCancel={() => {
          setOpenEditModal(false);
          setEditingVendor(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={editForm}
          onFinish={(values) => {
            console.log("UPDATE VENDOR:", { ...editingVendor, ...values });
            setOpenEditModal(false);
          }}
        >
          <Form.Item name="name" label="Vendor Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input type="email" />
          </Form.Item>

          <Form.Item name="gstNumber" label="GST Number">
            <Input />
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
            <InputNumber style={{ width: "100%" }} min={0} />
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

export default Vendors;
