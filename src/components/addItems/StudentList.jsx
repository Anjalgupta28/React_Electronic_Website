import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StudentDataService from '../services/student.services';
import { messaging } from '../../firebase';
import { getToken } from 'firebase/messaging';
import { toast } from 'react-toastify';
import axios from 'axios';

const StudentList = () => {
    const [openModal, setOpenModal] = useState(false);
    const [students, setStudents] = useState([]);
    const [studentName, setStudentName] = useState('');
    const [studentAge, setStudentAge] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [studentContactNumber, setStudentContactNumber] = useState('');
    const [message, setMessage] = useState({ error: false, msg: '' });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const usenavigate = useNavigate();
    const notificationInitializedRef = useRef(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("userId");
        if (!isLoggedIn) {
            usenavigate("/");
        }

        fetchStudents();
        getStudent();
        requestPermission()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usenavigate]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const fetchedStudents = await StudentDataService.getStudents();
            setStudents(fetchedStudents);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const getStudent = async () => {
        const data = await StudentDataService.getAllStudents();
        console.log(data.docs);
        setStudents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const editStudent = (id) => {
        const student = students.find((student) => student.id === id);
        if (student) {
            setEditId(id);
            setStudentName(student.studentName);
            setStudentAge(student.studentAge);
            setStudentClass(student.studentClass);
            setStudentContactNumber(student.studentContactNumber);
            setOpenModal(true);
        }
    };

    const requestPermission = async () => {
        if (notificationInitializedRef.current) {
            return;
        }

        notificationInitializedRef.current = true;
        try {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                const token = await getToken(messaging, {
                    vapidKey:
                        'BM-zVPAaCk-ShGEIxuGMrAIS-8RAWA6oydniQKBPA8mfy4aq6WEfaIH3XinKP96ERTMqWg6E7REgny5f4DG7vT0'
                });
                console.log("Token Generated", token);
                sendTokenToServer(token);
            } else if (permission === "denied") {
                alert("You denied the notification permission");
            }
        } catch (error) {
            console.error("Error initializing notification:", error);
        }
    }

    const sendTokenToServer = async (token) => {
        try {
            await fetch('http://localhost:8000/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });
            console.log('Token sent to the server:', token);
        } catch (error) {
            console.error('Error sending token to the server:', error);
        }
    };

    const deleteHandler = async (id) => {
        try {
            const confirmed = await fetch((`/data/${id}`), { method: 'GET' })
            console.log("confirmed", confirmed)
            if (confirmed.ok) {
                // await StudentDataService.deleteStudent(id);
                const response = await axios.delete(`http://localhost:8000/delete/${id}`, { headers: { 'Content-Type': 'application/json' } });
                // const data = await response.json();
                console.log("response", response)
                // alert("Record deleted successfully!");
            } else {
                // Show error alert if the record deletion fails
                alert(`Failed to delete record: `);
            }

            // await StudentDataService.deleteStudent(id);
            // setMessage({ error: false, msg: 'Record deleted successfully!' });
            // await sendPushNotification(); // Send push notification
            getStudent();
        } catch (error) {
            console.error(error);
        }
    };

    const sendPushNotification = async () => {
        const title = "Record Deleted";
        const body = "A record has been deleted from the student list.";

        const notification = {
            title,
            body,
        };

        try {
            const response = await fetch("http://localhost:8000/send-notification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notification }),
            });
            if (response.ok) {
                toast.success("Push notification sent successfully!", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } else {
                throw new Error("Failed to send push notification");
            }
        } catch (error) {
            console.error("Error sending push notification:", error);
            toast.error("Failed to send push notification.", {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
    };

    const handleModalOpen = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        resetForm();
        setOpenModal(false);
    };

    const resetForm = () => {
        setStudentName('');
        setStudentAge('');
        setStudentClass('');
        setStudentContactNumber('');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (studentName === '' || studentClass === '' || studentAge === '' || studentContactNumber === '') {
            setMessage({ error: true, msg: 'All fields are mandatory!' });
            return;
        }

        const newStudent = {
            studentName,
            studentAge,
            studentClass,
            studentContactNumber,
        };

        try {
            if (editId) {
                await StudentDataService.updateStudent(editId, newStudent);
                setMessage({ error: false, msg: 'Student updated successfully!' });
                // Update the existing student in the state
                setStudents((prevStudents) =>
                    prevStudents.map((student) => {
                        if (student.id === editId) {
                            return { ...student, ...newStudent };
                        }
                        return student;
                    })
                );
            } else {
                await StudentDataService.addStudents(newStudent);
                setMessage({ error: false, msg: 'New Student added Successfully!' });
                // Add the new student to the state
                setStudents((prevStudents) => [...prevStudents, { ...newStudent, id: Math.random().toString() }]);
            }
            setOpenModal(false);
            resetForm();
        } catch (err) {
            setMessage({ error: true, msg: err.message });
        }
    };

    return (
        <>
            <div className="container">
                <div style={{ margin: '15px' }}>
                    <button onClick={handleModalOpen}>Add Student</button>
                </div>

                <div>
                    <Dialog
                        open={openModal}
                        onClose={handleModalClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{'Fill up the form'}</DialogTitle>

                        <DialogContent>
                            <form onSubmit={handleSubmit} id="myForm" className="shadow" style={{ marginTop: '0px' }}>
                                <div>
                                    <input
                                        type="text"
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        className="form-control"
                                        placeholder="Student Name"
                                        required
                                    />
                                    <input
                                        type="number"
                                        value={studentClass}
                                        onChange={(e) => setStudentClass(e.target.value)}
                                        className="form-control"
                                        placeholder="Student Class"
                                        required
                                    />
                                    <input
                                        type="number"
                                        value={studentAge}
                                        onChange={(e) => setStudentAge(e.target.value)}
                                        className="form-control"
                                        placeholder="Student Age"
                                        required
                                    />
                                    <input
                                        type="number"
                                        value={studentContactNumber}
                                        onChange={(e) => setStudentContactNumber(e.target.value)}
                                        className="form-control"
                                        placeholder="Student Contact Number"
                                        required
                                    />
                                    <button type="submit" style={{ margin: '15px' }}>
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>


                {message.msg && (
                    <Alert severity={message.error ? 'error' : 'success'} onClose={() => setMessage({ error: true, msg: '' })}>
                        {message.msg}
                    </Alert>
                )}

                <div style={{ marginBottom: "50px", boxShadow: "0 0 20px 0 rgb(112 121 138 / 18%)", maxHeight: "700px", overflowY: "scroll", border: "1px solid #ccc", padding: "20px", borderRadius: "5px" }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <h2>Student List</h2>
                    </div>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </div>
                    ) : students.length === 0 ? (
                        <div style={{ textAlign: 'center' }}>
                            <p>No students found.</p>
                        </div>
                    ) : (
                        <table className="table table-bordered">
                            <thead className="bg-dark text-white">
                                <tr>
                                    <td>Name</td>
                                    <td>Age</td>
                                    <td>Class</td>
                                    <td>Contact Number</td>
                                    <td>Action</td>
                                </tr>
                            </thead>
                            <tbody>
                                {students && students.map((student) => (
                                    <tr key={student.id}>

                                        <td>{student.studentName}</td>
                                        <td>{student.studentAge}</td>
                                        <td>{student.studentClass}</td>
                                        <td>{student.studentContactNumber}</td>
                                        <td>
                                            <EditIcon
                                                style={{ color: "blue", cursor: "pointer" }}
                                                onClick={(e) => editStudent(student.id)}
                                            />
                                            <DeleteIcon
                                                style={{ color: "red", cursor: "pointer" }}
                                                onClick={(e) => deleteHandler(student.id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {/* <pre>{JSON.stringify(students, undefined, 2)}</pre> */}
            </div>

        </>
    );
};

export default StudentList;
