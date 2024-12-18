import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Signup from "./views/Signup";
import FoodsMenu from "./views/FoodsMenu";
import CategoryMenu from "./views/CategoryMenu";
import About from "./views/About";
import ShoppingCart from "./views/ShoppingCart";
import CategoryFoods from "./views/CategoryFoods";
import OrderForm from "./views/OrderForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/foods",
    element: <FoodsMenu />,
  },
  {
    path: "/categories",
    element: <CategoryMenu />,
  },
  {
    path: "/categories/:id", // Tambahkan route baru untuk kategori makanan
    element: <CategoryFoods />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/cart",
    element: <ShoppingCart />,
  },
  {
    path: "/order-form", // Route baru untuk halaman OrderForm
    element: <OrderForm />,
  },
]);

export default router;
