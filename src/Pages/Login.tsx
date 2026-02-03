import React from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import type { FormProps } from "antd";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../Utils/Axios";

type LoginFields = {
  email: string;
  password: string;
  remember?: boolean;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish: FormProps<LoginFields>["onFinish"] = async (values) => {
    try {
      const res = await axiosInstance.post("/login", {
        email: values.email,
        password: values.password,
      });
      localStorage.setItem("token", res.data.token);
      message.success("Login successful!");
      navigate("/customers");
    } catch (err) {
      message.error("Login failed. Check your credentials.");
      console.error(err);
    }
  };

  const onFinishFailed: FormProps<LoginFields>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Image Section */}
      <div
        style={{
          flex: 1,
          backgroundImage: 'url("/path-to-your-image.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: "2rem",
        }}
      >
        <h1>ERP SYSTEM</h1>
      </div>

      {/* Right Login Form Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#f7f8fa",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          <h2>Welcome Back!</h2>
          <p>Sign in to your account</p>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
            <Form.Item<LoginFields>
              label="Email Address"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<LoginFields>
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item<LoginFields> name="remember" valuePropName="checked">
              <Checkbox>Remember Me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>

            {/* Optional Social Login Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <Button shape="circle">G</Button>
              <Button shape="circle">M</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
