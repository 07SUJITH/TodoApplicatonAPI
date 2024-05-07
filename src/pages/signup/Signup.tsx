import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { isValidEmail, isValidPassword, isValidUsername } from "../../utils/regexMatcher.js";
import styles from "./Signup.module.css";
import axiosInstance from "../../config/axiosInstance.js";
import axios from "axios";

const Signup: React.FC = () => {
 const navigate = useNavigate();
 const [loading, setLoading] = useState<boolean>(false);
 const [signupDetails, setSignupDetails] = useState<{
    email: string;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
 }>({
    email: "",
    username: "",
    password: "",
    first_name: "",
    last_name: ""
 });

 const emailRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
 }, []);

 const handleUserInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
 };

 const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (
     !signupDetails.email ||
     !signupDetails.username ||
     !signupDetails.password ||
     !signupDetails.first_name ||
     !signupDetails.last_name
  ) {
     toast.error("Please fill all the fields");
     return;
  }
  if (!isValidEmail(signupDetails.email)) {
     toast.error("Invalid Email ID");
     return;
  }
  if (!isValidUsername(signupDetails.username)) {
     toast.error("Username should be at least 5 characters");
     return;
  }
  if (!isValidPassword(signupDetails.password)) {
     toast.error(
       "Invalid Password, Password should be 6 to 16 characters long with at least a number and special character"
     );
     return;
  }
 
  try {
     setLoading(true);
     console.log("signupDetails", signupDetails);
       // Prepare form data
     const response = await axiosInstance.post('/api/user/signup', signupDetails);
     if (response.status === 201) {
       navigate("/login");
       toast.success( response.data.message, {
         duration: 5000,
       });
     } else {
       toast.error("An unexpected error occurred. Please try again.");
     }
    } catch (err) {
      console.log("error in handling login details", err);
      if (axios.isAxiosError(err)) {
         // Now TypeScript knows that 'err' is an AxiosError, and you can safely access 'err.response'
         if (err.response) {
           // Handle specific HTTP error statuses if necessary
           toast.error("An error occurred. Please try again.");
         } else if (err.request) {
           // The request was made but no response was received
           toast.error("The server is not responding. Please try again later.");
         } else {
           // Something happened in setting up the request that triggered an Error
           toast.error("An error occurred. Please try again.");
         }
      } else {
         // Handle the case where 'err' is not an AxiosError
         toast.error("An unexpected error occurred. Please try again.");
      }
     }finally {
     setLoading(false);
  }
 };

 // Inside your Signup component's return statement
return (
  <div className={styles.animatedBackground}>
     <div className={styles.container}>
       <form onSubmit={onFormSubmit} noValidate>
         <h1 className={styles.h1}>SignUp</h1>
         <div className={styles.inputBox}>
           <label className={styles.label} htmlFor="first_name">First Name</label>
           <input
             onChange={handleUserInputs}
             className={styles.inputText}
             type="text"
             placeholder="Enter your first name"
             id="first_name"
             name="first_name"
             value={signupDetails.first_name}
           />
         </div>
         <div className={styles.inputBox}>
           <label className={styles.label} htmlFor="last_name">Last Name</label>
           <input
             onChange={handleUserInputs}
             className={styles.inputText}
             type="text"
             placeholder="Enter your last name"
             id="last_name"
             name="last_name"
             value={signupDetails.last_name}
           />
         </div>
         <div className={styles.inputBox}>
           <label className={styles.label} htmlFor="username">Username</label>
           <input
             onChange={handleUserInputs}
             className={styles.inputText}
             type="text"
             placeholder="Enter username"
             id="username"
             name="username"
             value={signupDetails.username}
           />
         </div>
         <div className={styles.inputBox}>
           <label className={styles.label} htmlFor="email">Email</label>
           <input
             onChange={handleUserInputs}
             className={styles.inputEmail}
             type="email"
             placeholder="Enter your email"
             id="email"
             name="email"
             value={signupDetails.email}
           />
         </div>
         <div className={styles.inputBox}>
           <label className={styles.label} htmlFor="password">Password</label>
           <input
             onChange={handleUserInputs}
             className={styles.inputPassword}
             type="password"
             placeholder="Enter your password"
             id="password"
             name="password"
             value={signupDetails.password}
           />
         </div>
         <button className={styles.button} type="submit">
           {loading ?
             <div className={styles.spinner}></div>
             : "Create account"
           }
         </button>
         <p className={styles.p}>
           Already have an account?{" "}
           <Link className={styles.a} to="/login">Login</Link>
         </p>
       </form>
     </div>
  </div>
 );
};

export default Signup;