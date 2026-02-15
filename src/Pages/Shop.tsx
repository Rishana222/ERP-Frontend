import { useState } from "react";
import { Button, Table, Modal, Form, Input, message, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  useGetShops,
  useCreateShop,
  useUpdateShop,
  useDeleteShop,
} from "../Utils/ShopAPI";
import type { Shop, ShopPayload } from "../Utils/ShopAPI";
import { useQueryClient } from "@tanstack/react-query";

const ShopPage = () => {
  const queryClient = useQueryClient();

  const { data: shops = [], isLoading } = useGetShops();
  const createMutation = useCreateShop();
  const updateMutation = useUpdateShop();
  const deleteMutation = useDeleteShop();

  const [open, setOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [form] = Form.useForm();


  const handleSubmit = async (values: ShopPayload) => {
    try {
      if (editingShop) {
        await updateMutation.mutateAsync({
          id: editingShop._id,
          data: values,
        });
        message.success("Shop updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        message.success("Shop created successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["shops"] });

      setOpen(false);
      setEditingShop(null);
      form.resetFields();
    } catch (error) {
      message.error("Something went wrong");
    }
  };


  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Shop deleted");
      queryClient.invalidateQueries({ queryKey: ["shops"] });
    } catch {
      message.error("Delete failed");
    }
  };


  const columns: ColumnsType<Shop> = [
    {
      title: "Shop Name",
      dataIndex: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
  title: "Actions",
  render: (_, record) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => {
          setEditingShop(record); 
          setOpen(true);          
          form.setFieldsValue(record); 
        }}
        className="px-4 py-1.5 text-sm font-medium rounded bg-[#00264d] text-white hover:bg-opacity-90 transition-all"
      >
        Edit
      </button>

      <Popconfirm
        title="Are you sure?"
        onConfirm={() => handleDelete(record._id)}
        okText="Yes"
        cancelText="No"
      >
        <button 
          className="px-4 py-1.5 text-sm font-medium rounded bg-red-600 text-white hover:bg-red-700 transition-all"
        >
          Delete
        </button>
      </Popconfirm>
    </div>
  ),
},
  ];


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Shops</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingShop(null);
            setOpen(true);
            form.resetFields();
          }}
        >
          Add Shop
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={shops}
        rowKey="_id"
        loading={isLoading}
        bordered
        className="erp-table"
      />

      <Modal
        title={editingShop ? "Edit Shop" : "Add Shop"}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Shop Name"
            rules={[{ required: true, message: "Please enter shop name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={createMutation.isPending || updateMutation.isPending}
          >
            {editingShop ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ShopPage;
