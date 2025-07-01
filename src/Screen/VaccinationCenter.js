import React, { useEffect, useState } from "react";
import ApiService from "../../src/services/apiService";
import Swal from "sweetalert2";
import "./VaccinationCenter.css";

export default function VaccinationCenter() {
  const [centers, setCenters] = useState([]);
  const [form, setForm] = useState({
    uuid: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    image: null,
    description: "",
    status: "",
    working_hours: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    const res = await ApiService.get("vaccination-center/getAll");
    if (res.code === 200) setCenters(res.data);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val !== null) formData.append(key, val);
    });

    try {
      if (isEditing) {
        await ApiService.put(`vaccination-center/update/${form.uuid}`, formData);
        Swal.fire("Đã cập nhật!", "", "success");
      } else {
        await ApiService.post("vaccination-center/add", formData);

        Swal.fire("Đã thêm mới!", "", "success");
      }
      fetchCenters();
      resetForm();
    } catch (err) {
      Swal.fire("Lỗi", "Không thể xử lý", "error");
    }
  };

  const handleEdit = (center) => {
    setForm({ ...center, image: null });
    setIsEditing(true);
  };

  const handleDelete = async (uuid) => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      showCancelButton: true,
      confirmButtonText: "Xóa",
    });
    if (confirm.isConfirmed) {
      await ApiService.delete(`vaccination-center/delete/${uuid}`);
      fetchCenters();
      Swal.fire("Đã xóa!", "", "success");
    }
  };

  const resetForm = () => {
    setForm({
      uuid: "",
      name: "",
      address: "",
      phone: "",
      email: "",
      image: null,
      description: "",
      status: "",
      working_hours: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="clinic-container">
      <h2>Quản lý Trung tâm tiêm chủng</h2>

      <form onSubmit={handleSubmit} className="clinic-form">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Tên" required />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Địa chỉ" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Số điện thoại" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input name="status" value={form.status} onChange={handleChange} placeholder="Trạng thái" required />
        <input name="working_hours" value={form.working_hours} onChange={handleChange} placeholder="Giờ làm việc" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Mô tả" />
        <input type="file" name="image" onChange={handleChange} accept="image/*" />
        <button type="submit">{isEditing ? "Cập nhật" : "Thêm mới"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Hủy</button>}
      </form>

      <div className="table-wrapper">
        <table className="clinic-table">
          <thead>
            <tr>
              
              <th>Tên</th>
              <th>Địa chỉ</th>
              <th>Điện thoại</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Giờ làm việc</th>
              <th>Mô tả</th>
              <th>Ảnh</th>
              <th>Ngày tạo</th>
              <th>Ngày cập nhật</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {centers.map((c) => (
              <tr key={c.uuid}>
              
                <td>{c.name}</td>
                <td>{c.address}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>{c.status}</td>
                <td>{c.working_hours}</td>
                <td>{c.description}</td>
                <td>
                  {c.image && (
                    <img
                      src={c.image}
                      alt="Vaccination Center"
                      width="60"
                      height="40"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </td>
                <td>{new Date(c.created_at).toLocaleString()}</td>
                <td>{new Date(c.updated_at).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleEdit(c)}>Sửa</button>
                  <button onClick={() => handleDelete(c.uuid)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
