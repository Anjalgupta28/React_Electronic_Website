import React, { useState, useRef } from "react";
import img from "../images/pricing.jpg";
import Back from "../common/Back";
import "./contact.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const formRef = useRef(null);

  const usenavigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    document.getElementById("myForm").reset();
    let ContactObj = { name, subject, email, message };

    fetch("http://localhost:8000/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(ContactObj),
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
        // usenavigate("/home");
        console.log(res);
      })
      .then(() => {
        // Reset the input value to an empty string
        setMessage("");
        setName("")
        setSubject("")
        setEmail("")
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
      <section className="contact mb">
        <Back
          name="Contact Us"
          title="Get Helps & Friendly Support"
          cover={img}
        />
        <div className="container">
          <form
            className="shadow"
            onSubmit={handleSubmit}
            ref={formRef}
            id="myForm"
          >
            <h4>Fillup The Form</h4> <br />
            <div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                required
              />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="form-control"
              required
            />
            <input
              type="text"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-control"
              required
            />
            <button>Submit Request</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Contact;
