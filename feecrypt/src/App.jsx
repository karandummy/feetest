import React from "react";
import { Routes, Route } from "react-router-dom";
import  NotFound from "./components/notfound.jsx"
import  Home from "./components/home.jsx";
import ProtectedRoute from "./components/protectedroute.jsx";
import  Profile from "./components/profile.jsx";
import Pay from "./components/pay.jsx"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile"
       element={
          <ProtectedRoute>
              <Profile />
        </ProtectedRoute>
      }
      />
      <Route path="/pay"
       element={
          <ProtectedRoute>
              <Pay />
        </ProtectedRoute>
      }
      />

       

      <Route path="/not-found" element={<NotFound />} />
    </Routes>
  );
};

export default App;

