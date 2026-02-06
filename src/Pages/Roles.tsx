import { useState } from "react";
import { Button, Form, Input, Modal, Select, Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useGetPermissions } from "../Utils/permissionsApi";

import {
  getRoles,
  useCreateRole,
  useDeleteRole,
  useUpdateRole,
} from "../Utils/RoleAPI";

import type { Role, RolePayload } from "../Utils/RoleAPI";

interface Permission {
  _id: string;
  name: string;
}

function Roles() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [roleId, setRoleId] = useState<string | null>(null);

  const { data: permissionsData } = useGetPermissions();

  const [form] = Form.useForm<RolePayload>();
  const [updateForm] = Form.useForm<RolePayload>();

  /* ========= Query ========= */
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getRoles"],
    queryFn: getRoles,
  });

  /* ========= Mutations ========= */
  const { mutate: createRole } = useCreateRole();
  const { mutate: updateRole } = useUpdateRole();
  const { mutate: deleteRole } = useDeleteRole();

  /* ========= Create ========= */
  const onCreateFormSubmit = (values: RolePayload) => {
    createRole(values, {
      onSuccess(res) {
        toast.success(res?.data?.message || "Role created");
        form.resetFields();
        setOpenCreateModal(false);
        refetch();
      },
      onError(err: any) {
        toast.error(err?.response?.data?.message || "Failed");
      },
    });
  };

  /* ========= Update ========= */
  const openUpdate = (record: Role) => {
    setRoleId(record._id);
    updateForm.setFieldsValue({
      role_name: record.role_name,
      permission: record.permission.map((p) => p._id),
    });
    setOpenUpdateModal(true);
  };

  const onUpdateFormSubmit = (values: RolePayload) => {
    if (!roleId) return;

    updateRole(
      { id: roleId, data: values },
      {
        onSuccess(res) {
          toast.success(res?.data?.message || "Updated");
          updateForm.resetFields();
          setOpenUpdateModal(false);
          refetch();
        },
        onError(err: any) {
          toast.error(err?.response?.data?.message || "Update failed");
        },
      }
    );
  };

  /* ========= Delete ========= */
  const onHandleDelete = (id: string) => {
    deleteRole(id, {
      onSuccess(res) {
        toast.success(res?.data?.message || "Deleted");
        refetch();
      },
      onError() {
        toast.error("Delete failed");
      },
    });
  };

  /* ========= Table ========= */
  const columns = [
    { title: "Role Name", dataIndex: "role_name" },
    {
      title: "Permissions",
      dataIndex: "permission",
      render: (perms: Permission[]) =>
        perms?.map((p) => (
          <span key={p._id} className="mr-2">
            {p.name}
          </span>
        )),
    },
    {
      title: "Action",
      render: (_: any, record: Role) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openUpdate(record)}
            className="px-3 py-1 text-sm rounded
               bg-[#00264d] text-white
               hover:bg-[#003a73]
               transition"
          >
            Edit
          </button>

          <button
            onClick={() => onHandleDelete(record._id)}
            className="px-3 py-1 text-sm rounded
               bg-[#b91c1c] text-white
               hover:bg-[#991b1b]
               transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Roles</h2>

        <Button type="primary" onClick={() => setOpenCreateModal(true)}>
          Add Role
        </Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data} // ✅ correct
        bordered
        loading={isLoading}
        className="erp-table"
      />

      {/* Create */}
      <Modal
        open={openCreateModal}
        footer={null}
        onCancel={() => setOpenCreateModal(false)}
        title="Create Role"
      >
        <Form form={form} layout="vertical" onFinish={onCreateFormSubmit}>
          <Form.Item
            name="role_name"
            label="Role Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="permission"
            label="Permissions"
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              placeholder="Select permissions"
              options={permissionsData?.map((p) => ({
                value: p._id,
                label: p.name.toUpperCase(),
              }))}
            />
          </Form.Item>

          <Button htmlType="submit" block>
            Submit
          </Button>
        </Form>
      </Modal>

      {/* Update */}
      <Modal
        open={openUpdateModal}
        footer={null}
        onCancel={() => setOpenUpdateModal(false)}
        title="Update Role"
      >
        <Form form={updateForm} layout="vertical" onFinish={onUpdateFormSubmit}>
          <Form.Item
            name="role_name"
            label="Role Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="permission"
            label="Permissions"
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              placeholder="Select permissions"
              options={permissionsData?.map((p) => ({
                value: p._id,
                label: p.name.toUpperCase(),
              }))}
            />
          </Form.Item>

          <Button htmlType="submit" block>
            Update
          </Button>
        </Form>
      </Modal>
    </>
  );
}

export default Roles;
