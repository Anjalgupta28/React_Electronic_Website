import React from "react";
import Header from "../common/header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../home/Home";
import Footer from "../common/footer/Footer";
import About from "../about/About";
import Contact from "../contact/Contact";
import Signup from "../Signup/Signup";
import { ToastContainer } from 'react-toastify';
import Login from "../login/Login";
import AddItems from "../addItems/AddItems";
import CreateInvoice from "../addItems/createInvoice";
import Product from "../home/featured/Product";
import ProductDetails from "../home/featured/ProductDetails";

const Pages = () => {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <ToastContainer theme='colored' position="bottom-right" />
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/add" element={<AddItems />} />
          <Route exact path="/createInvoice" element={<CreateInvoice />} />
          <Route exact path="/productPage" element={<Product />} />
          <Route exact path="/product-details/:id" element={<ProductDetails />} />
          <Route exact path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default Pages;
