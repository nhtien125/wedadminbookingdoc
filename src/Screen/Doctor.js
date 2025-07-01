import React, { useEffect, useState } from "react";
import ApiService from "../../src/services/apiService";
import "./Doctor.css";

export default function Doctor() {
  const [doctors, setDoctors] = useState([]);
  const [specializationNames, setSpecializationNames] = useState({});
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await ApiService.get("/doctor/getAll");
      if (res.code === 200) {
        const doctorList = res.data;
        setDoctors(doctorList);

        const specializationIds = [...new Set(doctorList.map(doc => doc.specialization_id))];
        const userIds = [...new Set(doctorList.map(doc => doc.user_id))];

        const specializationResults = await Promise.all(specializationIds.map(async (id) => {
          try {
            const res = await ApiService.get(`/specialization/getById/${id}`);
            return { id, name: res.data?.name || "Không rõ" };
          } catch {
            return { id, name: "Lỗi chuyên khoa" };
          }
        }));

        const userResults = await Promise.all(userIds.map(async (id) => {
          try {
            const res = await ApiService.get(`/auth/getByID/${id}`);
            return { id, name: res.data?.name || "Không rõ" };
          } catch {
            return { id, name: "Lỗi tên người dùng" };
          }
        }));

        const specMap = {};
        specializationResults.forEach(({ id, name }) => { specMap[id] = name; });

        const userMap = {};
        userResults.forEach(({ id, name }) => { userMap[id] = name; });

        setSpecializationNames(specMap);
        setUserNames(userMap);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách bác sĩ:", err);
    }
  };

  return (
    <div className="doctor-container">
      <h2>Danh sách bác sĩ</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Tên người dùng</th>
              <th>Loại</th>
              <th>Chuyên khoa</th>
              <th>GPLX</th>
              <th>Giới thiệu</th>
              <th>Ảnh</th>
              <th>Tạo lúc</th>
              <th>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.uuid}>
                <td>{userNames[doc.user_id] || doc.user_id}</td>
                <td>{doc.doctor_type}</td>
                <td>{specializationNames[doc.specialization_id] || doc.specialization_id}</td>
                <td>{doc.license}</td>
                <td>{doc.introduce}</td>
                <td>
                  <img
                    src={doc.image}
                    alt="ảnh bác sĩ"
                    className="avatar"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/64")}
                  />
                </td>
                <td>{new Date(doc.created_at).toLocaleString()}</td>
                <td>{new Date(doc.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
