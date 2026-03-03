import { Outlet } from "react-router-dom";
import Preloader from "../components/layout/Preloader";
import Topbar from "../components/layout/Topbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

export default function AdminLayout() {
  return (
    <>
      <Preloader />

      <div className="main-wrapper">
        <Topbar />
        <Sidebar />

        <div className="page-wrapper">
          <div className="content">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}