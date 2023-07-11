import React, { useState, useEffect } from "react"
import { list } from "../../data/Data"

const RecentCard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/addItems");
        const data = await response.json();
        const lastSixData = data.slice(-6);
        setData(lastSixData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const convertImage = (imageBase64String) => {
    return `data:image/png;base64, ${imageBase64String}`;
  };
  return (
    <>
      <div className='content grid3 mtop'>
        {data.map((val, index) => {
          const {imageBase64String, productName, productPrice, productDescription, productBrand, category } = val
          const imageUrl = convertImage(imageBase64String);
          return (
            <div className='box shadow' key={index}>
              <div className='img' style={{display:"flex", justifyContent:"center", width:"100%"}}>
                <img src={imageUrl} alt='' style={{width:"100%", height:"400px"}}/>
              </div>
              <div className='text'>
                <div className='category flex'>
                  <span style={{ background: category === "For Sale" ? "#25b5791a" : "#ff98001a", color: category === "For Sale" ? "#25b579" : "#ff9800" }}>{category}</span>
                  <i className='fa fa-heart'></i>
                </div>
                <h4>{productDescription}</h4>
                <p>
                  {/* <i className='fa fa-location-dot'></i> {location} */}
                </p>
              </div>
              <div className='button flex'>
                <div>
                  <button className='btn2'>{productPrice}</button>
                </div>
                <span>{productBrand}</span>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default RecentCard
