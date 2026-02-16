import { Navigate, RouterProvider, createBrowserRouter } from "react-router";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/home/home";
import SignIn from "./pages/login/login";
import Root from "./Root";
import AdminDashboard from "./pages/dashboard/adminDashboard";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // @ts-ignore
  const { isAuthenticated, isLoadingAuth } = useSelector((state) => state.auth);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        // home route for authenticated users(user and organizer)
        {
          index: true,
          element: <Home />,
        },

        {
          path: "/signin",
          element: !isAuthenticated ? (
            <SignIn />
          ) : (
            <Navigate to="/admindashboard" />
          ),
        },
        {
          path: "/admindashboard",
          element:
            isAuthenticated || isLoadingAuth ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            ),
        },
        {
          path: "*",
          element: <ErrorPage />,
        },
      ],
    },
  ]);
  return (
    <>
      {" "}
      {/* ✅ استخدام Fragment بدلاً من جعل التوست أباً للراوتر */}
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 99999 }} // ✅ تأكيد إن التوست فوق المودال
      />
    </>
  );
}
export default App;
