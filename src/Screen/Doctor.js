import React, { useEffect, useState } from "react";
import ApiService from "../../src/services/apiService"; // cập nhật đúng đường dẫn

export default function Doctor() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await ApiService.get("/doctor/getAll"); // hoặc `/user/doctors` nếu bạn tạo endpoint mới
      if (res.code === 200) {
        setDoctors(res.data);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách bác sĩ:", err);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Danh sách bác sĩ</h2>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">User ID</th>
              <th className="border p-2">Loại</th>
              <th className="border p-2">Chuyên khoa</th>
              <th className="border p-2">GPLX</th>
              <th className="border p-2">Giới thiệu</th>
              <th className="border p-2">Ảnh</th>
              <th className="border p-2">Tạo lúc</th>
              <th className="border p-2">Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.uuid}>
                <td className="border p-2">{doc.user_id}</td>
                <td className="border p-2">{doc.doctor_type}</td>
                <td className="border p-2">{doc.specialization_id}</td>
                <td className="border p-2">{doc.license}</td>
                <td className="border p-2">{doc.introduce}</td>
                <td className="border p-2">
                  <img
                    src={doc.image}
                    alt="ảnh bác sĩ"
                    className="w-16 h-16 object-cover"
                  />
                </td>
                <td className="border p-2">
                  {new Date(doc.created_at).toLocaleString()}
                </td>
                <td className="border p-2">
                  {new Date(doc.updated_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}