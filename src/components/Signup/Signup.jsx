import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const formRef = useRef(null);

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        
        let signupObj = { id, name, password, email, phone, address };
        // console.log(signupObj)

        fetch(" http://localhost:8000/users", {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(signupObj)
        }).then((res) => {
            toast.success("Registered successfully",{
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",})
            navigate('/')
        }).catch((err) => {
            toast.error("Failed:" + err.message,
            {position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",})
        });
    }

    // const handleReset = () => {
    //     formRef.current.reset();
    // };
    return (
        <div>
            <div className="offset-lg-3 col-lg-6">
                <form className="container" ref={formRef} onSubmit={handleSubmit} style={{margin:"50px"}}>
                    <div className="card">
                        <div className="card-header">
                            <h1>Register</h1>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Full Name<span className="errmsg">*</span></label>
                                        <input value={name} onChange={e => setName(e.target.value)} className="form-control" required></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>User Name / ID<span className="errmsg">*</span></label>
                                        <input value={id} onChange={e => setId(e.target.value)} className="form-control" required></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Password<span className="errmsg">*</span></label>
                                        <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" required></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Email<span className="errmsg">*</span></label>
                                        <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" required></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Phone<span className="errmsg">*</span></label>
                                        <input value={phone} onChange={e => setPhone(e.target.value)} className="form-control" required></input>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label>Address</label>
                                        <textarea value={address} onChange={e => setAddress(e.target.value)} className="form-control"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer" style={{display:"flex", justifyContent:"space-evenly"}}>
                            <Link to={'/login'} className="btn btn-primary">Back</Link>
                            <button type="submit" className="btn btn-success">Signup</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Signup;