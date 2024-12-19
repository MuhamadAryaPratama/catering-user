import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosClient from "../axiosClient";

function CategoryMenu() {
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get("/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    // Fetch cart count
    const fetchCartCount = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.log("No token found, user not logged in.");
        return; // Exit if no token
      }

      try {
        const response = await axiosClient.get("/cart");
        const totalCount = response.data.data.reduce(
          (total, item) => total + item.jumlah,
          0
        );
        setCartCount(totalCount);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
        // Handle token expiration or invalid token error
        if (error.response && error.response.status === 401) {
          console.log("Token may be expired or invalid.");
          // Optionally, redirect to login or refresh token here
        }
      }
    };

    fetchCategories();
    fetchCartCount();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}`); // Navigate to a new page
  };

  return (
    <div>
      <Navbar cartCount={cartCount} />
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Categories</h1>
        <div className="flex gap-16 flex-wrap mb-8 text-center justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="p-20 border rounded gap-8"
            >
              <img
                src={category.image_url}
                alt={category.name}
                className="w-16 h-16 object-cover rounded-full mb-2"
              />
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CategoryMenu;
