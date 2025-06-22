import React, { useEffect, useState } from "react";

const Notifi = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const updateNotifications = () => {
      const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
      setNotifications(storedNotifications);
    };

    window.addEventListener("storage", updateNotifications);

    // Lần đầu tiên tải thông báo từ localStorage
    updateNotifications();

    return () => {
      window.removeEventListener("storage", updateNotifications);
    };
  }, []);

  const clearNotifications = () => {
    localStorage.removeItem("notifications");
    setNotifications([]);
  };

  return (
    <div className="noti-list">
      {notifications.length === 0 ? (
        <div className="no-noti">Không có thông báo mới</div>
      ) : (
        notifications.map((noti, index) => (
          <div key={index} className="noti-item">
            <h4>{noti.title}</h4>
            <p>{noti.message}</p>
            <small>{noti.timestamp}</small>
          </div>
        ))
      )}
      <button className="clear-noti-btn" onClick={clearNotifications}>
        Xóa tất cả thông báo
      </button>
    </div>
  );
};

export default Notifi;
