import { Outlet } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

function WebsiteLayout() {
  return (
    <div className="min-h-screen bg-[#faf7ef]">
      <Navbar />

      <main className="pt-[82px]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default WebsiteLayout;