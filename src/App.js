import React, {  useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Hospital from "./Screen/Hospital/Hospital";
import AddProduct from "./Navigate/Sidebar";
import Doctor from "./Screen/Doctor/Doctor";
import MedicalService from "./Screen/MedicalService/MedicalService";
import Clinic from "./Screen/Clinic/Clinic";
import NavMenu from "./Navigate/NavMenu";
import { AdminProvider } from "./Component/AdminProvider";
import '@fontsource/roboto'; // Tải trọng số mặc định
import '@fontsource/roboto/400.css'; // Tải trọng số cụ thể
import Review from "./Screen/Review/Revview";
import VaccinationCenter from "./Screen/VaccinationCenter/VaccinationCenter";
import Loginn from "./Screen/Login/Loginn";
import Articles  from "./Screen/Articles/Articles"; 
function App() {
  const getAdminFromLocalStorage = () => {
    const adminInfo = localStorage.getItem("admin");
    return adminInfo ? JSON.parse(adminInfo) : null;
  };

  const [admin, setAdmin] = useState(getAdminFromLocalStorage());
  const [isHidden, setIsHidden] = useState(!admin);
  
  
  const saveAdminInfo = (adminInfo) => {
    if (!adminInfo) {
      localStorage.removeItem("admin");
      setAdmin(null);
      setIsHidden(true);
    } else {
      localStorage.setItem("admin", JSON.stringify(adminInfo));
      setAdmin(adminInfo);
      setIsHidden(false);
    }
  };

  // Hàm logout sẽ xóa thông tin admin khỏi localStorage và cập nhật state
  const logout = () => {
    localStorage.removeItem("admin");
    setAdmin(null);
    setIsHidden(true);
  };

  return (
    <Router>
      {admin ? (
        <AdminProvider>
          <NavMenu isHidden={isHidden} onLogout={logout}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/Clinic" element={<Clinic />} />
              <Route path="/Doctor" element={<Doctor />} />
              <Route path="/Hospital" element={<Hospital />} />
              <Route path="/add-Product" element={<AddProduct />} />
              <Route path="/MedicalService" element={<MedicalService />} />
              <Route path="/VaccinationCenter" element={<VaccinationCenter />} />
              <Route path="/Review" element={<Review />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/Loginn" element={<Loginn />} />
      
            </Routes>
          </NavMenu>
        </AdminProvider>
      ) : (
        <Routes>
          <Route path="/loginn" element={<Loginn saveAdmin={saveAdminInfo} />} />
          <Route path="*" element={<Navigate to="/loginn" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
