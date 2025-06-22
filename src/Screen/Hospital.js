import React, { useEffect, useState } from "react";
import ApiService from "../services/apiService";
import "./Hospital.css"; // CSS riêng nếu có

export default function Hospital() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    uuid: "",
    name: "",
    address: "",
    imageFile: null,
    imageUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const result = await ApiService.get("/hospital/getAll");
        if (result.code === 200) setData(result.data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };
    fetchHospitals();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      const file = files[0];
      setForm((prev) => ({
        ...prev,
        imageFile: file,
        imageUrl: "", // reset link nếu có file
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
      if (name === "imageUrl") {
        setPreviewImage(value); // preview link ảnh
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("address", form.address);

      if (form.imageFile) {
        formData.append("image", form.imageFile);
      } else if (form.imageUrl) {
        formData.append("image", form.imageUrl);
      }

      if (isEditing) {
        await ApiService.put(`/hospital/update/${form.uuid}`, formData);
      } else {
        const res = await ApiService.post("/hospital/add", formData);
        setData((prev) => [...prev, res.data]);
      }

      setForm({
        uuid: "",
        name: "",
        address: "",
        imageFile: null,
        imageUrl: "",
      });
      setPreviewImage("");
      setIsEditing(false);

      const updated = await ApiService.get("/hospital/getAll");
      setData(updated.data);
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
    }
  };

  const handleEdit = (item) => {
    setForm({
      uuid: item.uuid,
      name: item.name,
      address: item.address,
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

  return (
    <div className="p-4 max-w-5xl mx-auto overflow-y-auto min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Quản lý bệnh viện</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-white p-4 rounded shadow">
        <input
          type="text"
          name="name"
          placeholder="Tên bệnh viện"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          value={form.address}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <div className="flex gap-2">
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleChange}
            className="border p-2 w-1/2 rounded"
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Hoặc dán link ảnh (https://...)"
            value={form.imageUrl}
            onChange={handleChange}
            className="border p-2 w-1/2 rounded"
          />
        </div>

        {previewImage && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Xem trước ảnh:</p>
            <img
              src={previewImage}
              alt="Preview"
              className="w-24 h-24 object-cover border rounded"
            />
          </div>
        )}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {isEditing ? "Cập nhật" : "Thêm mới"}
        </button>
      </form>

      <div className="overflow-auto max-h-[200px] border rounded bg-white">
      <div className="table-scroll">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border p-2">Tên</th>
              <th className="border p-2">Địa chỉ</th>
              <th className="border p-2">Ảnh</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.uuid}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.address}</td>
                <td className="border p-2">
                  <img
                    src={item.image || "https://via.placeholder.com/100"}
                    alt="Ảnh"
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/100")
                    }
                  />
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item.uuid)}
                    className="bg-red-500 px-3 py-1 text-white rounded hover:bg-red-600"
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
    </div>
  );
}
