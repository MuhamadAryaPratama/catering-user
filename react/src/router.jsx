import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Signup from "./views/Signup";
import ForgotPassword from "./views/ForgotPassword";
import ResetPassword from "./views/ResetPassword";
import FoodsMenu from "./views/FoodsMenu";
import CategoryMenu from "./views/CategoryMenu";
import About from "./views/About";
import ShoppingCart from "./views/ShoppingCart";
import CategoryFoods from "./views/CategoryFoods";
import OrderForm from "./components/OrderForm";
import Profile from "./components/Profile";

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
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
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
    path: "/categories/:id",
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
    path: "/order-form",
    element: <OrderForm />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

export default router;
