import React from "react"
import Back from "../common/Back"
import Heading from "../common/Heading"
import img from "../images/about.jpg"
import "./about.css"

const About = () => {
  return (
    <>
      <section className='about'>
        <Back name='About Us' title='About Us - Who We Are?' cover={img} />
        <div className='container flex mtop'>
          <div className='left row'>
            <Heading title='Our Agency Story' subtitle='Check out our company story and work process' />

            <p>"To make electronics shopping, a fulfilling experience" - a thought that was the foundation of our humble beginning, way back in 1980. We, at Gupta Traders, sought to uncomplicate the life of our customers by bringing the latest electronic gadgets at the lowest prices.</p>
            <p>Everyone has aspirations of having a home with luxury electronic brands and have a comfortable home. Our aim is to serve our customers with top-notch quality brands yet maintain the customer and pocket-friendly prices. Quality is a need in itself and we have proven to cater to our customer's satisfaction and continue to do so.</p>
            <button style={{ width: "60%" }}>More About Us</button>
          </div>
          <div className='right row'>
            <img src='./immio.jpg' alt='' />
          </div>
        </div>
      </section>
    </>
  )
}

export default About
