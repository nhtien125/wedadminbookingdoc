import React, { useEffect, useState } from "react";
import ApiService from "../../services/apiService";
import "./Review.css";

export default function Review() {
  const [reviews, setReviews] = useState([]);
  const [doctorNames, setDoctorNames] = useState({});
  const [userNames, setUserNames] = useState({});
  const [appointmentNames, setAppointmentNames] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5); // Số đánh giá mỗi trang

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await ApiService.get("review/getAll");
      if (res.code === 200) {
        const data = res.data;
        setReviews(data);
        fetchDoctorNames(data);
        fetchUserNames(data);
        fetchAppointmentNames(data);
      }
    } catch (err) {
      console.error("Lỗi khi tải đánh giá:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorNames = async (reviews) => {
    const names = {};
    const doctorIds = [...new Set(reviews.map((r) => r.doctor_id))];
    await Promise.all(
      doctorIds.map(async (doctorId) => {
        try {
          const doctorRes = await ApiService.get(`doctor/getById/${doctorId}`);
          const userId = doctorRes?.data?.user_id;
          if (userId) {
            const userRes = await ApiService.get(`auth/getById/${userId}`);
            const name = userRes?.data?.name;
            names[doctorId] = name ? ` ${name}` : `BS ${doctorId.slice(0, 6)}...`;
          } else {
            names[doctorId] = "Không rõ bác sĩ";
          }
        } catch {
          names[doctorId] = "Lỗi bác sĩ";
        }
      })
    );
    setDoctorNames(names);
  };

  const fetchUserNames = async (reviews) => {
    const names = {};
    const userIds = [...new Set(reviews.map((r) => r.user_id))];
    await Promise.all(
      userIds.map(async (userId) => {
        try {
          const res = await ApiService.get(`auth/getById/${userId}`);
          names[userId] = res?.data?.name || `User ${userId.slice(0, 6)}...`;
        } catch {
          names[userId] = "Lỗi người dùng";
        }
      })
    );
    setUserNames(names);
  };

  const fetchAppointmentNames = async (reviews) => {
    const names = {};
    const appointmentIds = [...new Set(reviews.map((r) => r.appointment_id))];
    await Promise.all(
      appointmentIds.map(async (uuid) => {
        try {
          const res = await ApiService.get(`appointment/getById/${uuid}`);
          const data = res?.data;
          let serviceName = "";
          let doctorName = "";
          let dateTime = "";

          if (data?.medical_service_id) {
            const s = await ApiService.get(`medical_service/getById/${data.medical_service_id}`);
            serviceName = s?.data?.name || "";
          }
          if (data?.doctor_id) {
            const doc = await ApiService.get(`doctor/getById/${data.doctor_id}`);
            const userId = doc?.data?.user_id;
            if (userId) {
              const u = await ApiService.get(`auth/getById/${userId}`);
              doctorName = u?.data?.name ? `${u.data.name}` : "";
            }
          }
          if (data?.date) {
            const d = new Date(data.date);
            dateTime = d.toLocaleString("vi-VN");
          }

          const name =
            [
              serviceName && `🩺 ${serviceName}`,
              doctorName && `👨‍⚕️ ${doctorName}`,
              dateTime && `📅 ${dateTime}`,
            ]
              .filter(Boolean)
              .join(" - ") || `App ${uuid.slice(0, 6)}...`;

          names[uuid] = name;
        } catch {
          names[uuid] = "Lỗi cuộc hẹn";
        }
      })
    );
    setAppointmentNames(names);
  };

  const handleDelete = async (uuid) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá đánh giá này?")) return;
    try {
      await ApiService.delete(`/review/delete/${uuid}`);
      fetchReviews();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
    }
  };

  // Tính toán dữ liệu phân trang
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="review-container">
      <div className="review-title">Danh sách đánh giá</div>
      <div className="review-table-wrapper">
        <table className="review-table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Bác sĩ</th>
              <th>Cuộc hẹn</th>
              <th>Sao</th>
              <th>Bình luận</th>
              <th>Tạo lúc</th>
              <th>Cập nhật</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 24 }}>
                  <div className="review-loader" />
                  <div style={{ color: "#2563eb", fontWeight: 700, marginTop: 8 }}>
                    Đang tải dữ liệu...
                  </div>
                </td>
              </tr>
            )}
            {!loading && reviews.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 24, color: "#888" }}>
                  Không có đánh giá nào.
                </td>
              </tr>
            )}
            {!loading &&
              currentReviews.map((r, idx) => (
                <tr key={r.uuid} className="review-row-animate" style={{ animationDelay: `${idx * 35}ms` }}>
                  <td>
                    {userNames[r.user_id] || <span className="review-badge">Đang tải...</span>}
                  </td>
                  <td>
                    {doctorNames[r.doctor_id] || <span className="review-badge">Đang tải...</span>}
                  </td>
                  <td>
                    {appointmentNames[r.appointment_id] || <span className="review-badge">Đang tải...</span>}
                  </td>
                  <td>
                    <span className="review-badge star">
                      {r.stars} <span style={{ color: "#ef4444", fontSize: 18, marginLeft: 1 }}>★</span>
                    </span>
                  </td>
                  <td style={{ maxWidth: 280, wordBreak: "break-word" }}>{r.comment}</td>
                  <td>{new Date(r.created_at).toLocaleString("vi-VN")}</td>
                  <td>{new Date(r.updated_at).toLocaleString("vi-VN")}</td>
                  <td>
                    <button
                      className="review-action-btn review-delete-btn"
                      onClick={() => handleDelete(r.uuid)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* Thanh phân trang */}
      {reviews.length > reviewsPerPage && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}