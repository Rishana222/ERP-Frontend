import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Select, Switch } from "antd";
import type { ColumnsType } from "antd/es/table";

const { Option } = Select;

/* ---------- Types ---------- */
interface TaxData {
  key: string;
  name: string;
  rate: number;
  type: "CGST" | "SGST" | "IGST";
  isActive: boolean;
  description?: string;
}

const Tax: React.FC = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxData | null>(null);

  const [addForm] = Form.useForm<TaxData>();
  const [editForm] = Form.useForm<TaxData>();

  /* ---------- Columns ---------- */
  const columns: ColumnsType<TaxData> = [
    { title: "Tax Name", dataIndex: "name", width: 200 },
    {
      title: "Rate (%)",
      dataIndex: "rate",
      width: 120,
      render: (rate: number) => `${rate}%`,
    },
    { title: "Type", dataIndex: "type", width: 120 },
    {
      title: "Active",
      dataIndex: "isActive",
      width: 100,
      render: (val: boolean) => (val ? "Yes" : "No"),
    },
    { title: "Description", dataIndex: "description" },
    {
      title: "Action",
      width: 150,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setEditingTax(record);
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
        <h2 className="text-xl font-semibold">Tax Master</h2>
        <Button type="primary" onClick={() => setOpenAddModal(true)}>
          Add Tax
        </Button>
      </div>

      {/* Table */}
      <Table<TaxData>
        bordered
        columns={columns}
        dataSource={[]} // API later
        pagination={false}
        scroll={{ x: "max-content" }}
        style={{ marginTop: 16 }}
      />

      {/* Add Tax Modal */}
      <Modal
        title="Add Tax"
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
            console.log("ADD TAX:", values);
            setOpenAddModal(false);
            addForm.resetFields();
          }}
        >
          <Form.Item name="name" label="Tax Name" rules={[{ required: true }]}>
            <Input placeholder="Eg: GST 18%" />
          </Form.Item>

          <Form.Item name="rate" label="Tax Rate (%)" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="type" label="Tax Type" rules={[{ required: true }]}>
            <Select placeholder="Select Tax Type">
              <Option value="CGST">CGST</Option>
              <Option value="SGST">SGST</Option>
              <Option value="IGST">IGST</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Save
          </Button>
        </Form>
      </Modal>

      {/* Edit Tax Modal */}
      <Modal
        title="Edit Tax"
        open={openEditModal}
        onCancel={() => {
          setOpenEditModal(false);
          setEditingTax(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={editForm}
          onFinish={(values) => {
            console.log("UPDATE TAX:", {
              ...editingTax,
              ...values,
            });
            setOpenEditModal(false);
          }}
        >
          <Form.Item name="name" label="Tax Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="rate" label="Tax Rate (%)" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="type" label="Tax Type" rules={[{ required: true }]}>
            <Select>
              <Option value="CGST">CGST</Option>
              <Option value="SGST">SGST</Option>
              <Option value="IGST">IGST</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
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

export default Tax;
