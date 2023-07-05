import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TuneIcon from '@mui/icons-material/Tune';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Badge from '@mui/material/Badge';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Box, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./Product.css"
import "./Featured.css"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    height: 'auto',
    maxHeight: 900,
    overflowY: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Product = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [allProductsCount, setAllProductsCount] = useState(0);
    const [electronicsCount, setElectronicsCount] = useState(0);
    const [furnitureCount, setFurnitureCount] = useState(0);
    const [kitchenCount, setKitchenCount] = useState(0);
    const [electricalsCount, setElectricalsCount] = useState(0);
    const [sortOrder, setSortOrder] = useState('asc');
    const [pricesAfterDiscount, setPricesAfterDiscount] = useState([]);
    const [show, setShow] = useState(null)
    const [cart, setCart] = useState([]); // Array to store the selected products
    const [totalSum, setTotalSum] = useState(0); // Total sum of the selected products
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [quantities, setQuantities] = useState({});
    const [wishlist, setWishlist] = useState([]);
    const [showWishlistModal, setShowWishlistModal] = useState(false);

    const usenavigate = useNavigate();
    const open = Boolean(show);

    const handleClick = (event) => {
        setShow(event.currentTarget);
    };

    const handleClose = () => {
        setShow(null);
    };

    useEffect(() => {
        // Fetch the product data from the JSON server
        fetch('http://localhost:8000/addItems')
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setFilteredProducts(data);

                // Calculate prices after discount for each product
                const calculatedPricesAfterDiscount = calculatePricesAfterDiscount(data);
                setPricesAfterDiscount(calculatedPricesAfterDiscount);

                // Calculate counts for each category
                const electronics = data.filter(product => product.category === 'Electronics');
                setElectronicsCount(electronics.length);

                const furniture = data.filter(product => product.category === 'Furniture');
                setFurnitureCount(furniture.length);

                const kitchen = data.filter(product => product.category === 'Kitchen');
                setKitchenCount(kitchen.length);

                const electricals = data.filter(product => product.category === 'Electricals');
                setElectricalsCount(electricals.length);

                const allProducts = electronics.length + furniture.length + kitchen.length + electricals.length;
                setAllProductsCount(allProducts);

                if (data.length > 0) {
                    const fetchImageUrls = async () => {
                        const urls = [];
                        for (let i = 0; i < data.length; i++) {
                            const product = data[i];
                            const response = await fetch(`http://localhost:8000/addItems/${product.id}`);
                            const imageData = await response.json();
                            urls.push(imageData.imageBase64String);
                        }
                        setImageUrls(urls);
                    };
                    fetchImageUrls();
                }
            })
            .catch(error => {
                console.error('Error fetching product data:', error);
            });
    }, []);

    const convertToImageUrl = (imageData) => {
        if (!imageData) return <div>Loading image...</div>;
        const byteCharacters = atob(imageData);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i++) {
            byteArrays.push(byteCharacters.charCodeAt(i));
        }
        const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
    };

    const filterProductsByCategory = (category) => {
        if (category === selectedCategory) {
            // If the same category is clicked again, show all products
            setFilteredProducts(products);
            setSelectedCategory(null);
            setPricesAfterDiscount(calculatePricesAfterDiscount(products));
            console.log(products)
        } else if (category === 'All Products') {
            // If "All Products" is clicked, show all products
            setFilteredProducts(products);
            setSelectedCategory('All Products');
            setPricesAfterDiscount(calculatePricesAfterDiscount(products));
        } else {
            // Filter products based on the selected category
            const filtered = products.filter((product) => product.category === category);
            setFilteredProducts(filtered);
            setSelectedCategory(category);
            setPricesAfterDiscount(calculatePricesAfterDiscount(filtered));
        }
    };

    const getImageUrlByCategory = (category) => {
        const filteredUrls = imageUrls.filter(
            (_, index) => products[index].category === category
        );
        return filteredUrls;
    };

    const handleSortButtonClick = () => {
        // Toggle the sort order
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        // Sort the products based on price
        const sortedProducts = [...filteredProducts].sort((a, b) => {
            if (newSortOrder === 'asc') {
                return a.prdouctPrice - b.prdouctPrice;
            } else {
                return b.prdouctPrice - a.prdouctPrice;
            }
        });
        // Update the filtered products with the sorted list
        setFilteredProducts(sortedProducts);
        // Update the prices after discount based on the sorted products
        const sortedPricesAfterDiscount = [...pricesAfterDiscount].sort((a, b) => {
            if (newSortOrder === 'asc') {
                return a - b;
            } else {
                return b - a;
            }
        });
        setPricesAfterDiscount(sortedPricesAfterDiscount);
    };

    const handleProductClick = (data) => {
        // Navigate to the "Buying Product" page with the product data
        usenavigate('/buying-product', { data });
    };

    const calculatePricesAfterDiscount = (products) => {
        return products.map((product) => {
            // return product.prdouctPrice * (1 - product.discount / 100);
            const priceAfterDiscount = product.prdouctPrice * (1 - product.discount / 100);
            return Math.round(priceAfterDiscount); // Round off the calculated price
        });
    };

    const calculateTotalSum = (quantities) => {
        return cart.reduce((sum, product) => {
            const quantity = quantities[product.id] || 0;
            const price = pricesAfterDiscount[cart.indexOf(product)];
            return sum + (price * quantity);
        }, 0);
    };

    const handleAddToCartClick = (event, product, index) => {
        event.stopPropagation();
        const itemIndex = cart.findIndex((item) => item.id === product.id);
        if (itemIndex !== -1) {
            // Product already exists in the cart, increase the quantity
            const updatedCart = [...cart];
            updatedCart[itemIndex].quantity += 1;
            setCart(updatedCart);
        } else {
            // Product is not in the cart, add it as a new item
            const updatedCart = [...cart, { ...product, quantity: 1 }];
            setCart(updatedCart);
        }

        const updatedQuantities = { ...quantities, [product.id]: (quantities[product.id] || 0) + 1 };
        setQuantities(updatedQuantities);

        const updatedTotalSum = calculateTotalSum(updatedQuantities);
        setTotalSum(updatedTotalSum);

        setSelectedProduct(product);
        setShowModal(true);

        const updatedPricesAfterDiscount = [...pricesAfterDiscount]; // Create a new array
        updatedPricesAfterDiscount[index] = calculatePriceAfterDiscount(product);
        setPricesAfterDiscount(updatedPricesAfterDiscount);
    };

    const handleAddToWishlistClick = (event, product) => {
        event.stopPropagation();
        const isProductInWishlist = wishlist.some((item) => item.id === product.id);
        if (isProductInWishlist) {
            // Remove the product from the wishlist
            const updatedWishlist = wishlist.filter((item) => item.id !== product.id);
            setWishlist(updatedWishlist);
        } else {
            // Add the product to the wishlist
            const updatedWishlist = [...wishlist, product];
            setWishlist(updatedWishlist);
        }
    };

    const calculatePriceAfterDiscount = (product) => {
        return Math.round(product.prdouctPrice * (1 - product.discount / 100));
    };

    const handleClearCartClick = () => {
        setCart([]); // Clear the cart by setting it to an empty array
        setTotalSum(0); // Reset the total sum
    };

    return (
        <>
            <section className='featured background'>
                <div className='container'>
                    <div className='content grid5 mtop'>

                        <div className='box' onClick={() => filterProductsByCategory('All Products')}>
                            <img src="../../../images/hero/box.png" alt='' className='featured img' />
                            <h4>All Products</h4>
                            <label>{allProductsCount}</label>
                        </div>

                        <div className='box' onClick={() => filterProductsByCategory('Furniture')}>
                            <img src="../../../images/hero/furniture.png" alt='' className='featured img' />
                            <h4>Furniture</h4>
                            <label>{furnitureCount}</label>
                        </div>

                        <div className='box' onClick={() => filterProductsByCategory('Electronics')}>
                            <img src="../../../images/hero/appliance.png" alt='' className='featured img' />
                            <h4>Electronics</h4>
                            <label>{electronicsCount}</label>
                        </div>

                        <div className='box' onClick={() => filterProductsByCategory('Kitchen')}>
                            <img src="../../../images/hero/toaster.png" alt='' className='featured img' />
                            <h4>Kitchen Appliances</h4>
                            <label>{kitchenCount}</label>
                        </div>

                        <div className='box' onClick={() => filterProductsByCategory('Electricals')}>
                            <img src="../../../images/hero/plug.png" alt='' className='featured img' />
                            <h4>Electricals</h4>
                            <label>{electricalsCount}</label>
                        </div>
                    </div>

                    <div className="sort">
                        <Button id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            style={{ border: "1px solid black", color: "black", marginRight: "5px" }}>
                            Sort<TuneIcon />
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={show}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                            style={{ marginTop: "1rem" }}>
                            <MenuItem onClick={handleSortButtonClick}>Price: {sortOrder === 'asc' ? 'High to Low' : 'Low to High'}</MenuItem>
                        </Menu>

                        <div>
                            <Button
                                style={{ border: "1px solid black", color: "black", marginRight: "5px" }}
                                onClick={() => setShowModal(true)}>
                                Cart
                                <Badge badgeContent={cart.length} color="warning">
                                    <ShoppingCartIcon />
                                </Badge>
                            </Button>
                            <Modal
                                open={showModal}
                                onClose={() => setShowModal(false)}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <div style={{ padding: "15px" }}>
                                        <h3>Products in Cart</h3>
                                        <table className="table table-bordered">
                                            <thead className="bg-white text-black">
                                                <tr>
                                                    <td>Item</td>
                                                    <td>Price</td>
                                                    <td>Quantity</td>
                                                    <td>SubTotal</td>
                                                    <td>Action</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cart.length > 0 ? (
                                                    cart.map((product, index) => (
                                                        <tr key={index}>
                                                            <td>{product.productDescription}</td>
                                                            <td>{pricesAfterDiscount[index]}</td>
                                                            <td> <input
                                                                type="number"
                                                                value={quantities[product.id] || 0}
                                                                min="0"
                                                                onChange={(event) => {
                                                                    const updatedQuantities = {
                                                                        ...quantities,
                                                                        [product.id]: parseInt(event.target.value)
                                                                    };
                                                                    setQuantities(updatedQuantities);

                                                                    const updatedTotalSum = calculateTotalSum(updatedQuantities);
                                                                    setTotalSum(updatedTotalSum);
                                                                }}
                                                            /></td>
                                                            <td>{pricesAfterDiscount[index] * (quantities[product.id] || 0)}</td>
                                                            <td></td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <p>No products in the cart.</p>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "end" }}>
                                        <Button
                                            style={{ border: "1px solid black", color: "black", marginRight: "5px" }}
                                            onClick={handleClearCartClick}>
                                            Clear Cart<RemoveShoppingCartIcon />
                                        </Button>
                                    </div>
                                    <div style={{ backgroundColor: "#d7d9d6", width: "20rem", height: "auto", display: "flex", float: "right", marginTop: "1rem", flexDirection: "column" }}>
                                        <div style={{ padding: "15px" }}>Cart Item : <span style={{ fontWeight: "bold", marginLeft: "9.5rem" }}>{cart.length}</span></div>
                                        <div style={{ padding: "15px" }}>Subtotal : <span style={{ fontWeight: "bold", marginLeft: "9.5rem" }}>{totalSum}</span></div>
                                    </div>
                                    <div>
                                        <h3>Current Selected Product</h3>
                                        {selectedProduct && ( // Check if a product is selected
                                            <>
                                                <p>Product Description: <span style={{ fontWeight: "bold" }}>{selectedProduct.productDescription}</span></p>
                                                <p>Product Price: <span style={{ fontWeight: "bold" }}>{selectedProduct.prdouctPrice}</span></p>
                                                {/* Add other product details as needed */}
                                            </>
                                        )}
                                    </div>
                                </Box>
                            </Modal>
                        </div>

                        <div>
                            <Button
                                style={{ border: "1px solid black", color: "black" }}
                                onClick={() => setShowWishlistModal(true)}>
                                Wishlist
                                <Badge badgeContent={wishlist.length} color="error">
                                    <FavoriteBorderIcon />
                                </Badge>
                            </Button>
                            <Modal
                                open={showWishlistModal}
                                onClose={() => setShowWishlistModal(false)}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <div style={{ padding: "15px" }}>
                                        <h3>Products in Wishlist</h3>
                                        {wishlist.length > 0 ? (
                                            wishlist.map((product, index) => (
                                                <div key={index}>
                                                    <h4>{product.productDescription}</h4>
                                                    {/* Render other details of the product */}
                                                </div>
                                            ))
                                        ) : (
                                            <p>No products in the wishlist.</p>
                                        )}
                                    </div>
                                    {/* Add any additional content or styling for the wishlist modal */}
                                </Box>
                            </Modal>
                        </div>
                    </div>

                    <div className="content-bottom">
                        <div className="bottom">
                            <div className="container ha-pf" >
                                <h3>Home Appliances</h3>

                                <h6 className="product-found">{allProductsCount} Product found</h6>
                            </div>

                            {filteredProducts.map((product, index) => {
                                const { prdouctPrice, productDescription, productBrand, category } = product
                                const imageUrlsByCategory = getImageUrlByCategory(category);
                                // Calculate the saved amount
                                const savedAmount = Math.round((prdouctPrice * product.discount) / 100);

                                return (
                                    <div key={product.id}>
                                        <div className="container main">
                                            <li className="list">
                                                <div className="innerBox">
                                                    <div className="imageBox">
                                                        <img src={convertToImageUrl(imageUrlsByCategory[index])} alt="" style={{ height: "400px", width: "300px" }} />
                                                    </div>

                                                    <div className="product-info">
                                                        <div>
                                                            <div className="product-description-box">
                                                                <h3 className="product-description-content" onClick={() => handleProductClick(product)}>{productDescription}</h3>
                                                                <div style={{ display: "flex", float: "right", justifyContent: "flex-end" }} className='favorite-icon'>
                                                                    <FavoriteBorderIcon
                                                                        onClick={(event) => handleAddToWishlistClick(event, product)}
                                                                        className={wishlist.some((item) => item.id === product.id) ? 'wishlist-active' : ''}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="product-offer-box">
                                                                <span className="product-offer-content">4-in-1 Convertible</span>
                                                                <span className="product-offer-content">No-Cost EMI upto 12 months</span>
                                                            </div>
                                                        </div>
                                                        <div className="bottom-content">
                                                            <div className="price-to-addtocart-box">
                                                                <div className="price">
                                                                    <span>{pricesAfterDiscount[index]}</span>
                                                                </div>
                                                                <div className="inc-tax">(Incl. all Taxes)</div>
                                                                <div>
                                                                    <button className="buy-now-button">Buy Now</button>
                                                                    <button className="add-to-cart-button" onClick={(event) => handleAddToCartClick(event, product, index)}>Add to Cart</button>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <span className="oldprice">
                                                                    <span className="mrp">
                                                                        <span>MRP :  </span>
                                                                        ₹{product.prdouctPrice}
                                                                    </span>
                                                                </span>
                                                                <span className="save-value">(Save ₹{savedAmount})</span>
                                                                <span className="off-percentage">{Math.round(product.discount)}% Off</span>
                                                            </div>
                                                            <div className="brand">Brand : {productBrand}</div>
                                                            <div className="brand">Category : {category}</div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Product;