import React, { useState } from "react";
import { Table, Modal, Form, Input, InputNumber, Popconfirm, message } from "antd";
import {
  useGetUnits,
  useCreateUnit,
  useUpdateUnit,
  useDeleteUnit,

} from "../Utils/UnitAPI";
import type { Unit, UnitPayload } from "../Utils/UnitAPI";
const UnitsPage: React.FC = () => {
  const { data: units = [], isLoading } = useGetUnits();
  const createMutation = useCreateUnit();
  const updateMutation = useUpdateUnit();
  const deleteMutation = useDeleteUnit();

  const [open, setOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [form] = Form.useForm();

  const openModal = (unit?: Unit) => {
    if (unit) {
      setEditingUnit(unit);
      form.setFieldsValue({
        name: unit.name,
        shortName: unit.shortName,
        baseUnit: unit.baseUnit,
        baseValue: unit.baseValue,
      });
    } else {
      setEditingUnit(null);
      form.resetFields();
    }
    setOpen(true);
  };

  const handleSubmit = async (values: UnitPayload) => {
    try {
      if (editingUnit) {
        await updateMutation.mutateAsync({
          id: editingUnit._id,
          data: values,
        });
        message.success("Unit updated");
      } else {
        await createMutation.mutateAsync(values);
        message.success("Unit created");
      }
      setOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Unit deleted");
    } catch {
      message.error("Delete failed");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Short Name", dataIndex: "shortName" },
    { title: "Base Unit", dataIndex: "baseUnit" },
    { title: "Base Value", dataIndex: "baseValue" },
    {
      title: "Actions",
      render: (_: any, record: Unit) => (
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm rounded bg-[#00264d] text-white hover:bg-[#001a33]"
            onClick={() => openModal(record)}
          >
            Edit
          </button>

          <Popconfirm
            title="Delete this unit?"
            onConfirm={() => handleDelete(record._id)}
          >
            <button className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700">
              Delete
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Units</h2>
        <button
          className="px-4 py-2 bg-[#00264d] text-white rounded"
          onClick={() => openModal()}
        >
          Add Unit
        </button>
      </div>

      <Table
        dataSource={units}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        bordered
        className="erp-table"
      />

      <Modal
        title={editingUnit ? "Edit Unit" : "Add Unit"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Short Name" name="shortName">
            <Input />
          </Form.Item>

          <Form.Item label="Base Unit" name="baseUnit">
            <Input />
          </Form.Item>

          <Form.Item label="Base Value" name="baseValue">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UnitsPage;
