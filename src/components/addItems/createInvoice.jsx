import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import DownloadIcon from "@mui/icons-material/Download";
import Back from "../common/Back";
import img from "../images/services.jpg";
import "./createInvoice.css"

const CreateInvoice = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [open, setOpen] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [post, setPost] = useState("");
  const [district, setDistrict] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [placeOfSupply, setPlaceOfSupply] = useState("");
  const [reverseCharge, setReverseCharge] = useState("");
  const [transMode, setTransmode] = useState("");
  const [vehicleNumber, setVehicleNUmber] = useState("");
  const [eWayBillNumber, setEWayBillNumber] = useState("");
  const [product, setProduct] = useState("");
  const [description, setDescription] = useState("");
  const [qty, setQty] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [price, setPrice] = useState("");
  const [gst, setGst] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [grandTotal, setGrandTotal] = useState(0);
  const formRef = useRef(null);
  const componentPDF = useRef();
  const usenavigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/invoice")
      .then((response) => response.json())
      .then((data) => {
        setInvoiceData(data);

        let total = 0;
        data.forEach((item) => {
          total += parseFloat(item.totalAmount);
        });
        setGrandTotal(total.toFixed(2));
      })
      .catch((error) => console.error("Error fetching invoice data:", error));
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "UserData",
    onAfterPrint: () => alert("Data Saved Successfully"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    document.getElementById("myForm").reset();
    let InvoiceObj = {
      invoiceNumber,
      name,
      address,
      post,
      district,
      invoiceDate,
      orderDate,
      placeOfSupply,
      reverseCharge,
      transMode,
      vehicleNumber,
      eWayBillNumber,
      product,
      description,
      qty,
      hsnCode,
      price,
      gst,
      totalAmount,
      grandTotal,
    };
    setInvoiceData([...invoiceData, InvoiceObj]);
    fetch("http://localhost:8000/invoice", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(InvoiceObj),
    })
      .then((res) => {
        toast.success("Request Submitted Successfully", {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        handleClose();
        usenavigate("/createInvoice");
        // handleReset();
        console.log(res);
      })
      .then(() => {})
      .catch((err) => {
        toast.error("Failed:" + err.message, {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  return (
    <>
      <section className="blog-out mb">
        <Back
          name="Invoice"
          title="Invoice - To Generate new Invoice Bill "
          cover={img}
        />
      </section>
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            margin: "10px 0px 10px 0px",
          }}
        >
          {/* <button onClick={handleReset} style={{ marginRight: "10px" }}>Reset Form</button> */}
          <button onClick={generatePDF} style={{ marginRight: "10px" }}>
            Download Invoice
            <DownloadIcon />
          </button>
          <button onClick={handleClickOpen}>Add Details</button>
        </div>
      </div>

      <div ref={componentPDF} style={{ width: "100%" }}>
        <div
          className="container"
          style={{ marginBottom: "10px", border: "1px solid black" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
            className="container"
          >
            <h3>Tax Invoice</h3>
          </div>
          <div>
            <h6
              style={{
                display: "flex",
                flexDirection: "column",
              }}
              className="font"
            >
              Sold by : GUPTA TRADERS
            </h6>

            <h6>
              <span className="font" style={{fontStyle: "italic" }}>
                Ship-from Address :
              </span>{" "}
              Khalwara Bazar, Kymore-483880, Madhya Pradesh, India
            </h6>

            <h6>
              <span className="font">Email ID :</span>{" "}
              Guptaarun2810@gmail.com
            </h6>
            <h6>
              <span className="font">Contact No :</span>{" "}
              9893085219
            </h6>
            {invoiceData.map((invoice, index) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                key={index}
              >
                <h6>
                  <span className="font">GSTIN :</span>{" "}
                  23ANQPG4283N1ZI
                </h6>
                <h6
                  style={{
                    display: "flex",
                    borderRadius: "6px",
                    width: "20%",
                    height: "30px",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: "50px",
                  }}
                >
                  {" "}
                  <span className="font">
                    Invoice Number :
                  </span>{" "}
                  {invoice.invoiceNumber}
                </h6>
              </div>
            ))}
            <div style={{ border: "1px solid black" }} />
            <div>
              {invoiceData.map((invoice, index) => (
                <div key={index}>
                  <span className="font">Bill To :</span>
                  <div>{invoice.name}</div>
                  <div>{invoice.address}</div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <h6>
                      <span className="font">Post :</span>
                      {invoice.post}
                    </h6>
                    <h6>
                      <span className="font">
                        Invoice Date :{" "}
                      </span>
                      {invoice.invoiceDate}
                    </h6>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <h6>
                      <span className="font">District :</span>{" "}
                      {invoice.district}
                    </h6>
                    <h6>
                      <span className="font">Order Date :</span>{" "}
                      {invoice.orderDate}{" "}
                    </h6>
                  </div>

                  <div style={{ display: "flex", justifyContent: "end" }}>
                    <h6>
                      <span className="font">
                        Place of Supply :
                      </span>{" "}
                      {invoice.placeOfSupply}{" "}
                    </h6>
                  </div>

                  <div style={{ display: "flex", justifyContent: "end" }}>
                    <h6>
                      <span className="font">
                        Reverse Charge :
                      </span>{" "}
                      {invoice.reverseCharge}{" "}
                    </h6>
                  </div>

                  <div style={{ display: "flex", justifyContent: "end" }}>
                    <h6>
                      <span className="font">
                        Transportation Mode :
                      </span>{" "}
                      {invoice.transMode}
                    </h6>
                  </div>

                  <div style={{ display: "flex", justifyContent: "end" }}>
                    <h6>
                      <span className="font">
                        Vehicle Number :
                      </span>
                      {invoice.vehicleNumber}{" "}
                    </h6>
                  </div>

                  <div style={{ display: "flex", justifyContent: "end" }}>
                    <h6>
                      <span className="font">
                        E-Way Bill No :
                      </span>{" "}
                      {invoice.eWayBillNumber}{" "}
                    </h6>
                  </div>
                </div>
              ))}

              <div style={{ border: "1px solid black" }} />

              <table className="table">
                <thead className="bg-light text-black">
                  <tr>
                    <td>Products</td>
                    <td>Description of Goods</td>
                    <td>Qty</td>
                    <td>HSN/SAC Code</td>
                    <td>Price</td>
                    <td>GST</td>
                    <td>Total</td>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.map((invoice, index) => (
                    <tr key={index}>
                      <td>{invoice.product}</td>
                      <td>{invoice.description}</td>
                      <td>{invoice.qty}</td>
                      <td>{invoice.hsnCode}</td>
                      <td>{invoice.price}</td>
                      <td>{invoice.gst}</td>
                      <td>{invoice.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ border: "1px solid black" }} />
              <div style={{ display: "flex", justifyContent: "end" }}>
                <span className="font">Grand Total</span>
                {invoiceData.map((invoice, index) => (
                  <div key={index}>{invoice.grandTotal}</div>
                ))}
              </div>
              <div
                style={{ border: "1px solid black", marginBottom: "10px" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          style={{ height: "50rem", marginTop: "50px" }}
        >
          <DialogTitle id="alert-dialog-title">
            {"Fill up the form"}
          </DialogTitle>

          <DialogContent>
            <form
              onSubmit={handleSubmit}
              ref={formRef}
              id="myForm"
              className="shadow"
              style={{ marginTop: "0px" }}
            >
              <div>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="form-control"
                  placeholder="Invoice Number"
                  required
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  placeholder="Name"
                  required
                />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control"
                  placeholder="Address"
                  required
                />
                <input
                  type="text"
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                  className="form-control"
                  placeholder="Post"
                  required
                />
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="form-control"
                  placeholder="District"
                  required
                />
                <input
                  type="text"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="form-control"
                  placeholder="Invoice Date"
                  required
                />
                <input
                  type="text"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="form-control"
                  placeholder="Order Date"
                  required
                />
                <input
                  type="text"
                  value={placeOfSupply}
                  onChange={(e) => setPlaceOfSupply(e.target.value)}
                  className="form-control"
                  placeholder="Place Of Supply"
                  required
                />
                <input
                  type="text"
                  value={reverseCharge}
                  onChange={(e) => setReverseCharge(e.target.value)}
                  className="form-control"
                  placeholder="Reverse Charge"
                  required
                />
                <input
                  type="text"
                  value={transMode}
                  onChange={(e) => setTransmode(e.target.value)}
                  className="form-control"
                  placeholder="TransPortation Mode"
                  required
                />
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNUmber(e.target.value)}
                  className="form-control"
                  placeholder="Vehicle Number"
                  required
                />
                <input
                  type="text"
                  value={eWayBillNumber}
                  onChange={(e) => setEWayBillNumber(e.target.value)}
                  className="form-control"
                  placeholder="E-Way Bill Number"
                  required
                />
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="form-control"
                  placeholder="Product"
                  required
                />
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control"
                  placeholder="Descriptions"
                  required
                />
                <input
                  type="text"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="form-control"
                  placeholder="Quantity"
                  required
                />
                <input
                  type="text"
                  value={hsnCode}
                  onChange={(e) => setHsnCode(e.target.value)}
                  className="form-control"
                  placeholder="HSN Code"
                  required
                />
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="form-control"
                  placeholder="Price"
                  required
                />
                <input
                  type="text"
                  value={gst}
                  onChange={(e) => setGst(e.target.value)}
                  className="form-control"
                  placeholder="GST (%)"
                  required
                />
                <input
                  type="text"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="form-control"
                  placeholder="Total Amount"
                  required
                />
                <input
                  type="text"
                  value={grandTotal}
                  onChange={(e) => setGrandTotal(e.target.value)}
                  className="form-control"
                  placeholder="Grand Total"
                  required
                />
                <button style={{ margin: "15px" }}>Submit Request</button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default CreateInvoice;
