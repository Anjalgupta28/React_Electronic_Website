import React from "react";
import Header from "../common/header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../home/Home";
import Footer from "../common/footer/Footer";
import About from "../about/About";
// import Pricing from "../pricing/Pricing";
// import Blog from "../blog/Blog";
// import Services from "../services/Services";
import Contact from "../contact/Contact";
import Signup from "../Signup/Signup";
import { ToastContainer } from 'react-toastify';
import Login from "../login/Login";
import Appliances from "../services/Appliances";
import AddItems from "../addItems/AddItems";
import CreateInvoice from "../addItems/createInvoice";
import Product from "../home/featured/Product";

// import PrivateRoute from "../PrivateRoute";

const Pages = () => {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <ToastContainer theme='colored' position="bottom-right" />
        <Routes>
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/" element={<Login />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/add" element={<AddItems />} />
          {/* <Route exact path="/services" element={<Services />} /> */}
          {/* <Route exact path="/pricing" element={<Pricing />} /> */}
          <Route exact path="/createInvoice" element={<CreateInvoice />} />
          <Route exact path="/productPage" element={<Product />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/appliances" element={<Appliances />} />

          {/* <Route exact path="/private" element={<PrivateRoute />}>
          
          </Route> */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default Pages;
