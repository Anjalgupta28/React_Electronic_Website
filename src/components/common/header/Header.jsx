import React, { useState, useMemo } from "react";
import "./header.css";
import { nav } from "../../data/Data";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [navList, setNavList] = useState(false);
  const usenavigate = useNavigate();

  const handleClick = () => {
    usenavigate("/home");
  };

  const handleClickLogout = () => {
    // Remove the userId and role from local storage
    localStorage.removeItem("userId");
    localStorage.removeItem("role")
     // Redirect to the login page
     window.location.href = "/";
  };

  const memoizedNav = useMemo(() => nav, []);

  // Check if the user is logged in
  const isLoggedIn = localStorage.getItem("userId") !== null;

  return (
    <>
      <header>
        <div className="container flex">
          <div className="logo" onClick={handleClick}>
            <img src="./images/GT_logo.png" alt="" style={{ width: "100px" }} />
          </div>
          <div className="nav">
            <ul className={navList ? "small" : "flex"}>
              {!isLoggedIn && (
                <>
                  <li>
                    <Link to="/" className="hover-underline-animation">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="hover-underline-animation">
                      Signup
                    </Link>
                  </li>
                </>
              )}
              {isLoggedIn && (
                <>
                  {memoizedNav.map((list, index) => (
                    <li key={index}>
                      <Link to={list.path} className="hover-underline-animation">
                        {list.text}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link onClick={handleClickLogout} className="hover-underline-animation">
                      Logout
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="toggle">
            <button onClick={() => setNavList(!navList)}>
              {navList ? <i className="fa fa-times"></i> : <i className="fa fa-bars"></i>}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
