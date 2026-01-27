import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber } from "antd";
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

interface SalesReturnData {
  key: React.Key;
  returnNumber: string;
  sale: string;
  customer: string;
  shop: string;
  totalReturnAmount: number;
  refundType: string;
  refundStatus: string;
  status: string;
  returnDate: string;
}

const columns: TableColumnsType<SalesReturnData> = [
  { title: "Return Number", dataIndex: "returnNumber", width: 150 },
  { title: "Sale ID", dataIndex: "sale", width: 150 },
  { title: "Customer", dataIndex: "customer", width: 150 },
  { title: "Shop", dataIndex: "shop", width: 150 },
  { title: "Total Return", dataIndex: "totalReturnAmount", width: 120 },
  { title: "Refund Type", dataIndex: "refundType", width: 120 },
  { title: "Refund Status", dataIndex: "refundStatus", width: 120 },
  { title: "Status", dataIndex: "status", width: 120 },
  { title: "Return Date", dataIndex: "returnDate", width: 150 },
  {
    title: "Action",
    fixed: "end",
    width: 120,
    render: () => <a style={{ color: "red" }}>Delete</a>,
  },
];

const SalesReturn: React.FC = () => {
  const { styles } = useStyle();
  const [returns] = useState<SalesReturnData[]>([]); 

  
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sales Return </h2>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => setOpenModal(true)}>
            Add Sales Return
          </Button>
        </div>
      </div>

      <Table<SalesReturnData>
        bordered
        className={styles.customTable}
        columns={columns}
        dataSource={returns} 
        scroll={{ x: "max-content" }}
        pagination={false}
        rowKey="key"
      />

  
      <Modal
        title="Add Sales Return"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Return Number" name="returnNumber">
            <Input />
          </Form.Item>

          <Form.Item label="Sale ID" name="sale">
            <Input />
          </Form.Item>

          <Form.Item label="Customer" name="customer">
            <Select placeholder="Select Customer">
              <Option value="cust1">Customer 1</Option>
              <Option value="cust2">Customer 2</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Shop" name="shop">
            <Select placeholder="Select Shop">
              <Option value="shop1">Main Shop</Option>
              <Option value="shop2">Branch Shop</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Total Return Amount" name="totalReturnAmount">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Refund Type" name="refundType">
            <Select>
              <Option value="cash">Cash</Option>
              <Option value="credit">Credit</Option>
              <Option value="bank">Bank</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Refund Status" name="refundStatus">
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select>
              <Option value="draft">Draft</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
              <Option value="refunded">Refunded</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Return Date" name="returnDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Button type="primary" className="w-full mt-2">
            Save Return
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default SalesReturn;
