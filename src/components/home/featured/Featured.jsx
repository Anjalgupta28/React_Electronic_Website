import React from "react"
import Heading from "../../common/Heading"
import "./Featured.css"
import FeaturedCard from "./FeaturedCard"

const Featured = () => {
  return (
    <>
      <section className='featured background'>
        <div className='container'>
          <Heading title='Featured Appliance Types' subtitle='Find All Type of Appliances.' />
          <FeaturedCard />
        </div>
      </section>
    </>
  )
}

export default Featured
