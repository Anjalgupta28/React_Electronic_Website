    import React, { useEffect, useRef, useState } from 'react';
    import { Dialog, DialogContent, DialogTitle, Alert } from '@mui/material';
    import DeleteIcon from '@mui/icons-material/Delete';
    import EditIcon from '@mui/icons-material/Edit';
    import { CircularProgress } from "@mui/material";
    import { useNavigate } from "react-router-dom";
    import StudentDataService from '../services/student.services';
    import { messaging } from '../../firebase';
    import { getToken } from 'firebase/messaging';
    import axios from 'axios';
    import { onMessage } from 'firebase/messaging';

    const StudentList = () => {

        const [openModal, setOpenModal] = useState(false);
        const [students, setStudents] = useState([]);
        const [studentName, setStudentName] = useState('');
        const [studentAge, setStudentAge] = useState('');
        const [studentClass, setStudentClass] = useState('');
        const [studentContactNumber, setStudentContactNumber] = useState('');
        const [token, setToken] = useState('');
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
            // requestPermission()
        }, [usenavigate]);

        onMessage(messaging,async(payload) =>{
            const sw = await window.navigator.serviceWorker.register('/firebase-messaging-sw.js');
            window.Notification.requestPermission((permission)=>{
                console.log("inside");
                if (permission === 'granted') {
                    const image = payload.data['gcm.notification.Image'];
                    sw.showNotification(payload.notification.title,{
                        body:payload.notification.body,
                        icon: image,
                    })
                }
            })
            console.log('on message payload',payload);
        })

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
            // console.log(data.docs);
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
                    setToken(token);
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
                setToken(token);
            } catch (error) {
                console.error('Error sending token to the server:', error);
            }
        };

        const deleteHandler = async (id) => {
            try {
              const confirmed = await axios.get(`http://localhost:8000/data/${id}`);
              console.log("confirmed", confirmed);
          
              if (confirmed.status === 200) {
                const confirmation = window.confirm(confirmed.data.confirmation_message);
                if (confirmation) {
                  const response = await axios.delete(`http://localhost:8000/delete/${id}`);
                  console.log("response", response);
                  // Show success message or perform any other actions
                } else {
                  // Show cancellation message or perform any other actions
                }
              } else {
                // Show error alert if the confirmation request fails
                alert(`Failed to fetch confirmation: ${confirmed.data.error}`);
              }
              getStudent();
            } catch (error) {
              console.error(error);
            }
          };

        // const deleteHandler = async (id) => {
        //     try {
        //       const confirmed = await axios.get(`http://localhost:8000/data/${id}`);
        //       console.log("confirmed", confirmed);
        //       if (confirmed.status === 200) {
        //         const { confirmation_message } = confirmed.data;
                
        //         // Show the confirmation message received from the GET API in an alert
        //         if (window.confirm(confirmation_message)) {
        //           const response = await axios.delete(`http://localhost:8000/delete/${id}`);
        //           console.log("response", response);
        //           if (response.status === 200) {
        //             const notification = {
        //                 to: "cM13pTIvoB0eykdzTrPVW2:APA91bFf6PntYQRLqBd2RQ-CdUGOZ71W1ePbCbT00IkQ34prVYIl2-6cRV3pt041EJHY6i3VFcEPkmjgyGpu71m1l2FRg6OIj-maUsYPeLmdFGWRpJnlqWGIOtlSnMZuvTfrlMu2avXD", // Use the stored token or fetch it from the server
        //                 notification: {
        //                   title: 'Record Deleted Successfully',
        //                   body: 'The record has been deleted successfully!',
        //                 //   icon: 'path/to/notification-icon.png',
        //                 },
        //               };
        //               const pushResponse = await axios.post('http://localhost:8000/send-notification', { notification });
        //               console.log('Push notification sent:', pushResponse.data);
        //           } else {
        //             alert("Failed to delete record!");
        //           }
        //         }
        //       }
        //       getStudent();
        //     } catch (error) {
        //       console.error(error);
        //     }
        //   };

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
             requestPermission()
            const newStudent = {
                studentName,
                studentAge,
                studentClass,
                studentContactNumber,
                token,
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
