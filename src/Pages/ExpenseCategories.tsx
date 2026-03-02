import React, { useState } from "react";
import { Table, Modal, Form, Input, message, Popconfirm } from "antd";
import {
  useGetCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../Utils/ExpenseCategoryAPI"; // your Axios API
import type { Category, CategoryPayload } from "../Utils/ExpenseCategoryAPI";

const ExpenseCategoryPage: React.FC = () => {
  const { data: categories = [], isLoading } = useGetCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      form.setFieldsValue(category);
    } else {
      setEditingCategory(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleSave = async (values: CategoryPayload) => {
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({
          id: editingCategory._id,
          data: values,
        });
        message.success("Expense category updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        message.success("Expense category created successfully");
      }
      setModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
    } catch (err: any) {
      message.error(err?.message || "Error saving expense category");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Expense category deleted successfully");
    } catch (err: any) {
      message.error(err?.message || "Error deleting expense category");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Category) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal(record)}
            className="px-3 py-1 text-sm rounded bg-[#00264d] text-white hover:bg-[#001a33]"
          >
            Edit
          </button>

          <Popconfirm
            title="Are you sure?"
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
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Expense Categories</h2>
        <button
          className="px-4 py-2 bg-[#00264d] text-white rounded hover:bg-[#001a33]"
          onClick={() => openModal()}
        >
          Add Expense Category
        </button>
      </div>

      <Table
        dataSource={categories}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        bordered
        className="erp-table"
      />

      <Modal
        title={
          editingCategory ? "Edit Expense Category" : "Add Expense Category"
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingCategory(null);
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Expense category name is required" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ExpenseCategoryPage;
