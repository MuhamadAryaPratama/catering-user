import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axiosClient from "../axiosClient";

function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // Inisialisasi navigate
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await axiosClient.get(`/foods/${id}`);
        setFood(response.data.data);
      } catch (error) {
        console.error("Failed to fetch food details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (!food) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Detail makanan tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <img
        className="w-full h-64 object-cover"
        src={`${import.meta.env.VITE_API_BASE_URL}${food.gambar_url}`}
        alt={food.nama}
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{food.nama}</h2>
        <p className="text-gray-600 mb-4">{food.deskripsi}</p>
        <div className="text-lg font-bold text-green-600">
          {formatCurrency(food.harga)}
        </div>
      </div>

      {/* Tombol Kembali */}
      <div className="p-6">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate("/foods")} // Navigasi ke halaman FoodsMenu
        >
          Kembali
        </button>
      </div>
    </div>
  );
}

export default FoodDetail;
