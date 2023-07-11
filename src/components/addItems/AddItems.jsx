import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Breadcrumbs, Dialog, DialogContent, DialogTitle, Link, MenuItem, Select, Typography } from "@mui/material";
import Back from "../common/Back";
import img from "../images/services.jpg";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import { CircularProgress } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const AddItems = () => {
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [category, setCategory] = useState("");
  const [discount, setDiscount] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState(null);
  const [editItemId, setEditItemId] = useState(null);
  const [editItemData, setEditItemData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);
  const componentPDF = useRef();
  const usenavigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userId");
    if (!isLoggedIn) {
      usenavigate("/");
    }
    fetchData();
  }, [usenavigate]);

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
    onAfterPrint: () => alert("Data Saved Successfully"),
  });

  const removeItem = (id) => {
    if (window.confirm("Do you want to remove?")) {
      fetch(`http://localhost:8000/addItems/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          fetchData();
          toast.success("Product removed successfully.");
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
        fetchData();
        setEditItemId(null);
        setEditItemData({});
        toast.success("Product updated successfully.");
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
      console.error("No file selected");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageBase64String = reader.result.split(",")[1];
      postImage(imageBase64String);
    };
    reader.readAsDataURL(selectedFile);

    const postImage = (imageBase64String) => {
      const imageData = {
        productName,
        productPrice,
        productDescription,
        productBrand,
        category,
        discount,
        imageBase64String,
      };

      fetch("http://localhost:8000/addItems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(imageData),
      })
        .then((res) => {
          toast.success("Data uploaded successfully:");
          handleClose();
          fetchData();
        })
        .then(() => {
          setProductName("");
          setProductPrice("");
          setProductDescription("");
          setProductBrand("");
          setCategory("");
          setSelectedFile(null);
          setDiscount("");
        })
        .catch((err) => {
          toast.error("Error uploading data:" + err.message);
        });
    };
  };

  const createInvoice = () => {
    usenavigate("/createInvoice");
  };

  // const updateIDs = () => {
  //   const updatedData = data.map((item, index) => ({
  //     ...item,
  //     id: index + 1,
  //   }));
  //   setData(updatedData);
  // };

  return (
    <>
      <section className='blog-out mb'>
        <Back name='Add Product' title='Add-Product - To add new product in our list ' cover={img} />
        <div className="container">
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Link color="inherit" href="/home">
              Home
            </Link>
            <Typography color="textPrimary">
              Add Product
            </Typography>
          </Breadcrumbs>
        </div>
        <div className='container recent' style={{ display: "flex", justifyContent: "flex-end" }}>
          <button style={{ marginTop: "1rem", marginRight: "1rem" }} onClick={createInvoice}>Create Invoice</button>
          <button style={{ marginTop: "1rem", marginRight: "1rem" }} onClick={handleClickOpen}>Add Product</button>
          <button style={{ marginTop: "1rem" }} onClick={generatePDF}>Download PDF<DownloadIcon /></button>
        </div>
      </section>
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <CircularProgress />
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
                      <td>Discount</td>
                      <td>Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
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
                                name="productPrice"
                                value={editItemData.productPrice || ""}
                                onChange={handleChange}
                                required
                              />
                            ) : (
                              item.productPrice
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
                              <input
                                type="text"
                                name="Discount"
                                value={editItemData.discount || ""}
                                onChange={handleChange}
                                required
                              />
                            ) : (
                              item.discount
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
                <Select value={category} onChange={(e) => setCategory(e.target.value)} className="form-control" required>
                  <MenuItem value="">Select Category</MenuItem>
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Furniture">Furniture</MenuItem>
                  <MenuItem value="Kitchen">Kitchen</MenuItem>
                  <MenuItem value="Electricals">Electricals</MenuItem>
                </Select>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="form-control" placeholder="Product Name" required />
                <input type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className="form-control" placeholder="Price" required />
                <input type="text" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className="form-control" placeholder="Description" required />
                <input type="text" value={productBrand} onChange={(e) => setProductBrand(e.target.value)} className="form-control" placeholder="Brand" required />
                <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="form-control" placeholder="Discount" required />
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState } from "react";
// import { DialogContent, InputLabel, MenuItem, Select } from "@mui/material";

// const ElectronicsForm = ({
//   productName,
//   setProductName,
//   productPrice,
//   setProductPrice,
//   productDescription,
//   setProductDescription,
//   productBrand,
//   setProductBrand,
//   discount,
//   setDiscount,
//   selectedFile,
//   setSelectedFile,
// }) => {
//   return (
//     <>
//       <input
//         type="text"
//         value={productName}
//         onChange={(e) => setProductName(e.target.value)}
//         className="form-control"
//         placeholder="Product Name"
//         required
//       />
//       <input
//         type="text"
//         value={productBrand}
//         onChange={(e) => setProductBrand(e.target.value)}
//         className="form-control"
//         placeholder="Brand"
//         required
//       />
//       <input
//         type="text"
//         value={productDescription}
//         onChange={(e) => setProductDescription(e.target.value)}
//         className="form-control"
//         placeholder="Description"
//         required
//       />
//       <input
//         type="number"
//         value={productPrice}
//         onChange={(e) => setProductPrice(e.target.value)}
//         className="form-control"
//         placeholder="Price"
//         required
//       />
//       <input
//         type="number"
//         value={discount}
//         onChange={(e) => setDiscount(e.target.value)}
//         className="form-control"
//         placeholder="Discount"
//         required
//       />
//       <input
//         type="file"
//         multiple="multiple"
//         placeholder="Photos"
//         onChange={(e) => setSelectedFile(e.target.files[0])}
//       />
//       {/* Add additional input fields for Electronics category */}
//       <input type="text" placeholder="Product ID" />
//       <input type="text" placeholder="Features" />
//       <input type="text" placeholder="Specifications" />
//       <input type="text" placeholder="Connectivity" />
//       <input type="text" placeholder="Display Size" />
//       <input type="text" placeholder="Resolution" />
//       <input type="text" placeholder="Processor Type" />
//       <input type="text" placeholder="RAM" />
//       <input type="text" placeholder="Storage Capacity" />
//       <input type="text" placeholder="Operating System" />
//       <input type="text" placeholder="Battery Life" />
//       <input type="text" placeholder="Weight" />
//       <input type="text" placeholder="Color" />
//       <input type="text" placeholder="Warranty" />
//       <input type="text" placeholder="Reviews" />
//     </>
//   );
// };

// const FurnitureForm = ({
//   productName,
//   setProductName,
//   productPrice,
//   setProductPrice,
//   productDescription,
//   setProductDescription,
//   productBrand,
//   setProductBrand,
//   discount,
//   setDiscount,
//   selectedFile,
//   setSelectedFile,
// }) => {
//   return (
//     <>
//       <input
//         type="text"
//         value={productName}
//         onChange={(e) => setProductName(e.target.value)}
//         className="form-control"
//         placeholder="Product Name"
//         required
//       />
//       <input
//         type="text"
//         value={productBrand}
//         onChange={(e) => setProductBrand(e.target.value)}
//         className="form-control"
//         placeholder="Brand"
//         required
//       />
//       <input
//         type="text"
//         value={productDescription}
//         onChange={(e) => setProductDescription(e.target.value)}
//         className="form-control"
//         placeholder="Description"
//         required
//       />
//       <input
//         type="number"
//         value={productPrice}
//         onChange={(e) => setProductPrice(e.target.value)}
//         className="form-control"
//         placeholder="Price"
//         required
//       />
//       <input
//         type="number"
//         value={discount}
//         onChange={(e) => setDiscount(e.target.value)}
//         className="form-control"
//         placeholder="Discount"
//         required
//       />
//       <input
//         type="file"
//         multiple="multiple"
//         placeholder="Photos"
//         onChange={(e) => setSelectedFile(e.target.files[0])}
//       />
//       {/* Add additional input fields for Furniture category */}
//       <input type="text" placeholder="Product ID" />
//       <input type="text" placeholder="Type" />
//       <input type="text" placeholder="Material" />
//       <input type="text" placeholder="Dimensions" />
//       <input type="text" placeholder="Style" />
//       <input type="text" placeholder="Upholstery Material" />
//       <input type="text" placeholder="Assembly Required" />
//       <input type="text" placeholder="Weight Capacity" />
//       <input type="text" placeholder="Number of Pieces" />
//       <input type="text" placeholder="Care Instructions" />
//       <input type="text" placeholder="Shipping Dimensions" />
//       <input type="text" placeholder="Assembly Dimensions" />
//       <input type="text" placeholder="Reviews" />
//     </>
//   );
// };

// const KitchenForm = ({
//   productName,
//   setProductName,
//   productPrice,
//   setProductPrice,
//   productDescription,
//   setProductDescription,
//   productBrand,
//   setProductBrand,
//   discount,
//   setDiscount,
//   selectedFile,
//   setSelectedFile,
// }) => {
//   return (
//     <>
//       <input
//         type="text"
//         value={productName}
//         onChange={(e) => setProductName(e.target.value)}
//         className="form-control"
//         placeholder="Product Name"
//         required
//       />
//       <input
//         type="text"
//         value={productBrand}
//         onChange={(e) => setProductBrand(e.target.value)}
//         className="form-control"
//         placeholder="Brand"
//         required
//       />
//       <input
//         type="text"
//         value={productDescription}
//         onChange={(e) => setProductDescription(e.target.value)}
//         className="form-control"
//         placeholder="Description"
//         required
//       />
//       <input
//         type="number"
//         value={productPrice}
//         onChange={(e) => setProductPrice(e.target.value)}
//         className="form-control"
//         placeholder="Price"
//         required
//       />
//       <input
//         type="number"
//         value={discount}
//         onChange={(e) => setDiscount(e.target.value)}
//         className="form-control"
//         placeholder="Discount"
//         required
//       />
//       <input
//         type="file"
//         multiple="multiple"
//         placeholder="Photos"
//         onChange={(e) => setSelectedFile(e.target.files[0])}
//       />
//       {/* Add additional input fields for Kitchen category */}
//       <input type="text" placeholder="Product ID" />
//       <input type="text" placeholder="Capacity" />
//       <input type="text" placeholder="Feature" />
//       <input type="text" placeholder="Specification" />
//       <input type="text" placeholder="Power/Wattage" />
//       <input type="text" placeholder="Speed Setting" />
//       <input type="text" placeholder="Cooking Mode/Program" />
//       <input type="text" placeholder="Safety Feature" />
//       <input type="text" placeholder="Included Accessories" />
//       <input type="text" placeholder="Dimensions" />
//       <input type="text" placeholder="Reviews" />
//     </>
//   );
// };

// const ElectricalsForm = ({
//   productName,
//   setProductName,
//   productPrice,
//   setProductPrice,
//   productDescription,
//   setProductDescription,
//   productBrand,
//   setProductBrand,
//   discount,
//   setDiscount,
//   selectedFile,
//   setSelectedFile,
// }) => {
//   return (
//     <>
//       <input
//         type="text"
//         value={productName}
//         onChange={(e) => setProductName(e.target.value)}
//         className="form-control"
//         placeholder="Product Name"
//         required
//       />
//       <input
//         type="text"
//         value={productBrand}
//         onChange={(e) => setProductBrand(e.target.value)}
//         className="form-control"
//         placeholder="Brand"
//         required
//       />
//       <input
//         type="text"
//         value={productDescription}
//         onChange={(e) => setProductDescription(e.target.value)}
//         className="form-control"
//         placeholder="Description"
//         required
//       />
//       <input
//         type="number"
//         value={productPrice}
//         onChange={(e) => setProductPrice(e.target.value)}
//         className="form-control"
//         placeholder="Price"
//         required
//       />
//       <input
//         type="number"
//         value={discount}
//         onChange={(e) => setDiscount(e.target.value)}
//         className="form-control"
//         placeholder="Discount"
//         required
//       />
//       <input
//         type="file"
//         multiple="multiple"
//         placeholder="Photos"
//         onChange={(e) => setSelectedFile(e.target.files[0])}
//       />
//       {/* Add additional input fields for Electricals category */}
//       <input type="text" placeholder="Product ID" />
//       <input type="text" placeholder="Type" />
//       <input type="text" placeholder="Voltage Rating" />
//       <input type="text" placeholder="Current Rating" />
//       <input type="text" placeholder="Power Rating" />
//       <input type="text" placeholder="Number of Poles" />
//       <input type="text" placeholder="Rated Current" />
//       <input type="text" placeholder="Mounting Type" />
//       <input type="text" placeholder="Certification" />
//       <input type="text" placeholder="Installation Requirement" />
//       <input type="text" placeholder="Dimensions" />
//       <input type="text" placeholder="Reviews" />
//     </>
//   );
// };

// const YourComponent = () => {
//   const [category, setCategory] = useState("");
//   const [productName, setProductName] = useState("");
//   const [productPrice, setProductPrice] = useState("");
//   const [productDescription, setProductDescription] = useState("");
//   const [productBrand, setProductBrand] = useState("");
//   const [discount, setDiscount] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleCategoryChange = (e) => {
//     setCategory(e.target.value);
//     // Reset other form values when category changes
//     setProductName("");
//     setProductPrice("");
//     setProductDescription("");
//     setProductBrand("");
//     setDiscount("");
//     setSelectedFile(null);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Create an object to hold the form data
//     const formData = {
//       productName,
//       productPrice,
//       productDescription,
//       productBrand,
//       discount,
//       selectedFile,
//     };

//     // Make a POST request to JSON Server to store the form data
//     fetch("http://localhost:3001/" + category.toLowerCase() + "s", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Form data stored successfully:", data);
//         // Reset form values
//         setProductName("");
//         setProductPrice("");
//         setProductDescription("");
//         setProductBrand("");
//         setDiscount("");
//         setSelectedFile(null);
//       })
//       .catch((error) => {
//         console.error("Error storing form data:", error);
//       });
//   };

//   return (
//     <div>
//       <InputLabel id="category-label">Category</InputLabel>
//       <Select
//         labelId="category-label"
//         value={category}
//         onChange={handleCategoryChange}
//         className="form-control"
//         required
//       >
//         <MenuItem value="">Select Category</MenuItem>
//         <MenuItem value="Electronics">Electronics</MenuItem>
//         <MenuItem value="Furniture">Furniture</MenuItem>
//         <MenuItem value="Kitchen">Kitchen</MenuItem>
//         <MenuItem value="Electricals">Electricals</MenuItem>
//       </Select>
//       <DialogContent>
//         <form onSubmit={handleSubmit} id="myForm" className="shadow" style={{ marginTop: "0px" }}>
//           <div>
//             {category === "Electronics" && (
//               <ElectronicsForm
//                 productName={productName}
//                 setProductName={setProductName}
//                 productPrice={productPrice}
//                 setProductPrice={setProductPrice}
//                 productDescription={productDescription}
//                 setProductDescription={setProductDescription}
//                 productBrand={productBrand}
//                 setProductBrand={setProductBrand}
//                 discount={discount}
//                 setDiscount={setDiscount}
//                 selectedFile={selectedFile}
//                 setSelectedFile={setSelectedFile}
//               />
//             )}
//             {category === "Furniture" && (
//               <FurnitureForm
//                 productName={productName}
//                 setProductName={setProductName}
//                 productPrice={productPrice}
//                 setProductPrice={setProductPrice}
//                 productDescription={productDescription}
//                 setProductDescription={setProductDescription}
//                 productBrand={productBrand}
//                 setProductBrand={setProductBrand}
//                 discount={discount}
//                 setDiscount={setDiscount}
//                 selectedFile={selectedFile}
//                 setSelectedFile={setSelectedFile}
//               />
//             )}
//             {category === "Kitchen" && (
//               <KitchenForm
//                 productName={productName}
//                 setProductName={setProductName}
//                 productPrice={productPrice}
//                 setProductPrice={setProductPrice}
//                 productDescription={productDescription}
//                 setProductDescription={setProductDescription}
//                 productBrand={productBrand}
//                 setProductBrand={setProductBrand}
//                 discount={discount}
//                 setDiscount={setDiscount}
//                 selectedFile={selectedFile}
//                 setSelectedFile={setSelectedFile}
//               />
//             )}
//             {category === "Electricals" && (
//               <ElectricalsForm
//                 productName={productName}
//                 setProductName={setProductName}
//                 productPrice={productPrice}
//                 setProductPrice={setProductPrice}
//                 productDescription={productDescription}
//                 setProductDescription={setProductDescription}
//                 productBrand={productBrand}
//                 setProductBrand={setProductBrand}
//                 discount={discount}
//                 setDiscount={setDiscount}
//                 selectedFile={selectedFile}
//                 setSelectedFile={setSelectedFile}
//               />
//             )}
//           </div>
//           <button style={{ margin: "15px" }}>Submit Request</button>
//         </form>
//       </DialogContent>
//     </div>
//   );
// };

// export default YourComponent;
