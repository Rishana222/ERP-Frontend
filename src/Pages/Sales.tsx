import React, { useState } from "react";
import {
  Table,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Button,
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

  const openModal = (sale?: Sale) => {
    if (sale) {
      setEditingSale(sale);
      form.setFieldsValue({
        customer:
          typeof sale.customer === "object" ? sale.customer._id : sale.customer,
        items: sale.items?.map((i: any) => ({
          product: typeof i.product === "object" ? i.product._id : i.product,
          unit: typeof i.unit === "object" ? i.unit._id : i.unit,
          quantity: i.quantity,
          sellingPrice: i.sellingPrice,
          total: i.total,
        })),
        grandTotal: sale.grandTotal,
      });
    } else {
      setEditingSale(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const calculateTotals = () => {
    const items = form.getFieldValue("items") || [];
    const grandTotal = items.reduce(
      (sum: number, i: any) => sum + (i?.total || 0),
      0,
    );
    form.setFieldsValue({ grandTotal });
  };

  const onItemChange = (index: number) => {
    const items = form.getFieldValue("items") || [];
    const item = items[index];
    if (item?.quantity && item?.sellingPrice) {
      item.total = item.quantity * item.sellingPrice;
      items[index] = item;
      form.setFieldsValue({ items });
      calculateTotals();
    }
  };

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

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Sale deleted successfully");
    } catch {
      message.error("Error deleting sale");
    }
  };

  // Prepare table data
  const dataSource = sales.map((sale) => ({
    key: sale._id,
    customerName: typeof sale.customer === "object" ? sale.customer?.name : "-",
    productSummary:
      sale.items && sale.items.length > 0
        ? sale.items
            .map(
              (item: any) =>
                `${item.product?.name || "-"} (${item.quantity} ${
                  item.unit?.name || "pcs"
                })`,
            )
            .join(", ")
        : "-",
    sellingPriceSummary:
      sale.items && sale.items.length > 0
        ? sale.items.map((item: any) => `₹${item.sellingPrice ?? 0}`).join(", ")
        : "-",
    grandTotal: sale.grandTotal,
    fullSale: sale,
  }));

  const columns = [
    { title: "Customer", dataIndex: "customerName" },
    { title: "Products (Unit)", dataIndex: "productSummary" },
    { title: "Selling Price", dataIndex: "sellingPriceSummary" },
    {
      title: "Grand Total",
      dataIndex: "grandTotal",
      render: (val: number) => `₹${val.toLocaleString()}`,
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal(record.fullSale)}
            className="px-3 py-1 text-sm rounded bg-[#00264d] hover:bg-[#001a33] text-white"
          >
            Edit
          </button>

          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record.fullSale._id)}
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
        <h2 className="text-xl font-semibold">Sales</h2>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 rounded bg-[#00264d] text-white"
        >
          Add Sale
        </button>
      </div>

      <Table
        rowKey="key"
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        bordered
        className="erp-table"
      />

      <Modal
        open={modalVisible}
        title={editingSale ? "Edit Sale" : "Add Sale"}
        footer={null}
        width={900}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingSale(null);
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="customer"
            label="Customer"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select customer"
              options={customers.map((c: any) => ({
                label: c.name,
                value: c._id,
              }))}
            />
          </Form.Item>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ name }) => (
                  <div key={name} className="border p-4 mb-3 rounded">
                    <div className="grid grid-cols-2 gap-3">
                      <Form.Item
                        name={[name, "product"]}
                        label="Product"
                        rules={[{ required: true }]}
                      >
                        <Select
                          options={products.map((p: any) => ({
                            label: p.name,
                            value: p._id,
                          }))}
                        />
                      </Form.Item>

                      <Form.Item
                        name={[name, "unit"]}
                        label="Unit"
                        rules={[{ required: true }]}
                      >
                        <Select
                          options={units.map((u: any) => ({
                            label: u.name,
                            value: u._id,
                          }))}
                        />
                      </Form.Item>

                      <Form.Item
                        name={[name, "quantity"]}
                        label="Quantity"
                        rules={[{ required: true }]}
                      >
                        <InputNumber
                          className="w-full"
                          min={1}
                          onChange={() => onItemChange(name)}
                        />
                      </Form.Item>

                      <Form.Item
                        name={[name, "sellingPrice"]}
                        label="Selling Price"
                        rules={[{ required: true }]}
                      >
                        <InputNumber
                          className="w-full"
                          min={0}
                          onChange={() => onItemChange(name)}
                        />
                      </Form.Item>

                      <Form.Item name={[name, "total"]} label="Total">
                        <InputNumber className="w-full" disabled />
                      </Form.Item>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        remove(name);
                        calculateTotals();
                      }}
                      className="text-red-600 mt-2"
                    >
                      Remove Item
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => add()}
                  className="px-4 py-1.5 bg-[#00264d] text-white rounded"
                >
                  Add Item
                </button>
              </>
            )}
          </Form.List>

          <Form.Item name="grandTotal" label="Grand Total">
            <InputNumber className="w-full" disabled />
          </Form.Item>

          <div className="flex justify-end gap-3 border-t pt-4 mt-6">
            <button
              type="button"
              onClick={() => {
                setModalVisible(false);
                form.resetFields();
                setEditingSale(null);
              }}
              className="px-5 py-2 border border-[#00264d] text-[#00264d] rounded hover:bg-[#00264d] hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-[#00264d] text-white rounded hover:bg-[#001a33]"
            >
              {editingSale ? "Update Sale" : "Save Sale"}
            </button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default SalesPage;
