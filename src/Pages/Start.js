import React from 'react';
import imgUrl from "../img/imgurl";
import { Button } from '@mui/material';
import StartSharpIcon from '@mui/icons-material/StartSharp';
import { useNavigate } from 'react-router-dom';
import videoFile  from '../img/videobg.mp4';

function Start() {

    const navigate = useNavigate();
  return (
    <div className='position-relative'>
    <div className='startSection patientbg'>
      <img src={imgUrl.cdiclogo} className="main-logo"></img>
      <div className='start-button'>

      <img src={imgUrl.startButtonIcon} onClick={() => navigate("/patient")}></img>
      {/* <Button variant="outlined" color="primary" fullWidth className="existing-button" >
      <img src={imgUrl.startButtonIcon}></img>
              <span>  Start  </span>
              </Button> */}
              {/* <img src={imgUrl.voiceIcon}></img> */}
              </div>

              
    </div>
    <video muted loop id="myVideo" autoPlay>
        <source src={videoFile} type="video/mp4"/>
      </video>

    </div>
  )
}

export default Start
