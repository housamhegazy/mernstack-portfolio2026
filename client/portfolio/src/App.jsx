import { Navigate, RouterProvider,createBrowserRouter } from "react-router";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/home/home";
import SignIn from "./pages/login/login";
import Root from "./Root";
import AdminDashboard from "./pages/dashboard/adminDashboard";
import { useSelector } from "react-redux";

function App() {
  // @ts-ignore
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        // home route for authenticated users(user and organizer)
        {
          index: true,
          element: !isAuthenticated ? <Home /> : <Navigate to='/admindashboard'/>,
        },

        {
          path: "/signin",
          element: !isAuthenticated ? <SignIn/> :  <Navigate to='/admindashboard'/>,
        },
        {
          path:"/admindashboard",
          element:isAuthenticated ?  <AdminDashboard/> : <Navigate to='/'/>
        },
        {
          path: "*",
          element: <ErrorPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
export default App;
