import { useState } from "react";
import { Button, Form, Modal, Table, Popconfirm, Select } from "antd";
import { toast } from "react-toastify";
import {
  useGetPermissions,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission,
} from "../Utils/permissionsApi";
import type { Permission } from "../Utils/permissionsApi";
import { DASH_ACCESSES } from "../constants/dashbordaccess";

function Permissions() {
  const [openModal, setOpenModal] = useState(false);
  const [editingPermission, setEditingPermission] =
    useState<Permission | null>(null);
  const [form] = Form.useForm();

  const { data = [], isLoading, refetch } = useGetPermissions();
  const createMutation = useCreatePermission();
  const updateMutation = useUpdatePermission();
  const deleteMutation = useDeletePermission();

  const handleSave = (values: { name: string }) => {
    if (editingPermission) {
      updateMutation.mutate(
        { id: editingPermission._id, name: values.name },
        {
          onSuccess: () => {
            toast.success("Permission updated");
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
          toast.success("Permission created");
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
        toast.success("Permission deleted");
        refetch();
      },
      onError: () => toast.error("Delete failed"),
    });
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingPermission(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Permission Name",
      dataIndex: "name",
      responsive: ["xs", "sm", "md", "lg"],
      render: (name: string) => (
        <span className="font-medium text-sm sm:text-base">
          {name.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Action",
      responsive: ["xs", "sm", "md", "lg"],
      render: (_: any, record: Permission) => (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              setEditingPermission(record);
              form.setFieldsValue({ name: record.name });
              setOpenModal(true);
            }}
            className="px-3 py-1 text-xs sm:text-sm rounded bg-[#00264d] text-white w-full sm:w-auto"
          >
            Edit
          </button>

          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._id)}
          >
            <button className="px-3 py-1 text-xs sm:text-sm rounded bg-red-600 text-white w-full sm:w-auto">
              Delete
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          Permissions
        </h2>

        <Button
          type="primary"
          className="w-full sm:w-auto"
          onClick={() => {
            setEditingPermission(null);
            form.resetFields();
            setOpenModal(true);
          }}
        >
          Add Permission
        </Button>
      </div>

      {/* Table Wrapper for Horizontal Scroll */}
      <div className="overflow-x-auto">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data}
          loading={isLoading}
          pagination={{ pageSize: 8 }}
          bordered
          className="erp-table min-w-[500px]"
        />
      </div>

      {/* Modal */}
      <Modal
        open={openModal}
        title={editingPermission ? "Edit Permission" : "Create Permission"}
        onCancel={closeModal}
        onOk={() => form.submit()}
        width={window.innerWidth < 640 ? "90%" : 500}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="Permission"
            rules={[{ required: true, message: "Select permission" }]}
          >
            <Select
              placeholder="Select Permission"
              size="large"
              showSearch
            >
              {DASH_ACCESSES.map((item) => (
                <Select.Option key={item} value={item}>
                  {item.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Permissions;