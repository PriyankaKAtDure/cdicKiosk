import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Start from './Pages/Start';
import Patient from './Pages/Patient';
import Forms from './Pages/Forms';
import ExistingPatient from './Pages/ExistingPatient';

function App() {
  return (
    <div>
      <Router basename="/">
      
          <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/Patient" element={<Patient />} />
          <Route path="/Forms" element={<Forms />} />

          <Route path="/ExistingPatient" element={<ExistingPatient />} />
          </Routes>
    
      </Router> 
    </div>
  )
}

export default App
