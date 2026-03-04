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
import type {
  VendorPaymentPayload,
  VendorPayment,
} from "../Utils/VendorpaymentAPI";

const { Option } = Select;

const VendorPayments = () => {
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: vendors = [] } = useGetVendors();
  const { data: paymentsData = [], refetch } = useGetVendorPayments(
    selectedVendor || ""
  );

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
          message.error(
            err.response?.data?.message || "Failed to add payment"
          );
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= RESPONSIVE VENDOR TABLE ================= */

  const vendorColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      responsive: ["md"],
    },
    {
      title: "Email",
      dataIndex: "email",
      responsive: ["lg"],
    },
    {
      title: "GST",
      dataIndex: "gstNumber",
      responsive: ["lg"],
    },
    {
      title: "Paid",
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
        <Button
          type="primary"
          size="small"
          onClick={() => openModal(record._id)}
        >
          Add
        </Button>
      ),
    },
  ];

  /* ================= RESPONSIVE PAYMENT TABLE ================= */

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
    {
      title: "Mode",
      dataIndex: "paymentMode",
      responsive: ["md"],
    },
    {
      title: "Note",
      dataIndex: "note",
      responsive: ["lg"],
    },
  ];

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
    <div className="w-full overflow-x-hidden">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">
        Vendor Payments
      </h2>

      {/* Vendor Table */}
      <div className="w-full overflow-x-auto">
        <Table
          rowKey="_id"
          dataSource={vendors}
          columns={vendorColumns}
          bordered
          pagination={false}
          scroll={{ x: 600 }}
          className="erp-table"
        />
      </div>

      {/* Payments Table */}
      {selectedVendor && (
        <div className="mt-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3">
            Payments for{" "}
            {vendors.find((v) => v._id === selectedVendor)?.name}
          </h3>

          <div className="w-full overflow-x-auto">
            <Table
              rowKey="_id"
              dataSource={paymentsData}
              columns={paymentColumns}
              bordered
              pagination={false}
              scroll={{ x: 500 }}
              className="erp-table"
            />
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        title="Add Vendor Payment"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        confirmLoading={isLoading}
        width="100%"
        style={{ maxWidth: 500 }}
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
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            label="Account"
            name="account"
            rules={[{ required: true, message: "Account is required" }]}
          >
            <Select placeholder="Select account" className="w-full">
              <Option value="69a3fd27889e8eb025fe3752">
                Cash Account
              </Option>
              <Option value="69a3fd2e889e8eb025fe3755">
                Bank Account
              </Option>
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