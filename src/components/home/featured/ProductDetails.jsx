import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ProductDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const product = location.state.product;
  const usenavigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userId");
    if (!isLoggedIn) {
      usenavigate("/");
    }
  }, [usenavigate]);

  const priceAfterDiscount = Math.round(product.productPrice - (product.productPrice * (product.discount / 100)));

  const amountSaved = product.productPrice - priceAfterDiscount;

  const handleIconHover = () => {
    setIsModalOpen(true);
  };

  const handleIconLeave = () => {
    setIsModalOpen(false);
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const handleBuyNow = async (amount) => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
    if (!res) {
      alert("Error loading razor pay script")
      return
    }
    const options = {
      key: "rzp_test_dbRuomaxLTemXU",
      currency: "INR",
      amount: priceAfterDiscount * 100,
      name: product.productName,
      order_id: res.id,
      description: product.productDescription,

      handler: function (response) {
        alert(response.razorpay_payment_id)
        alert("Payment Successfully")
      },
      prefill: {
        email: 'Anjal.gupta28@gmail.com',
        contact: '8770495994',
        name:'Anjal'
      },
      notes: {
        address: 'Thanks for Supporting to us.',
      },
      // theme: {
      //   color: '#F37254',
      // },
    }
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  }

  return (
    <>
      <div className='container'>
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
      </div>

      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "10px" }} className='container'>
        <div style={{ width: "70%", height: "1000px", textAlign: "center", padding: "15px" }}>
          <div style={{ width: "100%", height: "600px", border: "1px solid #c8c8c8" }}></div>
          <div style={{ width: "100%", display: "flex", flexFlow: "row", justifyContent: "space-between", marginTop: "12px" }}>
            <button style={{ width: "49%", backgroundColor: "#ff9f00", borderRadius: "3px" }}>ADD TO CART</button>
            <button style={{ width: "49%", backgroundColor: "#fb641b", borderRadius: "3px" }} onClick={handleBuyNow}>BUY NOW</button>
          </div>
        </div>

        <div style={{ height: "1500px", padding: "15px" }} className='container'>
          <h2 style={{ width: "100%", fontWeight: "bold", display: "contents" }}>{product.productDescription}</h2>

          <div style={{ alignItems: "center", display: "flex", marginTop: "1.5rem" }}>
            <h1>₹{priceAfterDiscount}</h1>
            <div style={{ textDecoration: "line-through", marginLeft: "15px", fontSize: "20px", color: "#878787" }}>₹{product.productPrice}</div>
            <div style={{ marginLeft: "12px", fontSize: "16px", fontWeight: "bold", color: "#388e3c", verticalAlign: "middle" }}>{product.discount}% off</div>
            <div style={{ marginLeft: "15px", color: "grey" }}
              onMouseEnter={handleIconHover}
              onMouseLeave={handleIconLeave}
            >
              <ErrorOutlineIcon />
              {isModalOpen && (
                <div style={{ position: "absolute", padding: "15px", borderRadius: "4px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", backgroundColor: "whitesmoke", width: "auto" }}>
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: "black", }}>
                    Price Details
                  </div>
                  <div style={{ marginTop: "15px", color: "grey", display: "flex" }}>
                    <div style={{ fontWeight: "bold" }}>Maximum Retail Price</div>
                    <div style={{ textDecoration: "line-through", marginLeft: "70px", color: "black" }}>₹ {product.productPrice}.00</div>
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "bold" }}>(Incl. of all taxes)</div>
                  <div style={{ backgroundColor: "grey", height: "1px", width: "100%", marginTop: "15px" }} />
                  <div style={{ marginTop: "15px", color: "grey", display: "flex" }}>
                    <div style={{ fontWeight: "bold" }}>Selling Price</div>
                    <div style={{ marginLeft: "150px", color: "black" }}>₹ {priceAfterDiscount}.00</div>
                  </div>
                  <div style={{ backgroundColor: "grey", height: "1px", width: "100%", marginTop: "15px" }} />

                  <div style={{ marginTop: "15px", color: "#388e3c", fontWeight: "bold", fontSize: "14px", textAlign: "center" }}>Overall you save ₹{amountSaved} ({product.discount}%) on this product</div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: "bold", fontSize: "16px" }}>Available Offers</div>

            <div>
              <span style={{ marginTop: "12px", display: "flex", flexFlow: "row wrap" }}>
                <img src='https://rukminim2.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90' style={{ width: "18px", height: "18px" }} alt='' />
                <li style={{ width: "94%", listStyle: "none", marginTop: "-2px" }}>
                  <span style={{ marginLeft: "10px", fontWeight: "bold" }}>Bank Offer</span>
                  <span style={{ marginLeft: "5px" }}>Flat ₹1,250 Off on HDFC Bank Credit Card EMI Trxns on orders priced between ₹15,000 to ₹39,999</span>
                </li>
              </span>
            </div>

            <div>
              <span style={{ marginTop: "12px", display: "flex", flexFlow: "row wrap" }}>
                <img src='https://rukminim2.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90' style={{ width: "18px", height: "18px" }} alt='' />
                <li style={{ width: "94%", listStyle: "none", marginTop: "-2px" }}>
                  <span style={{ marginLeft: "10px", fontWeight: "bold" }}>Bank Offer</span>
                  <span style={{ marginLeft: "5px" }}>Flat ₹3,000 Off on HDFC Bank Credit Card EMI Trxns on orders priced between ₹40,000 to ₹49,999</span>
                </li>
              </span>
            </div>

            <div>
              <span style={{ marginTop: "12px", display: "flex", flexFlow: "row wrap" }}>
                <img src='https://rukminim2.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90' style={{ width: "18px", height: "18px" }} alt='' />
                <li style={{ width: "94%", listStyle: "none", marginTop: "-2px" }}>
                  <span style={{ marginLeft: "10px", fontWeight: "bold" }}>Bank Offer</span>
                  <span style={{ marginLeft: "5px" }}>Flat ₹4,000 Off on HDFC Bank Credit Card EMI Trxns on orders of ₹50,000 and above</span>
                </li>
              </span>
            </div>

            <div>
              <span style={{ marginTop: "12px", display: "flex", flexFlow: "row wrap" }}>
                <img src='https://rukminim2.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90' style={{ width: "18px", height: "18px" }} alt='' />
                <li style={{ width: "94%", listStyle: "none", marginTop: "-2px" }}>
                  <span style={{ marginLeft: "10px", fontWeight: "bold" }}>Bank Offer</span>
                  <span style={{ marginLeft: "5px" }}>Extra ₹2,000 Off on Bikes & Scooters on purchase of ₹30,000 or more</span>
                </li>
              </span>
            </div>
          </div>

          <div style={{ display: "flex", padding: "24px 0px 0px", flexFlow: "row" }}>
            <div style={{ display: "block", width: "50%" }}>
              <div style={{ paddingRight: "16px" }}>
                <div style={{ fontWeight: "500", color: "#878787", width: "110px", paddingRight: "10px", float: "left" }}>Highlight</div>
                <div style={{ marginLeft: "110px" }}>
                  <ul style={{ display: "block", listStyleType: "disc", marginBlockStart: "1em", marginBlockEnd: "1em", marginInlineStart: "0px", marginInlineEnd: "0px", paddingInlineStart: "40px" }}>
                    <li style={{ display: "list-item" }}>Output: Color</li>
                    <li style={{ display: "list-item" }}>WiFi | USB</li>
                    <li style={{ display: "list-item" }}>Print Speed Mono A4: 30 ppm | Print Speed Color A4: 12 ppm</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ display: "block", width: "50%" }}>
              <div>
                <div style={{ fontWeight: "500", color: "#878787", width: "110px", paddingRight: "10px", float: "left" }}>Easy Payment Options</div>
                <div style={{ marginLeft: "110px" }}>
                  <ul style={{ display: "block", listStyleType: "disc", marginBlockStart: "1em", marginBlockEnd: "1em", marginInlineStart: "0px", marginInlineEnd: "0px", paddingInlineStart: "40px" }}>
                    <li style={{ display: "list-item" }}>No cost EMI starting from ₹1,267/month</li>
                    <li style={{ display: "list-item" }}>Cash on Delivery</li>
                    <li style={{ display: "list-item" }}>Net banking & Credit/ Debit/ ATM card</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "block", width: "100%" }}>
            <div style={{ marginTop: "24px", display: "flex" }}>
              <div style={{ fontWeight: "500", width: "110px", paddingRight: "10px", color: "#878787", float: "left" }}>
                <span>Seller</span>
              </div>
              <div style={{ display: "block" }}>
                <div style={{ fontWeight: "500", color: "#2874f0", position: "relative", display: "inline", cursor: "pointer" }}>
                  <span>GUPTA TRADERS</span>
                </div>
                <div style={{ display: "block" }}>
                  <ul style={{ display: "block", listStyleType: "disc", marginBlockStart: "1em", marginBlockEnd: "1em", marginInlineStart: "0px", marginInlineEnd: "0px", paddingInlineStart: "40px" }}>
                    <li style={{ display: "list-item" }}>7 Days Service Center Replacement/Repair</li>
                    <li style={{ display: "list-item" }}>GST invoice available</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "block", width: "100%" }}>
            <div style={{ marginTop: "24", borderRadius: "2px", fontSize: "12px", border: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 30px 24px 24px", fontSize: "24px", fontWeight: "500", lineHeight: "1.14", color: "#212121" }}>Specification</div>
              <div style={{ display: "block" }}>
                <div style={{ maxHeight: "350px", overflow: "hidden", position: "relative" }}>
                  <div style={{ borderTop: "1px solid #f0f0f0", padding: "24px 24px 34px", fontSize: "14px" }}>
                    <div style={{ paddingBottom: "16px", fontSize: "18px", whiteSpace: "nowrap", lineHeight: "1.4" }}>General</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", display: "table", textIndent: "initial", borderSpacing: "2px", borderColor: "grey" }}>
                      <tbody style={{ display: "table-row-group", verticalAlign: "middle", borderColor: "inherit" }}>
                        <tr style={{ width: "100%", display: "flex", flexFlow: "row", paddingBottom: "16px", alignItems: "center" }}>
                          <td style={{ color: "#878787", paddingRight: "8px", width: "25%", display: "inline-block", verticalAlign: "top" }}>Printing Method</td>
                          <td style={{ lineHeight: "1.4", wordBreak: "break-word", color: "#212121", width: "75%", display: "inline-block", verticalAlign: "top" }}>
                            <div style={{ marginLeft: "110px" }}>
                              <ul style={{ display: "block", listStyleType: "disc", marginBlockStart: "1em", marginBlockEnd: "1em", marginInlineStart: "0px", marginInlineEnd: "0px", paddingInlineStart: "40px" }}>
                                <li style={{ paddingBottom: "0" }}>Inkjet</li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
