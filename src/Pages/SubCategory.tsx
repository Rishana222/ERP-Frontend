import React, { useState } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
} from "antd";
import {
  useGetCategories,
  useGetSubCategories,
  useCreateSubCategory,
  useUpdateSubCategory,
  useDeleteSubCategory,
} from "../Utils/SubcategoryAPI";
import type {
  SubCategory,
  SubCategoryPayload,
  Category,
} from "../Utils/SubcategoryAPI";

const SubCategoryPage: React.FC = () => {
  const { data: categories = [] } = useGetCategories();
  const { data: subCategories = [], isLoading } =
    useGetSubCategories();

  const createMutation = useCreateSubCategory();
  const updateMutation = useUpdateSubCategory();
  const deleteMutation = useDeleteSubCategory();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null);
  const [form] = Form.useForm();

  const openModal = (subCategory?: SubCategory) => {
    if (subCategory) {
      setEditingSubCategory(subCategory);
      form.setFieldsValue({
        name: subCategory.name,
        description: subCategory.description,
        category: subCategory.category._id,
      });
    } else {
      setEditingSubCategory(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleSave = async (values: SubCategoryPayload) => {
    try {
      if (editingSubCategory) {
        await updateMutation.mutateAsync({
          id: editingSubCategory._id,
          data: values,
        });
        message.success("SubCategory updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        message.success("SubCategory created successfully");
      }
      setModalVisible(false);
      form.resetFields();
    } catch {
      message.error("Error saving subcategory");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("SubCategory deleted successfully");
    } catch {
      message.error("Error deleting subcategory");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      ellipsis: true,
    },
    {
      title: "Actions",
      width: 150,
      render: (_: any, record: SubCategory) => (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            className="px-3 py-1 text-xs sm:text-sm rounded bg-[#00264d] text-white hover:bg-[#001a33] w-full sm:w-auto"
            onClick={() => openModal(record)}
          >
            Edit
          </button>

          <Popconfirm
            title="Are you sure?"
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
          SubCategories
        </h2>

        <button
          className="px-4 py-2 bg-[#00264d] text-white rounded hover:bg-[#001a33] w-full sm:w-auto"
          onClick={() => openModal()}
        >
          Add SubCategory
        </button>
      </div>

      {/* Table Wrapper (CRITICAL for 320px) */}
      <div className="w-full min-w-0 overflow-x-auto">
        <Table
          dataSource={subCategories}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          bordered
          size="small"
          pagination={{ pageSize: 8, size: "small" }}
          scroll={{ x: 700 }}
          className="erp-table"
        />
      </div>

      {/* Modal */}
      <Modal
        title={
          editingSubCategory
            ? "Edit SubCategory"
            : "Add SubCategory"
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingSubCategory(null);
        }}
        onOk={() => form.submit()}
        width="95%"
        style={{ maxWidth: 500 }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "SubCategory name is required",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[
              { required: true, message: "Select a category" },
            ]}
          >
            <Select placeholder="Select Category">
              {categories.map((cat: Category) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubCategoryPage;