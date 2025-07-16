import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock, LogIn } from "lucide-react";
import ApiService from "../../services/apiService";

export default function AdminLogin(props) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const userData = {
      username: form.username.trim(),
      password: form.password.trim(),
    };

    try {
      const result = await ApiService.post("/auth/login", userData);

      if (result.code === 200) {
        const user = result.data;

        if (user.premission_id !== 1) {
          alert("Chỉ tài khoản Admin (quyền 1) mới được đăng nhập!");
          setIsLoading(false);
          return;
        }

        alert("Đăng nhập thành công!");
        localStorage.setItem("access_token", user.access_token);
        localStorage.setItem("refresh_token", user.refresh_token);

        props.saveAdmin(user); // ✅ Cập nhật admin vào App

        navigate("/charts"); // ✅ Chuyển hướng vào bên trong
      } else {
        alert("Đăng nhập thất bại: " + result.msg);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Lỗi khi đăng nhập:", err);
      alert("Lỗi đăng nhập!");
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    backgroundDecor: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      pointerEvents: 'none'
    },
    decorCircle1: {
      position: 'absolute',
      top: '-160px',
      right: '-160px',
      width: '320px',
      height: '320px',
      background: 'radial-gradient(circle, rgba(102,126,234,0.2) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)'
    },
    decorCircle2: {
      position: 'absolute',
      bottom: '-160px',
      left: '-160px',
      width: '320px',
      height: '320px',
      background: 'radial-gradient(circle, rgba(118,75,162,0.2) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)'
    },
    wrapper: {
      position: 'relative',
      width: '100%',
      maxWidth: '400px',
      zIndex: 1
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    logoContainer: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '64px',
      height: '64px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      borderRadius: '16px',
      marginBottom: '16px',
      boxShadow: '0 8px 32px rgba(102,126,234,0.3)'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '8px',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    subtitle: {
      color: 'rgba(255,255,255,0.9)',
      fontSize: '16px'
    },
    formContainer: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
      padding: '40px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    inputGroup: {
      marginBottom: '24px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#374151',
      fontSize: '14px'
    },
    inputContainer: {
      position: 'relative'
    },
    inputIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9CA3AF',
      pointerEvents: 'none'
    },
    input: {
      width: '100%',
      padding: '12px 12px 12px 40px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '16px',
      background: 'rgba(249, 250, 251, 0.8)',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#667eea',
      background: 'white',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    },
    passwordContainer: {
      position: 'relative'
    },
    passwordToggle: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#9CA3AF',
      padding: '4px',
      transition: 'color 0.2s ease'
    },
    button: {
      width: '100%',
      padding: '12px 16px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
      transform: 'translateY(0)'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
    },
    buttonDisabled: {
      opacity: '0.6',
      cursor: 'not-allowed',
      transform: 'none'
    },
    loading: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '2px solid #ffffff',
      borderTop: '2px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    footer: {
      textAlign: 'center',
      marginTop: '24px',
      color: '#6B7280',
      fontSize: '14px'
    },
    bottomText: {
      textAlign: 'center',
      marginTop: '20px',
      color: 'rgba(255,255,255,0.8)',
      fontSize: '12px'
    }
  };

  return (
    <div style={styles.container}>
      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Background decorative elements */}
      <div style={styles.backgroundDecor}>
        <div style={styles.decorCircle1}></div>
        <div style={styles.decorCircle2}></div>
      </div>

      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Đăng nhập</h1>
          <p style={styles.subtitle}>Hệ thống quản trị viên</p>
        </div>

        {/* Main Form */}
        <div style={styles.formContainer}>
          <div>
            {/* Username Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Tên đăng nhập
              </label>
              <div style={styles.inputContainer}>
                <div style={styles.inputIcon}>
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Nhập tên đăng nhập"
                  style={{
                    ...styles.input,
                    borderColor: errors.username ? '#ef4444' : '#e5e7eb'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = 'rgba(249, 250, 251, 0.8)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.username && (
                <p style={{color: '#ef4444', fontSize: '12px', marginTop: '4px'}}>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Mật khẩu
              </label>
              <div style={styles.passwordContainer}>
                <div style={styles.inputIcon}>
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  style={{
                    ...styles.input,
                    paddingRight: '40px',
                    borderColor: errors.password ? '#ef4444' : '#e5e7eb'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = 'rgba(249, 250, 251, 0.8)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#9CA3AF';
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p style={{color: '#ef4444', fontSize: '12px', marginTop: '4px'}}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                ...styles.button,
                ...(isLoading ? styles.buttonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={styles.loading}></div>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Đăng nhập
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <p>Hệ thống quản trị viên</p>
          </div>
        </div>

        {/* Additional Info */}
        <div style={styles.bottomText}>
          <p>© 2024 Your Company. Đăng nhập an toàn và bảo mật.</p>
        </div>
      </div>
    </div>
  );
}