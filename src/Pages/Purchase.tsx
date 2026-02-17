import React, { useState } from "react";
import {
  Table,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
  Button,
  Popconfirm,
} from "antd";

import {
  useGetPurchases,
  useCreatePurchase,
  useUpdatePurchase,
  useDeletePurchase,
} from "../Utils/purchaseAPI";
import type { Purchase,
  PurchasePayload,} from "../Utils/purchaseAPI"

import { useGetVendors } from "../Utils/vendorApi";
import { useGetProducts } from "../Utils/productApi";

const PurchasePage: React.FC = () => {
  const { data: purchases = [], isLoading } = useGetPurchases();
  const { data: vendors = [] } = useGetVendors();
  const { data: products = [] } = useGetProducts();

  const createMutation = useCreatePurchase();
  const updateMutation = useUpdatePurchase();
  const deleteMutation = useDeletePurchase();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);

  const [form] = Form.useForm();

  /* ================= OPEN MODAL ================= */

  const openModal = (purchase?: Purchase) => {
    if (purchase) {
      setEditingPurchase(purchase);
      form.setFieldsValue({
        ...purchase,
        vendor: purchase.vendor?._id,
        items: purchase.items.map((item) => ({
          ...item,
          product: item.product?._id,
        })),
      });
    } else {
      setEditingPurchase(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  /* ================= SAVE ================= */

  const handleSave = async (values: any) => {
    try {
      const items = values.items.map((item: any) => ({
        ...item,
        total: item.quantity * item.costPrice,
      }));

      const grandTotal = items.reduce(
        (sum: number, item: any) => sum + item.total,
        0,
      );

      const payload: PurchasePayload = {
        vendor: values.vendor,
        items,
        grandTotal,
      };

      if (editingPurchase) {
        await updateMutation.mutateAsync({
          id: editingPurchase._id,
          data: payload,
        });
        message.success("Purchase updated");
      } else {
        await createMutation.mutateAsync(payload);
        message.success("Purchase created");
      }

      setModalVisible(false);
      form.resetFields();
    } catch {
      message.error("Error saving purchase");
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Deleted successfully");
    } catch {
      message.error("Delete failed");
    }
  };

  /* ================= TABLE COLUMNS ================= */

  const columns = [
    {
      title: "Vendor",
      dataIndex: ["vendor", "name"],
    },
    {
      title: "Grand Total",
      dataIndex: "grandTotal",
      render: (val: number) => `₹${val}`,
    },
    {
      title: "Actions",
      render: (_: any, record: Purchase) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal(record)}
            className="px-3 py-1 text-sm rounded bg-[#00264d] hover:bg-[#001a33] text-white"
          >
            Edit
          </button>

          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._id)}
          >
            <button className="px-3 py-1 text-sm rounded bg-red-600 hover:bg-red-700 text-white">
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
        <h2>Purchases</h2>
        <Button type="primary" onClick={() => openModal()}>
          Add Purchase
        </Button>
      </div>

      <Table
        dataSource={purchases}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        bordered
        className="erp-table"
        expandable={{
          expandedRowRender: (record: Purchase) => (
            <Table
              dataSource={record.items}
              pagination={false}
              rowKey={(item) => item.product?._id}
              bordered
              className="erp-table"
              columns={[
                {
                  title: "Product",
                  dataIndex: ["product", "name"],
                },
                {
                  title: "Quantity",
                  dataIndex: "quantity",
                },
                {
                  title: "Cost Price",
                  dataIndex: "costPrice",
                  render: (v: number) => `₹${v}`,
                },
                {
                  title: "Selling Price",
                  dataIndex: "sellingPrice",
                  render: (v: number) => `₹${v}`,
                },
                {
                  title: "Line Total",
                  dataIndex: "total",
                  render: (v: number) => `₹${v}`,
                },
              ]}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4}>
                    <strong>Grand Total</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    <strong>₹{record.grandTotal}</strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          ),
        }}
      />

      {/* ================= MODAL ================= */}

      <Modal
        title={editingPurchase ? "Edit Purchase" : "Add Purchase"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={900}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label="Vendor" name="vendor" rules={[{ required: true }]}>
            <Select placeholder="Select Vendor">
              {vendors.map((v: any) => (
                <Select.Option key={v._id} value={v._id}>
                  {v.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="grid grid-cols-5 gap-2 mb-3">
                    <Form.Item
                      {...restField}
                      name={[name, "product"]}
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Product">
                        {products.map((p: any) => (
                          <Select.Option key={p._id} value={p._id}>
                            {p.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Qty"
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "costPrice"]}
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Cost"
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "sellingPrice"]}
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Selling"
                      />
                    </Form.Item>

                    <Button danger onClick={() => remove(name)}>
                      Remove
                    </Button>
                  </div>
                ))}

                <Button type="dashed" onClick={() => add()} block>
                  + Add Item
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
};

export default PurchasePage;
