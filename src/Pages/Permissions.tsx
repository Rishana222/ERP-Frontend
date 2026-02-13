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

  const { data, isLoading, refetch } = useGetPermissions();
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
      render: (name: string) => (
        <span style={{ fontWeight: 500 }}>
          {name.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Action",
      render: (_: any, record: Permission) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingPermission(record);
              form.setFieldsValue({ name: record.name });
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
        <h2 className="text-xl font-semibold">Permissions</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingPermission(null);
            form.resetFields();
            setOpenModal(true);
          }}
        >
          Add Permission
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
        title={editingPermission ? "Edit Permission" : "Create Permission"}
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="Permission"
            rules={[{ required: true, message: "Select permission" }]}
          >
            <Select placeholder="Select Permission">
              {DASH_ACCESSES.map((item) => (
                <Select.Option key={item} value={item}>
                  {item.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Permissions;
