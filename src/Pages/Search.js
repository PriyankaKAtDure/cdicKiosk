import React from "react";
import { Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { PersonAdd, ArrowBack } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import imgUrl from "../img/imgurl";
import videoFile from '../img/videobg.mp4'

export default function Search() {

  const navigate = useNavigate();
  return (

    <>
     <div className='position-relative'>
      <div className="patientbg patientMainSection mainPatientLanding">
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
        <Box p={4} className="patientSection justify-content-start searchReportSection">
          {/* <Typography variant="h4" mb={4} textAlign="center">
        Patient Options
      </Typography> */}
          <Grid container spacing={2} justifyContent="center" className="">
            {/* New Patient Card */}

            <Grid item xs={12} sm={12} md={12} onClick={() => {}} className="cursor-pointer">
              <Card sx={{ bgcolor: "#f8fbff", borderRadius: 2, boxShadow: 2 }}>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    {/* <PersonAdd fontSize="large" color="primary" /> */}
                    <div className="">
                    <Typography variant="h6" fontWeight="bold">
                      Generate <br></br> Report
                    </Typography>
                    </div>
                    <div className="patientSecondDiv">
                    <img src={imgUrl.generateReport} className="patientImg"></img>
                    </div>
                   
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Existing Patient Card */}
            <Grid item xs={9} sm={9} md={9} onClick={() => navigate("/t")} className="cursor-pointer d-none patientSummaryBox">
              <Card sx={{ border: "1px solid #e0e0e0", borderRadius: 2, boxShadow: 2 }}>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    {/* <Person fontSize="large" color="primary" /> */}
                    <img src={imgUrl.patientSummary} className="patientImg"></img>
                    <Typography variant="h6" fontWeight="bold">
                    Patient Summary
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </div>
       {/* <video muted loop id="myVideo" autoPlay>
                <source src={videoFile} type="video/mp4" />
              </video> */}
      </div>
    </>
  );
}
