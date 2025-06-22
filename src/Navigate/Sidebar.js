// Sidebar.js
import React, { useState } from 'react';
import { FaUser, FaBox, FaChartBar, FaCommentDots, FaTags, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState('');

  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? '' : menu);
  };

  return (
    <div className="sidebar">
      <div className="menu-item" onClick={() => handleMenuClick('account')}>
        <FaUser />
        <Link to="/userManage">Quản lý tài khoản</Link>
      </div>

      <div className="menu-item" onClick={() => handleMenuClick('products')}>
        <FaBox />
        <Link to="/products">Quản lý hàng hóa</Link>
      </div>

      {activeMenu === 'products' && (
        <div className="submenu">
          <div className="submenu-item">
            <Link to="/QLHH">Quản lý sản phẩm</Link>
          </div>
          <div className="submenu-item">
            <Link to="/categoryStatistics">Thống kê loại hàng</Link>
          </div>
          <div className="submenu-item">
            <Link to="/orderManagement">Quản lý đơn hàng</Link>
          </div>
        </div>
      )}

      <div className="menu-item" onClick={() => handleMenuClick('comments')}>
        <FaCommentDots />
        <Link to="/comments">Quản lý bình luận</Link>
      </div>

      <div className="menu-item" onClick={() => handleMenuClick('statistics')}>
        <FaChartBar />
        <Link to="/statistics">Thống kê</Link>
      </div>

      <div className="menu-item" onClick={() => handleMenuClick('promotions')}>
        <FaTags />
        <Link to="/promotions">Quản lý khuyến mãi</Link>
      </div>

      <div className="menu-item logout">
        <FaSignOutAlt /> Đăng xuất
      </div>
    </div>
  );
};

export default Sidebar;
