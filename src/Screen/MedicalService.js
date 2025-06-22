// File: src/pages/QLHH.jsx
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ApiService from "../services/apiService";
import "./MedicalService.css";

export default function MedicalService() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    uuid: "",
    name: "",
    description: "",
    price: "",
    specialization_id: "",
    clinic_id: "",
    hospital_id: "",
    image: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showHospitalSelect, setShowHospitalSelect] = useState(true);

  const [specializations, setSpecializations] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    fetchServices();
    fetchSpecializations();
    fetchClinics();
    fetchHospitals();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await ApiService.get("medical_service/getAll");
      if (res.code === 200) setServices(res.data);
    } catch (err) {
      console.error("Lỗi tải dịch vụ:", err);
    }
  };

  const fetchSpecializations = async () => {
    const res = await ApiService.get("specialization/getAll");
    if (res.code === 200) setSpecializations(res.data);
  };

  const fetchClinics = async () => {
    const res = await ApiService.get("clinic/getAll");
    if (res.code === 200) setClinics(res.data);
  };

  const fetchHospitals = async () => {
    const res = await ApiService.get("hospital/getAll");
    if (res.code === 200) setHospitals(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  
    if (name === "clinic_id") {
      const selectedClinic = clinics.find((c) => c.uuid === value);
      if (selectedClinic && !selectedClinic.hospital_id) {
        setShowHospitalSelect(false);
        setForm((prev) => ({ ...prev, hospital_id: "" }));
      } else {
        setShowHospitalSelect(true);
      }
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await ApiService.put(`medical_service/update/${form.uuid}`, {
          ...form,
          price: parseFloat(form.price),
        });
      } else {
        await ApiService.post("medical_service/create", {
          ...form,
          uuid: uuidv4(),
          price: parseFloat(form.price),
        });
      }
      setForm({
        uuid: "",
        name: "",
        description: "",
        price: "",
        specialization_id: "",
        clinic_id: "",
        hospital_id: "",
        image: "",
      });
      setIsEditing(false);
      fetchServices();
    } catch (err) {
      console.error("Lỗi khi gửi dữ liệu:", err);
      alert("Lỗi khi gửi dữ liệu: " + err.message);
    }
  };

  const handleEdit = (item) => {
    setForm({ ...item });
    setIsEditing(true);
  };
const handleDelete = async (uuid) => {
    try {
      console.log("UUID muốn xoá:", uuid);
      const res = await ApiService.delete(`medical_service/delete/${uuid}`);
      if (res.code === 200) {
        fetchServices();
      } else {
        console.error("Xoá thất bại:", res.msg);
        alert("Không thể xoá dịch vụ. " + res.msg);
      }
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert("Lỗi hệ thống khi xoá: " + err.message);
    }
  };

  return (
    <div className="service-container">
      <h2 className="service-title">Quản lý Dịch vụ</h2>
      <form className="service-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Tên dịch vụ"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="price"
          placeholder="Giá"
          type="number"
          value={form.price}
          onChange={handleChange}
        />

        <select
          name="specialization_id"
          value={form.specialization_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Chọn chuyên khoa --</option>
          {specializations.map((s) => (
            <option key={s.uuid} value={s.uuid}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          name="clinic_id"
          value={form.clinic_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Chọn phòng khám --</option>
          {clinics.map((c) => (
            <option key={c.uuid} value={c.uuid}>
              {c.name}
            </option>
          ))}
        </select>
        {showHospitalSelect && (
          <select
            name="hospital_id"
            value={form.hospital_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn bệnh viện --</option>
            {hospitals.map((h) => (
              <option key={h.uuid} value={h.uuid}>
                {h.name}
              </option>
            ))}
          </select>
        )}

        <input
          name="image"
          placeholder="Link ảnh"
          value={form.image}
          onChange={handleChange}
        />
        <button type="submit">{isEditing ? "Cập nhật" : "Thêm mới"}</button>
      </form>

      <div className="table-scroll">
        <table className="service-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th>Ảnh</th>
              <th>Chuyên khoa</th>
              <th>Phòng khám</th>
              <th>Bệnh viện</th>
              <th>Ngày tạo</th>
              <th>Ngày cập nhật</th>
<th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {services.map((item) => (
              <tr key={item.uuid}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.price?.toLocaleString()}₫</td>
                <td>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="service-img"
                  />
                </td>
                <td>
                  {specializations.find(
                    (s) => s.uuid === item.specialization_id
                  )?.name || "Không rõ"}
                </td>
                <td>
                  {clinics.find((c) => c.uuid === item.clinic_id)?.name ||
                    "Không rõ"}
                </td>
                <td>
                  {hospitals.find((h) => h.uuid === item.hospital_id)?.name ||
                    "Không rõ"}
                </td>
                <td>{new Date(item.created_at).toLocaleString()}</td>
                <td>{new Date(item.updated_at).toLocaleString()}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(item)}>
                    Sửa
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.uuid)}
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