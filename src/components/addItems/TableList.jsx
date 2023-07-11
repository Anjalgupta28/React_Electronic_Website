import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

const TableList = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/addItems")
            .then((res) => {
                return res.json();
            }).then((resp) => {
                setData(resp);
            }).catch((err) => {
                console.log(err.message);
            })
    }, [])

    const Removefunction = (id) => {
        if (window.confirm('Do you want to remove?')) {
            fetch(`http://localhost:8000/addItems/${id}`, {
                method: "DELETE"
            }).then((res) => {
                alert('Removed successfully.')
                window.location.reload();
            }).catch((err) => {
                console.log(err.message)
            })
        }
    }

    return (
        <div className="container">
            <div className="card">
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <h2>Product Listing</h2>
                </div>
                <div className="card-body">
                    <table className="table table-bordered">
                        <thead className="bg-dark text-white">
                            <tr>
                                <td>ID</td>
                                <td>Name</td>
                                <td>Price</td>
                                <td>Description</td>
                                <td>Brand</td>
                                <td>Action</td>
                            </tr>
                        </thead>
                        <tbody>

                            {data &&
                                data.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.productName}</td>
                                        <td>{item.productPrice}</td>
                                        <td>{item.productDescription}</td>
                                        <td>{item.productBrand}</td>
                                        <td>
                                            <DeleteIcon onClick={() => { Removefunction(item.id) }} style={{ color: "red", cursor:"pointer"}}/>
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}

export default TableList;
