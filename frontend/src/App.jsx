import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Recommend from "./pages/Recommend";
import History from "./pages/History";
import Crops from "./pages/Crops";
import CropDetail from "./pages/CropDetail";

const PublicLayout = () => (<><Navbar /><div className="page-wrap"><Outlet /></div><Footer /></>);

const AppLayout = () => (
  <>
    <Navbar />
    <div className="container py-4 page-wrap">
      <div className="row g-4">
        <div className="col-md-3 col-lg-2"><Sidebar /></div>
        <div className="col-md-9 col-lg-10"><Outlet /></div>
      </div>
    </div>
    <Footer />
  </>
);

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/crops" element={<Crops />} />
        <Route path="/crops/:id" element={<CropDetail />} />
      </Route>
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/history" element={<History />} />
      </Route>
      <Route path="*" element={<PublicLayout />}>
        <Route path="*" element={<div className="container py-5 text-center"><h3>Page not found</h3></div>} />
      </Route>
    </Routes>
  );
}
