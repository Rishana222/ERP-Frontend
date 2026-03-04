import React, { useState } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  message,
} from "antd";
import {
  useGetUnits,
  useCreateUnit,
  useUpdateUnit,
  useDeleteUnit,
} from "../Utils/UnitAPI";
import type { Unit, UnitPayload } from "../Utils/UnitAPI";
import type { ColumnsType } from "antd/es/table";

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
      message.error(
        err?.response?.data?.message || "Something went wrong"
      );
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

  const columns: ColumnsType<Unit> = [
    {
      title: "Name",
      dataIndex: "name",
      ellipsis: true,
      width: 150,
    },
    {
      title: "Short",
      dataIndex: "shortName",
      ellipsis: true,
      width: 120,
    },
    {
      title: "Base Unit",
      dataIndex: "baseUnit",
      ellipsis: true,
      width: 150,
    },
    {
      title: "Base Value",
      dataIndex: "baseValue",
      width: 120,
    },
    {
      title: "Actions",
      width: 160,
      render: (_: any, record: Unit) => (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            className="px-3 py-1 text-xs sm:text-sm rounded bg-[#00264d] text-white hover:bg-[#001a33] w-full sm:w-auto"
            onClick={() => openModal(record)}
          >
            Edit
          </button>

          <Popconfirm
            title="Delete this unit?"
            onConfirm={() => handleDelete(record._id)}
          >
            <button className="px-3 py-1 text-xs sm:text-sm rounded bg-red-600 text-white hover:bg-red-700 w-full sm:w-auto">
              Delete
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-w-0 px-2 sm:px-4 py-3">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          Units
        </h2>

        <button
          className="px-4 py-2 bg-[#00264d] text-white rounded w-full sm:w-auto"
          onClick={() => openModal()}
        >
          Add Unit
        </button>
      </div>

      {/* Table Wrapper */}
      <div className="w-full min-w-0 overflow-x-auto">
        <Table
          dataSource={units}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          bordered
          size="small"
          pagination={{ pageSize: 8, size: "small" }}
          scroll={{ x: 800 }}
          className="erp-table"
        />
      </div>

      {/* Modal */}
      <Modal
        title={editingUnit ? "Edit Unit" : "Add Unit"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditingUnit(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width="95%"
        style={{ maxWidth: 500 }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
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
            <InputNumber
              style={{ width: "100%" }}
              min={0}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UnitsPage;