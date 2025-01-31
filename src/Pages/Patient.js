import React from "react";
import { Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { PersonAdd, Person, ArrowBack } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import imgUrl from "../img/imgurl";
import videoFile  from '../img/videobg.mp4'

export default function Patient() {

  const navigate = useNavigate();
  return (

    <>
    <div className='position-relative'>
      <div className="patientbg patientMainSection patientPage mainPatientLanding">
      <Grid container spacing={0} className="patientHeaderSection">
        <Grid items xs={1}>
        <div
          className="backButton">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)} // Navigate to the previous page
          // sx={{ mb: 2 }}
          >
          </Button>
        </div>
        </Grid>
        <Grid items xs={10}>
        <div className="patientLogo">
          <img src={imgUrl.cdiclogo} className="main-logo"></img>
        </div>
        </Grid>  
         <Grid item xs={1}></Grid>    
      </Grid>
        <Box p={4} className="patientSection">
          <Typography variant="h4" mb={4} textAlign="center" className="mainHeading mb-0">
        Welcome to CDIC
      </Typography>
      <p className="subHeading">Choose your patient type</p>
          <Grid container spacing={2} justifyContent="center" className="mt-10px">
            {/* New Patient Card */}

            <Grid item xs={6} sm={6} md={6} onClick={() => navigate("/forms")} className="cursor-pointer">
              <Card sx={{ bgcolor: "#f8fbff", borderRadius: 2, boxShadow: 2 }}>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    {/* <PersonAdd fontSize="large" color="primary" /> */}
                    <div>
                    <Typography variant="h6" fontWeight="bold">
                      New <br></br> Patient
                      {/* <ArrowForwardIosOutlinedIcon/> */}
                    </Typography>
                    </div>
                    <div className="patientSecondDiv">
                    <img src={imgUrl.patientnews} className="patientImg"></img>
                    </div>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Existing Patient Card */}
            <Grid item xs={6} sm={6} md={6} onClick={() => navigate("/existingpatient")} className="cursor-pointer">
              <Card sx={{ border: "1px solid #e0e0e0", borderRadius: 2, boxShadow: 2 }}>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    {/* <Person fontSize="large" color="primary" /> */}
                    <div>
                    <Typography variant="h6" fontWeight="bold">
                    
                      Existing <br></br> Patient
                      {/* <ArrowForwardIosOutlinedIcon/> */}
                    </Typography>
                    </div>
                    <div className="patientSecondDiv">
                    <img src={imgUrl.existingpatient} className="patientImg"></img>
                    </div>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        <div className="voiceFixIcon">
          
          <img src={imgUrl.voiceAudioIcon} className=""/>
    \
        </div>
      </div>
 <video autoplay muted loop id="myVideo">
        <source src={videoFile} type="video/mp4"/>
      </video>

    </div>
      
    </>
  );
}
