import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";

import {
  useGetRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "../Utils/RoleAPI";
import type { Role, RolePayload } from "../Utils/RoleAPI";
import { useGetPermissions } from "../Utils/permissionsApi";

interface Permission {
  _id: string;
  name: string;
}

const RolePage = () => {
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form] = Form.useForm();

  const { data: roles = [], isLoading } = useGetRoles();
  const { data: permissions = [] } = useGetPermissions();

  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const handleSubmit = async (values: RolePayload) => {
    try {
      if (editingRole) {
        await updateRole.mutateAsync({
          id: editingRole._id,
          data: values,
        });
        message.success("Role updated successfully");
      } else {
        await createRole.mutateAsync(values);
        message.success("Role created successfully");
      }

      setOpen(false);
      form.resetFields();
      setEditingRole(null);
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setOpen(true);

    form.setFieldsValue({
      name: role.name,
      permissions: role.permissions,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteRole.mutateAsync(id);
    message.success("Role deleted");
  };

  const columns: ColumnsType<Role> = [
    {
      title: "Role Name",
      dataIndex: "name",
    },
    {
      title: "Permissions",
      render: (_, record) => {
        if (!record.permissions || record.permissions.length === 0)
          return "No Permissions";

        return (
          <div className="flex flex-wrap gap-2">
            {record.permissions.map((perm: any) => (
              <Tag key={perm._id}>{perm.name}</Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => handleEdit(record)}
            className="px-3 py-1 text-sm rounded bg-[#00264d] text-white w-full sm:w-auto"
          >
            Edit
          </button>

          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._id)}
          >
            <button className="px-3 py-1 text-sm rounded bg-red-600 text-white w-full sm:w-auto">
              Delete
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Responsive Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold">Roles</h2>
        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
            setEditingRole(null);
          }}
        >
          Add Role
        </Button>
      </div>

      {/* Responsive Table */}
      <Table
        columns={columns}
        dataSource={roles}
        rowKey="_id"
        loading={isLoading}
        bordered
        className="erp-table"
        scroll={{ x: "max-content" }}
      />

      {/* Responsive Modal */}
      <Modal
        title={editingRole ? "Edit Role" : "Add Role"}
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={createRole.isPending || updateRole.isPending}
        width="95%"
        style={{ maxWidth: 600 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: "Role name required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="permissions" label="Permissions">
            <Select
              mode="multiple"
              placeholder="Select permissions"
              options={permissions.map((p: Permission) => ({
                label: p.name,
                value: p._id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RolePage;