import React, { createContext, useState, useEffect } from "react";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    // Lấy dữ liệu admin từ localStorage khi load trang
    const savedAdmin = localStorage.getItem("admin");
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  useEffect(() => {
    // Khi state admin thay đổi, cập nhật lại localStorage
    if (admin) {
      localStorage.setItem("admin", JSON.stringify(admin));
    } else {
      localStorage.removeItem("admin"); // Xóa khỏi localStorage nếu admin là null
    }
  }, [admin]);

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
