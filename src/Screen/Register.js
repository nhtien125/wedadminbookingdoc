import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Dùng để điều hướng
import ApiService from "../../src/services/apiService";
import "../Screen/Register.css"; // Dùng lại style login
import logoBlue from "../assets/images/logoBlue.png";

export default function Register() {
  const navigate = useNavigate(); // ✅ Hook để chuyển trang

  const [form, setForm] = useState({
    premission_id: 1,
    username: "",
    password: "",
    email: "",
    name: "",
    phone: "",
    address: "",
  });

  const sanitizeInput = (value) => value.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      premission_id: Number(form.premission_id),
      username: sanitizeInput(form.username),
      password: sanitizeInput(form.password),
      email: sanitizeInput(form.email),
      name: sanitizeInput(form.name),
      phone: sanitizeInput(form.phone),
      address: sanitizeInput(form.address),
    };

    try {
      const result = await ApiService.post("/auth/register", userData);
      if (result.code === 200) {
        alert("Đăng ký thành công!");
        navigate("/Loginn"); // ✅ Điều hướng sang trang đăng nhập
      } else {
        alert("Đăng ký thất bại: " + result.msg);
      }
    } catch (err) {
      console.error("Lỗi khi gọi API đăng ký:", err);
      alert("Đăng ký thất bại!");
    }
  };

  return (
    <div>
      <div className="headers">
        <p className="title">Đăng ký</p>
      </div>

      <div className="body">
        <div className="logo2Container">
          <img className="logoimg2" src={logoBlue} alt="logo" />
        </div>

        <div className="login-Container">
          <div className="textF-Container">
            <h1 className="text-login">Đăng ký</h1>
            <p className="text-loginR">, tạo tài khoản để tiếp tục</p>
          </div>

          <div className="inputLogin">
            {[
              { name: "premission_id", label: "Permission ID", type: "number", readOnly: true },
              { name: "username", label: "Tên đăng nhập", type: "text" },
              { name: "password", label: "Mật khẩu", type: "password" },
              { name: "email", label: "Email", type: "email" },
              { name: "name", label: "Họ tên", type: "text" },
              { name: "phone", label: "Số điện thoại", type: "text" },
              { name: "address", label: "Địa chỉ", type: "text" },
            ].map((field) => (
              <div className="inside-input" key={field.name}>
                <label className="label">{field.label}</label>
                <input
                  className="input"
                  name={field.name}
                  type={field.type}
                  placeholder={field.label}
                  value={form[field.name]}
                  onChange={handleChange}
                  readOnly={field.readOnly}
                  required={["username", "email", "password", "premission_id"].includes(field.name)}
                />
              </div>
            ))}

            <button onClick={handleSubmit} className="btn-login">
              Đăng ký
            </button>
            <a className="forgot-password" href="/Loginn">
              Đăng nhập
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
