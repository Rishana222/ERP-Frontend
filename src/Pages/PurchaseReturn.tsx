import { Table, Button, Modal, Form, Select, InputNumber, message } from "antd";
import { useState, useEffect, useMemo } from "react";
import {
  useGetPurchaseReturns,
  useCreatePurchaseReturn,
} from "../Utils/PurchaseReturnAPI";
import { useGetPurchases } from "../Utils/purchaseAPI";

const { Option } = Select;

function PurchaseReturnPage() {
  const { data: returnsData = [], isLoading } = useGetPurchaseReturns();
  const { data: purchases = [] } = useGetPurchases();
  const createPurchaseReturn = useCreatePurchaseReturn();

  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedPurchase) {
      const purchase = purchases.find((p) => p._id === selectedPurchase);
      if (purchase) {
        setItems(
          purchase.items.map((i) => ({
            product: i.product.name,
            productId: i.product._id,
            qty: 0,
            costPrice: i.costPrice,
            total: 0,
          })),
        );
      }
    } else {
      setItems([]);
    }
  }, [selectedPurchase, purchases]);

  const grandTotal = useMemo(() => {
    return items.reduce((sum, i) => sum + (i.total || 0), 0);
  }, [items]);

  const handleView = (record: any) => {
    setSelectedReturn(record);
    setIsViewModalOpen(true);
  };

  const handleSaveReturn = () => {
    if (!selectedPurchase) {
      message.error("Please select a purchase");
      return;
    }

    const payload = {
      purchase: selectedPurchase, 
      items: items
        .filter((i) => i.qty > 0)
        .map((i) => ({ product: i.productId, quantity: i.qty })),
      note: form.getFieldValue("note") || "",
    };

    if (!payload.items.length) {
      message.error("Please enter quantity for at least one product");
      return;
    }

    createPurchaseReturn.mutate(payload,  {
      onSuccess: () => {
        message.success("Purchase Return added successfully!");
        setIsAddModalOpen(false);
        setSelectedPurchase(null);
        setItems([]);
        form.resetFields();
      },
      onError: (err: any) =>
        message.error(err.message || "Failed to add return"),
    });
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("en-IN") : "-",
    },
    {
      title: "Return ID",
      dataIndex: "_id",
      render: (id: any) =>
        typeof id === "string"
          ? id.slice(-6).toUpperCase()
          : id?._id?.slice(-6).toUpperCase() || "-",
    },
    {
      title: "Purchase ID ",
      dataIndex: "purchase",
      render: (purchase: any) =>
        typeof purchase === "string"
          ? purchase.slice(-6).toUpperCase()
          : purchase?._id?.slice(-6).toUpperCase() || "-",
    },
    {
      title: "Vendor",
      render: (_: any, record: any) =>
        typeof record.vendor === "string"
          ? record.vendor
          : record.vendor?.name || "-",
    },
    {
      title: "Total Qty",
      render: (_: any, record: any) =>
        record?.items?.reduce(
          (sum: number, item: any) => sum + (item.quantity || 0),
          0,
        ) || 0,
    },
    {
      title: "Grand Total",
      dataIndex: "grandTotal",
      render: (amount: number) => `₹ ${amount?.toLocaleString("en-IN") || 0}`,
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleView(record)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <>
     
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Purchase Returns</h2>
        <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
          Add Purchase Return
        </Button>
      </div>

    
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={Array.isArray(returnsData) ? returnsData : []}
        loading={isLoading}
        bordered
         className="erp-table"
      />

      <Modal
        title="Purchase Return Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={900}
      >
        {selectedReturn && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded border">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Return No:</strong>{" "}
                  {selectedReturn._id?.slice(-6).toUpperCase()}
                </p>
                <p>
                  <strong>Purchase No:</strong>{" "}
                  {typeof selectedReturn.purchase === "string"
                    ? selectedReturn.purchase.slice(-6).toUpperCase()
                    : selectedReturn.purchase?._id?.slice(-6).toUpperCase()}
                </p>
                <p>
                  <strong>Vendor:</strong>{" "}
                  {typeof selectedReturn.vendor === "string"
                    ? selectedReturn.vendor
                    : selectedReturn.vendor?.name}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {selectedReturn.createdAt
                    ? new Date(selectedReturn.createdAt).toLocaleDateString(
                        "en-IN",
                      )
                    : "-"}
                </p>
                <p className="col-span-2">
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
              columns={[
                {
                  title: "Product",
                  render: (_: any, item: any) =>
                    typeof item.product === "string"
                      ? item.product
                      : item.product?.name || "-",
                },
                { title: "Quantity", dataIndex: "quantity" },
                {
                  title: "Cost Price",
                  dataIndex: "costPrice",
                  render: (price: number) =>
                    `₹ ${price?.toLocaleString("en-IN") || 0}`,
                },
                {
                  title: "Total",
                  dataIndex: "total",
                  render: (total: number) =>
                    `₹ ${total?.toLocaleString("en-IN") || 0}`,
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

     
      <Modal
        title="Add Purchase Return"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width={800}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Select Purchase"
            name="purchase"
            rules={[{ required: true, message: "Please select a purchase" }]}
          >
            <Select
              placeholder="Select purchase"
              onChange={(val) => setSelectedPurchase(val)}
            >
              {purchases.map((p) => (
                <Option key={p._id} value={p._id}>
                  {p.ref} - {p.vendor.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {items.length > 0 && (
            <Table
              rowKey="productId"
              pagination={false}
              dataSource={items}
              columns={[
                { title: "Product", dataIndex: "product" },
                {
                  title: "Quantity",
                  render: (_: any, record: any, idx: number) => (
                    <InputNumber
                      min={0}
                      value={record.qty}
                      onChange={(val) => {
                        const newItems = [...items];
                        newItems[idx].qty = val || 0;
                        newItems[idx].total =
                          newItems[idx].qty * newItems[idx].costPrice;
                        setItems(newItems);
                      }}
                    />
                  ),
                },
                {
                  title: "Cost Price",
                  dataIndex: "costPrice",
                  render: (val: number) =>
                    `₹ ${val?.toLocaleString("en-IN") || 0}`,
                },
                {
                  title: "Total",
                  dataIndex: "total",
                  render: (val: number) =>
                    `₹ ${val?.toLocaleString("en-IN") || 0}`,
                },
              ]}
            />
          )}

          <div className="flex justify-between mt-4 items-center">
            <div>
              <strong>
                Grand Total: ₹ {grandTotal.toLocaleString("en-IN")}
              </strong>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={handleSaveReturn}>
                Save Return
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default PurchaseReturnPage;
