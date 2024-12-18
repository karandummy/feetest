import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import mage from './Handler6.jpg';
import './home.css';

const Home = () => {
  const [Reg_No, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("top");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    
    e.preventDefault(); // Prevent default form submission
    if (!Reg_No || !password) {
      alert("Please fill in all fields.");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACK_END}/home`, { Reg_No, password })
      .then((res) => {
       // console.log(res); // Debugging server response
        if (res.data && res.data.message!=="The password is incorrect" && res.data.message!=="Reg No not found") {
         // alert("Login successful!");
         sessionStorage.setItem("isLoggedIn", "true");
          navigate("/profile",{state: res.data}); // Redirect to home page or dashboard
        } else {
          alert(res.data.message); // Show server response
        }

      })
      .catch((err) => {
       // console.log("Error connecting to the server:", err);
       alert("An error occurred. Please try again later.");
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => (prev === "top" ? "bottom" : "top"));
    }, 5000); // Change position every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="login-page">
      <div className="header-image-container">
        <img
          src={mage}
          alt="Header Logo"
          className="header-image"
        />
      </div>
      

      <div className="login-box">
        <h2>Student Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="Reg_No">Reg No</label>
          <input
            type="text"
            id="Reg_No"
            name="Reg_No"
            placeholder="Enter your Reg No"
            value={Reg_No}
            required
            onChange={(e) => setRegNo(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="DDMMYYYY (your DOB)"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
