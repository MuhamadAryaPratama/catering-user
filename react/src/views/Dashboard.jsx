import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosClient from "../axiosClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("access_token");

      // If no token, set cart count to 0 and don't attempt to fetch
      if (!token) {
        setCartCount(0);
        return;
      }

      try {
        const response = await axiosClient.get("/cart");
        const totalJumlah = response.data.data.reduce(
          (total, item) => total + item.jumlah,
          0
        ); // Summing the `jumlah` property from all items
        setCartCount(totalJumlah);
      } catch (error) {
        // More robust error handling
        console.error("Failed to fetch cart count:", error);

        // Check if the error is due to unauthorized access
        if (error.response && error.response.status === 401) {
          // Clear the token and redirect to login
          localStorage.removeItem("access_token");
          navigate("/login");
        }

        // Set cart count to 0 in case of any error
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [navigate]);

  return (
    <div>
      <Navbar cartCount={cartCount} />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      </div>
      <Footer />
    </div>
  );
}
