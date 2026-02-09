import { useState } from "react";
import { Button, Form, Input, Modal, Switch, Table,  Popconfirm } from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosInstance } from "../Utils/Axios";

interface Role {
  _id: string;
  role_name: string;
  description?: string;
  status: boolean;
  is_deleted?: boolean;
}

interface RolePayload {
  role_name: string;
  description?: string;
  status?: boolean;
}

const getRoles = async (): Promise<Role[]> => {
  const res = await axiosInstance.get("/api/roles/get");
  return res.data.data;
};

const createRole = (data: RolePayload) =>
  axiosInstance.post("/api/roles/create", data);

const updateRole = ({ id, data }: { id: string; data: RolePayload }) =>
  axiosInstance.put(`/api/roles/update/${id}`, data);

const deleteRole = (id: string) => axiosInstance.delete(`/api/roles/delete/${id}`);

function Roles() {
  const [openModal, setOpenModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form] = Form.useForm<RolePayload>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const createMutation = useMutation({ mutationFn: createRole });
  const updateMutation = useMutation({ mutationFn: updateRole });
  const deleteMutation = useMutation({ mutationFn: deleteRole });

  const handleSave = (values: RolePayload) => {
    if (editingRole) {
      updateMutation.mutate(
        { id: editingRole._id, data: values },
        {
          onSuccess() {
            toast.success("Role updated");
            closeModal();
            refetch();
          },
          onError: (err: any) =>
            toast.error(err?.response?.data?.message || "Update failed"),
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess() {
          toast.success("Role created");
          closeModal();
          refetch();
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.message || "Create failed"),
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess() {
        toast.success("Role deleted");
        refetch();
      },
      onError: () => toast.error("Delete failed"),
    });
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingRole(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Role Name",
      dataIndex: "role_name",
      render: (name: string) => (
        <span style={{ fontWeight: "500", color: "#00264d" }}>
          {name.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (v: string) => <span className="text-gray-600">{v || "-"}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: boolean) => (
        <span style={{ 
          fontWeight: "600", 
          color: status ? "#00264d" : "#cf1322" 
        }}>
          {status ? "ACTIVE" : "INACTIVE"}
        </span>
      ),
    },
    {
      title: "Action",
      render: (_: any, record: Role) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditingRole(record);
              form.setFieldsValue(record);
              setOpenModal(true);
            }}
            className="px-3 py-1 text-sm rounded bg-[#00264d] text-white hover:bg-[#003a73] transition"
          >
            Edit
          </button>

          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record._id)}>
            <button className="px-3 py-1 text-sm rounded bg-[#b91c1c] text-white hover:bg-[#991b1b] transition">
              Delete
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Roles</h2>
        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            setEditingRole(null);
            setOpenModal(true);
          }}
        >
          Add Role
        </Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        loading={isLoading}
        bordered
        className="erp-table"
      />

      <Modal
        open={openModal}
        title={editingRole ? "Edit Role" : "Create Role"}
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="role_name"
            label="Role Name"
            rules={[{ required: true, message: "Please enter role name" }]}
          >
            <Input placeholder="Enter role name" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          {editingRole && (
            <Form.Item name="status" label="Status" valuePropName="checked">
              <Switch />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
}

export default Roles;