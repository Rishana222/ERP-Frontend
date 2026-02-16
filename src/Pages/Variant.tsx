import { useState, useEffect } from "react";
import { Button, Form, Modal, Table, Popconfirm, Input, Select } from "antd";
import { toast } from "react-toastify";

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

  /* ================= API CALLS ================= */
  const { data: variants, isLoading: variantsLoading } = useGetVariants();
  const { data: products } = useGetProducts();

  const createMutation = useCreateVariant();
  const updateMutation = useUpdateVariant();
  const deleteMutation = useDeleteVariant();

  /* ================= HANDLERS ================= */
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
        },
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

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    { title: "Variant Name", dataIndex: "name" },
    {
      title: "Product",
      render: (_: any, record: any) => record.product?.name || "-",
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(record)}
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
        <h2 className="text-xl font-semibold">Variants</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingVariant(null);
            setOpenModal(true);
          }}
        >
          Add Variant
        </Button>
      </div>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={variants}
        loading={variantsLoading}
        bordered
        className="erp-table"
      />
     
      <Modal
        open={openModal}
        title={editingVariant ? "Edit Variant" : "Create Variant"}
        onCancel={closeModal}
        onOk={() => form.submit()}
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
              {products?.map((prod: any) => (
                <Select.Option key={prod._id} value={prod._id}>
                  {prod.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default VariantPage;
