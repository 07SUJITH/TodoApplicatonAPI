import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import styles from "../signup/Signup.module.css";
import axiosInstance from '../../config/axiosInstance';
import { useLocalStorage } from "../../hooks/useLocalStorage";
import axios from "axios";
const Login: React.FC = () => {
 const navigate = useNavigate();
 const [loading, setLoading] = useState<boolean>(false);
 const {setItem} = useLocalStorage("access_token");
 const [loginDetails, setLoginDetails] = useState<{
    username: string;
    password: string;
 }>({
    username: "",
    password: "",
 });

 const emailRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
 }, []);

 const handleUserInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
 };

 const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loginDetails.username || !loginDetails.password) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/api/user/login', {
        username: loginDetails.username,
        password: loginDetails.password,
      });

      if (response.status === 200) {
        const access_token = response.data.access_token;
        setItem(access_token);        
        navigate("/todo");
        toast.success("Logged in successfully", {
          duration: 5000,
        });
      }else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      console.log("error in handling login details", err);
      if (axios.isAxiosError(err)) {
         // Now TypeScript knows that 'err' is an AxiosError, and you can safely access 'err.response'
         if (err.response) {
           toast.error("An error occurred. Please try again.");
         } else if (err.request) {
           toast.error("The server is not responding. Please try again later.");
         } else {
           toast.error("An error occurred. Please try again.");
         }
      } else {
         toast.error("An unexpected error occurred. Please try again.");
      }
     }finally {
      setLoading(false);
    }
 };

 return (
    <div className={styles.animatedBackground}>
      <div className={styles.container}>
        <form onSubmit={onFormSubmit} noValidate>
          <h1 className={styles.h1}>SignIn</h1>
          <div className={styles.inputBox}>
            <label className={styles.label} htmlFor="username">Username</label>
            <input
              onChange={handleUserInputs}
              className={styles.inputText}
              type="text"
              placeholder="Enter username"
              id="username"
              name="username"
              value={loginDetails.username}
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
              value={loginDetails.password}
            />
          </div>
          <button className={styles.button}>
            {loading ?
              <div className={styles.spinner}></div>
              : "Login"
            }
          </button>
          <p className={styles.p}>
            Don&rsquo;t have an account ?{" "}
            <Link className={styles.a} to="/signup">Signup</Link>
          </p>
        </form>
      </div>
    </div>
 );
};

export default Login;