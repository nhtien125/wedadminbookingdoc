import React, { useEffect, useState } from "react";
import ApiService from "../../src/services/apiService";
import "./Review.css";

export default function Review() {
  const [reviews, setReviews] = useState([]);
  const [doctorNames, setDoctorNames] = useState({});
  const [userNames, setUserNames] = useState({});
  const [appointmentNames, setAppointmentNames] = useState({});

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await ApiService.get("/review/getAll");
      if (res.code === 200) {
        const data = res.data;
        setReviews(data);
        fetchDoctorNames(data);
        fetchUserNames(data);
        fetchAppointmentNames(data);
      }
    } catch (err) {
      console.error("Lỗi khi tải đánh giá:", err);
    }
  };

  const fetchDoctorNames = async (reviews) => {
    const names = {};
    const doctorIds = [...new Set(reviews.map((r) => r.doctor_id))];

    await Promise.all(
      doctorIds.map(async (doctorId) => {
        try {
          const doctorRes = await ApiService.get(`/doctor/getById/${doctorId}`);
          const userId = doctorRes?.data?.user_id;

          if (userId) {
            const userRes = await ApiService.get(`/auth/getById/${userId}`);
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
          const res = await ApiService.get(`/auth/getById/${userId}`);
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
      appointmentIds.map(async (id) => {
        try {
          const res = await ApiService.get(`/appointment/getById/${id}`);
          const data = res?.data;

          let serviceName = "";
          let doctorName = "";
          let dateTime = "";

          if (data?.medical_service_id) {
            const s = await ApiService.get(`/medical_service/getById/${data.medical_service_id}`);
            serviceName = s?.data?.name || "";
          }

          if (data?.doctor_id) {
            const doc = await ApiService.get(`/doctor/getById/${data.doctor_id}`);
            const userId = doc?.data?.user_id;
            if (userId) {
              const u = await ApiService.get(`/auth/getById/${userId}`);
              doctorName = u?.data?.name ? `${u.data.name}` : "";
            }
          }

          if (data?.date) {
            const d = new Date(data.date);
            dateTime = d.toLocaleString("vi-VN");
          }

          const name =
            [serviceName && `🩺 ${serviceName}`, doctorName && `👨‍⚕️ ${doctorName}`, dateTime && `📅 ${dateTime}`]
              .filter(Boolean)
              .join(" - ") || `App ${id.slice(0, 6)}...`;

          names[id] = name;
        } catch {
          names[id] = "Lỗi cuộc hẹn";
        }
      })
    );

    setAppointmentNames(names);
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
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Danh sách đánh giá</h2>
      <div className="table-scroll overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Người dùng</th>
              <th className="border p-2">Bác sĩ</th>
              <th className="border p-2">Cuộc hẹn</th>
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
                <td className="border p-2">{userNames[r.user_id] || "Đang tải..."}</td>
                <td className="border p-2">{doctorNames[r.doctor_id] || "Đang tải..."}</td>
                <td className="border p-2">{appointmentNames[r.appointment_id] || "Đang tải..."}</td>
                <td className="border p-2">{r.stars}</td>
                <td className="border p-2">{r.comment}</td>
                <td className="border p-2">{new Date(r.created_at).toLocaleString()}</td>
                <td className="border p-2">{new Date(r.updated_at).toLocaleString()}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(r.uuid)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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
