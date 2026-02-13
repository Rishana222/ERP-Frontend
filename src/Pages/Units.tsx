import React, { useState } from "react";
import { Table, Modal, Form, Input, Popconfirm, message } from "antd";
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

  const [modalVisible, setModalVisible] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [form] = Form.useForm();

  const openModal = (unit?: Unit) => {
    if (unit) {
      setEditingUnit(unit);
      form.setFieldsValue({
        name: unit.name,
        shortName: unit.shortName,
      });
    } else {
      setEditingUnit(null);
      form.resetFields();
    }
    setModalVisible(true);
  };


  const handleSave = async (values: UnitPayload) => {
    try {
      if (editingUnit) {
        await updateMutation.mutateAsync({ id: editingUnit._id, data: values });
        message.success("Unit updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        message.success("Unit created successfully");
      }
      setModalVisible(false);
      form.resetFields();
    } catch (err) {
      message.error("Error saving unit");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Unit deleted successfully");
    } catch (err) {
      message.error("Error deleting unit");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Short Name", dataIndex: "shortName", key: "shortName" },
    {
      title: "Actions",
      key: "action",
      render: (_: any, record: Unit) => (
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm rounded bg-[#00264d] text-white hover:bg-[#001a33]"
            onClick={() => openModal(record)}
          >
            Edit
          </button>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record._id)}>
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
          className="px-4 py-2 bg-[#00264d] text-white rounded hover:bg-[#001a33]"
          onClick={() => openModal()}
        >
          Add Unit
        </button>
      </div>


      <Table dataSource={units} columns={columns} rowKey="_id" loading={isLoading} bordered className="erp-table" />

  
      <Modal
        title={editingUnit ? "Edit Unit" : "Add Unit"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingUnit(null);
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Unit name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Short Name" name="shortName">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UnitsPage;
