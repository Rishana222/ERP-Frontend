import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Tag,
  message,
  Popconfirm,
  Space,
} from "antd";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";

// API Config - ഇത് ഒരു പ്രത്യേക ഫയലിലേക്ക് മാറ്റുന്നതാണ് ഉചിതം
const API_BASE_URL = "http://localhost:3000/api/permissions";

const ERP_ACCESSES = [
  "users",
  "products",
  "purchase",
  "sales",
  "stock",
  "accounts",
  "reports",
  "vendors",
  "customers",
];

interface Permission {
  _id: string;
  name: string;
  is_deleted: boolean;
}

const Permissions: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Helper: Get Auth Headers
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  }, []);

  // Fetch Permissions
  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/get`, getAuthHeaders());
      // ഡാറ്റ അറേ ആണോ എന്ന് ഉറപ്പുവരുത്തുന്നു
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setPermissions(data);
    } catch (err: any) {
      message.error(
        err.response?.data?.message || "Failed to fetch permissions",
      );
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // Create or Update
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingPermission) {
        await axios.put(
          `${API_BASE_URL}/update/${editingPermission._id}`,
          values,
          getAuthHeaders(),
        );
        message.success("Permission updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/create`, values, getAuthHeaders());
        message.success("Permission added successfully");
      }

      setModalVisible(false);
      form.resetFields();
      fetchPermissions();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${id}`, getAuthHeaders());
      message.success("Permission deleted");
      fetchPermissions();
    } catch (err: any) {
      message.error("Delete failed");
    }
  };

  const columns: ColumnsType<Permission> = [
    {
      title: "Permission Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <Tag color="blue">{name.toUpperCase()}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "is_deleted",
      key: "status",
      render: (deleted: boolean) => (
        <Tag color={deleted ? "red" : "green"}>
          {deleted ? "Deleted" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingPermission(record);
              form.setFieldsValue({ name: record.name });
              setModalVisible(true);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Manage Permissions</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingPermission(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Add Permission
        </Button>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={permissions}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingPermission ? "Edit Permission" : "Add Permission"}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Permission Name"
            rules={[
              { required: true, message: "Please select an access type" },
            ]}
          >
            <Select placeholder="Select access type">
              {ERP_ACCESSES.map((access) => (
                <Select.Option key={access} value={access}>
                  {access.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Permissions;
