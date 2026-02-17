import { useState } from "react";
import { Button, Form, Modal, Table, Popconfirm, Input, Select } from "antd";
import { toast } from "react-toastify";

import {
  useGetProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../Utils/productApi";

import { useGetCategories } from "../Utils/CategoroyAPI";
import { useGetSubCategories } from "../Utils/SubcategoryAPI";
import { useGetUnits } from "../Utils/UnitAPI";
import { useGetTaxes } from "../Utils/TaxAPI";

function ProductPage() {
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: products, isLoading } = useGetProducts();
  const { data: categories } = useGetCategories();
  const { data: subCategories } = useGetSubCategories();
  const { data: units } = useGetUnits();
  const { data: taxes } = useGetTaxes();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();


  const handleSave = (values: any) => {
    if (editingProduct) {
      updateMutation.mutate(
        { id: editingProduct._id, data: values },
        {
          onSuccess: () => {
            toast.success("Product updated successfully");
            closeModal();
          },
          onError: () => toast.error("Failed to update product"),
        },
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Product created successfully");
          closeModal();
        },
        onError: () => toast.error("Failed to create product"),
      });
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      category: product.category?._id,
      subCategory: product.subCategory?._id,
      unit: product.unit?._id,
      tax: product.tax?._id,
      price: product.price,
    });
    setOpenModal(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Product deleted successfully"),
      onError: () => toast.error("Failed to delete product"),
    });
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingProduct(null);
    form.resetFields();
  };



  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Category",
      render: (_: any, record: any) => record.category?.name || "-",
    },
    {
      title: "Sub Category",
      render: (_: any, record: any) => record.subCategory?.name || "-",
    },
    {
      title: "Unit",
      render: (_: any, record: any) => record.unit?.name || "-",
    },
    { title: "Tax", render: (_: any, record: any) => record.tax?.name || "-" },
    { title: "Price", dataIndex: "price" },
    { title: "Stock", dataIndex: "stock" },
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
        <h2 className="text-xl font-semibold">Products</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingProduct(null);
            setOpenModal(true);
          }}
        >
          Add Product
        </Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={products}
        loading={isLoading}
        bordered
        className="erp-table"
      />

      <Modal
        open={openModal}
        title={editingProduct ? "Edit Product" : "Create Product"}
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Category">
              {categories?.map((cat: any) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="subCategory" label="Sub Category">
            <Select placeholder="Select Sub Category" allowClear>
              {subCategories?.map((sub: any) => (
                <Select.Option key={sub._id} value={sub._id}>
                  {sub.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="unit" label="Unit">
            <Select placeholder="Select Unit" allowClear>
              {units?.map((unit: any) => (
                <Select.Option key={unit._id} value={unit._id}>
                  {unit.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="tax" label="Tax">
            <Select placeholder="Select Tax" allowClear>
              {taxes?.map((tax: any) => (
                <Select.Option key={tax._id} value={tax._id}>
                  {tax.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="stock" label="Stock">
            <Input type="number" min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ProductPage;