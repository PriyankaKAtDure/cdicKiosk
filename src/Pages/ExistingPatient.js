import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import imgUrl from "../img/imgurl";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { ArrowBack, ArrowBackOutlined } from "@mui/icons-material";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import SearchIcon from '@mui/icons-material/Search';

function ExistingPatient() {
    const navigate = useNavigate();

  return (
    
    <div className="patientbg patientMainSection">
    {/* back logo div */}
      <Grid container spacing ={0}>
      <Grid item xs={1}>
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
      <Grid item xs={10}>          
        <div className="patientLogo">
          <img src={imgUrl.cdiclogo} className="main-logo"></img>
        </div>
      </Grid>
      <Grid item xs={1}></Grid>
     </Grid>

     <Box p={4} className="patientSection">

      <Box mb={4} p={2} border="1px solid #e0e0e0" borderRadius={2} boxShadow={1} className="boxCard">

          <Grid container spacing={2}>
            <Grid item xs={12} lg={12} className="d-flex justify-content-center align-items-center gap-10px">
            <TextField name="phoneNumber" type="number" label="Phone Number" fullWidth variant="outlined" placeholder="Enter Phone Number" autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {/* <LockIcon /> */}
                        <ContactPhoneOutlinedIcon/>
                      </InputAdornment>
                    ),
                  }} />
                <img src={imgUrl.voiceIcon} className="voiceIcon"></img>
            </Grid>
            <Grid item xs={12} lg={12} className="d-flex justify-content-center align-items-center flex-direction-column gap-10px">
                  <h5 className='mt-0px mb-0px'>OR</h5>
                  <div>
                    <img src={imgUrl.qrCode} className=""></img>
                  </div>
            </Grid>
            <Grid item xs={12} lg={12} className="d-flex justify-content-center align-items-center gap-10px">
                <Button variant="contained" color="primary" fullWidth className="commonButton">
                  Search <SearchIcon></SearchIcon>
                </Button>
            </Grid>
          </Grid>

        </Box>

      </Box>
    </div>

  )
}

export default ExistingPatient
