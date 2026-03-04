import { useState } from "react";
import { Button, Form, Modal, Table, Popconfirm, Input, Select } from "antd";
import { toast } from "react-toastify";
import type { ColumnsType } from "antd/es/table";

import {
  useGetVariants,
  useCreateVariant,
  useUpdateVariant,
  useDeleteVariant,
} from "../Utils/VariantAPI";
import { useGetProducts } from "../Utils/productApi";

function VariantPage() {
  const [openModal, setOpenModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: variants = [], isLoading: variantsLoading } = useGetVariants();
  const { data: products = [] } = useGetProducts();

  const createMutation = useCreateVariant();
  const updateMutation = useUpdateVariant();
  const deleteMutation = useDeleteVariant();

  const handleSave = (values: any) => {
    if (editingVariant) {
      updateMutation.mutate(
        { id: editingVariant._id, data: values },
        {
          onSuccess: () => {
            toast.success("Variant updated successfully");
            closeModal();
          },
          onError: () => toast.error("Failed to update variant"),
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Variant created successfully");
          closeModal();
        },
        onError: () => toast.error("Failed to create variant"),
      });
    }
  };

  const handleEdit = (variant: any) => {
    setEditingVariant(variant);
    form.setFieldsValue({
      name: variant.name,
      product: variant.product?._id,
    });
    setOpenModal(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Variant deleted successfully"),
      onError: () => toast.error("Failed to delete variant"),
    });
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingVariant(null);
    form.resetFields();
  };

  const columns: ColumnsType<any> = [
    {
      title: "Variant Name",
      dataIndex: "name",
      ellipsis: true,
      width: 180,
    },
    {
      title: "Product",
      width: 180,
      render: (_: any, record: any) =>
        record.product?.name || "-",
    },
    {
      title: "Actions",
      width: 160,
      render: (_: any, record: any) => (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => handleEdit(record)}
            className="px-3 py-1 text-xs sm:text-sm rounded bg-[#00264d] text-white hover:bg-[#001a33] w-full sm:w-auto"
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
          Variants
        </h2>

        <Button
          type="primary"
          className="w-full sm:w-auto"
          onClick={() => {
            setEditingVariant(null);
            setOpenModal(true);
          }}
        >
          Add Variant
        </Button>
      </div>

      {/* Table Wrapper */}
      <div className="w-full min-w-0 overflow-x-auto">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={variants}
          loading={variantsLoading}
          bordered
          size="small"
          pagination={{ pageSize: 8, size: "small" }}
          scroll={{ x: 600 }}
          className="erp-table"
        />
      </div>

      {/* Modal */}
      <Modal
        open={openModal}
        title={editingVariant ? "Edit Variant" : "Create Variant"}
        onCancel={closeModal}
        onOk={() => form.submit()}
        width="95%"
        style={{ maxWidth: 500 }}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Form.Item
            name="name"
            label="Variant Name"
            rules={[{ required: true, message: "Please enter variant name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="product"
            label="Product"
            rules={[{ required: true, message: "Please select a product" }]}
          >
            <Select placeholder="Select Product">
              {products.map((prod: any) => (
                <Select.Option key={prod._id} value={prod._id}>
                  {prod.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default VariantPage;