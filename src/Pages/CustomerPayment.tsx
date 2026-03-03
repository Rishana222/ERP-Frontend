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
import { useGetSales } from "../Utils/salesAPI";

const { Option } = Select;

const CustomerPayments = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: customers = [] } = useGetCustomers();
  const { data: paymentsData = [], refetch } =
    useGetCustomerPayments(selectedCustomer || "");
  const { data: sales = [] } = useGetSales(selectedCustomer || "");
  const { mutate: addPayment, isLoading } = useCreateCustomerPayment();

  const openModal = (customerId: string) => {
    setSelectedCustomer(customerId);
    form.resetFields();
    form.setFieldsValue({ paymentDate: moment() });
    setIsModalOpen(true);
  };

  const handleSaleChange = (saleId: string) => {
    const sale = sales.find((s: any) => s._id === saleId);
    if (!sale) return;
    const due = sale.grandTotal - (sale.paidAmount || 0);
    form.setFieldsValue({ amount: due });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (!selectedCustomer || !values.sale) {
        message.error("Invoice is required");
        return;
      }

      const payload: CustomerPaymentPayload = {
        customer: selectedCustomer,
        sale: values.sale,
        amount: Number(values.amount),
        paymentDate: (values.paymentDate as Moment).format("YYYY-MM-DD"),
        paymentMode: values.paymentMode,
        note: values.note || "",
        account: values.account,
      };

      addPayment(payload, {
        onSuccess: () => {
          message.success("Payment added successfully");
          setIsModalOpen(false);
          refetch();
        },
      });
    } catch {}
  };

  /* MOBILE CUSTOMER TABLE */
  const customerColumns = [
    {
      title: "Customer",
      dataIndex: "name",
    },
    {
      title: "Paid",
      render: (_: any, record: any) => {
        const totalPaid =
          paymentsData
            .filter((p: CustomerPayment) => p.customer === record._id)
            .reduce((sum, p) => sum + p.amount, 0) || 0;

        return `₹${totalPaid}`;
      },
    },
    {
      title: "",
      render: (_: any, record: any) => (
      <Button
  type="primary"
  
  className="w-full sm:w-auto"
  onClick={() => openModal(record._id)}
>
  Add Payments
</Button>
      ),
    },
  ];

  /* MOBILE PAYMENT TABLE */
  const paymentColumns = [
    {
      title: "Date",
      dataIndex: "paymentDate",
      render: (date: string) => moment(date).format("DD-MM-YY"),
    },
    {
      title: "Amt",
      dataIndex: "amount",
      render: (amt: number) => `₹${amt}`,
    },
  ];

  return (
    <div className="p-3">
      <h2 className="text-lg font-semibold mb-3">
        Customer Payments
      </h2>

      {/* CUSTOMER TABLE */}
      <Table
        rowKey="_id"
        dataSource={customers}
        columns={customerColumns}
        bordered
        pagination={false}
    
        scroll={{ x: true }}
        style={{ marginBottom: 15 }}
        className="erp-table"
      />

      {/* PAYMENT TABLE */}
      {selectedCustomer && (
        <>
          <h3 className="text-sm font-semibold mb-2 break-words">
            Payments -{" "}
            {customers.find((c: any) => c._id === selectedCustomer)?.name}
          </h3>

          <Table
            rowKey="_id"
            dataSource={paymentsData}
            columns={paymentColumns}
            bordered
            pagination={false}
          
            scroll={{ x: true }}
            className="erp-table"
          />
        </>
      )}

      {/* MODAL */}
      <Modal
        title="Add Payment"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        confirmLoading={isLoading}
        // width="95%"
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Invoice"
            name="sale"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select invoice"
              onChange={handleSaleChange}
            >
              {sales
                .filter((s: any) => s.paymentStatus !== "PAID")
                .map((s: any) => {
                  const due = s.grandTotal - (s.paidAmount || 0);
                  return (
                    <Option key={s._id} value={s._id}>
                      {s.invoiceNumber} — ₹{due}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>

          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Date"
            name="paymentDate"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Account"
            name="account"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select account">
              <Option value="69a3fd27889e8eb025fe3752">Cash</Option>
              <Option value="69a3fd2e889e8eb025fe3755">Bank</Option>
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