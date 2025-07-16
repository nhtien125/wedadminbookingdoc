import React, { useEffect, useState } from "react";
import ApiService from "../../services/apiService";
import Swal from "sweetalert2";
import "./Articles.css";

const PlusIcon = () => (
  <svg width="21" height="21" viewBox="0 0 20 20" fill="none">
    <path d="M10 4v12m6-6H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function Articles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const result = await ApiService.get("article/getAll");
      if (result.code === 200) setArticles(result.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu bài viết:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể tải danh sách bài viết",
        confirmButtonText: "OK"
      });
    }
  };

  const showFormDialog = (article = null) => {
    const isEditing = article !== null;
    
    Swal.fire({
      title: isEditing ? 'Cập nhật bài viết' : 'Thêm bài viết mới',
      html: `
        <div class="swal-form articles-form">
          <div class="form-group">
            <label for="title">Tiêu đề bài viết</label>
            <input id="title" type="text" placeholder="Nhập tiêu đề" value="${article?.title || ''}" required>
          </div>
          
          <div class="form-group">
            <label for="author">Tác giả</label>
            <input id="author" type="text" placeholder="Nhập tên tác giả" value="${article?.author || ''}" required>
          </div>
          
          <div class="form-group content-group">
            <label for="content">Nội dung bài viết</label>
            <textarea id="content" placeholder="Nhập nội dung bài viết" rows="6" required>${article?.content || ''}</textarea>
          </div>
          
          <div class="image-section">
            <label style="font-weight: bold; margin-bottom: 10px; display: block;">Chọn ảnh đại diện:</label>
            <div class="image-options">
              <label>
                <input type="radio" name="imageType" value="url" checked> URL ảnh
              </label>
              <label>
                <input type="radio" name="imageType" value="file"> Tải lên từ máy
              </label>
            </div>
            
            <div id="url-section" class="image-input-section">
              <input id="imageUrl" type="url" placeholder="Nhập URL ảnh" value="${article?.image || ''}" style="width: 100%;">
              <div id="imagePreview" class="image-preview">
                ${article?.image ? `<img src="${article.image}" alt="Preview" style="max-width: 200px; max-height: 150px; margin-top: 10px;">` : ''}
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
      width: '800px',
      focusConfirm: false,
      didOpen: () => {
        const urlRadio = document.querySelector('input[value="url"]');
        const fileRadio = document.querySelector('input[value="file"]');
        const urlSection = document.getElementById('url-section');
        const fileSection = document.getElementById('file-section');
        const imageUrl = document.getElementById('imageUrl');
        const imageFile = document.getElementById('imageFile');
        const imagePreview = document.getElementById('imagePreview');
        const filePreview = document.getElementById('filePreview');

        urlRadio.addEventListener('change', () => {
          urlSection.style.display = 'block';
          fileSection.style.display = 'none';
        });

        fileRadio.addEventListener('change', () => {
          urlSection.style.display = 'none';
          fileSection.style.display = 'block';
        });

        imageUrl.addEventListener('input', (e) => {
          const url = e.target.value;
          if (url) {
            imagePreview.innerHTML = `<img src="${url}" alt="Preview" style="max-width: 200px; max-height: 150px; margin-top: 10px;" onerror="this.style.display='none'">`;
          } else {
            imagePreview.innerHTML = '';
          }
        });

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
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const content = document.getElementById('content').value;
        
        const imageType = document.querySelector('input[name="imageType"]:checked').value;
        const imageUrl = document.getElementById('imageUrl').value;
        const imageFile = document.getElementById('imageFile').files[0];

        if (!title || !author || !content) {
          Swal.showValidationMessage('Vui lòng điền đầy đủ các trường bắt buộc');
          return false;
        }

        return {
          title,
          author,
          content,
          imageType,
          imageUrl,
          imageFile
        };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        
        if (isEditing) {
          formData.append('uuid', article.uuid);
        }
        
        formData.append('title', result.value.title);
        formData.append('author', result.value.author);
        formData.append('content', result.value.content);
        
        if (result.value.imageType === 'url' && result.value.imageUrl) {
          formData.append('image', result.value.imageUrl);
        } else if (result.value.imageType === 'file' && result.value.imageFile) {
          formData.append('image', result.value.imageFile);
        }

        try {
          if (isEditing) {
            await ApiService.put(`article/update/${article.uuid}`, formData);
            Swal.fire({
              icon: "success",
              title: "Thành công!",
              text: "Cập nhật bài viết thành công!",
              timer: 2000,
              showConfirmButton: false
            });
          } else {
            await ApiService.post("article/add", formData);
            Swal.fire({
              icon: "success",
              title: "Thành công!",
              text: "Thêm bài viết mới thành công!",
              timer: 2000,
              showConfirmButton: false
            });
          }
          fetchArticles();
        } catch (error) {
          console.error("Lỗi khi gửi form:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: "Không thể xử lý: " + error.message,
            confirmButtonText: "OK"
          });
        }
      }
    });
  };

  const handleViewDetails = async (article) => {
    await Swal.fire({
      title: `Chi tiết bài viết: ${article.title}`,
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Tiêu đề:</strong> ${article.title}</p>
          <p><strong>Tác giả:</strong> ${article.author}</p>
          <p><strong>Nội dung:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0; max-height: 300px; overflow-y: auto; text-align: left;">
            ${article.content || "Chưa có nội dung"}
          </div>
          ${article.image ? `
            <p><strong>Ảnh đại diện:</strong></p>
            <div style="text-align: center; margin: 10px 0;">
              <img src="${article.image}" alt="Ảnh bài viết" style="max-width: 400px; max-height: 250px; border-radius: 8px; border: 1px solid #ddd;">
            </div>
          ` : ''}
          <p><strong>Ngày tạo:</strong> ${new Date(article.created_at).toLocaleString()}</p>
          <p><strong>Cập nhật lần cuối:</strong> ${new Date(article.updated_at).toLocaleString()}</p>
        </div>
      `,
      width: '700px',
      confirmButtonText: "Đóng"
    });
  };

  const handleDelete = async (uuid) => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa bài viết này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33"
    });
    
    if (confirm.isConfirmed) {
      try {
        await ApiService.delete(`article/delete/${uuid}`);
        setArticles((prev) => prev.filter((item) => item.uuid !== uuid));
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Bài viết đã được xóa thành công",
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không thể xóa: " + err.message,
          confirmButtonText: "OK"
        });
      }
    }
  };

  return (
    <div className="articles-admin-container">
      <div className="articles-header">
        <h2 className="articles-title">Quản lý bài viết</h2>
        <div className="header-actions">
          <div className="stats">
            <span className="stat-item">
              <span className="stat-label">Tổng số:</span>
              <span className="stat-value">{articles.length}</span>
            </span>
          </div>
          <button className="add-articles-btn" onClick={() => showFormDialog()}>
            <PlusIcon /> Thêm bài viết
          </button>
        </div>
      </div>

      <div className="articles-table-wrapper">
        <table className="articles-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Nội dung</th>
              <th>Ảnh</th>
              <th>Ngày tạo</th>
              <th>Cập nhật</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((item) => (
              <tr key={item.uuid}>
                <td className="title-cell">
                  <div className="title-wrapper">
                    {item.title && item.title.length > 40 
                      ? `${item.title.substring(0, 40)}...` 
                      : item.title || "Chưa có tiêu đề"
                    }
                    <button
                      className="articles-action-btn view-btn detail-btn"
                      onClick={() => handleViewDetails(item)}
                      title="Xem chi tiết"
                    >
                      Chi tiết
                    </button>
                  </div>
                </td>
                <td className="author-cell">{item.author}</td>
                <td className="content-cell">
                  <div className="content-wrapper">
                    {item.content && item.content.length > 60 
                      ? `${item.content.substring(0, 60)}...` 
                      : item.content || "Chưa có nội dung"
                    }
                  </div>
                </td>
                <td>
                  <img
                    src={item.image || "https://via.placeholder.com/80x60"}
                    alt="Ảnh bài viết"
                    className="article-image"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/80x60")}
                  />
                </td>
                <td className="date-cell">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="date-cell">{new Date(item.updated_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => showFormDialog(item)}
                      className="articles-action-btn edit-btn"
                      title="Sửa bài viết"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(item.uuid)}
                      className="articles-action-btn delete-btn"
                      title="Xóa bài viết"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                  Chưa có bài viết nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}