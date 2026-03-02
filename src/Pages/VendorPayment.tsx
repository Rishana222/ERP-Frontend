import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
} from "antd";
import moment from "moment";
import type { Moment } from "moment";

import { useGetVendors } from "../Utils/vendorApi";
import {
  useCreateVendorPayment,
  useGetVendorPayments,
} from "../Utils/VendorpaymentAPI";
import type { VendorPaymentPayload, VendorPayment } from "../Utils/VendorpaymentAPI";

const { Option } = Select;

const VendorPayments = () => {
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Get vendors
  const { data: vendors = [] } = useGetVendors();

  // Get payments for selected vendor
  const { data: paymentsData = [], refetch } = useGetVendorPayments(
    selectedVendor || ""
  );

  // Create payment mutation
  const { mutate: addPayment, isLoading } = useCreateVendorPayment();

  const openModal = (vendorId: string) => {
    setSelectedVendor(vendorId);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedVendor) return;

      const payload: VendorPaymentPayload = {
        vendor: selectedVendor,
        amount: Number(values.amount),
        paymentDate: (values.paymentDate as Moment).format("YYYY-MM-DD"),
        note: values.note || "",
        account: values.account,
      };

      addPayment(payload, {
        onSuccess: () => {
          message.success("Payment added successfully");
          setIsModalOpen(false);
          refetch();
        },
        onError: (err: any) => {
          message.error(err.response?.data?.message || "Failed to add payment");
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Vendor table columns
  const vendorColumns = [
    { title: "Name", dataIndex: "name" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Email", dataIndex: "email" },
    { title: "GST", dataIndex: "gstNumber" },
    {
      title: "Paid Amount",
      render: (_: any, record: any) => {
        const totalPaid =
          paymentsData
            .filter((p: VendorPayment) => p.vendor === record._id)
            .reduce((sum, p) => sum + p.amount, 0) || 0;
        return `₹${totalPaid}`;
      },
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Button type="primary" onClick={() => openModal(record._id)}>
          Add Payment
        </Button>
      ),
    },
  ];

  // Payment table columns
  const paymentColumns = [
    {
      title: "Date",
      dataIndex: "paymentDate",
      render: (date: string) => moment(date).format("DD-MM-YYYY"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amt: number) => `₹${amt}`,
    },
    { title: "Mode", dataIndex: "paymentMode" },
    { title: "Note", dataIndex: "note" },
  ];

  // Get remaining vendor balance
  const getRemainingBalance = () => {
    if (!selectedVendor) return 0;
    const vendor = vendors.find((v) => v._id === selectedVendor);
    if (!vendor) return 0;
    const totalPaid =
      paymentsData
        .filter((p) => p.vendor === selectedVendor)
        .reduce((sum, p) => sum + p.amount, 0) || 0;
    return vendor.balance - totalPaid;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Vendor Payments</h2>

      <Table
        rowKey="_id"
        dataSource={vendors}
        columns={vendorColumns}
        bordered
        className="erp-table"
        pagination={false}
        style={{ marginBottom: 20 }}
      />

      {selectedVendor && (
        <>
          <h3 style={{ marginTop: 20 }} className="text-xl font-semibold">
            Payments for {vendors.find((v) => v._id === selectedVendor)?.name}
          </h3>

          <Table
            rowKey="_id"
            dataSource={paymentsData}
            columns={paymentColumns}
            bordered
            className="erp-table"
            pagination={false}
          />
        </>
      )}

      <Modal
        title="Add Vendor Payment"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        confirmLoading={isLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: "Enter amount" },
              {
                validator: (_, value) => {
                  const remaining = getRemainingBalance();
                  if (value > remaining) {
                    return Promise.reject(
                      `Cannot pay more than vendor balance ₹${remaining}`
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Payment Date"
            name="paymentDate"
            rules={[{ required: true }]}
            initialValue={moment()}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Account"
            name="account"
            rules={[{ required: true, message: "Account is required" }]}
          >
            <Select placeholder="Select account">
              <Option value="69a3fd27889e8eb025fe3752">Cash Account</Option>
              <Option value="69a3fd2e889e8eb025fe3755">Bank Account</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Note" name="note">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VendorPayments;