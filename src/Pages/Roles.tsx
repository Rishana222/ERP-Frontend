import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import type { TableColumnsType } from "antd";
import { createStyles } from "antd-style";

const { Option } = Select;

// --- Styles ---
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

// --- Table Row Type ---
interface RoleData {
  key: React.Key;
  name: string;
  permissions: string[];
}

// --- Table Columns ---
const columns: TableColumnsType<RoleData> = [
  { title: "Role Name", dataIndex: "name", width: 150 },
  {
    title: "Permissions",
    dataIndex: "permissions",
    width: 400,
    render: (permissions: string[]) => permissions.join(", "),
  },
  {
    title: "Action",
    fixed: "end",
    width: 120,
    render: (_record) => <a style={{ color: "red" }}>Delete</a>,
  },
];

// --- Role Page Component ---
const UserRoles: React.FC = () => {
  const { styles } = useStyle();
  const [roles, setRoles] = useState<RoleData[]>([]);

  // Modal
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  // Permissions list
  const permissionOptions = [
    "createProduct",
    "editProduct",
    "deleteProduct",
    "viewProduct",
    "createPurchase",
    "editPurchase",
    "deletePurchase",
    "viewPurchase",
    "createSale",
    "editSale",
    "deleteSale",
    "viewSale",
    "manageStock",
    "viewReport",
    "manageAccounts",
  ];

  const handleSave = () => {
    form.validateFields().then((values) => {
      const newRole: RoleData = {
        key: Date.now(),
        name: values.name,
        permissions: values.permissions || [],
      };
      setRoles([...roles, newRole]);
      setOpenModal(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">User Roles</h2>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => setOpenModal(true)}>
            Add Role
          </Button>
        </div>
      </div>

      <Table<RoleData>
        bordered
        className={styles.customTable}
        columns={columns}
        dataSource={roles}
        scroll={{ x: "max-content" }}
        pagination={false}
        rowKey="key"
      />

      {/* Add Role Modal */}
      <Modal
        title="Add Role"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Role Name"
            name="name"
            rules={[{ required: true, message: "Please enter role name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Permissions" name="permissions">
            <Select mode="multiple" placeholder="Select Permissions">
              {permissionOptions.map((perm) => (
                <Option key={perm} value={perm}>
                  {perm}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Button type="primary" className="w-full mt-2" onClick={handleSave}>
            Save Role
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default UserRoles;
