import React, { useRef, useState } from "react"
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from "react-router-dom";
import img from "../images/services.jpg"
import { toast } from "react-toastify";
import Back from "../common/Back";
import "./Additem.css";
import TableList from "./TableList";

const AddItems = () => {
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [prdouctPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const formRef = useRef(null);
  const usenavigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageBase64String = reader.result.split(',')[1];
      postImage(imageBase64String);
    };
    reader.readAsDataURL(selectedFile);

    const postImage = (imageBase64String) => {
      const imageData = { productName, prdouctPrice, productDescription, productBrand, imageBase64String };

      fetch('http://localhost:8000/addItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
      })
        .then((res) => {
          toast.success("Data uploaded successfully:");
          usenavigate("/home");
          console.log(res);
        })
        .catch((err) => {
          toast.error("Error uploading data:" + err.message);
        });
    };
  };



  return (
    <>
      <section className='blog-out mb'>
        <Back name='Add Product' title='Add-Product - To add new product in our list ' cover={img} />
        <div className='container recent' style={{ display: "flex", justifyContent: "flex-end" }}>
          <button style={{ marginTop: "2rem" }} onClick={handleClickOpen}>Add Product</button>
        </div>

        <div style={{marginTop:"20px"}}>
          <TableList />
        </div>

        <div>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Fill up the form"}
            </DialogTitle>

            <DialogContent>
              <form onSubmit={handleSubmit} ref={formRef} id="myForm" className="shadow" style={{ marginTop: "0px" }}>
                <div>
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="form-control" placeholder="Product Name" required />
                  <input type="number" value={prdouctPrice} onChange={(e) => setProductPrice(e.target.value)} className="form-control" placeholder="Price" required />
                  <input type="text" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className="form-control" placeholder="Description" required />
                  <input type="text" value={productBrand} onChange={(e) => setProductBrand(e.target.value)} className="form-control" placeholder="Brand" required />
                  <input type="file" multiple="multiple" placeholder="Photos" onChange={(e) => setSelectedFile(e.target.files[0])} />
                  <button style={{ margin: "15px" }}>Submit Request</button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </>
  )
}

export default AddItems