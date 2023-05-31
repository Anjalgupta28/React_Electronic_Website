import React from "react"
import { featured } from "../../data/Data"
import { useNavigate } from "react-router-dom";

const FeaturedCard = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/appliances");
  };
  return (
    <>
      <div className='content grid5 mtop'>
        {featured.map((items, index) => (
          <div className='box' key={index}  onClick={handleClick}>
            <img src={items.cover} alt='' />
            <h4>{items.name}</h4>
            <label>{items.total}</label>
          </div>
        ))}
      </div>
    </>
  )
}

export default FeaturedCard
