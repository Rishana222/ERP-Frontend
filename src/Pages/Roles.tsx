import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Spin } from "antd";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";

interface Permission {
  _id: string;
  name: string;
  is_deleted?: boolean;
}

interface Role {
  _id: string;
  role_name: string;
  permission: Permission[];
}

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]); // always array
  const [permissions, setPermissions] = useState<Permission[]>([]); // always array
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form] = Form.useForm();

  // Fetch roles & permissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, permsRes] = await Promise.all([
          axios.get<Role[]>("/api/roles"),
          axios.get<Permission[]>("/api/permissions"),
        ]);

        // always arrays
        setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : []);
        setPermissions(
          Array.isArray(permsRes.data)
            ? permsRes.data.filter((p) => !p.is_deleted)
            : [],
        );
      } catch (err) {
        message.error("Failed to fetch roles or permissions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Open modal for add
  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Open modal for edit
  const handleEdit = (role: Role) => {
    setEditingRole(role);
    form.setFieldsValue({
      role_name: role.role_name,
      permission: role.permission?.map((p) => p._id) || [],
    });
    setModalVisible(true);
  };

  // Save role (create or update)
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingRole) {
        await axios.put(`/api/roles/${editingRole._id}`, values);
        message.success("Role updated successfully");
      } else {
        await axios.post("/api/roles", values);
        message.success("Role created successfully");
      }

      setModalVisible(false);
      // Refresh roles
      const res = await axios.get<Role[]>("/api/roles");
      setRoles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      message.error("Failed to save role");
    }
  };

  // Table columns
  const columns: ColumnsType<Role> = [
    { title: "Role Name", dataIndex: "role_name", key: "role_name" },
    {
      title: "Permissions",
      dataIndex: "permission",
      key: "permissions",
      render: (perms: Permission[]) =>
        Array.isArray(perms) && perms.length > 0 ? (
          perms.map((p) => (
            <span key={p._id} style={{ marginRight: 8 }}>
              {p.name}
            </span>
          ))
        ) : (
          <span>No Permissions</span>
        ),
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
        Add Role
      </Button>

      <Table
        columns={columns}
        dataSource={roles}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingRole ? "Edit Role" : "Add Role"}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="role_name"
            label="Role Name"
            rules={[{ required: true, message: "Please input role name" }]}
          >
            <Input placeholder="Enter role name" />
          </Form.Item>

          <Form.Item
            name="permission"
            label="Permissions"
            rules={[{ required: true, message: "Please select permissions" }]}
          >
            <Select mode="multiple" placeholder="Select permissions">
              {permissions.map((p) => (
                <Select.Option key={p._id} value={p._id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Roles;
