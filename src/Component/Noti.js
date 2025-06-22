import React from "react";
import nguoidung from "../assets/images/nguoidung.png"; 
import donhang from "../assets/images/donhang.png"
import thongke from "../assets/images/image 32.png"

const NotificationItem = ({ image, icon, title, description }) => (
  <div style={styles.notificationItem}>
    <div style={styles.iconContainer}>
      {image ? (
        <img src={image}  style={styles.image} />
      ) : (
        icon
      )}
    </div>
    <div style={styles.textContainer}>
      <h4 style={styles.title}>{title}</h4>
      <p style={styles.description}>{description}</p>
    </div>
  </div>
);

const Noti = () => {
  const notifications = [
    {
      id: 1,
      image: nguoidung,
      title: "Người dùng",
      description: "Có 3 người dùng mới đăng ký, hãy đến kiểm tra ngay nào!",
    },
    {
      id: 2,
      image: donhang,
      title: "Đơn hàng",
      description: "Có 15 đơn hàng đã xuất hôm nay.",
    },
    {
      id: 3,
      image: thongke,
      title: "Thống kê",
      description: "Top 10 sản phẩm đã được làm mới!",
    },
    {
      id: 3,
      image: nguoidung,
      title: "Thống kê",
      description: "Top 10 sản phẩm đã được làm mới!",
    },
    {
      id: 3,
      image: nguoidung,
      title: "Thống kê",
      description: "Top 10 sản phẩm đã được làm mới!",
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.notificationList}>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            image={notification.image}
            icon={notification.icon}
            title={notification.title}
            description={notification.description}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    left:"100px",
    alignItems: "flex-right",
 
    justifyContent: "end",

  },
  notificationList: {
    width: "400px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
 
  },
  notificationItem: {
    display: "flex",
    alignItems: "center",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
   
  },
  iconContainer: {
    fontSize: "30px",
    marginRight: "15px",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: 0,
    color: "#333",
  },
  description: {
    fontSize: "14px",
    color: "#666",
    margin: 0,
  },
  image: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
  },
};

export default Noti;