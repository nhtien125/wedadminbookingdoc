import React, {  useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Hospital from "./Screen/Hospital";
import AddProduct from "./Navigate/Sidebar";
import InsertProduct from "./Screen/InsertProduct";
import Doctor from "./Screen/Doctor";
import MedicalService from "./Screen/MedicalService";
import Clinic from "./Screen/Clinic";
import NavMenu from "./Navigate/NavMenu";
import { AdminProvider } from "./Component/AdminProvider";
import '@fontsource/roboto'; // Tải trọng số mặc định
import '@fontsource/roboto/400.css'; // Tải trọng số cụ thể
import ResetPassword from "./Screen/ResetPassword";
import Review from "./Screen/Revview";
import MedicalRecordList from "./Screen/MedicalRecordList";
import Register from "./Screen/Register";
import Loginn from "./Screen/Loginn";
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
              <Route path="/" element={<Navigate to="/charts" replace />} />
              <Route path="/Clinic" element={<Clinic />} />
              <Route path="/Doctor" element={<Doctor />} />
              <Route path="/Hospital" element={<Hospital />} />
              <Route path="/add-Product" element={<AddProduct />} />
              <Route path="/insert-Product" element={<InsertProduct />} />
              <Route path="/MedicalService" element={<MedicalService />} />
              <Route path="/MedicalRecordList" element={<MedicalRecordList />} />
              <Route path="/Review" element={<Review />} />
              <Route path="/login" element={<Navigate to="/charts" />} />
              <Route path="/Loginn" element={<Loginn />} />
              <Route path="/Register" element={<Register />} />
            </Routes>
          </NavMenu>
        </AdminProvider>
      ) : (
        <Routes>
          <Route path="/loginn" element={<Loginn saveAdmin={saveAdminInfo} />} />
          <Route path="*" element={<Navigate to="/loginn" replace />} />
          <Route path="/Register" element={<Register />} />

        </Routes>
      )}
    </Router>
  );
}

export default App;
