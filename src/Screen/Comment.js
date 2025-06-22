import React, { useState } from "react";
import "./Comment.css";
import { DeleteOutlined } from "@ant-design/icons";
import bapcai from "../assets/images/bapcai.png";
import deleteRed from "../assets/images/deleteRed.png";
import star from "../assets/images/star.png";

const Comment = () => {
  const [reviews, setReviews] = useState([
    {
      author: "Tuấn Phát",
      email: "thanhtuanphat21@gmail.com",
      product: {
        name: "Bắp cải trắng",
        id: "babcai12312332432",
        image: bapcai,
      },
      comment: "Tên sản phẩm: Bắp cải trắng đạt gì và này nọ!",
      date: "29/09/2024 lúc 3:51",
      rating: 5,
    },
    {
      author: "Tuấn Phát",
      email: "thanhtuanphat21@gmail.com",
      product: {
        name: "Bắp cải trắng",
        id: "babcai12312332432",
        image: bapcai,
      },
      comment: "Tên sản phẩm: Bắp cải trắng đạt gì và này nọ!",
      date: "29/09/2024 lúc 3:51",
      rating: 4,
    },
    {
      author: "Tuấn Phát",
      email: "thanhtuanphat21@gmail.com",
      product: {
        name: "Bắp cải trắng",
        id: "babcai12312332432",
        image: bapcai,
      },
      comment: "Tên sản phẩm: Bắp cải trắng đạt gì và này nọ!",
      date: "29/09/2024 lúc 3:51",
      rating: 3,
    },
  ]);

  const handleDelete = (index) => {
    const updatedReviews = reviews.filter((_, i) => i !== index);
    setReviews(updatedReviews);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<img key={i} className="star" src={star} alt="star" />);
    }
    return stars;
  };

  return (
    <div className="review-list-container">
      {/* Reviews */}
      <div className="review-list">
        {reviews.map((review, index) => (
          <div key={index} className="review-item">
            <div className="author-section">
              <p className="author-label">Tác giả</p>
              <p className="author-name">{review.author}</p>
              <p className="author-email">{review.email}</p>
            </div>
            <div className="product-section">
              <p className="product-label">Sản Phẩm</p>
              <div className="product-flex">
                <img
                  src={review.product.image}
                  alt={review.product.name}
                  className="product-image"
                />
                <div>
                  <p className="product-name">
                    Tên Sản Phẩm: {review.product.name}
                  </p>
                  <p className="product-id">Mã sản phẩm: {review.product.id}</p>
                </div>
              </div>
            </div>
            <div className="comment-section">
              <p className="comment-label">Bình luận</p>
              <p>{review.comment}</p>
            </div>
            <div className="date-section">
              <p className="date-label">Đã đăng vào</p>
              <p>{review.date}</p>
              <div className="rating-section">{renderStars(review.rating)}</div>
            </div>
            <div className="delete-section">
              <img
                src={deleteRed}
                alt="delete"
                className="delete-icon"
                onClick={() => handleDelete(index)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;
