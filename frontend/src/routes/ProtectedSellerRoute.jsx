import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

export default function ProtectedSellerRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#faf7ef] pt-32 text-center">Loading account...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "seller") return <Navigate to="/" replace />;
  return <Outlet />;
}
