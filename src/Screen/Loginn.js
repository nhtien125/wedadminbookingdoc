import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Screen/Login.css"; // dùng lại style của login
import logoBlue from "../assets/images/logoBlue.png";
import eyesoff from "../assets/images/eyesoff.png";
import eyeson from "../assets/images/eyeson.png";
import ApiService from "../../src/services/apiService";

export default function Loginn(props) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const userData = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
    };

    try {
      const result = await ApiService.post("/auth/login", userData);

      if (result.code === 200) {
        const user = result.data;

        if (user.premission_id !== 1) {
          alert("Chỉ tài khoản Admin (quyền 1) mới được đăng nhập!");
          return;
        }

        alert("Đăng nhập thành công!");
        localStorage.setItem("access_token", user.access_token);
        localStorage.setItem("refresh_token", user.refresh_token);

        props.saveAdmin(user); // ✅ Cập nhật admin vào App

        navigate("/charts"); // ✅ Chuyển hướng vào bên trong
      } else {
        alert("Đăng nhập thất bại: " + result.msg);
      }
    } catch (err) {
      console.error("Lỗi khi đăng nhập:", err);
      alert("Lỗi đăng nhập!");
    }
  };

  return (
    <div>
      <div className="headers">
        <p className="title">Đăng nhập</p>
      </div>

      <div className="body">
        <div className="logo2Container">
          <img className="logoimg2" src={logoBlue} alt="logo" />
        </div>

        <div className="login-Container">
          <div className="textF-Container">
            <h1 className="text-login">Đăng nhập</h1>
            <p className="text-loginR">, để tiếp tục sử dụng</p>
          </div>

          <div className="inputLogin">
            <div className="inside-input">
              <label className="label">Tên đăng nhập</label>
              <input
                className={`input ${errors.username ? "input-error" : ""}`}
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="inside-input">
              <label className="label">Email</label>
              <input
                className={`input ${errors.email ? "input-error" : ""}`}
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="inside-input">
              <label className="label">Mật khẩu</label>
              <div className="input-password">
                <input
                  className={`input ${errors.password ? "input-error" : ""}`}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mật khẩu"
                  value={form.password}
                  onChange={handleChange}
                />
                <img
                  className="icon-eyesoff"
                  src={showPassword ? eyeson : eyesoff}
                  alt="toggle password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>

            <button onClick={handleSubmit} className="btn-login">
              Đăng nhập
            </button>
            <a className="forgot-password" href="/Register">
              Đăng ký
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
