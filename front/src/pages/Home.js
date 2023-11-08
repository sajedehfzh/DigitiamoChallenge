import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './css/Home.css';
import logo from './css/Logo.png';

const Home = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  //const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) { // This checks for an empty string or a string with only spaces
      alert('URL is mandatory'); // Alert the user that the URL is mandatory
      return;
    }
    try {
      const response = await axios.post('http://localhost:8081/home', { url });
      const shareId = response.data.shareId; // Assuming shareId is returned from the backend
      navigate(`/${shareId}`); // Redirecting to the path with the shareId
    } catch (error) {
      console.error('Error sending URL to the backend', error);
    }
  };

  return (

    <div className="main-container">
    <div className="logo-container">
    <img src={logo} alt="Logo" />
    </div>
    <div  className='main'>
      <form onSubmit={handleSubmit}>
        <input className='url-holder'
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />
        <button type="submit" className="button" >Submit</button>
      </form>
      </div>
    </div>
  );
};

export default Home;