import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Switch } from "antd";
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


interface UnitData {
  key: React.Key;
  name: string;
  shortName: string;
  shop: string;
  isActive: boolean;
}


const columns: TableColumnsType<UnitData> = [
  {
    title: "Unit Name",
    dataIndex: "name",
    width: 200,
    fixed: "start",
  },
  {
    title: "Short Name",
    dataIndex: "shortName",
    width: 150,
  },
  {
    title: "Shop",
    dataIndex: "shop",
    width: 200,
  },
  {
    title: "Active",
    dataIndex: "isActive",
    width: 100,
    render: (val: boolean) => (val ? "Yes" : "No"),
  },
  {
    title: "Action",
    fixed: "end",
    width: 150,
    render: () => (
      <div className="flex gap-2">
        <a>Edit</a>
        <a style={{ color: "red" }}>Delete</a>
      </div>
    ),
  },
];

const Units: React.FC = () => {
  const { styles } = useStyle();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  return (
    <div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Units Master</h2>

        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => setOpenAddModal(true)}>
            Add Unit
          </Button>
        </div>
      </div>


      <Table<UnitData>
        bordered
        className={styles.customTable}
        columns={columns}
        dataSource={[]}
        scroll={{ x: "max-content" }}
        pagination={false}
      />


      <Modal
        title="Add Unit"
        open={openAddModal}
        onCancel={() => setOpenAddModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={addForm}
          onFinish={(values) => {
            console.log("Add Unit:", values);
            setOpenAddModal(false);
            addForm.resetFields();
          }}
        >
          <Form.Item
            label="Unit Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Eg: Kilogram" />
          </Form.Item>

          <Form.Item
            label="Short Name"
            name="shortName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Eg: kg" />
          </Form.Item>

          <Form.Item
            label="Shop"
            name="shop"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select shop">
              <Option value="shop1">Main Shop</Option>
              <Option value="shop2">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Active"
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Save
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Edit Unit"
        open={openEditModal}
        onCancel={() => setOpenEditModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={editForm}
          onFinish={(values) => {
            console.log("Edit Unit:", values);
            setOpenEditModal(false);
          }}
        >
          <Form.Item
            label="Unit Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Short Name"
            name="shortName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Shop"
            name="shop"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="shop1">Main Shop</Option>
              <Option value="shop2">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Active"
            name="isActive"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Update
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Units;