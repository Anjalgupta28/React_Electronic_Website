// import React, { useState } from "react"
// import "./header.css"
// import { nav } from "../../data/Data"
// import { Link } from "react-router-dom"
// import { useNavigate } from 'react-router-dom';

// const Header = () => {
//   const [navList, setNavList] = useState(false)

//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate('/home');
//   };

//   return (
//     <>
//       <header>
//         <div className='container flex'>
//           <div className='logo' onClick={handleClick}>
//             <img src='./images/GT_logo.png' alt='' style={{ width: "100px" }} />
//           </div>
//           <div className='nav'>
//             <ul className={navList ? "small" : "flex"}>
//               {nav.map((list, index) => (
//                 <li key={index}>
//                   <Link to={list.path} className="hover-underline-animation">{list.text}</Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className='toggle'>
//             <button onClick={() => setNavList(!navList)}>{navList ? <i className='fa fa-times'></i> : <i className='fa fa-bars'></i>}</button>
//           </div>
//         </div>
//       </header>
//     </>
//   )
// }

// export default Header

import React, { useState, useMemo } from "react";
import "./header.css";
import { nav } from "../../data/Data";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [navList, setNavList] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/home");
  };

  const memoizedNav = useMemo(() => nav, []);

  return (
    <>
      <header>
        <div className="container flex">
          <div className="logo" onClick={handleClick}>
            <img src="./images/GT_logo.png" alt="" style={{ width: "100px" }} />
          </div>
          <div className="nav">
            <ul className={navList ? "small" : "flex"}>
              {memoizedNav.map((list, index) => (
                <li key={index}>
                  <Link to={list.path} className="hover-underline-animation">
                    {list.text}
                  </Link>
                </li>
              ))}
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
