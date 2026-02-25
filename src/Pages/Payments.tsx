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

import { useGetCustomers } from "../Utils/customerApi";
import {
  useCreateCustomerPayment,
  useGetCustomerPayments,
} from "../Utils/customerPaymentApi";
import type {
  CustomerPayment,
  CustomerPaymentPayload,
} from "../Utils/customerPaymentApi";

const { Option } = Select;

const CustomerPayments = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Customers list
  const { data: customers = [] } = useGetCustomers();

  // Payments for selected customer
  const { data: paymentsData = [], refetch } = useGetCustomerPayments(
    selectedCustomer || "",
  );

  // Create payment
  const { mutate: addPayment, isLoading } = useCreateCustomerPayment();

  const openModal = (customerId: string) => {
    setSelectedCustomer(customerId);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedCustomer) return;

      const payload: CustomerPaymentPayload = {
        customer: selectedCustomer,
        amount: Number(values.amount),
        paymentDate: (values.paymentDate as Moment).format("YYYY-MM-DD"),
        paymentMode: values.paymentMode,
        note: values.note || "",
      };

      addPayment(payload, {
        onSuccess: () => {
          message.success("Payment added successfully");
          setIsModalOpen(false);
          refetch();
        },
        onError: (err: any) => {
          message.error(
            err?.response?.data?.message || "Failed to add payment",
          );
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= TABLE COLUMNS ================= */

  const customerColumns = [
    { title: "Name", dataIndex: "name" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Paid Amount",
      render: (_: any, record: any) => {
        const totalPaid =
          paymentsData
            .filter((p: CustomerPayment) => p.customer === record._id)
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

  return (
    <div>
      <h2 className="text-xl font-semibold">Customer Payments</h2>

      {/* Customers table */}
      <Table
        rowKey="_id"
        dataSource={customers}
        columns={customerColumns}
        bordered
        pagination={false}
        style={{ marginBottom: 20 }}
      />

      {/* Payments table */}
      {selectedCustomer && (
        <>
          <h3 className="text-xl font-semibold" style={{ marginTop: 20 }}>
            Payments for{" "}
            {customers.find((c: any) => c._id === selectedCustomer)?.name}
          </h3>

          <Table
            rowKey="_id"
            dataSource={paymentsData}
            columns={paymentColumns}
            bordered
            pagination={false}
          />
        </>
      )}

      {/* Add Payment Modal */}
      <Modal
        title="Add Customer Payment"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        confirmLoading={isLoading}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ paymentDate: moment() }}
        >
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
