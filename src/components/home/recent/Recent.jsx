import React from "react"
import Heading from "../../common/Heading"
import "./recent.css"
import RecentCard from "./RecentCard"

const Recent = () => {
  return (
    <>
      <section className='recent padding'>
        <div className='container'>
          <Heading title='Recent Appliances & Furniture Listed' subtitle='Our Bestselling new and future Product' />
          <RecentCard />
        </div>
      </section>
    </>
  )
}

export default Recent
