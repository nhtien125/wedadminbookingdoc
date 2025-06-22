import React, { useState } from "react";
import "../Screen/Login.css";
import logoBlue from "../assets/images/logoBlue.png";
import logo2 from "../assets/images/logoBlue.png";
import eyesoff from "../assets/images/eyesoff.png";
import eyeson from "../assets/images/eyeson.png";
import Swal from "sweetalert2";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleResetPassword = async () => {
    setErrors({
      email: "",
      password: "",
      newPassword: "",
      confirmPassword: "",
    });

    // Validate dữ liệu nhập
    const newErrors = {};
    if (!email) newErrors.email = "Vui lòng nhập email";
    if (!password) newErrors.password = "Vui lòng nhập mật khẩu cũ";
    if (!newPassword) newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    if (!confirmPassword)
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const body = {
        email: email,
        password: password,
        newPassword: newPassword,
      };

      const response = await fetch(
        "https://server-vert-rho-94.vercel.app/admins/change-passwordAdmin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (response.ok) {
        Swal.fire("Đổi mật khẩu thành công!", "", "success");
      } else {
        Swal.fire(
          "Đổi mật khẩu thất bại",
          result.message || "Mật khẩu không chính xác hoặc có lỗi xảy ra!",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Lỗi hệ thống", "Vui lòng thử lại sau.", "error");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div>
      <div className="headers">
        <div className="logoContainer">
          <img className="logoimg" src={logoBlue} alt="logoBlue" />
          <span className="text-logo">The Mini Store</span>
        </div>
        <p className="title">Đổi mật khẩu</p>
        <p className="titleRight">Bạn cần hỗ trợ?</p>
      </div>
      <div className="body">
        <div className="logo2Container">
          <img className="logoimg2" src={logo2} alt="logo2" />
          <span className="text-logo2">The Mini Store</span>
        </div>
        <div className="login-Container2">
          <div className="textF-Container">
            <h1 className="text-login">Đổi mật khẩu</h1>
            <p className="text-loginR">, nhập để tiếp tục</p>
          </div>
          <div className="inside-input">
            <label className="label">Email</label>
            <input
              className={`input ${errors.email ? "input-error" : ""}`}
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="inside-input">
            <label className="label">Mật khẩu cũ</label>
            <div className="input-password">
              <input
                className={`input ${errors.password ? "input-error" : ""}`}
                placeholder="Nhập mật khẩu cũ"
                type={showPassword.oldPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                className="icon-eyesoff"
                src={showPassword.oldPassword ? eyeson : eyesoff}
                alt="Hiển thị/Ẩn mật khẩu"
                onClick={() => togglePasswordVisibility("oldPassword")}
                style={{ cursor: "pointer" }}
              />
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          <div className="inside-input">
            <label className="label">Mật khẩu mới</label>
            <div className="input-password">
              <input
                className={`input ${errors.newPassword ? "input-error" : ""}`}
                placeholder="Nhập mật khẩu mới"
                type={showPassword.newPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <img
                className="icon-eyesoff"
                src={showPassword.newPassword ? eyeson : eyesoff}
                alt="Hiển thị/Ẩn mật khẩu"
                onClick={() => togglePasswordVisibility("newPassword")}
                style={{ cursor: "pointer" }}
              />
            </div>
            {errors.newPassword && (
              <p className="error-text">{errors.newPassword}</p>
            )}
          </div>
          <div className="inside-input">
            <label className="label">Xác nhận mật khẩu mới</label>
            <div className="input-password">
              <input
                className={`input ${
                  errors.confirmPassword ? "input-error" : ""
                }`}
                placeholder="Nhập lại mật khẩu mới"
                type={showPassword.confirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <img
                className="icon-eyesoff"
                src={showPassword.confirmPassword ? eyeson : eyesoff}
                alt="Hiển thị/Ẩn mật khẩu"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                style={{ cursor: "pointer" }}
              />
            </div>
            {errors.confirmPassword && (
              <p className="error-text">{errors.confirmPassword}</p>
            )}
          </div>
          <button onClick={handleResetPassword} className="btn-login">
            Xác nhận
          </button>
          <a
            className="forgot-password"
            href="/login"
            alt="login"
          >
            Đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
