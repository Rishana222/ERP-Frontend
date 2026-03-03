import React, { useState } from "react";
import { Table, Modal, Form, Input, message, Popconfirm } from "antd";
import {
  useGetCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../Utils/CategoroyAPI";
import type { Category, CategoryPayload } from "../Utils/CategoroyAPI";

const CategoryPage: React.FC = () => {
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
        message.success("Category updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        message.success("Category created successfully");
      }
      setModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
    } catch (err) {
      message.error("Error saving category");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Category deleted successfully");
    } catch (err) {
      message.error("Error deleting category");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Actions",
      key: "action",
      render: (_: any, record: Category) => (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => openModal(record)}
            className="w-full sm:w-auto px-3 py-1 text-sm rounded bg-[#00264d] text-white hover:bg-[#001a33]"
          >
            Edit
          </button>

          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record._id)}
          >
            <button className="w-full sm:w-auto px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700">
              Delete
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>

        <button
          className="w-full sm:w-auto px-4 py-2 bg-[#00264d] text-white rounded hover:bg-[#001a33]"
          onClick={() => openModal()}
        >
          Add Category
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          bordered
          pagination={{ pageSize: 5 }}
          className="min-w-[600px] erp-table"
        />
      </div>

      {/* Modal */}
      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingCategory(null);
        }}
        onOk={() => form.submit()}
        width="100%"
        style={{ maxWidth: 500 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          className="space-y-2"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Category name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryPage;