import React, { useEffect } from "react"
import Featured from "./featured/Featured"
import Hero from "./hero/Hero"
import Recent from "./recent/Recent"
import { useNavigate } from "react-router-dom";

const Home = () => {
  const usenavigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userId");
    if (!isLoggedIn) {
      usenavigate("/");
    }
  }, [usenavigate]);

  return (
    <>
      <Hero />
      <Featured/>
      <Recent />
      {/* <Awards />
      <Location />
      <Team />
      <Price /> */}
    </>
  )
}

export default Home
