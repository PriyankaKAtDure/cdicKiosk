import React from "react";
import { Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { PersonAdd, Person, ArrowBack } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import imgUrl from "../img/imgurl";

export default function Patient() {

  const navigate = useNavigate();
  return (

    <>
      <div className="patientbg patientMainSection">
      <Grid container spacing={0} className="">
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
          {/* <Typography variant="h4" mb={4} textAlign="center">
        Patient Options
      </Typography> */}
          <Grid container spacing={2} justifyContent="center">
            {/* New Patient Card */}

            <Grid item xs={9} sm={9} md={9} onClick={() => navigate("/forms")} className="cursor-pointer">
              <Card sx={{ bgcolor: "#f8fbff", borderRadius: 2, boxShadow: 2 }}>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    {/* <PersonAdd fontSize="large" color="primary" /> */}
                    <img src={imgUrl.patientnews} className="patientImg"></img>
                    <Typography variant="h6" fontWeight="bold">
                      New Patient
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Existing Patient Card */}
            <Grid item xs={9} sm={9} md={9} onClick={() => navigate("/existingpatient")} className="cursor-pointer mt-10px">
              <Card sx={{ border: "1px solid #e0e0e0", borderRadius: 2, boxShadow: 2 }}>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    {/* <Person fontSize="large" color="primary" /> */}
                    <img src={imgUrl.existingpatient} className="patientImg"></img>
                    <Typography variant="h6" fontWeight="bold">
                      Existing Patient
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        <div className="voiceFixIcon">
          <img src={imgUrl.voiceAudioIcon} className=""/>
        </div>
      </div>
    </>
  );
}
