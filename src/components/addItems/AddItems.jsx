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
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import './Additem.css'

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
  const [model, setModel] = useState("")
  const [specifications, setSpecification] = useState("")
  const [connectivity, setConnectivity] = useState("")
  const [displaySize, setDisplaySize] = useState("")
  const [resolution, setResolution] = useState("")
  const [processor, setProcessor] = useState("")
  const [ram, setRam] = useState("")
  const [storage, setStorage] = useState("")
  const [operatingSystem, setOperatingSystem] = useState("")
  const [batteryLife, setBatteryLife] = useState("")
  const [weight, setWeight] = useState("")
  const [color, setColor] = useState("")
  const [warranty, setWarranty] = useState("")
  const [review, setReview] = useState("")
  const [type, setType] = useState("")
  const [material, setMaterial] = useState("")
  const [dimension, setDimension] = useState("")
  const [style, setStyle] = useState("")
  const [assemblyRequired, setAssemblyRequired] = useState("")
  const [weightCapacity, setWeightCapacity] = useState("")
  const [piece, setPiece] = useState("")
  const [instruction, setInstruction] = useState("")
  const [voltageRating, setVoltageRating] = useState("")
  const [powerRating, setPowerRating] = useState("")
  const [mountingType, setMountingType] = useState("")
  const [installation, setInstallation] = useState("")
  const [capacity, setCapacity] = useState("")
  const [wattage, setWattage] = useState("")
  const [speed, setSpeed] = useState("")
  const [cookingMode, setCookingMode] = useState("")
  const [safetyFeature, setSafetyFeature] = useState("")
  const [accessories, setAccessories] = useState("")
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
    fetch("http://localhost:7000/addItems")
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
      fetch(`http://localhost:7000/addItems/${id}`, {
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
    fetch(`http://localhost:7000/addItems/${editItemId}`, {
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
      let imageData = {
        productName,
        productPrice,
        productDescription,
        productBrand,
        category,
        discount,
      };

      if (category === "Electronics") {
        imageData = {
          ...imageData,
          model,
          specifications,
          connectivity,
          displaySize,
          resolution,
          processor,
          ram,
          storage,
          operatingSystem,
          batteryLife,
          weight,
          color,
          warranty,
          review,
          imageBase64String,
        };
      } else if (category === "Furniture") {
        imageData = {
          ...imageData,
          type,
          material,
          dimension,
          style,
          assemblyRequired,
          weightCapacity,
          piece,
          instruction,
          review,
          imageBase64String,
        };
      } else if (category === "Kitchen") {
        imageData = {
          ...imageData,
          type,
          capacity,
          safetyFeature,
          specifications,
          wattage,
          speed,
          cookingMode,
          accessories,
          review,
          imageBase64String,
        };
      } else if (category === "Electricals") {
        imageData = {
          ...imageData,
          type,
          voltageRating,
          powerRating,
          mountingType,
          installation,
          review,
          imageBase64String,
        };
      }

      fetch("http://localhost:7000/addItems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(imageData),
      })
        .then((res) => {
          if (res.ok) {
            toast.success("Data uploaded successfully.");
            handleClose();
            fetchData();
          } else {
            throw new Error("Error uploading data.");
          }
        })
        .catch((err) => {
          toast.error("Error uploading data: " + err.message);
        })
        .finally(() => {
          setProductName("");
          setProductPrice("");
          setProductDescription("");
          setProductBrand("");
          setCategory("");
          setSelectedFile(null);
          setDiscount("");
          setModel("");
          setSpecification("");
          setConnectivity("");
          setDisplaySize("");
          setResolution("");
          setProcessor("");
          setRam("");
          setStorage("");
          setOperatingSystem("");
          setBatteryLife("");
          setWeight("");
          setColor("");
          setWarranty("");
          setReview("");
          setType("");
          setMaterial("");
          setDimension("");
          setStyle("");
          setAssemblyRequired("");
          setWeightCapacity("");
          setPiece("");
          setInstruction("");
          setVoltageRating("");
          setPowerRating("");
          setMountingType("");
          setInstallation("");
          setCapacity("");
          setWattage("");
          setSpeed("");
          setCookingMode("");
          setSafetyFeature("");
          setAccessories("");
        });
    };
  };

  const createInvoice = () => {
    usenavigate("/createInvoice");
  };

  const studentPage =() =>{
    usenavigate("/studentlist")
  }

  const renderFormInputs = () => {
    if (category === "Electronics") {
      return (
        <>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="form-control" placeholder="Product Name" required />
          <input type="text" value={productBrand} onChange={(e) => setProductBrand(e.target.value)} className="form-control" placeholder="Brand" required />
          <input type="text" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className="form-control" placeholder="Description" />
          <input type="text" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className="form-control" placeholder="Price" />
          <input type="text" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Discount" />
          <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model Number" />
          <input type="text" value={specifications} onChange={(e) => setSpecification(e.target.value)} placeholder="Specifications" />
          <input type="text" value={connectivity} onChange={(e) => setConnectivity(e.target.value)} placeholder="Connectivity" />
          <input type="text" value={displaySize} onChange={(e) => setDisplaySize(e.target.value)} placeholder="Display Size" />
          <input type="text" value={resolution} onChange={(e) => setResolution(e.target.value)} placeholder="Resolution" />
          <input type="text" value={processor} onChange={(e) => setProcessor(e.target.value)} placeholder="Processor Type" />
          <input type="text" value={ram} onChange={(e) => setRam(e.target.value)} placeholder="RAM" />
          <input type="text" value={storage} onChange={(e) => setStorage(e.target.value)} placeholder="Storage Capacity" />
          <input type="text" value={operatingSystem} onChange={(e) => setOperatingSystem(e.target.value)} placeholder="Operating System" />
          <input type="text" value={batteryLife} onChange={(e) => setBatteryLife(e.target.value)} placeholder="Battery Life" />
          <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight" />
          <input type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Color" />
          <input type="text" value={warranty} onChange={(e) => setWarranty(e.target.value)} placeholder="Warranty" />
          <input type="text" value={review} onChange={(e) => setReview(e.target.value)} placeholder="Reviews" />
          <input type="file" multiple="multiple" onChange={(e) => setSelectedFile(e.target.files[0])} placeholder="Photos" />
        </>
      );
    } else if (category === "Furniture") {
      return (
        <>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="form-control" placeholder="Product Name" required />
          <input type="text" value={productBrand} onChange={(e) => setProductBrand(e.target.value)} className="form-control" placeholder="Brand" required />
          <input type="text" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className="form-control" placeholder="Description" />
          <input type="text" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className="form-control" placeholder="Price" />
          <input type="text" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Discount" />
          <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Type" />
          <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Material" />
          <input type="text" value={dimension} onChange={(e) => setDimension(e.target.value)} placeholder="Dimensions" />
          <input type="text" value={style} onChange={(e) => setStyle(e.target.value)} placeholder="Style" />
          <input type="text" value={assemblyRequired} onChange={(e) => setAssemblyRequired(e.target.value)} placeholder="Assembly Required" />
          <input type="text" value={weightCapacity} onChange={(e) => setWeightCapacity(e.target.value)} placeholder="Weight Capacity" />
          <input type="text" value={piece} onChange={(e) => setPiece(e.target.value)} placeholder="Number of Pieces" />
          <input type="text" value={instruction} onChange={(e) => setInstruction(e.target.value)} placeholder="Care Instructions" />
          <input type="text" value={review} onChange={(e) => setReview(e.target.value)} placeholder="Reviews" />
          <input type="file" multiple="multiple" onChange={(e) => setSelectedFile(e.target.files[0])} placeholder="Photos" />
        </>
      );
    } else if (category === "Kitchen") {
      return (
        <>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="form-control" placeholder="Product Name" required />
          <input type="text" value={productBrand} onChange={(e) => setProductBrand(e.target.value)} className="form-control" placeholder="Brand" required />
          <input type="text" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className="form-control" placeholder="Description" />
          <input type="text" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className="form-control" placeholder="Price" />
          <input type="text" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Discount" />
          <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Type" />
          <input type="text" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Capacity" />
          <input type="text" value={safetyFeature} onChange={(e) => setSafetyFeature(e.target.value)} placeholder="Safety Feature" />
          <input type="text" value={specifications} onChange={(e) => setSpecification(e.target.value)} placeholder="Specification" />
          <input type="text" value={wattage} onChange={(e) => setWattage(e.target.value)} placeholder="Power/Wattage" />
          <input type="text" value={speed} onChange={(e) => setSpeed(e.target.value)} placeholder="Speed Setting" />
          <input type="text" value={cookingMode} onChange={(e) => setCookingMode(e.target.value)} placeholder="Cooking Mode/Program" />
          <input type="text" value={accessories} onChange={(e) => setAccessories(e.target.value)} placeholder="Included Accessories" />
          <input type="text" value={review} onChange={(e) => setReview(e.target.value)} placeholder="Reviews" />
          <input type="file" multiple="multiple" onChange={(e) => setSelectedFile(e.target.files[0])} placeholder="Photos" />
        </>
      );
    } else if (category === "Electricals") {
      return (
        <>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="form-control" placeholder="Product Name" required />
          <input type="text" value={productBrand} onChange={(e) => setProductBrand(e.target.value)} className="form-control" placeholder="Brand" required />
          <input type="text" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className="form-control" placeholder="Description" />
          <input type="text" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className="form-control" placeholder="Price" />
          <input type="text" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Discount" />
          <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Type" />
          <input type="text" value={voltageRating} onChange={(e) => setVoltageRating(e.target.value)} placeholder="Voltage Rating" />
          <input type="text" value={powerRating} onChange={(e) => setPowerRating(e.target.value)} placeholder="Power Rating" />
          <input type="text" value={mountingType} onChange={(e) => setMountingType(e.target.value)} placeholder="Mounting Type" />
          <input type="text" value={installation} onChange={(e) => setInstallation(e.target.value)} placeholder="Installation Requirement" />
          <input type="text" value={review} onChange={(e) => setReview(e.target.value)} placeholder="Reviews" />
          <input type="file" multiple="multiple" onChange={(e) => setSelectedFile(e.target.files[0])} placeholder="Photos" />
        </>
      );
    }
  };

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
          <button style={{ marginTop: "1rem", marginRight: "1rem" }} onClick={generatePDF}>Download PDF<DownloadIcon /></button>
          <button style={{ marginTop: "1rem" }} onClick={studentPage}>Student List<FormatListBulletedIcon style={{marginLeft:"10px"}}/></button>
        </div>
      </section>
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <CircularProgress />
          {/* <div class="wrapper">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="shadow"></div>
            <div class="shadow"></div>
            <div class="shadow"></div>
          </div> */}
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
                  <MenuItem value="" disabled>Select Category</MenuItem>
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Furniture">Furniture</MenuItem>
                  <MenuItem value="Kitchen">Kitchen</MenuItem>
                  <MenuItem value="Electricals">Electricals</MenuItem>
                </Select>
                {renderFormInputs()}
                {/* <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="form-control" placeholder="Product Name" required />
                <input type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className="form-control" placeholder="Price" required />
                <input type="text" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className="form-control" placeholder="Description" required />
                <input type="text" value={productBrand} onChange={(e) => setProductBrand(e.target.value)} className="form-control" placeholder="Brand" required />
                <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="form-control" placeholder="Discount" required />
                <input type="file" multiple="multiple" placeholder="Photos" onChange={(e) => setSelectedFile(e.target.files[0])} /> */}
                <button type="submit" style={{ margin: "15px" }}>Submit Request</button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AddItems;
