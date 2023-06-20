import React, { useState, useEffect } from 'react';
import "./Featured.css"
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TuneIcon from '@mui/icons-material/Tune';

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
    const [discounts, setDiscounts] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [show, setShow] = useState(null)
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
                // Calculate discounts for each product
                const calculatedDiscounts = data.map(product => product.prdouctPrice * product.discount);
                setDiscounts(calculatedDiscounts);

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
        if (!imageData) return '';

        const byteCharacters = atob(imageData);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i++) {
            byteArrays.push(byteCharacters.charCodeAt(i));
        }
        const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
    };

    // if (!imageData) {
    //     return <div>Loading image...</div>;
    // }

    // const byteCharacters = atob(imageData);
    // const byteArrays = [];
    // for (let i = 0; i < byteCharacters.length; i++) {
    //     byteArrays.push(byteCharacters.charCodeAt(i));
    // }
    // const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' });

    // // Create object URL from Blob
    // const imageUrl = URL.createObjectURL(blob);


    const filterProductsByCategory = (category) => {
        if (category === selectedCategory) {
            // If the same category is clicked again, show all products
            setFilteredProducts(products);
            setSelectedCategory(null);
        } else if (category === 'All Products') {
            // If "All Products" is clicked, show all products
            setFilteredProducts(products);
            setSelectedCategory('All Products');
        } else {
            // Filter products based on the selected category
            const filtered = products.filter((product) => product.category === category);
            setFilteredProducts(filtered);
            setSelectedCategory(category);
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

                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", margin: "2rem" }}>
                        <Button id="basic-button" aria-controls={open ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClick} style={{ border: "1px solid black", color: "black" }}>
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
                    </div>

                    <div style={{ boxShadow: "0 0 20px 0 rgb(112 121 138 / 18%)", backgroundColor: "#ffffff", marginTop: "2rem", borderRadius: "6px" }}>
                        <div style={{ color: "black", padding: "2rem" }}>
                            <div className="container" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <h3>Home Appliances</h3>

                                <h6 style={{ marginTop: "5px" }}>{allProductsCount} Product found</h6>
                            </div>

                            {filteredProducts.map((product, index) => {
                                const { prdouctPrice, productDescription, productBrand, category } = product
                                {/* const imageUrl = convertToImageUrl(imageUrls[index]); */ }
                                const imageUrlsByCategory = getImageUrlByCategory(category);

                                return (
                                    <div key={product.id}>
                                        <div className="container" style={{ color: "black", padding: "2rem" }}>
                                            <li style={{ borderBottom: "1px solid #f6f6f6", listStyle: "none" }}>
                                                <div style={{ paddingBottom: "1rem", display: "flex", flexDirection: "row" }}>
                                                    <div className="product-img" style={{ display: "flex", alignItems: "center" }}>
                                                        <div style={{ width: "auto", margin: "0 auto" }}>
                                                            <img src={convertToImageUrl(imageUrlsByCategory[index])} alt="" style={{ height: "400px", width: "300px" }} />
                                                        </div>
                                                    </div>

                                                    <div className="product-info" style={{ marginLeft: "50px", marginBottom: "20px" }}>
                                                        <div>
                                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                                <h3 style={{ fontSize: "2rem", lineHeight: "1.3", height: "auto", paddingRight: "3.5rem" }}>{productDescription}</h3>
                                                                <i className='fa fa-heart'></i>
                                                            </div>
                                                            <div style={{ margin: "0.7rem 0", display: "flex", justifyContent: "flex-start" }}>
                                                                <span style={{ fontSize: "1rem", borderRadius: "0.4rem", border: "1px solid #ff02b9", padding: "0.8rem 1rem", marginRight: "0.8rem", fontWeight: "700", color: "#ff02b9" }}>4-in-1 Convertible</span>
                                                                <span style={{ fontSize: "1rem", borderRadius: "0.4rem", border: "1px solid #ff02b9", padding: "0.8rem 1rem", marginRight: "0.8rem", fontWeight: "700", color: "#ff02b9" }}>No-Cost EMI upto 12 months</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: "block" }}>
                                                            <div style={{ paddingBottom: "10px" }}>
                                                                <div>
                                                                    <button className='btn2'>{category}</button>
                                                                </div>
                                                                <div style={{ fontSize: "2.6rem" }}>
                                                                    <span>{prdouctPrice}</span>

                                                                </div>
                                                                <div style={{ marginLeft: 0, fontSize: "1.2rem", fontWeight: "400" }}>(Incl. all Taxes)</div>
                                                            </div>
                                                            <div className="discount">
                                                                <span className="oldPrice" style={{ fontSize: "1.4rem" }}>
                                                                    <span style={{ textDecoration: "line-through", color: "#9a9a9a" }}>
                                                                        <span>MRP :  </span>
                                                                        ₹{product.prdouctPrice}
                                                                    </span>
                                                                </span>
                                                                <span className="dicount-value" style={{ fontSize: "1.2rem", letterSpacing: "0.33px", marginLeft: "2%", color: "#9a9a9a" }}>(Save ₹{discounts[index]})</span>
                                                                <span className="discount-percentage" style={{ border: "1px solid #9a9a9a", fontSize: "1.4rem", borderRadius: "0.4rem", lineHeight: 1, marginLeft: "2rem", fontWeight: "700", padding: "1rem 1rem 1rem 1rem", }}>{Math.round(product.discount)}% Off</span>
                                                            </div>
                                                            <div className="location" style={{ fontSize: "1.2rem", fontWeight: "400", marginTop: "10px" }}>Brand : {productBrand}</div>
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