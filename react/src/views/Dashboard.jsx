import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosClient from "../axiosClient";

export default function Dashboard() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await axiosClient.get("/cart");
        const totalJumlah = response.data.data.reduce(
          (total, item) => total + item.jumlah,
          0
        ); // Menjumlahkan properti `jumlah` dari semua item
        setCartCount(totalJumlah);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCartCount();
  }, []);

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
