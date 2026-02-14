import { Outlet } from "react-router";
import Navbar from "./components/navbar";
import { useGetUserByNameQuery } from "./Redux/UserApi";
import LoadingPage from "./pages/loadingPage";
import { useSelector } from "react-redux";

const Root = () => {
  // @ts-ignore
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { isLoading: userLoading } = useGetUserByNameQuery(undefined, {
    // skip: !isAuthenticated,
  });

  if (isAuthenticated && userLoading) {
    return <LoadingPage />;
  }

  return (
    <div
      className="root"
      style={{
        display: "flex",
        flexDirection: "column",
        // ✅ تغيير الخلفية لتناسب Deep Blue (نفس لون الهوم)
        backgroundColor: "#1a202c", 
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1500px",
          margin: "0 auto",
          position: "sticky",
          top: "0",
          zIndex: "1000",
        }}
      >
      {!isAuthenticated && !userLoading && <Navbar />}  
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "1500px",
          margin: "0 auto",
          minHeight: `calc(100vh - 64px)`,
          display: "flex", // تأكيد الـ flex هنا
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // ✅ جعل الـ Border خفيف جداً عشان ميزعجش العين في الدارك مود
            borderRight: "1px solid rgba(255, 215, 0, 0.1)", 
            borderLeft: "1px solid rgba(255, 215, 0, 0.1)",
            flexGrow: 1,
            width: "100%",
            backgroundColor: "#1a202c", // توحيد اللون
          }}
        >
          {/* هنا الـ Home أو أي صفحة تانية بتظهر */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Root;