import React, { useState } from "react";
import "../Screen/Login.css";
import logoBlue from "../assets/images/logoBlue.png";
import logo2 from "../assets/images/logoBlue.png";
import eyesoff from "../assets/images/eyesoff.png";
import eyeson from "../assets/images/eyeson.png"; // Icon mới để hiển thị mật khẩu
import Swal from "sweetalert2";


function Login(props) {
  const { saveAdmin } = props;
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminID, setAdminID] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    adminID: "",
  });

  const handleLogin = async () => {
    // Đặt lại lỗi
    setErrors({ email: "", password: "", adminID: "" });

    // Kiểm tra dữ liệu
    const newErrors = {};
    if (!email) newErrors.email = "Vui lòng nhập địa chỉ email";
    if (!password) newErrors.password = "Vui lòng nhập mật khẩu";
    if (!adminID) newErrors.adminID = "Vui lòng nhập ID Admin";

    // Nếu có lỗi, hiển thị lỗi và dừng quy trình đăng nhập
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Thực hiện đăng nhập
    try {
      const body = {
        email: email,
        password: password,
        adminID: adminID,
      };
      const response = await fetch("https://server-vert-rho-94.vercel.app/admins/loginAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();

      if (result.status) {
        // Lưu dữ liệu admin nếu đăng nhập thành công
        saveAdmin(result.data);
        Swal.fire("Đăng nhập thành công!", "", "success");
      } else {
        Swal.fire(
          "Đăng nhập thất bại",
          "Email, mật khẩu hoặc ID Admin không chính xác!",
          "error"
        );
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Lỗi hệ thống", "Vui lòng thử lại sau.", "error");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div className="headers">
        <div className="logoContainer">
    

        </div>
        <p className="title">Đăng nhập</p>
        <p className="titleRight">Bạn cần hỗ trợ?</p>
      </div>
      <div className="body">
        <div className="logo2Container">
          <img className="logoimg2" src={logoBlue} alt="logoBlue" />
    
        </div>
        <div className="login-Container">
          <div className="textF-Container">
            <h1 className="text-login">Đăng nhập</h1>
            <p className="text-loginR">, để tiếp tục sử dụng</p>
          </div>
          <div className="inputLogin">
            <div className="inside-input">
              <label className="label">Địa chỉ email</label>
              <input
                className={`input ${errors.email ? "input-error" : ""}`}
                placeholder="Nhập địa chỉ email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            <div className="inside-input">
              <label className="label">Mật khẩu</label>
              <div className="input-password">
                <input
                  className={`input ${errors.password ? "input-error" : ""}`}
                  placeholder="Nhập mật khẩu"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <img
                  className="icon-eyesoff"
                  src={showPassword ? eyeson : eyesoff}
                  alt=""
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                />
              </div>
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>
            <div className="inside-input">
              <label className="label">ID Admin</label>
              <input
                className={`input ${errors.adminID ? "input-error" : ""}`}
                placeholder="Nhập ID Admin"
                value={adminID}
                onChange={(e) => setAdminID(e.target.value)}
              />
              {errors.adminID && <p className="error-text">{errors.adminID}</p>}
            </div>
            <button onClick={handleLogin} className="btn-login">
              Đăng nhập
            </button>
            <a className="forgot-password" href="/ResetPassword" alt="insert">
              Đổi mật khẩu?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
