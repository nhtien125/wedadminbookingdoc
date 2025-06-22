import React, { useEffect, useState } from "react";
import ApiService from "../../src/services/apiService";
import "./Review.css";

export default function Review() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await ApiService.get("/review/getAll");
      if (res.code === 200) setReviews(res.data);
    } catch (err) {
      console.error("Lỗi khi tải đánh giá:", err);
    }
  };

  const handleDelete = async (uuid) => {
    try {
      await ApiService.delete(`/review/delete/${uuid}`);
      fetchReviews();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Danh sách đánh giá</h2>
      <div className="table-scroll">
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">User ID</th>
            <th className="border p-2">Doctor ID</th>
            <th className="border p-2">Appointment ID</th>
            <th className="border p-2">Sao</th>
            <th className="border p-2">Bình luận</th>
            <th className="border p-2">Tạo lúc</th>
            <th className="border p-2">Cập nhật</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.uuid}>
              <td className="border p-2">{r.user_id}</td>
              <td className="border p-2">{r.doctor_id}</td>
              <td className="border p-2">{r.appointment_id}</td>
              <td className="border p-2">{r.stars}</td>
              <td className="border p-2">{r.comment}</td>
              <td className="border p-2">
                {new Date(r.created_at).toLocaleString()}
              </td>
              <td className="border p-2">
                {new Date(r.updated_at).toLocaleString()}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(r.uuid)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
