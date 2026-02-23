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
import type { Purchase, PurchasePayload } from "../Utils/purchaseAPI";

import { useGetVendors } from "../Utils/vendorApi";
import { useGetProducts } from "../Utils/productApi";
import { useGetUnits } from "../Utils/UnitAPI"; // Dynamic units

const PurchasePage: React.FC = () => {
  const { data: purchases = [], isLoading } = useGetPurchases();
  const { data: vendors = [] } = useGetVendors();
  const { data: products = [] } = useGetProducts();
  const { data: units = [] } = useGetUnits();

  const createMutation = useCreatePurchase();
  const updateMutation = useUpdatePurchase();
  const deleteMutation = useDeletePurchase();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [form] = Form.useForm();

 
  const openModal = (purchase?: Purchase) => {
    if (purchase) {
      setEditingPurchase(purchase);
      form.setFieldsValue({
        vendor: purchase.vendor?._id,
        items: purchase.items.map((item) => ({
          product: item.product?._id,
          unit: item.unit?._id, 
          quantity: item.quantity,
          costPrice: item.costPrice,
          sellingPrice: item.sellingPrice,
        })),
      });
    } else {
      setEditingPurchase(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  
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
    } catch (err) {
      console.error(err);
      message.error("Error saving purchase");
    }
  };


  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Deleted successfully");
    } catch {
      message.error("Delete failed");
    }
  };


  const dataSource = purchases.map((purchase: any) => ({
    key: purchase._id,
    vendorName: purchase.vendor?.name,
    productSummary: purchase.items
      .map(
        (item: any) =>
          `${item.product?.name} (${item.quantity} ${item.unit?.name || "pcs"})`,
      )
      .join(", "),
    costPriceSummary: purchase.items
      .map((item: any) => item.costPrice ?? 0)
      .join(", "),
    sellingPriceSummary: purchase.items
      .map((item: any) => item.sellingPrice ?? 0)
      .join(", "),
    lineTotal: purchase.items.reduce(
      (sum: number, item: any) => sum + (item.quantity * item.costPrice || 0),
      0,
    ),
    fullPurchase: purchase,
  }));


  const columns = [
    { title: "Vendor", dataIndex: "vendorName" },
    { title: "Products", dataIndex: "productSummary" },
    {
      title: "Cost Price",
      dataIndex: "costPriceSummary",
      render: (val: any) => `₹${val}`,
    },
    {
      title: "Selling Price",
      dataIndex: "sellingPriceSummary",
      render: (val: any) => `₹${val}`,
    },
    {
      title: "Line Total",
      dataIndex: "lineTotal",
      render: (val: number) => `₹${val}`,
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal(record.fullPurchase)}
            className="px-3 py-1 text-sm rounded bg-[#00264d] hover:bg-[#001a33] text-white"
          >
            Edit
          </button>

          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record.fullPurchase._id)}
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
        <h2 className="text-xl font-semibold">Purchases</h2>
        <Button type="primary" onClick={() => openModal()}>
          Add Purchase
        </Button>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(record) => record.key}
        loading={isLoading}
        bordered
        className="erp-table"
      />

   
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
                  <div key={key} className="grid grid-cols-6 gap-2 mb-3">
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
                      name={[name, "unit"]}
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Unit">
                        {units.map((u: any) => (
                          <Select.Option key={u._id} value={u._id}>
                            {u.name}
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
                        placeholder="Cost Price"
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "sellingPrice"]}
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Selling Price"
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
