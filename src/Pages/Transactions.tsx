import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  DatePicker,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { createStyles } from "antd-style";

const { Option } = Select;

/* -------------------- Styles -------------------- */
const useStyle = createStyles(({ css }) => ({
  customTable: css`
    .ant-table {
      .ant-table-body,
      .ant-table-content {
        scrollbar-width: thin;
      }
    }
  `,
}));

/* -------------------- Types -------------------- */
interface Transaction {
  key: string;
  transactionType: "Payment" | "Receipt" | "Sales" | "Purchase" | "Expense";
  referenceId: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  transactionDate: string;
}

// Form type with Dayjs for DatePicker
interface TransactionForm {
  transactionType: Transaction["transactionType"];
  referenceId: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  transactionDate: Dayjs;
}

/* -------------------- Component -------------------- */
const Transactions: React.FC = () => {
  const { styles } = useStyle();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [form] = Form.useForm<TransactionForm>();
  const [editForm] = Form.useForm<TransactionForm>();

  /* -------------------- Table Columns -------------------- */
  const columns: ColumnsType<Transaction> = [
    { title: "Type", dataIndex: "transactionType", width: 120 },
    { title: "Reference ID", dataIndex: "referenceId", width: 120 },
    { title: "Debit Account", dataIndex: "debitAccount", width: 150 },
    { title: "Credit Account", dataIndex: "creditAccount", width: 150 },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 120,
      render: (amt) => `₹ ${amt}`,
    },
    { title: "Date", dataIndex: "transactionDate", width: 120 },
    {
      title: "Action",
      width: 150,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            danger
            size="small"
            onClick={() =>
              setTransactions((prev) =>
                prev.filter((t) => t.key !== record.key)
              )
            }
          >
            Delete
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setEditingTransaction(record);
              editForm.setFieldsValue({
                ...record,
                transactionDate: dayjs(record.transactionDate),
              });
              setOpenEditModal(true);
            }}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  /* -------------------- Add Transaction -------------------- */
  const handleAdd = (values: TransactionForm) => {
    const newTransaction: Transaction = {
      key: Date.now().toString(),
      ...values,
      transactionDate: values.transactionDate.format("YYYY-MM-DD"),
    };
    setTransactions((prev) => [...prev, newTransaction]);
    setOpenAddModal(false);
    form.resetFields();
  };

  /* -------------------- Edit Transaction -------------------- */
  const handleEdit = (values: TransactionForm) => {
    if (!editingTransaction) return;
    setTransactions((prev) =>
      prev.map((t) =>
        t.key === editingTransaction.key
          ? { ...t, ...values, transactionDate: values.transactionDate.format("YYYY-MM-DD") }
          : t
      )
    );
    setOpenEditModal(false);
    setEditingTransaction(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <Button type="primary" onClick={() => setOpenAddModal(true)}>
          Add Transaction
        </Button>
      </div>

      {/* Table */}
      <Table<Transaction>
        bordered
        className={styles.customTable}
        columns={columns}
        dataSource={transactions}
        rowKey="key"
        pagination={false}
        scroll={{ x: "max-content" }}
          style={{ marginTop: 16 }}
      />

      {/* Add Modal */}
      <Modal
        title="Add Transaction"
        open={openAddModal}
        onCancel={() => setOpenAddModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleAdd}>
          <Form.Item
            name="transactionType"
            label="Transaction Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Payment">Payment</Option>
              <Option value="Receipt">Receipt</Option>
              <Option value="Sales">Sales</Option>
              <Option value="Purchase">Purchase</Option>
              <Option value="Expense">Expense</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="referenceId"
            label="Reference ID"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="debitAccount"
            label="Debit Account"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="creditAccount"
            label="Credit Account"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="transactionDate"
            label="Transaction Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Save
          </Button>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Transaction"
        open={openEditModal}
        onCancel={() => setOpenEditModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={editForm} onFinish={handleEdit}>
          <Form.Item name="transactionType" label="Transaction Type">
            <Select>
              <Option value="Payment">Payment</Option>
              <Option value="Receipt">Receipt</Option>
              <Option value="Sales">Sales</Option>
              <Option value="Purchase">Purchase</Option>
              <Option value="Expense">Expense</Option>
            </Select>
          </Form.Item>

          <Form.Item name="referenceId" label="Reference ID">
            <Input />
          </Form.Item>

          <Form.Item name="debitAccount" label="Debit Account">
            <Input />
          </Form.Item>

          <Form.Item name="creditAccount" label="Credit Account">
            <Input />
          </Form.Item>

          <Form.Item name="amount" label="Amount">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="transactionDate" label="Transaction Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Update
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Transactions;
