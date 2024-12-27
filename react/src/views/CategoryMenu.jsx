import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosClient from "../axiosClient";

function CategoryMenu() {
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get("/categories");
        console.log("Categories response:", response.data);
        setCategories(response.data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchCartCount = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const response = await axiosClient.get("/cart");
        const totalCount = response.data.data.reduce(
          (total, item) => total + item.jumlah,
          0
        );
        setCartCount(totalCount);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCategories();
    fetchCartCount();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartCount={cartCount} />

      {/* Hero Section */}
      <div className="bg-orange-50 py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-orange-800 mb-4">
            Menu Pilihan Warung Nasi Marsel
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Nikmati Berbagai Pilihan Menu Istimewa Untuk Setiap Momen Spesial
            Anda
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Pilihan Kategori Menu
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan berbagai pilihan menu lezat untuk acara spesial Anda. Dari
            paket prasmanan hingga nasi kotak, kami siap melayani dengan cita
            rasa yang autentik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${
                    category.image_url
                  }`}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    console.log(`Image error for ${category.name}:`, e);
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {category.name}
                </h3>
                <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-300 w-full">
                  Lihat Menu
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CategoryMenu;
