import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosClient from "../axiosClient";
import { useNavigate } from "react-router-dom";

function FoodsMenu() {
  const [cartCount, setCartCount] = useState(0);
  const [foods, setFoods] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fungsi untuk memformat harga ke format Rp.xx.xxx
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch cart and foods data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodsResponse, cartResponse] = await Promise.all([
          axiosClient.get("/foods"),
          axiosClient.get("/cart"),
        ]);

        setFoods(foodsResponse.data.data);
        setCartItems(cartResponse.data.data); // Simpan data keranjang
        updateCartCount(cartResponse.data.data);
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

  const updateCartCount = (cartItems) => {
    const totalCount = cartItems.reduce(
      (total, item) => total + item.jumlah,
      0
    );
    setCartCount(totalCount);
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem("access_token"); // Check if the access token exists

    if (!token) {
      Swal.fire({
        title: "Login Required",
        text: "Please log in to add items to the cart.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/"); // Redirect to home page if not logged in
      });
      return;
    }

    // Periksa apakah makanan sudah ada di keranjang
    const isInCart = cartItems.some((item) => item.nama_menu === product.nama);

    if (isInCart) {
      Swal.fire({
        title: "Info",
        text: `${product.nama} sudah ada di keranjang.`,
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // Tambahkan produk ke keranjang
      await axiosClient.post("/cart", {
        nama_menu: product.nama,
        jumlah: 1,
        harga_satuan: product.harga, // Harga satuan
      });

      // Perbarui data keranjang dan hitung ulang jumlah item
      const updatedCartResponse = await axiosClient.get("/cart");
      setCartItems(updatedCartResponse.data.data);
      updateCartCount(updatedCartResponse.data.data);

      Swal.fire({
        title: "Added to Cart",
        text: `${product.nama} telah ditambahkan ke keranjang.`,
        icon: "success",
        confirmButtonText: "OK",
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Gagal menambahkan item ke keranjang.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleOrderClick = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      Swal.fire({
        title: "Login Required",
        text: "Please log in to place an order.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login"); // Redirect ke halaman login jika belum login
      });
    } else {
      navigate("/order-form"); // Redirect ke halaman order form jika sudah login
    }
  };

  return (
    <div>
      <Navbar cartCount={cartCount} />
      <div className="container mx-auto py-8">
        <h1 className="text-center text-3xl font-bold mb-6">Daftar Menu</h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {foods.map((food) => (
              <div
                key={food.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg ring-4 ring-red-500 ring-opacity-40 max-w-xs"
              >
                <div className="relative">
                  <img
                    className="w-full"
                    src={food.gambar_url}
                    alt={food.nama}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">{food.nama}</h3>
                  <p className="text-gray-600 text-sm mb-4">{food.deskripsi}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">
                      {formatCurrency(food.harga)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4 space-x-2">
                    <button
                      onClick={() => addToCart(food)}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-2 rounded flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleOrderClick}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
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
