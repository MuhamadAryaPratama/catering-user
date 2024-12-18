import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosClient from "../axiosClient";

function CategoryFoods() {
  const { id } = useParams();
  const [foods, setFoods] = useState([]);
  const [category, setCategory] = useState(null);

  // Fungsi untuk memformat harga ke format mata uang Indonesia
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    // Fetch foods by category ID
    const fetchFoods = async () => {
      try {
        const response = await axiosClient.get(`/categories/${id}/foods`);
        setFoods(response.data.foods);
        setCategory(response.data.category);
      } catch (error) {
        console.error("Failed to fetch foods:", error);
      }
    };

    fetchFoods();
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-8">
        {category ? (
          <>
            <h1 className="text-2xl font-bold mb-4">{category.name}</h1>
            {foods.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {foods.map((food) => (
                  <div
                    key={food.id}
                    className="border p-4 rounded shadow hover:shadow-lg"
                  >
                    <img
                      src={food.gambar_url}
                      alt={food.nama}
                      className="w-full h-32 object-cover mb-2"
                    />
                    <h3 className="font-bold">{food.nama}</h3>
                    <p className="text-gray-700">{food.deskripsi}</p>
                    <p className="text-blue-500 font-bold">
                      {formatCurrency(food.harga)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No foods available for this category.
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-500">Loading category...</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default CategoryFoods;
