import React, { useState } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  InputNumber,
} from "antd";
import {
  useGetAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeactivateAccount,
} from "../Utils/AccountsAPI";
import type { Account, AccountPayload } from "../Utils/AccountsAPI";

const { Option } = Select;

const AccountPage: React.FC = () => {
  const { data: accounts = [], isLoading } = useGetAccounts();
  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();
  const deactivateMutation = useDeactivateAccount();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [form] = Form.useForm();

  const openModal = (account?: Account) => {
    if (account) {
      setEditingAccount(account);
      form.setFieldsValue(account);
    } else {
      setEditingAccount(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleSave = async (values: AccountPayload) => {
    try {
      if (editingAccount) {
        await updateMutation.mutateAsync({
          id: editingAccount._id,
          data: values,
        });
        message.success("Account updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        message.success("Account created successfully");
      }
      setModalVisible(false);
      form.resetFields();
      setEditingAccount(null);
    } catch (err) {
      message.error("Error saving account");
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await deactivateMutation.mutateAsync(id);
      message.success("Account deactivated successfully");
    } catch (err) {
      message.error("Error deactivating account");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (val: number) => `₹${val}`,
    },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Actions",
      key: "action",
      render: (_: any, record: Account) => (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => openModal(record)}
            className="w-full sm:w-auto px-3 py-1 text-sm rounded bg-[#00264d] text-white hover:bg-[#001a33]"
          >
            Edit
          </button>

          <Popconfirm
            title="Are you sure you want to deactivate this account?"
            onConfirm={() => handleDeactivate(record._id)}
          >
            <button className="w-full sm:w-auto px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700">
              Deactivate
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold">Accounts</h2>
        <button
          className="w-full sm:w-auto px-4 py-2 bg-[#00264d] text-white rounded hover:bg-[#001a33]"
          onClick={() => openModal()}
        >
          Add Account
        </button>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <Table
          dataSource={accounts}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          bordered
          pagination={{ pageSize: 5 }}
          className="erp-table min-w-[700px]"
        />
      </div>

      {/* Modal */}
      <Modal
        title={editingAccount ? "Edit Account" : "Add Account"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingAccount(null);
        }}
        onOk={() => form.submit()}
        width="100%"
        style={{ maxWidth: 500 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          className="space-y-2"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Account name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Account type is required" }]}
          >
            <Select placeholder="Select type">
              <Option value="Cash">Cash</Option>
              <Option value="Bank">Bank</Option>
              <Option value="UPI">UPI</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Balance" name="balance" initialValue={0}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AccountPage;