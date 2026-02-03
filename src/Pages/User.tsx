import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Spin,
} from "antd";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";

interface Role {
  _id: string;
  role_name: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // Fetch users & roles safely
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, rolesRes] = await Promise.all([
          axios.get("/api/users"),
          axios.get("/api/roles"),
        ]);

        // ensure we always have arrays
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : []);
      } catch (err) {
        message.error("Failed to fetch users or roles");
        setUsers([]);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role?._id,
      isActive: user.isActive,
    });
    setModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingUser) {
        await axios.put(`/api/users/${editingUser._id}`, values);
        message.success("User updated successfully");
      } else {
        await axios.post("/api/users", values);
        message.success("User added successfully");
      }

      setModalVisible(false);

      // Refresh users after save
      const res = await axios.get("/api/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      message.error("Failed to save user");
    }
  };

  const columns: ColumnsType<User> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      key: "role",
      render: (_, record) => record.role?.role_name || "No Role",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (active) => <Switch checked={active} disabled />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add User
      </Button>

      <Table columns={columns} dataSource={users} rowKey="_id" />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select role">
              {Array.isArray(roles) &&
                roles.map((role) => (
                  <Select.Option key={role._id} value={role._id}>
                    {role.role_name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;
