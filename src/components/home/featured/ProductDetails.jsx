import React from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Typography } from '@mui/material';


const ProductDetails = () => {
  const location = useLocation();
  const product = location.state.product;

  return (
    <>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link color="inherit" href="/home">
          Home
        </Link>
        <Link color="inherit" href="/productPage">
          Products
        </Link>
        <Typography color="textPrimary">
          Product Details
        </Typography>
      </Breadcrumbs>

      <h2>Product Details</h2>
      <p>Product ID: {product.id}</p>
      <p>Description: {product.productDescription}</p>
      <p>Brand: {product.productBrand}</p>
      <p>Price: {product.prdouctPrice}</p>
      <p>Category: {product.category}</p>
      <p>Discount: {product.discount}</p>
      <p>Price after discount: {product.priceAfterDiscount}</p>
    </>
  );
};

export default ProductDetails;
