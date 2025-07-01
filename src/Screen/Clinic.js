import React, { useEffect, useState } from "react";
import ApiService from "../../src/services/apiService";
import "./Clinic.css";

export default function Clinic() {
  const [data, setData] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState({
    uuid: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    image: "",
    hospital_id: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchClinics();
    fetchHospitals();
  }, []);

  const fetchClinics = async () => {
    try {
      const result = await ApiService.get("clinic/getAll");
      if (result.code === 200) setData(result.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu phòng ban:", err);
    }
  };

  const fetchHospitals = async () => {
    try {
      const result = await ApiService.get("hospital/getAll");
      if (result.code === 200) setHospitals(result.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách bệnh viện:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name || "",
        address: form.address || "",
        phone: form.phone || "",
        email: form.email || "",
        image: form.image || "",
        hospital_id: form.hospital_id || null,
        description: form.description || "",
      };

      if (isEditing) {
        await ApiService.put(`clinic/update/${form.uuid}`, payload);
      } else {
        await ApiService.post("clinic/add", payload);
      }

      setForm({
        uuid: "",
        name: "",
        address: "",
        phone: "",
        email: "",
        image: "",
        hospital_id: "",
        description: "",
      });
      setIsEditing(false);
      fetchClinics();
    } catch (err) {
      console.error("Lỗi khi gửi form:", err);
    }
  };

  const handleEdit = (item) => {
    setForm({
      uuid: item.uuid,
      name: item.name || "",
      address: item.address || "",
      phone: item.phone || "",
      email: item.email || "",
      image: item.image || "",
      hospital_id: item.hospital_id || "",
      description: item.description || "",
    });
    setIsEditing(true);
  };

  const handleDelete = async (uuid) => {
    try {
      await ApiService.delete(`clinic/delete/${uuid}`);
      fetchClinics();
    } catch (err) {
      console.error("Lỗi khi xoá:", err);
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Quản lý phòng khám</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Tên" required />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Địa chỉ" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="SĐT" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Link ảnh (https://...)" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Mô tả" rows="3" />
        <select name="hospital_id" value={form.hospital_id} onChange={handleChange}>
          <option value="">-- Chọn bệnh viện --</option>
          {hospitals.map((h) => (
            <option key={h.uuid} value={h.uuid}>
              {h.name}
            </option>
          ))}
        </select>
        <button type="submit">{isEditing ? "Cập nhật" : "Thêm mới"}</button>
      </form>

      <div className="table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Địa chỉ</th>
              <th>SĐT</th>
              <th>Email</th>
              <th>Ảnh</th>
              <th>Mô tả</th>
              <th>Bệnh viện</th>
              <th>Tạo lúc</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const hospital = hospitals.find((h) => h.uuid === item.hospital_id);
              return (
                <tr key={item.uuid}>
                  <td>{item.name}</td>
                  <td>{item.address}</td>
                  <td>{item.phone}</td>
                  <td>{item.email}</td>
                  <td>
                    <img
                      src={item.image || "https://via.placeholder.com/80"}
                      alt="Ảnh"
                      className="admin-image"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80";
                      }}
                    />
                  </td>
                  <td>{item.description}</td>
                  <td>{hospital ? hospital.name : "Không rõ"}</td>
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(item)}>Sửa</button>
                    <button className="delete-btn" onClick={() => handleDelete(item.uuid)}>Xoá</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
