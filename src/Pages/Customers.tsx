import { useState } from "react";
import { Button, Form, Modal, Table, Popconfirm, Input, Switch } from "antd";
import { toast } from "react-toastify";
import {
  useGetCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "../Utils/customerApi";
import type { Customer } from "../Utils/customerApi";

function Customers() {
  const [openModal, setOpenModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = useGetCustomers();
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();



  const handleSave = (values: any) => {
    if (editingCustomer) {
      updateMutation.mutate(
        { id: editingCustomer._id, data: values },
        {
          onSuccess: () => {
            toast.success("Customer updated");
            closeModal();
            refetch();
          },
          onError: (err: any) =>
            toast.error(err?.response?.data?.message || "Update failed"),
        },
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Customer created");
          closeModal();
          refetch();
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.message || "Create failed"),
      });
    }
  };


  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Customer deleted");
        refetch();
      },
      onError: () => toast.error("Delete failed"),
    });
  };

  

  const closeModal = () => {
    setOpenModal(false);
    setEditingCustomer(null);
    form.resetFields();
  };


  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "GST Number",
      dataIndex: "gstNumber",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive: boolean) => (
        <span style={{ color: isActive ? "green" : "red" }}>
          {isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Action",
      render: (_: any, record: Customer) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingCustomer(record);
              form.setFieldsValue(record);
              setOpenModal(true);
            }}
            className="px-3 py-1 text-sm rounded bg-[#00264d] text-white"
          >
            Edit
          </button>

          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._id)}
          >
            <button className="px-3 py-1 text-sm rounded bg-red-600 text-white">
              Delete
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];



  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Customers</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingCustomer(null);
            form.resetFields();
            setOpenModal(true);
          }}
        >
          Add Customer
        </Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        loading={isLoading}
        bordered
        className="erp-table"
      />

      <Modal
        open={openModal}
        title={editingCustomer ? "Edit Customer" : "Create Customer"}
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="Customer Name"
            rules={[{ required: true, message: "Enter name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Enter phone number" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>

          <Form.Item name="gstNumber" label="GST Number">
            <Input />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Active"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Customers;
