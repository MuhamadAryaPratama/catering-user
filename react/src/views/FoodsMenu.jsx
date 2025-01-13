import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosClient from "../axiosClient";
import { useNavigate } from "react-router-dom";
import "../styles/animations.css";

function FoodsMenu() {
  const [cartCount, setCartCount] = useState(0);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        const cartResponse = await axiosClient.get("/cart");
        if (cartResponse.data && cartResponse.data.data) {
          const cartData = cartResponse.data.data;
          const totalCount = cartData.reduce(
            (total, item) => total + item.jumlah,
            0
          );
          setCartCount(totalCount);
        }
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
      // Don't show error to user as this is not critical
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const foodsResponse = await axiosClient.get("/foods");

        if (foodsResponse.data && foodsResponse.data.data) {
          setFoods(foodsResponse.data.data);
          await fetchCartCount();
        } else {
          throw new Error("Invalid data format received from server");
        }
      } catch (error) {
        console.error("Error fetching foods:", error);
        setError(error.response?.data?.message || "Gagal memuat data menu.");

        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Gagal memuat data menu.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const goToDetail = (foodId) => {
    navigate(`/foods/${foodId}`);
  };

  const handleOrderNow = async (food, e) => {
    e.stopPropagation(); // Prevent event bubbling

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        Swal.fire({
          title: "Login Required",
          text: "Anda harus login terlebih dahulu untuk memesan.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        navigate("/foods");
        return;
      }

      navigate("/order-form", {
        state: {
          orderType: "direct",
          foodData: {
            id: food.id,
            quantity: 1,
          },
        },
      });
    } catch (error) {
      console.error("Order failed:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal memproses pesanan.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleCartClick = async (food, e) => {
    e.stopPropagation(); // Prevent event bubbling

    const token = localStorage.getItem("access_token");
    if (!token) {
      Swal.fire({
        title: "Login Required",
        text: "Anda harus login terlebih dahulu untuk mengakses keranjang.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      navigate("/login");
      return;
    }

    try {
      const response = await axiosClient.post("/cart", {
        food_id: food.id,
        jumlah: 1,
      });

      if (response.data.status === "success") {
        await fetchCartCount();

        Swal.fire({
          title: "Success",
          text: `${food.nama} telah ditambahkan ke keranjang.`,
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Cart error:", error);
      const errorMessage =
        error.response?.data?.message || "Gagal menambahkan item ke keranjang.";

      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar cartCount={cartCount} />
        <div className="container mx-auto py-12 px-4 md:px-8 flex-grow">
          <div className="text-center text-red-600">
            <h2 className="text-2xl font-bold mb-4">Error Loading Menu</h2>
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartCount={cartCount} />
      <div className="container mx-auto py-12 px-4 md:px-8 flex-grow">
        <div className="text-center space-y-6 animate-fadeIn">
          <h2 className="text-4xl font-bold text-teal-700 animate-slideDown">
            Selamat datang di Catering Warung Nasi Marsel
          </h2>
          <p className="text-xl text-gray-600 animate-slideUp">
            Kami menyediakan berbagai menu lezat dengan harga terjangkau.
            Jelajahi menu kami dan temukan hidangan favorit Anda.
          </p>
          <h1 className="text-5xl font-extrabold text-teal-800 animate-bounce">
            Daftar Menu
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading menu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
            {foods.map((food, index) => (
              <div
                key={food.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fadeInUp"
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => goToDetail(food.id)}
              >
                <div className="h-56 overflow-hidden relative">
                  <img
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    src={`${import.meta.env.VITE_API_BASE_URL}${
                      food.gambar_url
                    }`}
                    alt={food.nama}
                    onError={(e) => {
                      e.target.src = "/placeholder-food.jpg"; // Add a placeholder image
                      e.target.className = "w-full h-full object-cover";
                    }}
                  />
                </div>
                <div className="p-6 flex flex-col justify-between space-y-4">
                  <h3 className="text-xl font-bold text-teal-700 text-center animate-pulse">
                    {food.nama}
                  </h3>
                  <div className="font-bold text-2xl text-center text-teal-600 animate-slideUp">
                    {formatCurrency(food.harga)}
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
                      onClick={(e) => handleCartClick(food, e)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                        />
                      </svg>
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
                      onClick={(e) => handleOrderNow(food, e)}
                    >
                      Pesan Sekarang
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default FoodsMenu;
