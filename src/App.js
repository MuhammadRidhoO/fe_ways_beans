import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/UseContext";
import PrivateTenant from "./routes/PrivateTenant";
import PrivateAdmin from "./routes/PrivateOwner";
import { API, setAuthToken } from "./config/api";
import Navbarr from "./components/Navbar";
import Home from "./components/Home";
import Detail from "./components/DetailBeans";
import Profile from "./components/Profile";
import Cart from "./components/Card";
import AddProduct from "./components/addProduct";
import IndexOwner from "./components/IndexOwner";

function App() {

  const [state, dispatch] = useContext(UserContext);
  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");
      let payload = response.data.data;
      payload.token = localStorage.token;
      dispatch({
        type: "USER_SUCCESS",
        payload,
      })
    } catch (error) {
      console.log(error);
      dispatch({
        type: "AUTH_ERROR",
      });
    }
  };

  useEffect(() => {
    checkUser()
  }, []);

  if (localStorage.token) {
    setAuthToken(localStorage.token)
  }

  return (
    <>
      <BrowserRouter>
        <Navbarr />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/detailbeans/:id" element={<Detail />} />

          <Route element={<PrivateTenant />}>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/detailbeans/:id" element={<Detail />} />
            <Route exact path="/card-transaction" element={<Cart />} />
            <Route exact path="/profile-user" element={<Profile />} />
          </Route>

          <Route element={<PrivateAdmin />}>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/product" element={<AddProduct />} />
            <Route exact path="/index" element={<IndexOwner />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
    // {/* <Navbar/>
    // <Home/>
    // <Detail/>
    // <ProfileUser/>
    // <MyBooking/>
    // <MyBookingPending/>
    // <ProfileOwner/>
    // <IndexOwner/> */}
  );
}

export default App;
