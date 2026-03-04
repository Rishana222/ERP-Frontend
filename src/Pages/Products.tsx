import { useState } from "react";
import {
  Button,
  Form,
  Modal,
  Table,
  Popconfirm,
  Input,
  Select,
  Row,
  Col,
  InputNumber,
} from "antd";
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

  const { data: products = [], isLoading } = useGetProducts();
  const { data: categories = [] } = useGetCategories();
  const { data: subCategories = [] } = useGetSubCategories();
  const { data: units = [] } = useGetUnits();
  const { data: taxes = [] } = useGetTaxes();

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
        }
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
      stock: product.stock,
      sellingPrice: product.sellingPrice,
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
    {
      title: "Name",
      dataIndex: "name",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Category",
      responsive: ["sm", "md", "lg"],
      render: (_: any, record: any) => record.category?.name || "-",
    },
    {
      title: "Sub Category",
      responsive: ["md", "lg"],
      render: (_: any, record: any) => record.subCategory?.name || "-",
    },
    {
      title: "Unit",
      responsive: ["md", "lg"],
      render: (_: any, record: any) => record.unit?.name || "-",
    },
    {
      title: "Tax",
      responsive: ["lg"],
      render: (_: any, record: any) => record.tax?.name || "-",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Selling Price",
      dataIndex: "sellingPrice",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => handleEdit(record)}
            className="px-3 py-1 text-xs sm:text-sm rounded bg-[#00264d] text-white w-full sm:w-auto"
          >
            Edit
          </button>

          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._id)}
          >
            <button className="px-3 py-1 text-xs sm:text-sm rounded bg-red-600 text-white w-full sm:w-auto">
              Delete
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Products</h2>

        <Button
          type="primary"
          className="w-full sm:w-auto"
          onClick={() => {
            setEditingProduct(null);
            form.resetFields();
            setOpenModal(true);
          }}
        >
          Add Product
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={products}
          loading={isLoading}
          bordered
          pagination={{ pageSize: 8 }}
          className="min-w-[900px] erp-table"
        />
      </div>

      {/* Modal */}
      <Modal
        open={openModal}
        title={editingProduct ? "Edit Product" : "Create Product"}
        onCancel={closeModal}
        onOk={() => form.submit()}
        width={window.innerWidth < 640 ? "95%" : 800}
        centered
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Product Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true }]}
              >
                <Select showSearch placeholder="Select Category">
                  {categories.map((cat: any) => (
                    <Select.Option key={cat._id} value={cat._id}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="subCategory" label="Sub Category">
                <Select allowClear placeholder="Select Sub Category">
                  {subCategories.map((sub: any) => (
                    <Select.Option key={sub._id} value={sub._id}>
                      {sub.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="unit" label="Unit">
                <Select allowClear placeholder="Select Unit">
                  {units.map((unit: any) => (
                    <Select.Option key={unit._id} value={unit._id}>
                      {unit.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="tax" label="Tax">
                <Select allowClear placeholder="Select Tax">
                  {taxes.map((tax: any) => (
                    <Select.Option key={tax._id} value={tax._id}>
                      {tax.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="stock" label="Stock">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="sellingPrice" label="Selling Price">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default ProductPage;