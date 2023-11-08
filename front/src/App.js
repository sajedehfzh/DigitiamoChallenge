//import logo from './logo.svg';
import './App.css';
import  React  from 'react'
import {BrowserRouter, Routes , Route} from 'react-router-dom'
import Home from './pages/Home'
import Response from './pages/Response'



function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path='/' element= {<Home/>} />
   <Route path="/:shareId" element={<Response/>} />
    </Routes>
    
    
    </BrowserRouter>
  );
}

export default App;
