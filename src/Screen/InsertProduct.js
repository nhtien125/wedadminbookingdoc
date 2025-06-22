import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./InsertProduct.css";
import { FloatButton } from "antd";

const InsertProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [preserves, setPreserves] = useState([]);
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [origin, setOrigin] = useState("");
  const [price, setPrice] = useState("");
  const [fiber, setFiber] = useState("");
  const [oum, setOum] = useState("");
  const [preserve, setPreserve] = useState("");
  const [supplier, setSupplier] = useState("");
  const [uses, setUses] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");

  const [errors, setErrors] = useState({
    name: false,
    category: false,
    quantity: false,
    price: false,
    oum: false,
    preserve: false,
    images: false,
  });

  useEffect(() => {
    const getAllCategories = async () => {
      const response = await fetch(
        "https://server-vert-rho-94.vercel.app/categories"
      );
      const result = await response.json();
      setCategories(result.data);
      if (result.data.length > 0) {
        setCategory(result.data[0]._id); 
      }
    };
    getAllCategories();
  }, []);

  useEffect(() => {
    const getAllPreserves = async () => {
      const response = await fetch(
        "https://server-vert-rho-94.vercel.app/preserves"
      );
      const result = await response.json();
      setPreserves(result.data);
      if (result.data.length > 0) {
        setPreserve(result.data[0]._id); 
      }
    };
    getAllPreserves();
  }, []);

  const uploadToCloundinary = async () => {
    try {
      const file = document.getElementById("image").files[0];
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "ml_default");
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dffuzgy5h/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const result = await response.json();
      setImages([...images, result.secure_url]);
    } catch (error) {
      console.error("Lỗi tải ảnh:", error);
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrl) {
      setImages([...images, imageUrl]);
      setImageUrl(""); 
    }
  };

  const removeImage = (img) => {
    const newImages = images.filter(
      (item) => item.toString() !== img.toString()
    );
    setImages(newImages);
  };

  const handleSubmit = async () => {
    try {
      let formErrors = { ...errors };

      formErrors.name = !name;
      formErrors.category = !category;
      formErrors.quantity = !quantity;
      formErrors.price = !price;
      formErrors.oum = !oum;
      formErrors.preserve = !preserve;
      formErrors.images = images.length === 0;

      setErrors(formErrors);

      if (
        formErrors.name ||
        formErrors.category ||
        formErrors.quantity ||
        formErrors.price ||
        formErrors.oum ||
        formErrors.preserve ||
        formErrors.images
      ) {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Vui lòng nhập đầy đủ thông tin cần thiết",
        });
        return;
      }

      if (quantity <= 0) {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Số lượng phải từ 1 trở lên",
        });
        return;
      }
      if (price < 0) {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Giá tiền không được là số âm",
        });
        return;
      }
      if (discount < 0) {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Giá giảm không được là số âm",
        });
        return;
      }

      const unitRegex = /^(?:\d*\s*(kg|chai|bó|gram|lít|thùng|con|ml))$/i; // Cập nhật regex cho phép nhập số hoặc không có số, sau đó là đơn vị hợp lệ

      // Kiểm tra xem đơn vị có hợp lệ không
      if (!unitRegex.test(oum.trim())) {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Đơn vị không hợp lệ. Vui lòng nhập: kg, chai, bó, gram, lít, thùng, con, ml.",
        });
        return;
      }
      
      
      

      const body = {
        name: name,
        category: category,
        quantity: quantity,
        origin: origin,
        price: price,
        fiber: fiber,
        oum: oum,
        preserve: preserve,
        supplier: supplier,
        uses: uses,
        discount: discount,
        images: images,
        description: description,
      };
      const result = await fetch(
        "https://server-vert-rho-94.vercel.app/products/addSP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      const response = await result.json();
      // debugger
      if (response.success) {
        // Thêm thông báo mới vào danh sách
        const notifications =
          JSON.parse(localStorage.getItem("notifications")) || [];
        notifications.push({
          title: "Thêm sản phẩm thành công",
          message: `Sản phẩm "${name}" đã được thêm.`,
          timestamp: new Date().toLocaleString(),
        });
        localStorage.setItem("notifications", JSON.stringify(notifications));

        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Thêm sản phẩm thành công",
        });

        // Reset form
        setName("");
        setCategory(categories[0]?._id || "");
        setQuantity("");
        setOrigin("");
        setPrice("");
        setFiber("");
        setOum("");
        setPreserve(preserves[0]?._id || "");
        setSupplier("");
        setUses("");
        setDiscount("");
        setImages([]);
        setDescription("");

        navigate(-1);
      } else {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Thêm sản phẩm thất bại",
        });
      }
    } catch (error) {
      console.log("....Loi:", error);
      Swal.fire({
        icon: "error",
        title: "Thất bại",
        text: "Thêm sản phẩm thất bại",
      });
    }
    const _result = await Swal.fire({
      title: "  Bạn có chắc không?",
      text: "Bạn có chắc chắn thêm sản phẩm này không?",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vâng, tôi đồng ý",
    });
    // Kiểm tra giá giảm không lớn hơn giá sản phẩm
      if (parseFloat(discount) > parseFloat(price)) {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Giá giảm không được lớn hơn giá sản phẩm",
        });
        return;
      }
    if (!_result.isConfirmed) {
      return;
    }
    setName("");
    setCategory(categories[0]?._id || ""); 
    setQuantity("");
    setOrigin("");
    setPrice("");
    setFiber("");
    setOum("");
    setPreserve(preserves[0]?._id || ""); 
    setSupplier("");
    setUses("");
    setDiscount("");
    setImages([]);
    setDescription("");

    // quay về trang ds
    navigate(-1);
  };

  return (
    <div className="containerne">
      <form className="form-container">
        <div className="titleF">
          <h1>Thêm sản phẩm</h1>
        </div>

        <div className="n-c-q-x-container">
          <div className="mb-4 mt-4">
            <div className="inside-container">
              <label className="form-label">Tên sản phẩm:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  borderColor: errors.name ? "red" : "",
                }}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Danh mục:</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((item, index) => {
                  return (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Số lượng:</label>
              <input
                type="number"
                className="form-control"
                placeholder="Nhập số lượng"
                style={{
                  borderColor: errors.quantity ? "red" : "",
                }}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Xuất xứ:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập xuất xứ"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="g-d-c-l-container">
          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Giá sản phẩm:</label>
              <input
                type="number"
                className="form-control"
                placeholder="Nhập giá"
                style={{
                  borderColor: errors.price ? "red" : "",
                }}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Chất sơ:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập chất sơ"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Đơn vị tính:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập đơn vị tính"
                style={{
                  borderColor: errors.oum ? "red" : "",
                }}
                value={oum}
                onChange={(e) => setOum(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Loại hàng:</label>
              <select
                className="form-select"
                value={preserve}
                onChange={(e) => setPreserve(e.target.value)}
              >
                {preserves.map((item, index) => {
                  return (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        <div className="n-c-a-container">
          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Nhà cung cấp:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập nhà cung cấp"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Công dụng:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập công dụng"
                value={uses}
                onChange={(e) => setUses(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Giảm giá:</label>
              <input
                type="number"
                className="form-control"
                placeholder="Nhập giá giảm"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3 link-container">
            <div className="inside-container">
              <label className="form-label">Hoặc dán link ảnh:</label>
              <div className="linkimg-container">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Dán link ảnh vào đây"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <FloatButton
                  shape="square"
                  className="btn-link"
                  onClick={handleAddImageUrl}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="image-upload-container">
          <div className="inside-container">
            <label className="form-label">Ảnh từ thiết bị:</label>
            <input
              type="file"
              className="form-controlimg"
              style={{
                borderColor: errors.images ? "red" : "",
              }}
              id="image"
              onChange={uploadToCloundinary}
            />
          </div>

          <div className="image-preview-container">
            {images.map((item, index) => (
              <div key={index} className="image-preview">
                <img src={item} alt="preview" />
                <button
                  onClick={() => removeImage(item)}
                  className="remove-image-btn"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <div className="inside-container">
            <label className="form-label">Mô tả:</label>
            <textarea
              className="form-controlD"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="btn-container2">
          <button
            onClick={() => navigate("/products")}
            className="btn-primaryC"
          >
            Hủy
          </button>
          <button onClick={handleSubmit} type="button" className="btn-primary">
            Thêm mới
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsertProduct;
