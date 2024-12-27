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
          foodData: {
            name: food.nama,
            price: food.harga,
            quantity: 1,
            total: food.harga,
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
      const cartResponse = await axiosClient.get("/cart");
      const currentCart = cartResponse.data.data;

      const existingItem = currentCart.find(
        (item) => item.nama_menu === food.nama
      );

      if (existingItem) {
        Swal.fire({
          title: "Info",
          text: `${food.nama} sudah ada di keranjang.`,
          icon: "info",
          confirmButtonText: "OK",
        });
        return;
      }

      await axiosClient.post("/cart", {
        nama_menu: food.nama,
        jumlah: 1,
        harga_satuan: food.harga,
      });

      await fetchCartCount();

      Swal.fire({
        title: "Added to Cart",
        text: `${food.nama} telah ditambahkan ke keranjang.`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Gagal menambahkan item ke keranjang.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Cart operation failed:", error);
    }
  };

  return (
    <div>
      <Navbar cartCount={cartCount} />
      <div className="container mx-auto py-8">
        <h2 className="text-center mt-5">
          Selamat datang di Catering Warung Nasi Marsel
        </h2>
        <p className="text-center">
          Kami menyediakan berbagai menu lezat dengan harga terjangkau.
        </p>
        <p className="text-center py-3">
          Berikut ini menu yang tersedia di Catering Warung Nasi Marsel
        </p>

        <h1 className="text-3xl font-bold text-center mb-6">Daftar Menu</h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {foods.map((food) => (
              <div
                key={food.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:bg-cyan-600 hover:shadow-2xl transition duration-300 cursor-pointer w-full h-96"
                onClick={() => goToDetail(food.id)}
              >
                <div className="h-1/2 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={`${import.meta.env.VITE_API_BASE_URL}${
                      food.gambar_url
                    }`}
                    alt={food.nama}
                  />
                </div>
                <div className="h-1/2 p-4 flex flex-col justify-between">
                  <h3 className="text-lg font-medium mb-2 text-center">
                    {food.nama}
                  </h3>
                  <div className="font-bold text-lg mb-4 text-center">
                    {formatCurrency(food.harga)}
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-2 rounded"
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
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
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
