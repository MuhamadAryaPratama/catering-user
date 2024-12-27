import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosClient from "../axiosClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [cartCount, setCartCount] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setCartCount(0);
        return;
      }
      try {
        const response = await axiosClient.get("/cart");
        const totalJumlah = response.data.data.reduce(
          (total, item) => total + item.jumlah,
          0
        );
        setCartCount(totalJumlah);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("access_token");
        }
        setCartCount(0);
      }
    };

    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get("/suggestions");
        setSuggestions(response.data.data);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setError("Gagal memuat saran. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartCount();
    fetchSuggestions();
  }, []);

  return (
    <div>
      <Navbar cartCount={cartCount} />
      <div
        className="hero-section bg-cover bg-center h-64 flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://source.unsplash.com/1600x900/?restaurant,food')",
        }}
      >
        <h1 className="text-4xl font-bold drop-shadow-md">
          Selamat Datang di Warung Nasi Marsel!
        </h1>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Rasakan Cita Rasa Terbaik
          </h2>
          <p className="text-gray-600">
            Pilihan masakan rumahan yang lezat dan penuh kenangan.
          </p>
        </div>

        <div className="text-center">
          <button
            className="bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-orange-600 transition-all shadow-lg"
            onClick={() => navigate("/foods")}
          >
            🍛 Pesan Sekarang!
          </button>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
            Saran dari Pelanggan
          </h2>

          {loading && (
            <div className="text-center py-4">
              <p className="text-gray-600">Memuat saran...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4 text-center">
              {error}
            </div>
          )}

          {!loading && !error && suggestions.length === 0 && (
            <p className="text-gray-600 text-center">
              Belum ada saran dari pelanggan.
            </p>
          )}

          {!loading && !error && suggestions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="bg-white border p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-600 font-medium">
                      {suggestion.user?.name || "Anonymous"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(suggestion.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700">{suggestion.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
