import { useState } from "react";
import { Button, Form, Modal, Table, Popconfirm, Input, Switch } from "antd";
import { toast } from "react-toastify";

import {
  useGetVendors,
  useCreateVendor,
  useUpdateVendor,
  useDeleteVendor,
} from "../Utils/vendorApi";

import type { Vendor } from "../Utils/vendorApi";

function VendorPage() {
  const [openModal, setOpenModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = useGetVendors();
  const createMutation = useCreateVendor();
  const updateMutation = useUpdateVendor();
  const deleteMutation = useDeleteVendor();

  const handleSave = (values: any) => {
    if (editingVendor) {
      updateMutation.mutate(
        { id: editingVendor._id, data: values },
        {
          onSuccess: () => {
            toast.success("Vendor updated successfully");
            closeModal();
            refetch();
          },
          onError: (err: any) =>
            toast.error(err?.response?.data?.message || "Update failed"),
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Vendor created successfully");
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
        toast.success("Vendor deleted");
        refetch();
      },
      onError: () => toast.error("Delete failed"),
    });
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingVendor(null);
    form.resetFields();
  };

  /* ================= RESPONSIVE TABLE ================= */

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (name: string) => <strong>{name}</strong>,
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
      title: "GST Number",
      dataIndex: "gstNumber",
      responsive: ["lg"],
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive: boolean) =>
        isActive ? (
          <span className="text-green-600 font-medium text-xs sm:text-sm">
            Active
          </span>
        ) : (
          <span className="text-red-600 font-medium text-xs sm:text-sm">
            Inactive
          </span>
        ),
    },
    {
      title: "Action",
      render: (_: any, record: Vendor) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setEditingVendor(record);
              form.setFieldsValue(record);
              setOpenModal(true);
            }}
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded bg-[#00264d] text-white"
          >
            Edit
          </button>

          <Popconfirm
            title="Are you sure delete?"
            onConfirm={() => handleDelete(record._id)}
          >
            <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded bg-red-600 text-white">
              Delete
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Vendors</h2>

        <Button
          type="primary"
          className="w-full sm:w-auto"
          onClick={() => {
            setEditingVendor(null);
            form.resetFields();
            setOpenModal(true);
          }}
        >
          Add Vendor
        </Button>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data}
          loading={isLoading}
          bordered
          scroll={{ x: 700 }}
          pagination={{ pageSize: 10 }}
          className="erp-table"
        />
      </div>

      {/* Modal */}
      <Modal
        open={openModal}
        title={editingVendor ? "Edit Vendor" : "Create Vendor"}
        onCancel={closeModal}
        onOk={() => form.submit()}
        width="100%"
        style={{ maxWidth: 600 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="Vendor Name"
            rules={[{ required: true, message: "Enter vendor name" }]}
          >
            <Input placeholder="Enter vendor name" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Enter phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input.TextArea placeholder="Enter address" />
          </Form.Item>

          <Form.Item name="gstNumber" label="GST Number">
            <Input placeholder="Enter GST number" />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Active Status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default VendorPage;