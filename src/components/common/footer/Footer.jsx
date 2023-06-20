import React, { useRef, useState } from "react";
import { footer } from "../../data/Data";
import "./footer.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Footer = () => {
  const [subscriber, setSubscriber] = useState("");
  const usenavigate = useNavigate();
  const formRef = useRef(null);

  const handleClick = () => {
    usenavigate("/contact");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // formRef.current.reset();
    let SubscriberObj = { subscriber };

    fetch("http://localhost:8000/subscribers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(SubscriberObj),
    })
      .then((res) => {
        toast.success("Request Submitted Successfully", {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        usenavigate("/home");
        console.log(res);
      })
      .then(() => {
        // Reset the input value to an empty string
        setSubscriber("");
      })
      .catch((err) => {
        toast.error("Failed:" + err.message, {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  return (
    <>
      <section className="footerContact">
        <div className="container">
          <div className="send flex">
            <div className="text">
              <h1>Do You Have Questions ?</h1>
              <p>We'll help you to grow your business</p>
            </div>
            <div onClick={handleClick}>
              <button className="btn5">Contact Us Today</button>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="box">
            <div className="logo">
              <img src="../images/GT_logo.png" alt="" />
              <h2>Do You Need Help With Anything?</h2>
              <p>
                Receive updates, hot deals, tutorials, discounts sent straignt
                in your inbox every month
              </p>

              <div>
                <form
                  className="input flex"
                  onSubmit={handleSubmit}
                  ref={formRef}
                  id="myForm"
                >
                  <input
                    type="text"
                    placeholder="Email Address"
                    value={subscriber}
                    onChange={(e) => setSubscriber(e.target.value)}
                    className="form-control"
                    required
                  />
                  <button style={{margin:"10px"}}>Subscribe</button>
                </form>
              </div>

            </div>
          </div>

          {footer.map((val, index) => (
            <div className="box" key={index}>
              <h3>{val.title}</h3>
              <ul>
                {val.text.map((items) => (
                  <li> {items.list} </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
      <div className="legal">
        <span>© 2023 Gupta-Traders. Designd By Anjal.</span>
      </div>
    </>
  );
};

export default Footer;
