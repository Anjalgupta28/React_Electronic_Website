import React from 'react';
import Heading from '../../common/Heading';
import "./Featured.css"
import { useNavigate } from "react-router-dom";

const Featured = () => {
  const usenavigate = useNavigate();

  const ProductPage = () => {
    usenavigate("/productPage");
  };

  return (
    <>
      <section className='featured background'>
        <div className='container'>
          <Heading title='Featured Appliance Types' subtitle='Find All Type of Appliances.' />

          <div className='content grid mtop'>
            <div className='box' onClick={ProductPage}>
              <img src="../../../images/hero/appliance.png" alt='' className='featured img' />
              <h2>Buy Product</h2>
              <label></label>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Featured;