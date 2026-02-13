import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";

import {
  useGetUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,

} from "../Utils/UserAPI";
import type { User, UserPayload } from "../Utils/UserAPI";
import { useGetRoles } from "../Utils/RoleAPI";

const UserPage = () => {
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const { data: users = [], isLoading } = useGetUsers();
  const { data: roles = [] } = useGetRoles();

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleSubmit = async (values: UserPayload) => {
    try {
      if (editingUser) {
        await updateUser.mutateAsync({
          id: editingUser._id,
          data: values,
        });
        message.success("User updated successfully");
      } else {
        await createUser.mutateAsync(values);
        message.success("User created successfully");
      }

      setOpen(false);
      form.resetFields();
      setEditingUser(null);
    } catch {
      message.error("Something went wrong");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setOpen(true);

    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role?._id,
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      render: (_, record) =>
        record.role ? <Tag>{record.role.name}</Tag> : "No Role",
    },
    {
      title: "Status",
      render: (_, record) =>
        record.isActive ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(record)}
            className="px-3 py-1 text-sm rounded bg-[#00264d] text-white hover:bg-[#001a33]"
          >
            Edit
          </button>

          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteUser.mutate(record._id)}
          >
            <button className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700">
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
        <h2 className="text-xl font-semibold">Users</h2>
        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
            setEditingUser(null);
          }}
        >
          Add User
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={isLoading}
        bordered
      />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item name="role" label="Role">
            <Select
              placeholder="Select Role"
              options={roles.map((r: any) => ({
                label: r.name,
                value: r._id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserPage;
