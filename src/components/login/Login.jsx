import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import "./All.css"

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const usenavigate = useNavigate();
    

    const handleSubmit = (e) => {
        e.preventDefault();
            fetch("http://localhost:7000/users/"+username)
                .then((res) => {
                    return res.json()
                }).then((resp) => {
                    console.log(resp)
                    if(Object.keys(resp).length ===0){
                        toast.error("User not found",
                        {position: "bottom-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",});
                    }else{
                        if(resp.password === password){
                        localStorage.setItem("userId",resp.id)
                        localStorage.setItem("role",resp.role)
                            toast.success('Successfully logged in',
                            {position: "bottom-right",
                            autoClose: 1000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",})
                            usenavigate('/home')
                        }else{
                            toast.error('Please enter valid password',
                            {position: "bottom-right",
                            autoClose: 1000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",})
                        }
                    }
                }).catch((err) => {
                    toast.error('Login failed due to :' + err.message,
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

    useEffect(() => {
        sessionStorage.clear();
    }, []);


    return (
        <div className="row">
            <div className="offset-lg-3 col-lg-6">
                <form className="container" onSubmit={handleSubmit} style={{margin:"50px"}}>
                    <div className="card">
                        <div className="card-header">
                            <h2>User Login</h2>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>User Name <span className="errmsg">*</span></label>
                                <input value={username} onChange={e => setUsername(e.target.value)} className="form-control"></input>
                            </div>
                            <div className="form-group">
                                <label>Password <span className="errmsg">*</span></label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control"></input>
                            </div>
                        </div>
                        <div className="card-footer" style={{display:"flex", justifyContent:"space-evenly"}}>
                            <button type="submit" className="btn btn-primary">Login</button>
                            <Link className="btn btn-success" to={'/signup'}>New User</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login

