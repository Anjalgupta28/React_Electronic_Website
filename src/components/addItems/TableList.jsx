import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

const TableList = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/addItems")
            .then((res) => {
                return res.json();
            }).then((resp) => {
                setData(resp);
            }).catch((err) => {
                console.log(err.message);
            })
    }, [])

    const Removefunction = (id) => {
        if (window.confirm('Do you want to remove?')) {
            fetch(`http://localhost:8000/addItems/${id}`, {
                method: "DELETE"
            }).then((res) => {
                alert('Removed successfully.')
                window.location.reload();
            }).catch((err) => {
                console.log(err.message)
            })
        }
    }

    return (
        <div className="container">
            <div className="card">
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <h2>Product Listing</h2>
                </div>
                <div className="card-body">
                    <table className="table table-bordered">
                        <thead className="bg-dark text-white">
                            <tr>
                                <td>ID</td>
                                <td>Name</td>
                                <td>Price</td>
                                <td>Description</td>
                                <td>Brand</td>
                                <td>Action</td>
                            </tr>
                        </thead>
                        <tbody>

                            {data &&
                                data.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.productName}</td>
                                        <td>{item.prdouctPrice}</td>
                                        <td>{item.productDescription}</td>
                                        <td>{item.productBrand}</td>
                                        <td>
                                            <DeleteIcon onClick={() => { Removefunction(item.id) }} style={{ color: "red", cursor:"pointer"}}/>
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}

export default TableList;

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

// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import Dialog from '@mui/material/Dialog';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { useNavigate } from "react-router-dom";

// const Appliances = () => {
//   const [data, setData] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const usenavigate = useNavigate();

//   useEffect(() => {
//     fetch("http://localhost:8000/addItems")
//       .then((res) => res.json())
//       .then((resp) => {
//         setData(resp);
//       })
//       .catch((err) => {
//         console.log(err.message);
//       });
//   }, []);

//   const handleOpenEditDialog = (item) => {
//     setSelectedItem(item);
//     setOpen(true);
//   };

//   const handleCloseEditDialog = () => {
//     setOpen(false);
//     setSelectedItem(null);
//   };

//   const handleDeleteItem = (id) => {
//     if (window.confirm("Do you want to remove?")) {
//       fetch(`http://localhost:8000/addItems/${id}`, {
//         method: "DELETE",
//       })
//         .then((res) => {
//           alert("Removed successfully.");
//           window.location.reload();
//         })
//         .catch((err) => {
//           console.log(err.message);
//         });
//     }
//   };

//   const handleEditSubmit = (e) => {
//     e.preventDefault();
//     // Update the item using the selectedItem state
//     if (selectedItem) {
//       fetch(`http://localhost:8000/addItems/${selectedItem.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(selectedItem),
//       })
//         .then((res) => {
//           toast.success("Data updated successfully");
//           handleCloseEditDialog();
//           window.location.reload(); // Reload the table after successful update
//         })
//         .catch((err) => {
//           toast.error("Error updating data: " + err.message);
//         });
//     }
//   };

//   return (
//     <div style={{ backgroundColor: "#191919" }}>
//       <div style={{ color: "white", minHeight: "1000px", padding: "2rem" }}>
//         <div className="container" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
//           <h3>Home Appliances</h3>
//           <h6 style={{ marginTop: "5px" }}>25 product found</h6>
//         </div>
//         {data &&
//           data.map((val, index) => {
//             const { cover, category, location, name, price, type } = val;
//             return (
//               <div className="container" style={{ color: "white", padding: "2rem" }}>
//                 <li style={{ borderBottom: "1px solid #f6f6f6", listStyle: "none" }}>
//                   <div style={{ paddingBottom: "1rem", display: "flex", flexDirection: "row" }}>
//                     <div className="product-img" style={{ display: "flex", alignItems: "center" }}>
//                       <div style={{ width: "auto", margin: "0 auto" }}>
//                         <img src={cover} alt="" style={{ height: "300px", width: "300px" }} />
//                       </div>
//                     </div>

//                     <div className="product-info" style={{ marginLeft: "50px", marginBottom: "20px" }}>
//                       <div>
//                         <div style={{ display: "flex", flexDirection: "row" }}>
//                           <h3 style={{ fontSize: "2rem", lineHeight: "1.3", height: "auto", paddingRight: "3.5rem" }}>{name}</h3>
//                           <i className="fa fa-heart"></i>
//                         </div>
//                         <div style={{ margin: "0.7rem 0", display: "flex", justifyContent: "flex-start" }}>
//                           <span style={{ fontSize: "1rem", borderRadius: "0.4rem", border: "1px solid #ff02b9", padding: "0.8rem 1rem", marginRight: "0.8rem", fontWeight: "700", color: "#ff02b9" }}>4-in-1 Convertible</span>
//                           <span style={{ fontSize: "1rem", borderRadius: "0.4rem", border: "1px solid #ff02b9", padding: "0.8rem 1rem", marginRight: "0.8rem", fontWeight: "700", color: "#ff02b9" }}>No-Cost EMI upto 12 months</span>
//                         </div>
//                       </div>
//                       <div style={{ display: "block" }}>
//                         <div style={{ paddingBottom: "10px" }}>
//                           <div style={{ fontSize: "2.6rem" }}>
//                             <span>{price}</span>
//                           </div>
//                           <div style={{ marginLeft: 0, fontSize: "1.2rem", fontWeight: "400" }}>(Incl. all Taxes)</div>
//                         </div>
//                         <div className="discount">
//                           <span className="oldPrice" style={{ fontSize: "1.4rem" }}>
//                             <span style={{ textDecoration: "line-through", color: "#9a9a9a" }}>
//                               <span>MRP :  </span>
//                               ₹60,636
//                             </span>
//                           </span>
//                           <span className="dicount-value" style={{ fontSize: "1.2rem", letterSpacing: "0.33px", marginLeft: "2%", color: "#9a9a9a" }}>(Save ₹29,646)</span>
//                           <span className="discount-percentage" style={{ border: "1px solid #9a9a9a", fontSize: "1.4rem", borderRadius: "0.4rem", lineHeight: 1, marginLeft: "2rem", fontWeight: "700", padding: "1rem 1rem 1rem 1rem", }}>49% Off</span>
//                         </div>
//                         <div className="location" style={{ fontSize: "1.2rem", fontWeight: "400", marginTop: "10px" }}>Location : {location}</div>
//                       </div>
//                       <div className="actions">
//                         <button onClick={() => handleOpenEditDialog(val)}>Edit</button>
//                         <DeleteIcon onClick={() => handleDeleteItem(val.id)} style={{ color: "red", cursor: "pointer" }} />
//                       </div>
//                     </div>
//                   </div>
//                 </li>
//               </div>
//             );
//           })}
//       </div>

//       <Dialog open={open} onClose={handleCloseEditDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
//         <DialogTitle id="alert-dialog-title">Edit Product</DialogTitle>
//         <DialogContent>
//           <form onSubmit={handleEditSubmit} id="myForm" className="shadow" style={{ marginTop: "0px" }}>
//             <div>
//               <input type="text" className="form-control" defaultValue={selectedItem && selectedItem.productName} placeholder="Product Name" onChange={(e) => setSelectedItem({ ...selectedItem, productName: e.target.value })} required />
//             </div>
//             <div>
//               <input type="text" className="form-control" defaultValue={selectedItem && selectedItem.prdouctPrice} placeholder="Product Price" onChange={(e) => setSelectedItem({ ...selectedItem, prdouctPrice: e.target.value })} required />
//             </div>
//             <div>
//               <input type="text" className="form-control" defaultValue={selectedItem && selectedItem.productDescription} placeholder="Product Description" onChange={(e) => setSelectedItem({ ...selectedItem, productDescription: e.target.value })} required />
//             </div>
//             <div>
//               <input type="text" className="form-control" defaultValue={selectedItem && selectedItem.productBrand} placeholder="Product Brand" onChange={(e) => setSelectedItem({ ...selectedItem, productBrand: e.target.value })} required />
//             </div>
//             <div className="button-group">
//               <button type="submit" className="btn btn-primary">
//                 Update
//               </button>
//               <button type="button" className="btn btn-danger" onClick={handleCloseEditDialog}>
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Appliances;
