import React, { useEffect, useState } from "react";
import ApiService from "../../services/apiService";
import Swal from "sweetalert2";
import "./VaccinationCenter.css";

export default function VaccinationCenter() {
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    const res = await ApiService.get("vaccination-center/getAll");
    if (res.code === 200) setCenters(res.data);
  };

  const showFormDialog = (center = null) => {
    const isEditing = center !== null;
    
    Swal.fire({
      title: isEditing ? 'Cập nhật Trung tâm tiêm chủng' : 'Thêm Trung tâm tiêm chủng mới',
      html: `
        <div class="swal-form">
          <input id="name" type="text" placeholder="Tên" value="${center?.name || ''}" required>
          <input id="address" type="text" placeholder="Địa chỉ" value="${center?.address || ''}" required>
          <input id="phone" type="text" placeholder="Số điện thoại" value="${center?.phone || ''}" required>
          <input id="email" type="email" placeholder="Email" value="${center?.email || ''}" required>
          <input id="status" type="text" placeholder="Trạng thái" value="${center?.status || ''}" required>
          <input id="working_hours" type="text" placeholder="Giờ làm việc" value="${center?.working_hours || ''}">
          <textarea id="description" placeholder="Mô tả" rows="3">${center?.description || ''}</textarea>
          
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
              <input id="imageUrl" type="url" placeholder="Nhập URL ảnh" value="${center?.image || ''}" style="width: 100%;">
              <div id="imagePreview" class="image-preview">
                ${center?.image ? `<img src="${center.image}" alt="Preview" style="max-width: 200px; max-height: 150px; margin-top: 10px;">` : ''}
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
        const status = document.getElementById('status').value;
        const working_hours = document.getElementById('working_hours').value;
        const description = document.getElementById('description').value;
        
        // Kiểm tra loại ảnh được chọn
        const imageType = document.querySelector('input[name="imageType"]:checked').value;
        const imageUrl = document.getElementById('imageUrl').value;
        const imageFile = document.getElementById('imageFile').files[0];

        if (!name || !address || !phone || !email || !status) {
          Swal.showValidationMessage('Vui lòng điền đầy đủ các trường bắt buộc');
          return false;
        }

        return {
          name,
          address,
          phone,
          email,
          status,
          working_hours,
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
          formData.append('uuid', center.uuid);
        }
        
        formData.append('name', result.value.name);
        formData.append('address', result.value.address);
        formData.append('phone', result.value.phone);
        formData.append('email', result.value.email);
        formData.append('status', result.value.status);
        formData.append('working_hours', result.value.working_hours);
        formData.append('description', result.value.description);
        
        // Xử lý ảnh dựa trên loại được chọn
        if (result.value.imageType === 'url' && result.value.imageUrl) {
          formData.append('image', result.value.imageUrl);
        } else if (result.value.imageType === 'file' && result.value.imageFile) {
          formData.append('image', result.value.imageFile);
        }

        try {
          if (isEditing) {
            await ApiService.put(`vaccination-center/update/${center.uuid}`, formData);
            Swal.fire("Đã cập nhật!", "", "success");
          } else {
            await ApiService.post("vaccination-center/add", formData);
            Swal.fire("Đã thêm mới!", "", "success");
          }
          fetchCenters();
        } catch (err) {
          Swal.fire("Lỗi", "Không thể xử lý", "error");
        }
      }
    });
  };

  const handleDelete = async (uuid) => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa trung tâm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33"
    });
    
    if (confirm.isConfirmed) {
      try {
        await ApiService.delete(`vaccination-center/delete/${uuid}`);
        fetchCenters();
        Swal.fire("Đã xóa!", "Trung tâm đã được xóa thành công", "success");
      } catch (err) {
        Swal.fire("Lỗi", "Không thể xóa", "error");
      }
    }
  };

  return (
    <div className="clinic-container">
      <div className="header-section">
        <h2>Quản lý Trung tâm tiêm chủng</h2>
        <button className="add-button" onClick={() => showFormDialog()}>
          + Thêm mới
        </button>
      </div>

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
                  <button onClick={() => showFormDialog(c)}>Sửa</button>
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