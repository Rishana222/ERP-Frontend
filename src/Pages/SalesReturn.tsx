import { Table, Button, Modal, Form, Select, InputNumber, message } from "antd";
import { useState, useEffect, useMemo } from "react";
import {
  useGetSaleReturns,
  useCreateSaleReturn,
} from "../Utils/salesReturnAPI";
import { useGetSales } from "../Utils/salesAPI";

const { Option } = Select;

function SaleReturnPage() {
  const { data: returnsData = [], isLoading } = useGetSaleReturns();
  const { data: sales = [] } = useGetSales();
  const createSaleReturn = useCreateSaleReturn();

  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!selectedSale) {
      setItems([]);
      return;
    }

    const sale = sales.find((s: any) => s?._id === selectedSale);

    if (!sale || !Array.isArray(sale.items)) {
      setItems([]);
      return;
    }

    setItems(
      sale.items
        .filter((i: any) => i?.product)
        .map((i: any) => ({
          product: i.product?.name ?? "Unknown Product",
          productId: i.product?._id ?? null,
          qty: 0,
          sellingPrice: i.sellingPrice ?? 0,
          total: 0,
        }))
    );
  }, [selectedSale, sales]);

  const grandTotal = useMemo(
    () => items.reduce((sum, i) => sum + (i.total || 0), 0),
    [items]
  );

  const handleView = (record: any) => {
    setSelectedReturn(record);
    setIsViewModalOpen(true);
  };

  const handleSaveReturn = () => {
    if (!selectedSale) {
      message.error("Please select a sale");
      return;
    }

    const sale = sales.find((s: any) => s?._id === selectedSale);

    const payload = {
      sale: selectedSale,
      customer:
        typeof sale?.customer === "object"
          ? sale.customer?._id
          : sale?.customer,
      items: items
        .filter((i) => i.qty > 0 && i.productId)
        .map((i) => ({
          product: i.productId,
          quantity: i.qty,
          sellingPrice: i.sellingPrice,
          total: i.qty * i.sellingPrice,
        })),
      grandTotal,
      note: form.getFieldValue("note") || "",
    };

    if (!payload.items.length) {
      message.error("Please enter quantity for at least one product");
      return;
    }

    createSaleReturn.mutate(payload, {
      onSuccess: () => {
        message.success("Sale Return added successfully");
        setIsAddModalOpen(false);
        setSelectedSale(null);
        setItems([]);
        form.resetFields();
      },
      onError: (err: any) =>
        message.error(err?.message || "Failed to add sale return"),
    });
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (d: string) =>
        d ? new Date(d).toLocaleDateString("en-IN") : "-",
    },
    {
      title: "Return ID",
      dataIndex: "_id",
      render: (id: string) => id?.slice(-6).toUpperCase(),
    },
    {
      title: "Sale",
      dataIndex: "sale",
      render: (s: any) =>
        typeof s === "object"
          ? s?.ref ?? s?._id?.slice(-6).toUpperCase() ?? "-"
          : "-",
    },
    {
      title: "Customer",
      render: (_: any, r: any) =>
        typeof r.customer === "object" ? r.customer?.name ?? "-" : "-",
    },
    {
      title: "Total Qty",
      render: (_: any, r: any) =>
        r?.items?.reduce(
          (sum: number, i: any) => sum + (i?.quantity || 0),
          0
        ) || 0,
    },
    {
      title: "Grand Total",
      dataIndex: "grandTotal",
      render: (v: number) => `₹ ${v?.toLocaleString("en-IN") || 0}`,
    },
    {
      title: "Action",
      render: (_: any, r: any) => (
        <Button type="link" onClick={() => handleView(r)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      {/* Responsive Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold">Sale Returns</h2>
        <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
          Add Sale Return
        </Button>
      </div>

      {/* Responsive Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={Array.isArray(returnsData) ? returnsData : []}
        loading={isLoading}
        bordered
        className="erp-table"
        scroll={{ x: "max-content" }}
      />

      {/* View Modal */}
      <Modal
        title="Sale Return Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width="95%"
        style={{ maxWidth: 1000 }}
      >
        {selectedReturn && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Return No:</strong>{" "}
                  {selectedReturn._id?.slice(-6).toUpperCase()}
                </p>
                <p>
                  <strong>Sale No:</strong>{" "}
                  {selectedReturn.sale?.ref ??
                    selectedReturn.sale?._id?.slice(-6).toUpperCase() ??
                    "-"}
                </p>
                <p>
                  <strong>Customer:</strong>{" "}
                  {selectedReturn.customer?.name ?? "-"}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {selectedReturn.createdAt
                    ? new Date(
                        selectedReturn.createdAt
                      ).toLocaleDateString("en-IN")
                    : "-"}
                </p>
                <p className="sm:col-span-2">
                  <strong>Note:</strong> {selectedReturn.note || "-"}
                </p>
              </div>
            </div>

            <Table
              rowKey="_id"
              pagination={false}
              dataSource={selectedReturn.items || []}
              bordered
              className="erp-table"
              scroll={{ x: "max-content" }}
              columns={[
                {
                  title: "Product",
                  render: (_: any, i: any) => i.product?.name ?? "-",
                },
                { title: "Quantity", dataIndex: "quantity" },
                {
                  title: "Price",
                  dataIndex: "sellingPrice",
                  render: (p: number) =>
                    `₹ ${p?.toLocaleString("en-IN") || 0}`,
                },
                {
                  title: "Total",
                  dataIndex: "total",
                  render: (t: number) =>
                    `₹ ${t?.toLocaleString("en-IN") || 0}`,
                },
              ]}
            />

            <div className="flex justify-end">
              <div className="bg-blue-50 px-6 py-3 rounded border text-right">
                <h3 className="text-lg font-semibold">
                  Grand Total: ₹{" "}
                  {selectedReturn.grandTotal?.toLocaleString("en-IN") || 0}
                </h3>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Modal */}
      <Modal
        title="Add Sale Return"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width="95%"
        style={{ maxWidth: 900 }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Select Sale"
            rules={[{ required: true, message: "Please select a sale" }]}
          >
            <Select
              placeholder="Select sale"
              onChange={(val) => setSelectedSale(val)}
            >
              {sales.map((s: any) => (
                <Option key={s._id} value={s._id}>
                  {typeof s.customer === "object"
                    ? s.customer?.name
                    : "Unnamed Sale"}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {items.length > 0 && (
            <Table
              rowKey="productId"
              pagination={false}
              dataSource={items}
              bordered
              scroll={{ x: "max-content" }}
              columns={[
                { title: "Product", dataIndex: "product" },
                {
                  title: "Quantity",
                  render: (_: any, r: any, idx: number) => (
                    <InputNumber
                      min={0}
                      value={r.qty}
                      onChange={(val) => {
                        const copy = [...items];
                        copy[idx].qty = val || 0;
                        copy[idx].total =
                          copy[idx].qty * copy[idx].sellingPrice;
                        setItems(copy);
                      }}
                    />
                  ),
                },
                {
                  title: "Price",
                  dataIndex: "sellingPrice",
                  render: (p: number) =>
                    `₹ ${p?.toLocaleString("en-IN") || 0}`,
                },
                {
                  title: "Total",
                  dataIndex: "total",
                  render: (t: number) =>
                    `₹ ${t?.toLocaleString("en-IN") || 0}`,
                },
              ]}
            />
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4">
            <strong>
              Grand Total: ₹ {grandTotal.toLocaleString("en-IN")}
            </strong>
            <Button type="primary" onClick={handleSaveReturn}>
              Save Return
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default SaleReturnPage;