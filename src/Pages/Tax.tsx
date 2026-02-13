import { useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Popconfirm, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  useGetTaxes,
  useCreateTax,
  useUpdateTax,
  useDeleteTax,
} from "../Utils/TaxAPI";
import type { Tax, TaxPayload } from "../Utils/TaxAPI";
const TaxPage = () => {
  const { data: taxes = [], isLoading } = useGetTaxes();
  const createTax = useCreateTax();
  const updateTax = useUpdateTax();
  const deleteTax = useDeleteTax();

  const [open, setOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<Tax | null>(null);
  const [form] = Form.useForm();


  const handleSubmit = async () => {
    try {
      const values: TaxPayload = await form.validateFields();

      if (editingTax) {
        await updateTax.mutateAsync({ id: editingTax._id, data: values });
        message.success("Tax updated successfully");
      } else {
        await createTax.mutateAsync(values);
        message.success("Tax created successfully");
      }

      form.resetFields();
      setEditingTax(null);
      setOpen(false);
    } catch (error) {
      message.error("Something went wrong");
    }
  };


  const handleEdit = (record: Tax) => {
    setEditingTax(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTax.mutateAsync(id);
      message.success("Tax deleted successfully");
    } catch {
      message.error("Delete failed");
    }
  };

  const columns: ColumnsType<Tax> = [
    {
      title: "Tax Name",
      dataIndex: "name",
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      render: (value: number) => `${value}%`,
    },
    {
      title: "Actions",
      key: "action",
      render: (_: any, record: Tax) => (
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm rounded bg-[#00264d] text-white hover:bg-[#001a33]"
            onClick={() => handleEdit(record)}
          >
            Edit
          </button>

          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._id)}
          >
            <button className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700">
              Delete
            </button>
          </Popconfirm>
        </div>
      ),
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Taxes</h2>

        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
            setEditingTax(null);
          }}
        >
          Add Tax
        </Button>
      </div>


      <Table
        columns={columns}
        dataSource={taxes}
        rowKey="_id"
        loading={isLoading}
        bordered
        className="erp-table"
      />

      <Modal
        title={editingTax ? "Edit Tax" : "Add Tax"}
        open={open}
        onOk={handleSubmit}
        onCancel={() => {
          setOpen(false);
          setEditingTax(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tax Name"
            name="name"
            rules={[{ required: true, message: "Enter tax name" }]}
          >
            <Input placeholder="GST 18%" />
          </Form.Item>

          <Form.Item
            label="Percentage"
            name="percentage"
            rules={[{ required: true, message: "Enter percentage" }]}
          >
            <InputNumber
              min={0}
              max={100}
              style={{ width: "100%" }}
              placeholder="18"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TaxPage;
