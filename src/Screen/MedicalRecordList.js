import React, { useEffect, useState } from "react";
import ApiService from "../../src/services/apiService"; // Đảm bảo path đúng
import "./MedicalRecordList.css";

export default function MedicalRecordList() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await ApiService.get("/medicalRecord/getAll");
      if (res.code === 200) {
        setRecords(res.data);
      } else {
        console.error("Lỗi khi gọi API:", res.msg);
      }
    } catch (err) {
      console.error("Lỗi kết nối API:", err);
    }
  };

  return (
    <div className="record-container">
      <h2 className="record-title">Danh sách hồ sơ bệnh án</h2>
      <div className="table-scroll">
        <table className="record-table">
          <thead>
            <tr>
              <th>UUID</th>
              <th>Patient ID</th>
              <th>Ngày tạo</th>
              <th>Ngày cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.uuid}>
                <td>{rec.uuid}</td>
                <td>{rec.patient_id}</td>
                <td>{new Date(rec.created_at).toLocaleString()}</td>
                <td>{new Date(rec.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
