
import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Switch, message } from "antd";
import axios from "axios";

const { Option } = Select;

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  permissions: {
    products: boolean;
    purchase: boolean;
    sales: boolean;
    stock: boolean;
    accounts: boolean;
  };
}

const User = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [form] = Form.useForm();

  const token = localStorage.getItem("token"); // Login token

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open modal for add/edit
  const openModal = (user?: User) => {
    setEditingUser(user || null);
    setIsModalVisible(true);
    form.setFieldsValue(user || { name: "", email: "", role: "staff", permissions: {} });
  };

  const handleCancel = () => setIsModalVisible(false);

  // Save user (create or update)
  const handleSave = async (values: any) => {
    try {
      if (editingUser) {
        await axios.put(`/api/users/update/${editingUser._id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("User updated successfully");
      } else {
        await axios.post("/api/users/create", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("User created successfully");
      }
      fetchUsers();
      setIsModalVisible(false);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to save user");
    }
  };

  // Delete user
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/users/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("User deleted successfully");
      fetchUsers();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Permissions",
      key: "permissions",
      render: (_: any, record: User) =>
        Object.entries(record.permissions)
          .filter(([_, v]) => v)
          .map(([k]) => k)
          .join(", "),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => openModal()}>
        Add User
      </Button>

      <Table rowKey="_id" dataSource={users} columns={columns} loading={loading} />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        visible={isModalVisible}
        open={isModalVisible}   
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="staff">Staff</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Permissions">
            <Form.Item name={["permissions", "products"]} valuePropName="checked" noStyle>
              <Switch checkedChildren="Products" unCheckedChildren="Products" />
            </Form.Item>
            <Form.Item name={["permissions", "purchase"]} valuePropName="checked" noStyle>
              <Switch checkedChildren="Purchase" unCheckedChildren="Purchase" style={{ marginLeft: 8 }} />
            </Form.Item>
            <Form.Item name={["permissions", "sales"]} valuePropName="checked" noStyle>
              <Switch checkedChildren="Sales" unCheckedChildren="Sales" style={{ marginLeft: 8 }} />
            </Form.Item>
            <Form.Item name={["permissions", "stock"]} valuePropName="checked" noStyle>
              <Switch checkedChildren="Stock" unCheckedChildren="Stock" style={{ marginLeft: 8 }} />
            </Form.Item>
            <Form.Item name={["permissions", "accounts"]} valuePropName="checked" noStyle>
              <Switch checkedChildren="Accounts" unCheckedChildren="Accounts" style={{ marginLeft: 8 }} />
            </Form.Item>
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: !editingUser }]}>
            <Input.Password placeholder={editingUser ? "Leave blank to keep current" : ""} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default User;
