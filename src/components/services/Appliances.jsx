// import React from "react";
// import { appliances } from "../data/Data"

// const Appliances = () => {
//     return (
//         <>
//         <div className='content grid3 mtop' style={{padding:"10px"}}>
//             {appliances.map((val, index) => {
//                 const { cover, category, location, name, price, type } = val
//                 return (
//                     <div className='box shadow' key={index} style={{padding:"20px", borderRadius:"10px"}}>
//                         <div className='img'>
//                             <img src={cover} alt='' />
//                         </div>
//                         <div className='text'>
//                             <div className='category flex'>
//                                 <span style={{ background: category === "For Sale" ? "#25b5791a" : "#ff98001a", color: category === "For Sale" ? "#25b579" : "#ff9800" }}>{category}</span>
//                                 <i className='fa fa-heart'></i>
//                             </div>
//                             <h4>{name}</h4>
//                             <p>
//                                 <i className='fa fa-location-dot'></i> {location}
//                             </p>
//                         </div>
//                         <div className='button flex'>
//                             <div>
//                                 <button className='btn2'>{price}</button>
//                             </div>
//                             <span>{type}</span>
//                         </div>
//                     </div>
//                 )
//             })}
//         </div>
//         </>
//     )
// }

// export default Appliances;

import React, { useEffect, useState } from "react";
import { appliances } from "../data/Data"

const Appliances = () => {
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
    return (
        <div style={{ backgroundColor: "#191919" }}>
            <div style={{ color: "white", minHeight: "1000px", padding: "2rem" }}>
                <div className="container" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <h3>Home Appliances</h3>
                    <h6 style={{ marginTop: "5px" }}>25 product found</h6>
                </div>
                {appliances.map((val, index) => {
                    const { cover, category, location, name, price, type } = val
                    return (
                        <div className="container" style={{ color: "white", padding: "2rem" }}>
                            <li style={{ borderBottom: "1px solid #f6f6f6", listStyle: "none" }}>
                                <div style={{ paddingBottom: "1rem", display: "flex", flexDirection: "row" }}>
                                    <div className="product-img" style={{ display: "flex", alignItems: "center" }}>
                                        <div style={{ width: "auto", margin: "0 auto" }}>
                                            <img src={cover} alt="" style={{ height: "300px", width: "300px" }} />
                                        </div>
                                    </div>

                                    <div className="product-info" style={{ marginLeft: "50px", marginBottom: "20px" }}>
                                        <div>
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <h3 style={{ fontSize: "2rem", lineHeight: "1.3", height: "auto", paddingRight: "3.5rem" }}>{name}</h3>
                                                <i className='fa fa-heart'></i>
                                            </div>
                                            <div style={{ margin: "0.7rem 0", display: "flex", justifyContent: "flex-start" }}>
                                                <span style={{ fontSize: "1rem", borderRadius: "0.4rem", border: "1px solid #ff02b9", padding: "0.8rem 1rem", marginRight: "0.8rem", fontWeight: "700", color: "#ff02b9" }}>4-in-1 Convertible</span>
                                                <span style={{ fontSize: "1rem", borderRadius: "0.4rem", border: "1px solid #ff02b9", padding: "0.8rem 1rem", marginRight: "0.8rem", fontWeight: "700", color: "#ff02b9" }}>No-Cost EMI upto 12 months</span>
                                            </div>
                                        </div>
                                        <div style={{ display: "block" }}>
                                            <div style={{ paddingBottom: "10px" }}>
                                                {/* <div>
                                                    <button className='btn2'>{price}</button>
                                                </div> */}
                                                <div style={{ fontSize: "2.6rem" }}>
                                                    <span>{price}</span>
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
                                            <div className="location" style={{ fontSize: "1.2rem", fontWeight: "400", marginTop: "10px" }}>Location : {location}</div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default Appliances;