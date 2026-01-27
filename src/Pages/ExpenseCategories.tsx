import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, } from "antd";
import type { TableColumnsType } from "antd";
import { createStyles } from "antd-style";

const { Option } = Select;

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

interface ExpenseCategoryData {
  key: React.Key;
  name: string;
  description?: string;
  status: string;
  createdBy?: string;
}

const columns: TableColumnsType<ExpenseCategoryData> = [
  { title: "Name", dataIndex: "name", width: 150 },
  { title: "Description", dataIndex: "description", width: 200 },
  { title: "Status", dataIndex: "status", width: 120 },
  { title: "Created By", dataIndex: "createdBy", width: 150 },
  {
    title: "Action",
    fixed: "end",
    width: 120,
    render: () => (
      <div className="flex gap-2">
        <a>Edit</a>
        <a style={{ color: "red" }}>Delete</a>
      </div>
    ),
  },
];

const ExpenseCategories: React.FC = () => {
  const { styles } = useStyle();

  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  const dataSource: ExpenseCategoryData[] = [];

  const handleAddCategory = (values: any) => {
    console.log("New Category:", values);
    setOpenModal(false);
    form.resetFields();
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Expense Categories</h2>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => setOpenModal(true)}>
            Add Category
          </Button>
        </div>
      </div>

      <Table<ExpenseCategoryData>
        bordered
        className={styles.customTable}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: "max-content" }}
        pagination={false}
        rowKey="key"
      />

      <Modal
        title="Add Expense Category"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleAddCategory}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Category Name" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Optional Description" />
          </Form.Item>

          <Form.Item label="Status" name="status" initialValue="Active">
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Created By" name="createdBy">
            <Input placeholder="Optional (User ID)" />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Add Category
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ExpenseCategories;
