import React, { useEffect, useState } from "react";
import ApiService from "../services/apiService";
import "./Hospital.css";

export default function Hospital() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    uuid: "",
    name: "",
    address: "",
    description: "",
    imageFile: null,
    imageUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const result = await ApiService.get("/hospital/getAll");
      if (result.code === 200) setData(result.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      const file = files[0];
      setForm((prev) => ({
        ...prev,
        imageFile: file,
        imageUrl: "",
      }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreviewImage("");
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      if (name === "imageUrl") setPreviewImage(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("address", form.address);
      formData.append("description", form.description);
      if (form.imageFile) formData.append("image", form.imageFile);
      else if (form.imageUrl) formData.append("image", form.imageUrl);

      if (isEditing) {
        await ApiService.put(`/hospital/update/${form.uuid}`, formData);
      } else {
        const res = await ApiService.post("/hospital/add", formData);
        setData((prev) => [...prev, res.data]);
      }

      resetForm();
      fetchHospitals();
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
    }
  };

  const handleEdit = (item) => {
    setForm({
      uuid: item.uuid,
      name: item.name,
      address: item.address,
      description: item.description || "",
      imageFile: null,
      imageUrl: item.image || "",
    });
    setPreviewImage(item.image || "");
    setIsEditing(true);
  };

  const handleDelete = async (uuid) => {
    try {
      await ApiService.delete(`/hospital/delete/${uuid}`);
      setData((prev) => prev.filter((item) => item.uuid !== uuid));
    } catch (err) {
      console.error("Lỗi khi xoá:", err);
    }
  };

  const resetForm = () => {
    setForm({
      uuid: "",
      name: "",
      address: "",
      description: "",
      imageFile: null,
      imageUrl: "",
    });
    setIsEditing(false);
    setPreviewImage("");
  };

  return (
    <div className="p-4 max-w-5xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Quản lý bệnh viện</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Tên bệnh viện"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            value={form.address}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Mô tả"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Hoặc dán link ảnh (https://...)"
            value={form.imageUrl}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {previewImage && (
          <div>
            <p className="text-sm text-gray-100 mb-1">Xem trước ảnh:</p>
            <img
              src={previewImage}
              alt="Preview"
              className="imgbe"
            />
          </div>
        )}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {isEditing ? "Cập nhật" : "Thêm mới"}
        </button>
      </form>

      {/* TABLE */}
      <div className="hospital-table-wrapper">
        <table className="hospital-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Địa chỉ</th>
              <th>Mô tả</th>
              <th>Ảnh</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.uuid}>
                <td>{item.name}</td>
                <td>{item.address}</td>
                <td>{item.description}</td>
                <td>
                  <img
                    src={item.image || "https://via.placeholder.com/100"}
                    alt="Ảnh"
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item.uuid)}
                    className="bg-red-500 px-3 py-1 text-white rounded hover:bg-red-600 ml-2"
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
