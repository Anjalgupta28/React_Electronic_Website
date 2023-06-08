import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogTitle, MenuItem, Select } from "@mui/material";
import Back from "../common/Back";
import img from "../images/services.jpg"
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import { CircularProgress } from "@mui/material";
import { useReactToPrint } from "react-to-print";

const AddItems = () => {
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [prdouctPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [category, setCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState(null);
  const [editItemId, setEditItemId] = useState(null);
  const [editItemData, setEditItemData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);
  const componentPDF = useRef()
  const usenavigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    fetch("http://localhost:8000/addItems")
      .then((res) => res.json())
      .then((resp) => {
        setData(resp);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
      });
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "UserData",
    onAfterPrint: () => alert("Data Saved Successfully")
  })

  const removeItem = (id) => {
    if (window.confirm('Do you want to remove?')) {
      fetch(`http://localhost:8000/addItems/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          // alert('Removed successfully.');
          fetchData();
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  const handleEditItem = (item) => {
    setEditItemId(item.id);
    setEditItemData(item);
  };

  const handleCancelEdit = () => {
    setEditItemId(null);
    setEditItemData({});
  };

  const handleUpdateItem = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8000/addItems/${editItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editItemData),
    })
      .then((res) => {
        alert('Product updated successfully.');
        fetchData();
        setEditItemId(null);
        setEditItemData({});
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditItemData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
      const imageData = { productName, prdouctPrice, productDescription, productBrand, category, imageBase64String };

      fetch('http://localhost:8000/addItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
      })
        .then((res) => {
          toast.success("Data uploaded successfully:");
          handleClose()
          fetchData()
          console.log(res);
        })
        .then(() => {
          // Reset the input value to an empty string
          setProductName("");
          setProductPrice("")
          setProductDescription("")
          setProductBrand("")
          setCategory("")
          setSelectedFile("")

        })
        .catch((err) => {
          toast.error("Error uploading data:" + err.message);
        });
    };
  };

  const createInvoice = () => {
    usenavigate("/createInvoice");
  };

  return (
    <>
      <section className='blog-out mb'>
        <Back name='Add Product' title='Add-Product - To add new product in our list ' cover={img} />
        <div className='container recent' style={{ display: "flex", justifyContent: "flex-end" }}>
          <button style={{ marginTop: "1rem", marginRight: "1rem" }} onClick={createInvoice}>Create Invoice</button>
          <button style={{ marginTop: "1rem", marginRight: "1rem" }} onClick={handleClickOpen}>Add Product</button>
          <button style={{ marginTop: "1rem" }} onClick={generatePDF}>Download PDF<DownloadIcon /></button>
        </div>
      </section>
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <CircularProgress /> {/* Loader component */}
        </div>
      ) : (

        <div className="container">
          <div className="card" style={{ marginBottom: "50px", boxShadow: "0 0 20px 0 rgb(112 121 138 / 18%)", maxHeight: "700px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h2>Product Listing</h2>
            </div>
            <div className="card-body">
              <div ref={componentPDF} style={{ width: "100%" }}>
                <table className="table table-bordered">
                  <thead className="bg-dark text-white">
                    <tr>
                      <td>ID</td>
                      <td>Name</td>
                      <td>Price</td>
                      <td>Description</td>
                      <td>Brand</td>
                      <td>Category</td>
                      <td>Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>
                            {editItemId === item.id ? (
                              <input
                                type="text"
                                name="productName"
                                value={editItemData.productName || ""}
                                onChange={handleChange}
                                required
                              />
                            ) : (
                              item.productName
                            )}
                          </td>
                          <td>
                            {editItemId === item.id ? (
                              <input
                                type="number"
                                name="prdouctPrice"
                                value={editItemData.prdouctPrice || ""}
                                onChange={handleChange}
                                required
                              />
                            ) : (
                              item.prdouctPrice
                            )}
                          </td>
                          <td>
                            {editItemId === item.id ? (
                              <input
                                type="text"
                                name="productDescription"
                                value={editItemData.productDescription || ""}
                                onChange={handleChange}
                                required
                              />
                            ) : (
                              item.productDescription
                            )}
                          </td>
                          <td>
                            {editItemId === item.id ? (
                              <input
                                type="text"
                                name="productBrand"
                                value={editItemData.productBrand || ""}
                                onChange={handleChange}
                                required
                              />
                            ) : (
                              item.productBrand
                            )}
                          </td>
                          <td>
                            {editItemId === item.id ? (
                              <input
                                type="text"
                                name="category"
                                value={editItemData.category || ""}
                                onChange={handleChange}
                                required
                              />
                            ) : (
                              item.category
                            )}
                          </td>
                          <td>
                            {editItemId === item.id ? (
                              <>
                                <CheckIcon onClick={handleUpdateItem} style={{ color: "blue", cursor: "pointer" }} />
                                <CloseIcon onClick={handleCancelEdit} style={{ color: "red", cursor: "pointer" }} />
                              </>
                            ) : (
                              <>
                                <EditIcon
                                  onClick={() => handleEditItem(item)}
                                  style={{ color: "blue", cursor: "pointer" }}
                                />
                                <DeleteIcon
                                  onClick={() => removeItem(item.id)}
                                  style={{ color: "red", cursor: "pointer" }}
                                />
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="form-control" placeholder="Category" required />
                <input type="file" multiple="multiple" placeholder="Photos" onChange={(e) => setSelectedFile(e.target.files[0])} />
                <button style={{ margin: "15px" }}>Submit Request</button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AddItems;

///////////////////////////////////////////////////Convert ImageBase64String to Image (its original format) ////////////////////////////////////////////

// import React, { useEffect, useState } from 'react';

// function TableList() {
//   const [imageData, setImageData] = useState(null);

//   useEffect(() => {
//     // Fetch the JSON object from the server
//     fetch('http://localhost:8000/addItems/1')
//       .then(response => response.json())
//       .then(data => setImageData(data.imageBase64String));
//   }, []);

//   if (!imageData) {
//     return <div>Loading image...</div>;
//   }

//   // Convert Base64 to Blob
//   const byteCharacters = atob(imageData);  
//   const byteArrays = [];
//   for (let i = 0; i < byteCharacters.length; i++) {
//     byteArrays.push(byteCharacters.charCodeAt(i));
//   }
//   const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' });

//   // Create object URL from Blob
//   const imageUrl = URL.createObjectURL(blob);

//   // eslint-disable-next-line jsx-a11y/img-redundant-alt
//   return <img src={imageUrl} alt="Image" />;
// }

// export default TableList;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////