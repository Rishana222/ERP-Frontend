import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Tag, message, Spin } from "antd";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";
import { createStyles } from "antd-style";

interface Permission {
  _id: string;
  name: string;
  is_deleted: boolean;
}

const useStyle = createStyles(({ css }) => ({
  customTable: css`
    .ant-table {
      .ant-table-body,
      .ant-table-content {
        scrollbar-width: thin;
        scrollbar-color: #eaeaea transparent;
      }
    }
  `,
}));

const Permissions: React.FC = () => {
  const { styles } = useStyle();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null,
  );
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/permissions");
      // Ensure it's always an array
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setPermissions(data);
    } catch (err) {
      message.error("Failed to fetch permissions");
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPermission(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (perm: Permission) => {
    setEditingPermission(perm);
    form.setFieldsValue({ name: perm.name });
    setModalVisible(true);
  };

  const handleDelete = async (perm: Permission) => {
    try {
      await axios.delete(`/api/permissions/${perm._id}`);
      message.success("Permission deleted");
      fetchPermissions();
    } catch {
      message.error("Failed to delete permission");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingPermission) {
        await axios.put(`/api/permissions/${editingPermission._id}`, values);
        message.success("Permission updated");
      } else {
        await axios.post("/api/permissions", values);
        message.success("Permission added");
      }
      setModalVisible(false);
      fetchPermissions();
    } catch {
      message.error("Failed to save permission");
    }
  };

  const columns: ColumnsType<Permission> = [
    { title: "Permission Name", dataIndex: "name", key: "name" },
    {
      title: "Status",
      dataIndex: "is_deleted",
      key: "status",
      render: (deleted) =>
        deleted ? (
          <Tag color="red">Deleted</Tag>
        ) : (
          <Tag color="green">Active</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </>
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
        Add Permission
      </Button>

      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={permissions} // always array now
        rowKey="_id"
      />

      <Modal
        title={editingPermission ? "Edit Permission" : "Add Permission"}
        open={modalVisible} // use `open` instead of deprecated `visible`
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Permission Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Permissions;
