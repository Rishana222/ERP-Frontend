import { useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, Select, message } from "antd";
import moment from "moment";
import type { Moment } from "moment";
import { useGetVendors } from "../Utils/vendorApi";
import {
  useCreateVendorPayment,
  useGetVendorPayments,

} from "../Utils/VendorpaymentAPI";
import type { VendorPaymentPayload ,} from "../Utils/VendorpaymentAPI";
const { Option } = Select;

const VendorPayments = () => {
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  
  const { data: vendors } = useGetVendors();

  
  const { data: paymentsData = [], refetch } = useGetVendorPayments(selectedVendor || "");

  
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
        paymentMode: values.paymentMode,
        note: values.note || "",
      };

      addPayment(payload, {
        onSuccess: () => {
          message.success("Payment added!");
          setIsModalOpen(false);
          refetch();
        },
        onError: () => {
          message.error("Failed to add payment");
        },
      });
    } catch (err) {
      console.log("Validation Failed:", err);
    }
  };

  
  const vendorColumns = [
    { title: "Name", dataIndex: "name" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Email", dataIndex: "email" },
    { title: "GST", dataIndex: "gstNumber" },
    {
  title: "Paid Amount",
  dataIndex: "paidAmount",
  render: (_: any, record: any) => {
    const totalPaid = paymentsData?.data
      ?.filter((p: any) => p.vendor === record._id)
      .reduce((sum: number, p: any) => sum + p.amount, 0) || 0;

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

  
  const paymentColumns = [
    {
      title: "Date",
      dataIndex: "paymentDate",
      render: (date: string) => moment(date).format("DD-MM-YYYY"),
    },
    { title: "Amount", dataIndex: "amount", render: (amt: number) => `₹${amt}` },
    { title: "Mode", dataIndex: "paymentMode" },
    { title: "Note", dataIndex: "note" },
  ];

  return (
    <div>
      <h2>Vendor Payments</h2>

      
      <Table
        rowKey="_id"
        dataSource={vendors || []}
        columns={vendorColumns}
        pagination={false}
        bordered
        className="erp-table"
        style={{ marginBottom: 20 }}
      />

    
      {selectedVendor && (
        <>
          <h3 style={{ marginTop: 20 }}>
            Payments for {vendors?.find((v) => v._id === selectedVendor)?.name}
          </h3>
          <Table
            rowKey="_id"
            dataSource={paymentsData || []}
            columns={paymentColumns}
            bordered
            className="erp-table"
            pagination={false}
          />
        </>
      )}

      
      <Modal
        title={`Add Payment for ${vendors?.find((v) => v._id === selectedVendor)?.name}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        confirmLoading={isLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please enter amount" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Payment Date"
            name="paymentDate"
            rules={[{ required: true, message: "Please select date" }]}
            initialValue={moment()}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Payment Mode"
            name="paymentMode"
            rules={[{ required: true, message: "Please select mode" }]}
          >
            <Select>
              <Option value="Cash">Cash</Option>
              <Option value="Bank">Bank</Option>
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