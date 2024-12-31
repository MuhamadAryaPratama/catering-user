import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosClient from "../axiosClient";
import { useNavigate } from "react-router-dom";

function FoodsMenu() {
  const [cartCount, setCartCount] = useState(0);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
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
        const cartData = cartResponse.data.data;
        const totalCount = cartData.reduce(
          (total, item) => total + item.jumlah,
          0
        );
        setCartCount(totalCount);
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foodsResponse = await axiosClient.get("/foods");
        setFoods(foodsResponse.data.data);
        await fetchCartCount();
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Gagal memuat data.",
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

  const handleOrderNow = async (food) => {
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
      Swal.fire({
        title: "Error",
        text: "Gagal memproses pesanan.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Order failed:", error);
    }
  };

  const handleCartClick = async (food) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      Swal.fire({
        title: "Login Required",
        text: "Anda harus login terlebih dahulu untuk mengakses keranjang.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      navigate("/foods");
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

  return (
    <div>
      <Navbar cartCount={cartCount} />
      <div className="container mx-auto py-8 px-4 md:px-8">
        <h2 className="text-center mt-5 text-3xl font-bold text-teal-700">
          Selamat datang di Catering Warung Nasi Marsel
        </h2>
        <p className="text-center text-lg text-gray-600">
          Kami menyediakan berbagai menu lezat dengan harga terjangkau. Jelajahi
          menu kami dan temukan hidangan favorit Anda.
        </p>
        <p className="text-center text-md py-3 text-gray-500">
          Berikut ini menu yang tersedia di Catering Warung Nasi Marsel:
        </p>

        <h1 className="text-4xl font-extrabold text-center mb-6 text-teal-800">
          Daftar Menu
        </h1>

        {loading ? (
          <div className="text-center text-lg text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {foods.map((food) => (
              <div
                key={food.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer w-full"
                onClick={() => goToDetail(food.id)}
              >
                <div className="h-56 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={`${import.meta.env.VITE_API_BASE_URL}${
                      food.gambar_url
                    }`}
                    alt={food.nama}
                  />
                </div>
                <div className="p-4 flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-teal-700 text-center">
                    {food.nama}
                  </h3>
                  <div className="font-bold text-lg mb-4 text-center text-teal-600">
                    {formatCurrency(food.harga)}
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-3 rounded shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCartClick(food);
                      }}
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
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrderNow(food);
                      }}
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
