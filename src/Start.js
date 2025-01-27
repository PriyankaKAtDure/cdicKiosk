import React from 'react';
import imgUrl from "./img/imgurl";
import { Button } from '@mui/material';
import StartSharpIcon from '@mui/icons-material/StartSharp';
import { useNavigate } from 'react-router-dom';

function Start() {

    const navigate = useNavigate();
  return (
    <div className='startSection patientbg'>
      <img src={imgUrl.cdiclogo} className="main-logo"></img>
      <div className='start-button'>
      <Button variant="outlined" color="primary" fullWidth className="existing-button" onClick={() => navigate("/patient")}>
                Start <StartSharpIcon className='iconimg'/>
              </Button>
              <img src={imgUrl.voiceIcon}></img>
              </div>
    </div>
  )
}

export default Start
