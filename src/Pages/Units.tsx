import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
} from "antd";
import type { ColumnsType } from "antd/es/table";
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
  key: string;
  name: string;
  shortName: string;
  shop: string;
  isActive: boolean;
}



const Units: React.FC = () => {
  const { styles } = useStyle();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitData | null>(null);

  const [addForm] = Form.useForm<UnitData>();
  const [editForm] = Form.useForm<UnitData>();

  /* ---------- Columns ---------- */
  const columns: ColumnsType<UnitData> = [
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
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setEditingUnit(record);
              editForm.setFieldsValue(record);
              setOpenEditModal(true);
            }}
          >
            Edit
          </Button>
          <Button size="small" danger>
            Delete
          </Button>
        </div>
      ),
    },
  ];

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
        style={{ marginTop: 16 }}
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
          initialValues={{ isActive: true }}
          onFinish={(values) => {
            console.log("ADD UNIT:", values);
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
              <Option value="Main Shop">Main Shop</Option>
              <Option value="Branch Shop">Branch Shop</Option>
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
            Save
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Edit Unit"
        open={openEditModal}
        onCancel={() => {
          setOpenEditModal(false);
          setEditingUnit(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={editForm}
          onFinish={(values) => {
            console.log("UPDATE UNIT:", {
              ...editingUnit,
              ...values,
            });
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
              <Option value="Main Shop">Main Shop</Option>
              <Option value="Branch Shop">Branch Shop</Option>
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
