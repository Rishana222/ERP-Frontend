import { Button, Modal, Form, Select, Table, Tag, Popconfirm } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";

import {
  useGetPermissions,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission,
} from "../Utils/permissionsApi";
import type { Permission, PermissionPayload } from "../Utils/permissionsApi";

const ERP_ACCESSES = [
  "users",
  "roles",
  "products",
  "purchase",
  "sales",
  "stock",
  "accounts",
  "reports",
  "vendors",
  "customers",
];

const Permissions = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null,
  );

  const [form] = Form.useForm<PermissionPayload>();

  /* ========= QUERY ========= */
  const { data: permissions, isLoading, refetch } = useGetPermissions();

  /* ========= MUTATIONS ========= */
  const { mutate: createPermission } = useCreatePermission();
  const { mutate: updatePermission } = useUpdatePermission();
  const { mutate: deletePermission } = useDeletePermission();

  /* ========= SAVE ========= */
  const handleSave = (values: PermissionPayload) => {
    if (editingPermission) {
      updatePermission(
        { id: editingPermission._id, data: values },
        {
          onSuccess() {
            toast.success("Permission updated");
            closeModal();
            refetch();
          },
          onError(err: any) {
            toast.error(err?.response?.data?.message || "Update failed");
          },
        },
      );
    } else {
      createPermission(values, {
        onSuccess() {
          toast.success("Permission created");
          closeModal();
          refetch();
        },
        onError(err: any) {
          toast.error(err?.response?.data?.message || "Create failed");
        },
      });
    }
  };

  /* ========= DELETE ========= */
  const handleDelete = (id: string) => {
    deletePermission(id, {
      onSuccess() {
        toast.success("Permission deleted");
        refetch();
      },
      onError() {
        toast.error("Delete failed");
      },
    });
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingPermission(null);
    form.resetFields();
  };

  /* ========= TABLE ========= */
  const columns = [
    {
      title: "Permission",
      dataIndex: "name",
      render: (name: string) => (
        <Tag
          color="blue"
          style={{
            backgroundColor: "#E6F0FF",
            color: "#00264d",

            fontWeight: "500",
          }}
        >
          {name.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_deleted",
      render: (deleted: boolean) => (
        <Tag
          style={{
            borderRadius: "4px",
            fontWeight: "600",

            color: deleted ? "#cf1322" : "#00264d",
          }}
        >
          {deleted ? "DELETED" : "ACTIVE"}
        </Tag>
      ),
    },
    {
      title: "Action",
      render: (_: any, record: Permission) => (
        <div className="flex space-x-2">
          {/* UPDATE */}
          <button
            onClick={() => {
              setEditingPermission(record);
              form.setFieldsValue({ name: record.name });
              setOpenModal(true);
            }}
            className="px-3 py-1 text-sm rounded
                   bg-[#00264d] text-white
                   hover:bg-[#003a73]
                   transition"
          >
            Update
          </button>

          {/* DELETE */}
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._id)}
          >
            <button
              className="px-3 py-1 text-sm rounded
                       bg-[#b91c1c] text-white
                       hover:bg-[#991b1b]
                       transition"
            >
              Delete
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Permissions</h2>

        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            setEditingPermission(null);
            setOpenModal(true);
          }}
        >
          Add Permission
        </Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={permissions}
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
            label="Permission Name"
            rules={[{ required: true, message: "Select permission" }]}
          >
            <Select placeholder="Select permission">
              {ERP_ACCESSES.map((p) => (
                <Select.Option key={p} value={p}>
                  {p.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Permissions;
