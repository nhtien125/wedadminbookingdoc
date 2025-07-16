import React, { useEffect, useState } from "react";
import ApiService from "../../services/apiService";
import Swal from "sweetalert2";
import "./Clinic.css";

export default function Clinic() {
  const [data, setData] = useState([]);

  useEffect(() => { 
    fetchClinics(); 
  }, []);

  const fetchClinics = async () => {
    try {
      const result = await ApiService.get("clinic/getAll");
      if (result.code === 200) setData(result.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu phòng khám:", err);
    }
  };

  const showFormDialog = (clinic = null) => {
    const isEditing = clinic !== null;
    
    Swal.fire({
      title: isEditing ? 'Cập nhật phòng khám' : 'Thêm phòng khám mới',
      html: `
        <div class="swal-form">
          <div class="form-group">
            <label for="name">Tên phòng khám</label>
            <input id="name" type="text" placeholder="Nhập tên" value="${clinic?.name || ''}" required>
          </div>
          
          <div class="form-group">
            <label for="address">Địa chỉ</label>
            <input id="address" type="text" placeholder="Nhập địa chỉ" value="${clinic?.address || ''}" required>
          </div>
          
          <div class="form-group">
            <label for="phone">Số điện thoại</label>
            <input id="phone" type="text" placeholder="Nhập SĐT" value="${clinic?.phone || ''}">
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" placeholder="Nhập email" value="${clinic?.email || ''}">
          </div>
          
          <div class="form-group">
            <label for="description">Mô tả</label>
            <textarea id="description" placeholder="Nhập mô tả" rows="3">${clinic?.description || ''}</textarea>
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
              <input id="imageUrl" type="url" placeholder="Nhập URL ảnh" value="${clinic?.image || ''}" style="width: 100%;">
              <div id="imagePreview" class="image-preview">
                ${clinic?.image ? `<img src="${clinic.image}" alt="Preview" style="max-width: 200px; max-height: 150px; margin-top: 10px;">` : ''}
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
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const description = document.getElementById('description').value;
        
        // Kiểm tra loại ảnh được chọn
        const imageType = document.querySelector('input[name="imageType"]:checked').value;
        const imageUrl = document.getElementById('imageUrl').value;
        const imageFile = document.getElementById('imageFile').files[0];

        if (!name || !address) {
          Swal.showValidationMessage('Vui lòng điền đầy đủ tên và địa chỉ');
          return false;
        }

        return {
          name,
          address,
          phone,
          email,
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
          formData.append('uuid', clinic.uuid);
        }
        
        formData.append('name', result.value.name);
        formData.append('address', result.value.address);
        formData.append('phone', result.value.phone || '');
        formData.append('email', result.value.email || '');
        formData.append('description', result.value.description || '');
        
        // Xử lý ảnh dựa trên loại được chọn
        if (result.value.imageType === 'url' && result.value.imageUrl) {
          formData.append('image', result.value.imageUrl);
        } else if (result.value.imageType === 'file' && result.value.imageFile) {
          formData.append('image', result.value.imageFile);
        }

        try {
          if (isEditing) {
            await ApiService.put(`clinic/update/${clinic.uuid}`, formData);
            Swal.fire("Đã cập nhật!", "Cập nhật phòng khám thành công!", "success");
          } else {
            await ApiService.post("clinic/add", formData);
            Swal.fire("Đã thêm mới!", "Thêm phòng khám mới thành công!", "success");
          }
          fetchClinics();
        } catch (err) {
          console.error("Lỗi khi gửi form:", err);
          Swal.fire("Lỗi", "Không thể xử lý: " + err.message, "error");
        }
      }
    });
  };

  const handleDelete = async (uuid) => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa phòng khám này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33"
    });
    
    if (confirm.isConfirmed) {
      try {
        await ApiService.delete(`clinic/delete/${uuid}`);
        fetchClinics();
        Swal.fire("Đã xóa!", "Phòng khám đã được xóa thành công", "success");
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
        Swal.fire("Lỗi", "Không thể xóa: " + err.message, "error");
      }
    }
  };

  return (
    <div className="clinic-admin-container">
      <div className="clinic-header">
        <div className="clinic-title">Quản lý phòng khám</div>
        <button className="clinic-add-btn" onClick={() => showFormDialog()}>
          <span className="add-icon">+</span>
          Thêm phòng khám
        </button>
      </div>

      <div className="clinic-table-wrapper">
        <table className="clinic-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Địa chỉ</th>
              <th>SĐT</th>
              <th>Email</th>
              <th>Ảnh</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '16px' }}>Chưa có dữ liệu</td>
              </tr>
            )}
            {data.map((item) => (
              <tr key={item.uuid}>
                <td>{item.name}</td>
                <td>{item.address}</td>
                <td>{item.phone}</td>
                <td>{item.email}</td>
                <td>
                  <img
                    src={item.image || "https://via.placeholder.com/80"}
                    alt="Ảnh"
                    className="clinic-image"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/80")}
                  />
                </td>
                <td>{item.description}</td>
                <td>
                  <button className="clinic-action-btn" onClick={() => showFormDialog(item)}>Sửa</button>
                  <button className="clinic-action-btn clinic-delete-btn" onClick={() => handleDelete(item.uuid)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}