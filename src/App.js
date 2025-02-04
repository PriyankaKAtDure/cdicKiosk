import React from 'react';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Start from './Pages/Start';
import Patient from './Pages/Patient';
import Forms from './Pages/Forms';
import ExistingPatient from './Pages/ExistingPatient';
import Search from './Pages/Search';
import useKeyboardDetection from './Pages/useKeyboardVisible';

function App() {
  useKeyboardDetection();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/Patient" element={<Patient />} />
        <Route path="/Forms" element={<Forms />} />
        <Route path="/ExistingPatient" element={<ExistingPatient />} />
        <Route path="/Search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
