import React from "react";
import img from "../images/services.jpg";
import Back from "../common/Back";
import "../home/featured/Featured.css";
import FeaturedCard from "../home/featured/FeaturedCard";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/appliances");
  };

  return (
    <>
      <section className="services mb">
        <Back name="Services" title="Services -All Services" cover={img} />
        <div className="featured container" onClick={handleClick}>
          <FeaturedCard />
        </div>
      </section>
    </>
  );
};

export default Services;
