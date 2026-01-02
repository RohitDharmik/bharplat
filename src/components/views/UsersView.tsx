import React, { useState, useEffect } from "react";
import { User, UserRole, AttendanceRecord } from "../../types";
import { MOCK_ATTENDANCE } from "../../constants";
import {
  Search,
  Plus,
  MoreVertical,
  Shield,
  Mail,
  Clock,
  CalendarCheck,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useApi } from "../../hooks/useApi";
import { Modal, Form, Input, Select, message, Tabs, Table, Tag } from "antd";

const { Option } = Select;

interface UsersViewProps {
  currentUserRole?: UserRole;
}

export const UsersView: React.FC<UsersViewProps> = ({ currentUserRole }) => {
  const { users, addUser, isLoading } = useAppStore();
  const { getUsers, createUser: apiCreateUser } = useApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users from API
        // const usersData = await getUsers();
        // console.log('Users data from API:', usersData);
        console.log(
          "UsersView: Ready to fetch users from API using axiosInstance"
        );
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [getUsers]);

  const getAllowedRoles = () => {
    if (!currentUserRole) return [];

    if (currentUserRole === UserRole.SUPER_ADMIN) {
      return [UserRole.ADMIN];
    }

    if (currentUserRole === UserRole.ADMIN) {
      return Object.values(UserRole).filter(
        (role) =>
          role !== UserRole.SUPER_ADMIN &&
          role !== UserRole.ADMIN &&
          role !== UserRole.CHEF &&
          role !== UserRole.COOK &&
          role !== UserRole.GUEST &&
          role !== UserRole.WAITER
      );
    }
    if (currentUserRole === UserRole.SUB_ADMIN || currentUserRole === UserRole.MANAGER) {
      return Object.values(UserRole).filter(
        (role) => role !== UserRole.SUPER_ADMIN && role !== UserRole.ADMIN && role !== UserRole.SUB_ADMIN && role !== UserRole.MANAGER
      );
    }

  return [];
  };

  const allowedRoles = getAllowedRoles();
  const canAddUser = allowedRoles.length > 0;

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        const newUser: User = {
          id: `u${Date.now()}`,
          name: values.name,
          email: values.email,
          role: values.role,
          status: "Active",
          lastActive: new Date(),
        };

        try {
          // Using axiosInstance to create user
          // await apiCreateUser(newUser);
          // Then update local state
          await addUser(newUser);
          messageApi.success("User added successfully");
          setIsModalOpen(false);
          form.resetFields();
        } catch (error) {
          console.error("Failed to add user:", error);
          messageApi.error("Failed to add user");
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const attendanceColumns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (date: Date) => date.toLocaleDateString(),
    },
    {
      title: "Employee",
      dataIndex: "userId",
      render: (userId: string) =>
        users.find((u) => u.id === userId)?.name || userId,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={status === "Present" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Check In",
      dataIndex: "checkIn",
    },
    {
      title: "Check Out",
      dataIndex: "checkOut",
    },
  ];

  return (
    <div className="space-y-6">
      {contextHolder}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Staff Management
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Manage access, roles, and attendance
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search staff..."
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-neutral-900 dark:text-white focus:border-gold-500/50 focus:outline-none"
            />
          </div>
          {canAddUser && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap"
            >
              <Plus size={18} />
              <span className="hidden md:inline">Add Member</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 rounded-xl overflow-hidden backdrop-blur-md shadow-sm dark:shadow-none p-4">
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "Staff Directory",
              children: (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-white/5">
                        <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-300 text-sm">
                          User
                        </th>
                        <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-300 text-sm">
                          Role
                        </th>
                        <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-300 text-sm">
                          Status
                        </th>
                        <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-300 text-sm">
                          Last Active
                        </th>
                        <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-300 text-sm text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-neutral-200 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors group"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center border border-white/10">
                                <span className="font-bold text-neutral-600 dark:text-gold-400">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-neutral-900 dark:text-white">
                                  {user.name}
                                </div>
                                <div className="text-xs text-neutral-500 flex items-center mt-0.5">
                                  <Mail size={10} className="mr-1" />
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Shield
                                size={14}
                                className="text-gold-600 dark:text-gold-500"
                              />
                              <span className="text-sm text-neutral-600 dark:text-neutral-300">
                                {user.role}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${
                                  user.status === "Active"
                                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                                }
                              `}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  user.status === "Active"
                                    ? "bg-green-500 dark:bg-green-400"
                                    : "bg-red-500 dark:bg-red-400"
                                }`}
                              ></span>
                              {user.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                              <Clock size={14} className="mr-1.5" />
                              {user.lastActive.toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <button className="p-2 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ),
            },
            {
              key: "2",
              label: "Attendance & Payroll",
              children: (
                <div>
                  <div className="mb-4 flex justify-end">
                    <button className="text-xs bg-neutral-100 dark:bg-white/10 px-3 py-1 rounded">
                      Download Report
                    </button>
                  </div>
                  <Table
                    dataSource={MOCK_ATTENDANCE}
                    columns={attendanceColumns}
                    rowKey="id"
                    scroll={{ x: 600 }}
                  />
                </div>
              ),
            },
          ]}
        />
      </div>

      <Modal
        title="Add Staff Member"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isLoading}
        okText="Create User"
      >
        <Form
          form={form}
          layout="vertical"
          name="user_form"
          initialValues={{ role: UserRole.WAITER }}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select>
              {allowedRoles.map((role) => (
                <Option key={role} value={role}>
                  {role}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
