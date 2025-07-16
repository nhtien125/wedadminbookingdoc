import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ApiService from "../../services/apiService";
import Swal from "sweetalert2";
import "./MedicalService.css";

export default function MedicalService() {
  const [services, setServices] = useState([]);
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

  const showFormDialog = (service = null) => {
    const isEditing = service !== null;
    
    Swal.fire({
      title: isEditing ? 'Cập nhật Dịch vụ y tế' : 'Thêm Dịch vụ y tế mới',
      html: `
        <div class="swal-form">
          <input id="name" type="text" placeholder="Tên dịch vụ" value="${service?.name || ''}" required>
          <input id="description" type="text" placeholder="Mô tả" value="${service?.description || ''}">
          <input id="price" type="number" placeholder="Giá" value="${service?.price || ''}" required>
          
          <select id="specialization_id" required>
            <option value="">-- Chọn chuyên khoa --</option>
            ${specializations.map(s => 
              `<option value="${s.uuid}" ${service?.specialization_id === s.uuid ? 'selected' : ''}>${s.name}</option>`
            ).join('')}
          </select>
          
          <select id="clinic_id" required>
            <option value="">-- Chọn phòng khám --</option>
            ${clinics.map(c => 
              `<option value="${c.uuid}" ${service?.clinic_id === c.uuid ? 'selected' : ''}>${c.name}</option>`
            ).join('')}
          </select>
          
          <select id="hospital_id" required>
            <option value="">-- Chọn bệnh viện --</option>
            ${hospitals.map(h => 
              `<option value="${h.uuid}" ${service?.hospital_id === h.uuid ? 'selected' : ''}>${h.name}</option>`
            ).join('')}
          </select>
          
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
              <input id="imageUrl" type="url" placeholder="Nhập URL ảnh" value="${service?.image || ''}" style="width: 100%;">
              <div id="imagePreview" class="image-preview">
                ${service?.image ? `<img src="${service.image}" alt="Preview" style="max-width: 200px; max-height: 150px; margin-top: 10px;">` : ''}
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
        const clinicSelect = document.getElementById('clinic_id');
        const hospitalSelect = document.getElementById('hospital_id');

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

        // Xử lý logic clinic/hospital
        clinicSelect.addEventListener('change', (e) => {
          const selectedClinic = clinics.find(c => c.uuid === e.target.value);
          if (selectedClinic && !selectedClinic.hospital_id) {
            hospitalSelect.style.display = 'none';
            hospitalSelect.value = '';
          } else {
            hospitalSelect.style.display = 'block';
          }
        });
      },
      preConfirm: () => {
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const specialization_id = document.getElementById('specialization_id').value;
        const clinic_id = document.getElementById('clinic_id').value;
        const hospital_id = document.getElementById('hospital_id').value;
        
        // Kiểm tra loại ảnh được chọn
        const imageType = document.querySelector('input[name="imageType"]:checked').value;
        const imageUrl = document.getElementById('imageUrl').value;
        const imageFile = document.getElementById('imageFile').files[0];

        if (!name || !price || !specialization_id || !clinic_id) {
          Swal.showValidationMessage('Vui lòng điền đầy đủ các trường bắt buộc');
          return false;
        }

        return {
          name,
          description,
          price,
          specialization_id,
          clinic_id,
          hospital_id,
          imageType,
          imageUrl,
          imageFile
        };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        
        if (isEditing) {
          formData.append('uuid', service.uuid);
        } else {
          formData.append('uuid', uuidv4());
        }
        
        formData.append('name', result.value.name);
        formData.append('description', result.value.description);
        formData.append('price', parseFloat(result.value.price));
        formData.append('specialization_id', result.value.specialization_id);
        formData.append('clinic_id', result.value.clinic_id);
        formData.append('hospital_id', result.value.hospital_id);
        
        // Xử lý ảnh dựa trên loại được chọn
        if (result.value.imageType === 'url' && result.value.imageUrl) {
          formData.append('image', result.value.imageUrl);
        } else if (result.value.imageType === 'file' && result.value.imageFile) {
          formData.append('image', result.value.imageFile);
        }

        try {
          if (isEditing) {
            await ApiService.put(`medical_service/update/${service.uuid}`, formData);
            Swal.fire("Đã cập nhật!", "", "success");
          } else {
            await ApiService.post("medical_service/create", formData);
            Swal.fire("Đã thêm mới!", "", "success");
          }
          fetchServices();
        } catch (err) {
          console.error("Lỗi khi gửi dữ liệu:", err);
          Swal.fire("Lỗi", "Không thể xử lý: " + err.message, "error");
        }
      }
    });
  };

  const handleDelete = async (uuid) => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa dịch vụ này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33"
    });
    
    if (confirm.isConfirmed) {
      try {
        console.log("UUID muốn xoá:", uuid);
        const res = await ApiService.delete(`medical_service/delete/${uuid}`);
        if (res.code === 200) {
          fetchServices();
          Swal.fire("Đã xóa!", "Dịch vụ đã được xóa thành công", "success");
        } else {
          console.error("Xoá thất bại:", res.msg);
          Swal.fire("Lỗi", "Không thể xóa dịch vụ. " + res.msg, "error");
        }
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
        Swal.fire("Lỗi", "Lỗi hệ thống khi xoá: " + err.message, "error");
      }
    }
  };

  return (
    <div className="service-container">
      <div className="header-section">
        <h2 className="service-title">Quản lý Dịch vụ</h2>
        <button className="add-button" onClick={() => showFormDialog()}>
          + Thêm mới
        </button>
      </div>

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
                  <button className="edit-btn" onClick={() => showFormDialog(item)}>
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