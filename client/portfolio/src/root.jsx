
import { Outlet } from "react-router";
import Navbar from "./components/navbar";
const Root = () => {

  // loading whene userloading
  // if (userLoading) {
  //   return <LoadingPage />;
  // }
  //=================================================================================================================
  return (
    <div
      className="root"
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#e9f0e8",
      }}
    >
      {/* <ScrollToTop /> */}
      <div
        style={{
          width: "100%",
          maxWidth: `${1500}px`,
          // height: "64px",
          margin: "0 auto",
          position: "sticky",
          top: "0",
          zIndex: "1000",
        }}
      >
        <Navbar />
      </div>
      {/* عشان خاصية ال ستيكي تشتغل لازم يكون ارتفاع الكونتينر اكبر من ارتفاع البوكس الداخلي */}
      <div
        style={{
          width: "100%",
          maxWidth: `${1500}px`,
          margin: "0 auto",
          minHeight: `calc(100vh - 64px)`,
          flexWrap: "nowrap",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // backgroundColor: theme.palette.background.default,
            borderRight: "1px solid",
            borderLeft: "1px solid",
            borderColor: "divider",
            flexGrow: 1,
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Root;