import React, { useEffect, useState } from "react";
import ApiService from "../../services/apiService";
import Swal from "sweetalert2";
import "./Hospital.css";

// Icon cộng cho nút (bạn có thể dùng emoji hoặc xóa SVG này nếu không thích)
const PlusIcon = () => (
  <svg width="21" height="21" viewBox="0 0 20 20" fill="none"><path d="M10 4v12m6-6H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
);

export default function Hospital() {
  const [data, setData] = useState([]);

  useEffect(() => { 
    fetchHospitals(); 
  }, []);

  const fetchHospitals = async () => {
    try {
      const result = await ApiService.get("hospital/getAll");
      if (result.code === 200) setData(result.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    }
  };

  const showFormDialog = (hospital = null) => {
    const isEditing = hospital !== null;
    
    Swal.fire({
      title: isEditing ? 'Cập nhật bệnh viện' : 'Thêm bệnh viện mới',
      html: `
        <div class="swal-form">
          <div class="form-group">
            <label for="name">Tên bệnh viện</label>
            <input id="name" type="text" placeholder="Nhập tên bệnh viện" value="${hospital?.name || ''}" required>
          </div>
          
          <div class="form-group">
            <label for="address">Địa chỉ</label>
            <input id="address" type="text" placeholder="Nhập địa chỉ" value="${hospital?.address || ''}" required>
          </div>
          
          <div class="form-group">
            <label for="description">Mô tả</label>
            <textarea id="description" placeholder="Nhập mô tả" rows="3" required>${hospital?.description || ''}</textarea>
          </div>
          
          <div class="image-section">
            <label style="font-weight: bold; margin-bottom: 10px; display: block;">Chọn ảnh:</label>
            <div class="image-options">
              <label>
                <input type="radio" name="imageType" value="url" checked> URL ảnh
              </label>
              <label>
                <input type="radio" name="imageType" value="file"> Tải lên từ máy
              </label>
            </div>
            
            <div id="url-section" class="image-input-section">
              <input id="imageUrl" type="url" placeholder="Nhập URL ảnh" value="${hospital?.image || ''}" style="width: 100%;">
              <div id="imagePreview" class="image-preview">
                ${hospital?.image ? `<img src="${hospital.image}" alt="Preview" style="max-width: 200px; max-height: 150px; margin-top: 10px;">` : ''}
              </div>
            </div>
            
            <div id="file-section" class="image-input-section" style="display: none;">
              <input id="imageFile" type="file" accept="image/*" style="width: 100%;">
              <div id="filePreview" class="image-preview"></div>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: isEditing ? 'Cập nhật' : 'Thêm mới',
      cancelButtonText: 'Hủy',
      width: '700px',
      focusConfirm: false,
      didOpen: () => {
        // Xử lý chuyển đổi giữa URL và File
        const urlRadio = document.querySelector('input[value="url"]');
        const fileRadio = document.querySelector('input[value="file"]');
        const urlSection = document.getElementById('url-section');
        const fileSection = document.getElementById('file-section');
        const imageUrl = document.getElementById('imageUrl');
        const imageFile = document.getElementById('imageFile');
        const imagePreview = document.getElementById('imagePreview');
        const filePreview = document.getElementById('filePreview');

        // Xử lý khi chọn radio button
        urlRadio.addEventListener('change', () => {
          urlSection.style.display = 'block';
          fileSection.style.display = 'none';
        });

        fileRadio.addEventListener('change', () => {
          urlSection.style.display = 'none';
          fileSection.style.display = 'block';
        });

        // Preview ảnh từ URL
        imageUrl.addEventListener('input', (e) => {
          const url = e.target.value;
          if (url) {
            imagePreview.innerHTML = `<img src="${url}" alt="Preview" style="max-width: 200px; max-height: 150px; margin-top: 10px;" onerror="this.style.display='none'">`;
          } else {
            imagePreview.innerHTML = '';
          }
        });

        // Preview ảnh từ file
        imageFile.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              filePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 150px; margin-top: 10px;">`;
            };
            reader.readAsDataURL(file);
          } else {
            filePreview.innerHTML = '';
          }
        });
      },
      preConfirm: () => {
        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const description = document.getElementById('description').value;
        
        // Kiểm tra loại ảnh được chọn
        const imageType = document.querySelector('input[name="imageType"]:checked').value;
        const imageUrl = document.getElementById('imageUrl').value;
        const imageFile = document.getElementById('imageFile').files[0];

        if (!name || !address || !description) {
          Swal.showValidationMessage('Vui lòng điền đầy đủ các trường bắt buộc');
          return false;
        }

        return {
          name,
          address,
          description,
          imageType,
          imageUrl,
          imageFile
        };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        
        if (isEditing) {
          formData.append('uuid', hospital.uuid);
        }
        
        formData.append('name', result.value.name);
        formData.append('address', result.value.address);
        formData.append('description', result.value.description);
        
        // Xử lý ảnh dựa trên loại được chọn
        if (result.value.imageType === 'url' && result.value.imageUrl) {
          formData.append('image', result.value.imageUrl);
        } else if (result.value.imageType === 'file' && result.value.imageFile) {
          formData.append('image', result.value.imageFile);
        }

        try {
          if (isEditing) {
            await ApiService.put(`/hospital/update/${hospital.uuid}`, formData);
            Swal.fire("Đã cập nhật!", "Cập nhật bệnh viện thành công!", "success");
          } else {
            await ApiService.post("/hospital/add", formData);
            Swal.fire("Đã thêm mới!", "Thêm bệnh viện mới thành công!", "success");
          }
          fetchHospitals();
        } catch (error) {
          console.error("Lỗi khi gửi form:", error);
          Swal.fire("Lỗi", "Không thể xử lý: " + error.message, "error");
        }
      }
    });
  };

  const handleDelete = async (uuid) => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa bệnh viện này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33"
    });
    
    if (confirm.isConfirmed) {
      try {
        await ApiService.delete(`/hospital/delete/${uuid}`);
        setData((prev) => prev.filter((item) => item.uuid !== uuid));
        Swal.fire("Đã xóa!", "Bệnh viện đã được xóa thành công", "success");
      } catch (err) {
        console.error("Lỗi khi xoá:", err);
        Swal.fire("Lỗi", "Không thể xóa: " + err.message, "error");
      }
    }
  };

  return (
    <div className="hospital-admin-container">
      <div className="hospital-header">
        <h2 className="hospital-title">Quản lý bệnh viện</h2>
        <button className="add-hospital-btn" onClick={() => showFormDialog()}>
          <PlusIcon /> Thêm bệnh viện
        </button>
      </div>

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
                    onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
                  />
                </td>
                <td>
                  <button
                    onClick={() => showFormDialog(item)}
                    className="hospital-action-btn"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item.uuid)}
                    className="hospital-action-btn hospital-delete-btn"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '16px' }}>Chưa có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}