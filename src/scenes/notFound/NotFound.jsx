import React from 'react';
import '../../scenes/notFound/PageNotFound.css'; // Import CSS for styling
import { useNavigate } from "react-router-dom";
import * as CONSTANT from "../../constants/Constant";
function PageNotFound() {
  
    const navigate = useNavigate();
    const goToLoginPage = () => {
      navigate(CONSTANT.LOGIN);
    };
  return (
   
    <div className="not-found-container">
      <div className="astronaut"></div>
      <div className="planet"></div>
      <h2 className="error-message">404 - Page Not Found</h2>
      <p className="sub-message">Oops! Looks like you're lost in space.</p>
      <button className="home-button"  onClick={goToLoginPage}>Go Back</button>
     
    </div>
   
  );
}

export default PageNotFound;
