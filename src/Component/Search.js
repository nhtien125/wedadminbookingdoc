// import React, { useState, useEffect } from "react";
// import { Input } from "antd";
// import { useNavigate } from "react-router-dom";
// import "./Search.css";
// import bellActive from "../assets/images/bell2.png"; // Chuông bình thường
// import bellInactive from "../assets/images/bell.png"; // Chuông khi nhấn
// import mailIcon from "../assets/images/mail.png";
// import Noti from "./Notifi";

// const { Search } = Input;

// function SearchComponent() {
//   const [searchResults, setSearchResults] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [showNoti, setShowNoti] = useState(false); // Quản lý trạng thái thông báo
//   const [isBellActive, setIsBellActive] = useState(false); // Quản lý trạng thái chuông
//   const [notifications, setNotifications] = useState([]); // Trạng thái thông báo
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const updatedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
//       setNotifications(updatedNotifications);
//     };
  
//     window.addEventListener("storage", handleStorageChange);
  
//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//     };
//   }, []);
  

//   const handleSearch = async (value) => {
//     if (!value) {
//       setShowSuggestions(false);
//       return;
//     }
//     try {
//       const response = await fetch(
//         `http://localhost:6677/products/search?key=${value}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         setSearchResults(data.data || []);
//         setShowSuggestions(true);
//       } else {
//         console.error("Lỗi khi gọi API:", response.status);
//       }
//     } catch (error) {
//       console.error("Lỗi:", error);
//     }
//   };

//   const handleSelectSuggestion = (productId) => {
//     setShowSuggestions(false);
//     navigate(`/products?product=${productId}`);
//   };

//   const toggleNoti = () => {
//     setShowNoti(!showNoti);
//     setIsBellActive(!isBellActive); // Thay đổi trạng thái chuông
//   };

//   return (
//     <div className="search-component">
//       <Input
//         placeholder="Nhập để tìm kiếm..."
//         className="search-inside"
//         onChange={(e) => handleSearch(e.target.value)}
//       />
      

//       {showSuggestions && searchResults.length > 0 && (
//         <div className="search-suggestions">
//           {searchResults.map((product) => (
//             <div
//               key={product._id}
//               className="suggestion-item"
//               onClick={() => handleSelectSuggestion(product._id)}
//             >
//               {product.name}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default SearchComponent;
