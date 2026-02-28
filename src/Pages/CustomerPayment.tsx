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
  Spin,
} from "antd";
import moment, { Moment } from "moment";

import { useGetCustomers } from "../Utils/customerApi";
import {
  useCreateCustomerPayment,
  useGetCustomerPayments,
} from "../Utils/customerPaymentApi";
import { useGetCustomerAccount } from "../Utils/customerAccountApi";

const { Option } = Select;

const CustomerPayments = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  /* ================= APIs ================= */
  const { data: customers = [], isLoading: loadingCustomers } =
    useGetCustomers();
  const { data: paymentsData = [], refetch: refetchPayments } =
    useGetCustomerPayments(selectedCustomer || "");
  const { data: account, isLoading: loadingAccount } = useGetCustomerAccount(
    selectedCustomer || "",
  );
  const { mutate: addPayment, isLoading: savingPayment } =
    useCreateCustomerPayment();

  /* ================= MODAL HANDLERS ================= */
  const openModal = (customerId: string) => {
    setSelectedCustomer(customerId);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedCustomer) return;

      const payload = {
        customer: selectedCustomer,
        amount: Number(values.amount),
        paymentDate: (values.paymentDate as Moment).format("YYYY-MM-DD"),
        paymentMode: values.paymentMode,
        note: values.note || "",
      };

      addPayment(payload, {
        onSuccess: (res) => {
          message.success(res.message || "Payment added successfully");
          setIsModalOpen(false);
          refetchPayments();
        },
        onError: (err: any) => {
          message.error(err?.response?.data?.message || "Payment failed");
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= TABLE COLUMNS ================= */
  const customerColumns = [
    { title: "Name", dataIndex: "name" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Due Amount",
      render: (_: any, record: any) =>
        record._id === selectedCustomer ? `₹${account?.balance || 0}` : "-",
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
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amt: number) => `₹${amt}`,
    },
    { title: "Mode", dataIndex: "paymentMode" },
    { title: "Note", dataIndex: "note" },
  ];

  /* ================= UI ================= */
  if (loadingCustomers) return <Spin tip="Loading customers..." />;

  return (
    <div>
      <h2 className="text-xl font-semibold">Customer Payments</h2>

      {/* CUSTOMER TABLE */}
      <Table
        rowKey="_id"
        dataSource={customers}
        columns={customerColumns}
        bordered
        pagination={false}
        style={{ marginBottom: 20 }}
      />

      {/* PAYMENT HISTORY */}
      {selectedCustomer && (
        <>
          <h3 style={{ marginTop: 20 }} className="text-xl font-semibold">
            Payments for{" "}
            {customers.find((c) => c._id === selectedCustomer)?.name}
          </h3>

          {loadingAccount ? (
            <Spin tip="Loading account..." />
          ) : (
            <Table
              rowKey="_id"
              dataSource={paymentsData}
              columns={paymentColumns}
              bordered
              pagination={false}
            />
          )}
        </>
      )}

      {/* ADD PAYMENT MODAL */}
      <Modal
        title="Add Customer Payment"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        confirmLoading={savingPayment}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            paymentDate: moment(),
            paymentMode: "Cash",
          }}
        >
          <Form.Item label="Due Amount">
            <Input value={`₹${account?.balance || 0}`} disabled />
          </Form.Item>

          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Enter amount" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>

          <Form.Item
            label="Payment Date"
            name="paymentDate"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Payment Mode"
            name="paymentMode"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Cash">Cash</Option>
              <Option value="Bank">Bank</Option>
              <Option value="UPI">UPI</Option>
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

export default CustomerPayments;
