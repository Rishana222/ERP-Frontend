import React, { useState } from "react";
import {
  Table,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
  Popconfirm,
} from "antd";

import {
  useGetSales,
  useCreateSale,
  useUpdateSale,
  useDeleteSale,
} from "../Utils/salesAPI";

import { useGetCustomers } from "../Utils/customerApi";
import { useGetProducts } from "../Utils/productApi";
import { useGetUnits } from "../Utils/UnitAPI";

import type { Sale, SalePayload } from "../Utils/salesAPI";

const SalesPage: React.FC = () => {
  const { data: sales = [], isLoading } = useGetSales();
  const { data: customers = [] } = useGetCustomers();
  const { data: products = [] } = useGetProducts();
  const { data: units = [] } = useGetUnits();

  const createMutation = useCreateSale();
  const updateMutation = useUpdateSale();
  const deleteMutation = useDeleteSale();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [form] = Form.useForm();

  /* ================= OPEN MODAL (SAFE) ================= */
  const openModal = (sale?: Sale) => {
    if (sale) {
      setEditingSale(sale);
      form.setFieldsValue({
        ...sale,
        customer:
          sale.customer && typeof sale.customer === "object"
            ? sale.customer._id
            : sale.customer || undefined,
        items: (sale.items || []).map((i: any) => ({
          ...i,
          product:
            i.product && typeof i.product === "object"
              ? i.product._id
              : i.product || undefined,
          unit:
            i.unit && typeof i.unit === "object"
              ? i.unit._id
              : i.unit || undefined,
        })),
      });
    } else {
      setEditingSale(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  /* ================= CALCULATIONS ================= */
  const calculateGrandTotal = (items: any[]) => {
    const grandTotal = (items || []).reduce(
      (sum, item) => sum + (item?.total || 0),
      0
    );
    form.setFieldsValue({ grandTotal });
  };

  const calculateItemTotal = (index: number) => {
    const items = form.getFieldValue("items") || [];
    const item = items[index];
    if (item?.quantity && item?.sellingPrice) {
      item.total = item.quantity * item.sellingPrice;
      items[index] = item;
      form.setFieldsValue({ items });
      calculateGrandTotal(items);
    }
  };

  /* ================= SAVE ================= */
  const handleSave = async (values: SalePayload) => {
    try {
      if (editingSale) {
        await updateMutation.mutateAsync({
          id: editingSale._id,
          data: values,
        });
        message.success("Sale updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        message.success("Sale created successfully");
      }
      setModalVisible(false);
      form.resetFields();
    } catch {
      message.error("Error saving sale");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Sale deleted successfully");
    } catch {
      message.error("Error deleting sale");
    }
  };

  /* ================= TABLE (NULL SAFE) ================= */
  const columns = [
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (c: any) => {
        if (!c) return "-";
        if (typeof c === "object") return c.name || "-";
        return c;
      },
    },
    {
      title: "Items",
      key: "items",
      render: (_: any, record: Sale) => record.items?.length || 0,
    },
    {
      title: "Grand Total",
      dataIndex: "grandTotal",
      key: "grandTotal",
    },
    {
      title: "Actions",
      key: "action",
      render: (_: any, record: Sale) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal(record)}
            className="px-3 py-1 bg-[#00264d] text-white rounded"
          >
            Edit
          </button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._id)}
          >
            <button className="px-3 py-1 bg-red-600 text-white rounded">
              Delete
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Sales</h2>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-[#00264d] text-white rounded"
        >
          Add Sale
        </button>
      </div>

      <Table
        rowKey="_id"
        loading={isLoading}
        dataSource={sales}
        columns={columns}
        bordered
      />

      <Modal
        open={modalVisible}
        title={editingSale ? "Edit Sale" : "Add Sale"}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingSale(null);
        }}
        onOk={() => form.submit()}
        width={900}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          {/* CUSTOMER */}
          <Form.Item name="customer" label="Customer" rules={[{ required: true }]}>
            <Select
              placeholder="Select customer"
              options={customers.map((c: any) => ({
                label: c.name,
                value: c._id,
              }))}
            />
          </Form.Item>

          {/* ITEMS */}
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ name }) => (
                  <div key={name} className="border p-3 mb-3 rounded">
                    <div className="grid grid-cols-2 gap-3">
                      <Form.Item name={[name, "product"]} label="Product" rules={[{ required: true }]}>
                        <Select
                          options={products.map((p: any) => ({
                            label: p.name,
                            value: p._id,
                          }))}
                        />
                      </Form.Item>

                      <Form.Item name={[name, "unit"]} label="Unit" rules={[{ required: true }]}>
                        <Select
                          options={units.map((u: any) => ({
                            label: u.name,
                            value: u._id,
                          }))}
                        />
                      </Form.Item>

                      <Form.Item name={[name, "quantity"]} label="Quantity" rules={[{ required: true }]}>
                        <InputNumber
                          className="w-full"
                          min={1}
                          onChange={() => calculateItemTotal(name)}
                        />
                      </Form.Item>

                      <Form.Item name={[name, "sellingPrice"]} label="Selling Price" rules={[{ required: true }]}>
                        <InputNumber
                          className="w-full"
                          min={0}
                          onChange={() => calculateItemTotal(name)}
                        />
                      </Form.Item>

                      <Form.Item name={[name, "total"]} label="Total">
                        <InputNumber className="w-full" disabled />
                      </Form.Item>
                    </div>

                    <button
                      type="button"
                      className="text-red-600 mt-2"
                      onClick={() => {
                        remove(name);
                        calculateGrandTotal(form.getFieldValue("items") || []);
                      }}
                    >
                      Remove Item
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => add()}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Add Item
                </button>
              </>
            )}
          </Form.List>

          {/* GRAND TOTAL */}
          <Form.Item name="grandTotal" label="Grand Total">
            <InputNumber className="w-full" disabled />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SalesPage;