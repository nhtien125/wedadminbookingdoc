import React, { useEffect, useState } from "react";
import ApiService from "../../services/apiService";
import Swal from "sweetalert2";
import "./Doctor.css";

export default function Doctor() {
  const [doctors, setDoctors] = useState([]);
  const [specializationNames, setSpecializationNames] = useState({});
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await ApiService.get("doctor/getAll");
      if (res.code === 200) {
        const doctorList = res.data;
        console.log("Full API Response:", res);
        console.log("Raw Doctor List:", doctorList.map(doc => ({ uuid: doc.uuid, status: doc.status, statusType: typeof doc.status })));
        const normalizedDoctorList = doctorList.map(doc => ({
          ...doc,
          status: isNaN(Number(doc.status)) ? 2 : Number(doc.status) 
        }));
        console.log("Normalized Doctor List:", normalizedDoctorList.map(doc => ({ uuid: doc.uuid, status: doc.status })));
        setDoctors(normalizedDoctorList);

        const specializationIds = [...new Set(normalizedDoctorList.map(doc => doc.specialization_id))];
        const userIds = [...new Set(normalizedDoctorList.map(doc => doc.user_id))];

        const specializationResults = await Promise.all(specializationIds.map(async (id) => {
          try {
            const res = await ApiService.get(`specialization/getById/${id}`);
            return { id, name: res.data?.name || "Không rõ" };
          } catch {
            return { id, name: "Lỗi chuyên khoa" };
          }
        }));

        const userResults = await Promise.all(userIds.map(async (id) => {
          try {
            const res = await ApiService.get(`auth/getByID/${id}`);
            return { id, name: res.data?.name || "Không rõ" };
          } catch {
            return { id, name: "Lỗi tên người dùng" };
          }
        }));

        const specMap = {};
        specializationResults.forEach(({ id, name }) => { specMap[id] = name; });

        const userMap = {};
        userResults.forEach(({ id, name }) => { userMap[id] = name; });

        setSpecializationNames(specMap);
        setUserNames(userMap);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách bác sĩ:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể tải danh sách bác sĩ",
        confirmButtonText: "OK"
      });
    }
  };

  const handleApprove = async (uuid) => {
    // Hiển thị dialog xác nhận
    const confirm = await Swal.fire({
      title: "Xác nhận duyệt hồ sơ",
      text: "Bạn có chắc chắn muốn duyệt hồ sơ bác sĩ này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Duyệt",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#28a745"
    });

    if (confirm.isConfirmed) {
      try {
        const res = await ApiService.put(`doctor/updateStatus/${uuid}`, { status: 0 });
        if (res.code === 200) {
          setDoctors(doctors.map(doc => 
            doc.uuid === uuid ? { ...doc, status: 0 } : doc
          ));
          console.log(`Approved doctor with UUID: ${uuid}, new status: 0`);
          
          // Thông báo thành công
          Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Đã duyệt hồ sơ bác sĩ",
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error(res.msg || "Lỗi không xác định");
        }
      } catch (err) {
        console.error("Lỗi duyệt hồ sơ:", err);
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không thể duyệt hồ sơ: " + err.message,
          confirmButtonText: "OK"
        });
      }
    }
  };

  const handleReject = async (uuid) => {
    // Hiển thị dialog xác nhận với input lý do
    const { value: reason, isConfirmed } = await Swal.fire({
      title: "Xác nhận từ chối hồ sơ",
      text: "Bạn có chắc chắn muốn từ chối hồ sơ bác sĩ này?",
      input: "textarea",
      inputLabel: "Lý do từ chối (tùy chọn)",
      inputPlaceholder: "Nhập lý do từ chối...",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Từ chối",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#dc3545",
      inputValidator: (value) => {
        // Không bắt buộc nhập lý do
        return null;
      }
    });

    if (isConfirmed) {
      try {
        const payload = { status: 2 };
        if (reason) {
          payload.reject_reason = reason;
        }
        
        const res = await ApiService.put(`/doctor/updateStatus/${uuid}`, payload);
        if (res.code === 200) {
          setDoctors(doctors.map(doc => 
            doc.uuid === uuid ? { ...doc, status: 2 } : doc
          ));
          console.log(`Rejected doctor with UUID: ${uuid}, new status: 2`);
          
          // Thông báo thành công
          Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Đã từ chối hồ sơ bác sĩ",
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error(res.msg || "Lỗi không xác định");
        }
      } catch (err) {
        console.error("Lỗi từ chối hồ sơ:", err);
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không thể từ chối hồ sơ: " + err.message,
          confirmButtonText: "OK"
        });
      }
    }
  };

  const handleViewDetails = async (doctor) => {
    const userName = userNames[doctor.user_id] || "Không rõ";
    const specializationName = specializationNames[doctor.specialization_id] || "Không rõ";
    
    await Swal.fire({
      title: `Chi tiết bác sĩ: ${userName}`,
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Tên:</strong> ${userName}</p>
          <p><strong>Chuyên khoa:</strong> ${specializationName}</p>
          <p><strong>Giấy phép hành nghề:</strong> ${doctor.license || "Chưa cập nhật"}</p>
          <p><strong>Giới thiệu:</strong></p>
          <div style="background: #f5f5f5; padding: 10px; border-radius: 5px; margin: 10px 0;">
            ${doctor.introduce || "Chưa có giới thiệu"}
          </div>
          <p><strong>Trạng thái:</strong> <span style="color: ${getStatusColor(doctor.status)}">${getStatusText(doctor.status)}</span></p>
          <p><strong>Ngày tạo:</strong> ${new Date(doctor.created_at).toLocaleString()}</p>
          <p><strong>Cập nhật lần cuối:</strong> ${new Date(doctor.updated_at).toLocaleString()}</p>
        </div>
      `,
      width: '600px',
      confirmButtonText: "Đóng"
    });
  };

  const getStatusText = (status) => {
    console.log(`Rendering status: ${status}, type: ${typeof status}`);
    switch (status) {
      case 0:
        return "Đã duyệt";
      case 1:
        return "Đang chờ";
      default:
        return "Từ chối";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "#28a745"; // Green
      case 1:
        return "#ffc107"; // Yellow
      default:
        return "#dc3545"; // Red
    }
  };

  return (
    <div className="doctor-container">
      <div className="doctor-header">
        <h2>Danh sách bác sĩ</h2>
        <div className="stats">
          <span className="stat-item">
            <span className="stat-label">Tổng số:</span>
            <span className="stat-value">{doctors.length}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Đang chờ:</span>
            <span className="stat-value">{doctors.filter(d => d.status === 1).length}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Đã duyệt:</span>
            <span className="stat-value">{doctors.filter(d => d.status === 0).length}</span>
          </span>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Tên người dùng</th>
              <th>Chuyên khoa</th>
              <th>GPLX</th>
              <th>Giới thiệu</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
              <th>Tạo lúc</th>
              <th>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.uuid}>
                <td>{userNames[doc.user_id] || doc.user_id}</td>
                <td>{specializationNames[doc.specialization_id] || doc.specialization_id}</td>
                <td>{doc.license}</td>
                <td className="introduce-cell">
                  {doc.introduce && doc.introduce.length > 50 
                    ? `${doc.introduce.substring(0, 50)}...` 
                    : doc.introduce || "Chưa có"
                  }
                </td>
                <td className={`status-${doc.status}`}>
                  {getStatusText(doc.status)}
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="view-button"
                      onClick={() => handleViewDetails(doc)}
                      title="Xem chi tiết"
                    >
                      Chi tiết
                    </button>
                    {doc.status === 1 && (
                      <>
                        <button 
                          className="approve-button"
                          onClick={() => handleApprove(doc.uuid)}
                          title="Duyệt hồ sơ"
                        >
                          Duyệt
                        </button>
                        <button 
                          className="reject-button"
                          onClick={() => handleReject(doc.uuid)}
                          title="Từ chối hồ sơ"
                        >
                          Từ chối
                        </button>
                      </>
                    )}
                  </div>
                </td>
                <td>{new Date(doc.created_at).toLocaleString()}</td>
                <td>{new Date(doc.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}