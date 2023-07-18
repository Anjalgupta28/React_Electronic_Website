import { db } from "../../firebase";
import {collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore" ;

const studentCollectionRef = collection(db,"student")

class StudentDataService {
    addStudents = (newStudent) =>{
        return addDoc(studentCollectionRef, newStudent)
    }
    
    updateStudent = (id, updatedStudent) =>{
        const studentDoc = doc(db, "student", id);
        return updateDoc(studentDoc, updatedStudent)
    }

    deleteStudent = (id) =>{
        const studentDoc = doc(db, "student", id);
        return deleteDoc(studentDoc)
    }

    getAllStudents = () =>{
        return getDocs(studentCollectionRef)
    }

    getStudent = (id) =>{
        const studentDoc = doc(db,"student", id);
        return getDoc(studentDoc)
    }

    getStudents = () => {
        return getDocs(studentCollectionRef);
      };
}

export default new StudentDataService()