import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

// Lazy load components
const Dashboard = React.lazy(() => import("./views/Dashboard"));
const Login = React.lazy(() => import("./views/Login"));
const Signup = React.lazy(() => import("./views/Signup"));
const ForgotPassword = React.lazy(() => import("./components/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./components/ResetPassword"));
const FoodsMenu = React.lazy(() => import("./views/FoodsMenu"));
const CategoryMenu = React.lazy(() => import("./views/CategoryMenu"));
const About = React.lazy(() => import("./views/About"));
const ShoppingCart = React.lazy(() => import("./views/ShoppingCart"));
const CategoryFoods = React.lazy(() => import("./components/CategoryFoods"));
const OrderForm = React.lazy(() => import("./components/OrderForm"));
const Profile = React.lazy(() => import("./views/Profile"));
const FoodDetail = React.lazy(() => import("./components/FoodDetail"));
const EditProfile = React.lazy(() => import("./components/EditProfile"));

// Fallback loader
const Loader = () => <div>Loading...</div>;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<Loader />}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <Suspense fallback={<Loader />}>
        <ForgotPassword />
      </Suspense>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <Suspense fallback={<Loader />}>
        <ResetPassword />
      </Suspense>
    ),
  },
  {
    path: "/foods",
    element: (
      <Suspense fallback={<Loader />}>
        <FoodsMenu />
      </Suspense>
    ),
  },
  {
    path: "/foods/:id",
    element: (
      <Suspense fallback={<Loader />}>
        <FoodDetail />
      </Suspense>
    ),
  },
  {
    path: "/categories",
    element: (
      <Suspense fallback={<Loader />}>
        <CategoryMenu />
      </Suspense>
    ),
  },
  {
    path: "/categories/:id",
    element: (
      <Suspense fallback={<Loader />}>
        <CategoryFoods />
      </Suspense>
    ),
  },
  {
    path: "/about",
    element: (
      <Suspense fallback={<Loader />}>
        <About />
      </Suspense>
    ),
  },
  {
    path: "/cart",
    element: (
      <Suspense fallback={<Loader />}>
        <ShoppingCart />
      </Suspense>
    ),
  },
  {
    path: "/order-form",
    element: (
      <Suspense fallback={<Loader />}>
        <OrderForm />
      </Suspense>
    ),
  },
  {
    path: "/profile",
    element: (
      <Suspense fallback={<Loader />}>
        <Profile />
      </Suspense>
    ),
  },
  {
    path: "/profile/:id",
    element: (
      <Suspense fallback={<Loader />}>
        <EditProfile />
      </Suspense>
    ),
  },
]);

export default router;
