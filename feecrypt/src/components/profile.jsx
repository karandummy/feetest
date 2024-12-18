import React from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import "./profile.css"
const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { RegNo,Name,Degree,Branch,Semester,Batchyear,DOB,photo} = location.state;

  const handleLogout = () => {
    
    // Clear all login information
    console.clear();
    sessionStorage.clear(); // Remove any saved session data
    localStorage.clear(); // Remove any saved local data

    // Navigate to the home page
    navigate("/", { replace: true });

    // Optional: Prevent forward navigation
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      navigate("/", { replace: true });
    };
  };

  const handlePay = () => {
    // Navigate to the payment page with RegNo passed as state

    navigate("/pay", { state: { RegNo } });
  };

  return (
    <>
    <div className="user-details-page">
      <header>National Engineering College</header>
      <button className="logout-button"type="button" onClick={handleLogout}>logout</button>
      
      {/* <p>{photo}</p> */}
       <img 
            // src={photo} 
            src={photo}
            alt="User Image" 
            //  style={{ width: '30%', height: '50%' }} 
            className="profile-image"
      />
      <div className="details">
        <p>
            Student Name: <span>{Name}</span>
        </p>
        <p>
          Degree: <span>{Degree}</span>
        </p>
        <p>
          Branch: <span>{Branch}</span>
        </p>
        <p>
          Semester: <span>{Semester}</span>
        </p>
        <p>
          Batch Year: <span>{Batchyear}</span>
        </p>
      </div>
  
    </div>
    <div>
    <button className="pay-online-button" type="button" onClick={handlePay}>Pay</button>
    </div>
    </>
  );
};

export default Profile;

  