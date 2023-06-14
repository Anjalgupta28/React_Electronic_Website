import React, { useState, useEffect } from 'react';
import "./Featured.css"

const Product = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [allProductsCount, setAllProductsCount] = useState(0);
    const [electronicsCount, setElectronicsCount] = useState(0);
    const [furnitureCount, setFurnitureCount] = useState(0);
    const [kitchenCount, setKitchenCount] = useState(0);
    const [electricalsCount, setElectricalsCount] = useState(0);

    useEffect(() => {
        // Fetch the product data from the JSON server
        fetch('http://localhost:8000/addItems')
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setFilteredProducts(data);
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
            })
            .catch(error => {
                console.error('Error fetching product data:', error);
            });
    }, []);

    const filterProductsByCategory = category => {
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
            const filtered = products.filter(product => product.category === category);
            setFilteredProducts(filtered);
            setSelectedCategory(category);
        }
    };

    return (
        <>
            <section className='featured background'>
                <div className='container'>
                    <div className='content grid5 mtop'>
                        <div className='box' onClick={() => filterProductsByCategory('All Products')}>
                            <img src="../../../images/hero/appliance.png" alt='' className='featured img' />
                            <h4>All Products</h4>
                            <label>{allProductsCount}</label>
                        </div>

                        <div className='box' onClick={() => filterProductsByCategory('Electronics')}>
                            <img src="../../../images/hero/appliance.png" alt='' className='featured img' />
                            <h4>Electronics</h4>
                            <label>{electronicsCount}</label>
                        </div>

                        <div className='box' onClick={() => filterProductsByCategory('Furniture')}>
                            <img src="../../../images/hero/furniture.png" alt='' className='featured img' />
                            <h4>Furniture</h4>
                            <label>{furnitureCount}</label>
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

                    <div style={{ backgroundColor: "#191919", marginTop:"2rem"  }}>
                        <div style={{ color: "white", padding: "2rem" }}>
                            <div className="container" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <h3>Home Appliances</h3>
                                <h6 style={{ marginTop: "5px" }}>25 product found</h6>
                            </div>

                            {filteredProducts.map(product => {
                                const { productName, prdouctPrice, productDescription, productBrand, category, imageBase64String } = product

                                return (
                                    <div key={product.id}>
                                        <div className="container" style={{ color: "white", padding: "2rem" }}>
                                            <li style={{ borderBottom: "1px solid #f6f6f6", listStyle: "none" }}>
                                                <div style={{ paddingBottom: "1rem", display: "flex", flexDirection: "row" }}>
                                                    <div className="product-img" style={{ display: "flex", alignItems: "center" }}>
                                                        <div style={{ width: "auto", margin: "0 auto" }}>
                                                            <img src={imageBase64String} alt="" style={{ height: "300px", width: "300px" }} />
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
                                                                        ₹60,636
                                                                    </span>
                                                                </span>
                                                                <span className="dicount-value" style={{ fontSize: "1.2rem", letterSpacing: "0.33px", marginLeft: "2%", color: "#9a9a9a" }}>(Save ₹29,646)</span>
                                                                <span className="discount-percentage" style={{ border: "1px solid #9a9a9a", fontSize: "1.4rem", borderRadius: "0.4rem", lineHeight: 1, marginLeft: "2rem", fontWeight: "700", padding: "1rem 1rem 1rem 1rem", }}>49% Off</span>
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
//  <div style={{ backgroundColor: "#191919" }}>
//             <div style={{ color: "white", minHeight: "1000px", padding: "2rem" }}>
//               <div className="container" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
//                 <h3>Home Appliances</h3>
//                 <h6 style={{ marginTop: "5px" }}>25 product found</h6>
//               </div>

//               {filteredProducts.map(product => {
//                 const { productName, prdouctPrice, productDescription, productBrand, category, imageBase64String } = product

//                 return (
//                   <div key={product.id}>
//                     <div className="container" style={{ color: "white", padding: "2rem" }}>
//                       <li style={{ borderBottom: "1px solid #f6f6f6", listStyle: "none" }}>
//                         <div style={{ paddingBottom: "1rem", display: "flex", flexDirection: "row" }}>
//                           <div className="product-img" style={{ display: "flex", alignItems: "center" }}>
//                             <div style={{ width: "auto", margin: "0 auto" }}>
//                               <img src={imageBase64String} alt="" style={{ height: "300px", width: "300px" }} />
//                             </div>
//                           </div>

//                           <div className="product-info" style={{ marginLeft: "50px", marginBottom: "20px" }}>
//                             <div>
//                               <div style={{ display: "flex", flexDirection: "row" }}>
//                                 <h3 style={{ fontSize: "2rem", lineHeight: "1.3", height: "auto", paddingRight: "3.5rem" }}>{productDescription}</h3>
//                                 <i className='fa fa-heart'></i>
//                               </div>
//                               <div style={{ margin: "0.7rem 0", display: "flex", justifyContent: "flex-start" }}>
//                                 <span style={{ fontSize: "1rem", borderRadius: "0.4rem", border: "1px solid #ff02b9", padding: "0.8rem 1rem", marginRight: "0.8rem", fontWeight: "700", color: "#ff02b9" }}>4-in-1 Convertible</span>
//                                 <span style={{ fontSize: "1rem", borderRadius: "0.4rem", border: "1px solid #ff02b9", padding: "0.8rem 1rem", marginRight: "0.8rem", fontWeight: "700", color: "#ff02b9" }}>No-Cost EMI upto 12 months</span>
//                               </div>
//                             </div>
//                             <div style={{ display: "block" }}>
//                               <div style={{ paddingBottom: "10px" }}>
//                                 <div>
//                                   <button className='btn2'>{category}</button>
//                                 </div>
//                                 <div style={{ fontSize: "2.6rem" }}>
//                                   <span>{prdouctPrice}</span>
//                                 </div>
//                                 <div style={{ marginLeft: 0, fontSize: "1.2rem", fontWeight: "400" }}>(Incl. all Taxes)</div>
//                               </div>
//                               <div className="discount">
//                                                 <span className="oldPrice" style={{ fontSize: "1.4rem" }}>
//                                                     <span style={{ textDecoration: "line-through", color: "#9a9a9a" }}>
//                                                         <span>MRP :  </span>
//                                                         ₹60,636
//                                                     </span>
//                                                 </span>
//                                                 <span className="dicount-value" style={{ fontSize: "1.2rem", letterSpacing: "0.33px", marginLeft: "2%", color: "#9a9a9a" }}>(Save ₹29,646)</span>
//                                                 <span className="discount-percentage" style={{ border: "1px solid #9a9a9a", fontSize: "1.4rem", borderRadius: "0.4rem", lineHeight: 1, marginLeft: "2rem", fontWeight: "700", padding: "1rem 1rem 1rem 1rem", }}>49% Off</span>
//                                             </div>
//                               <div className="location" style={{ fontSize: "1.2rem", fontWeight: "400", marginTop: "10px" }}>Brand : {productBrand}</div>
//                             </div>
//                           </div>
//                         </div>
//                       </li>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div> 