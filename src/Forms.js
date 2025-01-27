import React from "react";
import { Box, Typography, Grid, TextField, Button, MenuItem,  InputAdornment, } from "@mui/material";
import imgUrl from "./img/imgurl";

export default function Forms() {
  return (
    <div className="patientbg patientMainSection">
    <div className="patientLogo">
       <img src={imgUrl.cdiclogo} className="main-logo" style={{paddingTop:"17px"}}></img>
    </div>
    <Box p={4} className="patientbg">
      

     
        <Box mb={4} p={2} border="1px solid #e0e0e0" borderRadius={2} boxShadow={1} className="boxCard">
          <Typography variant="h6" mb={2}>
            
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} className="d-flex justify-content-center align-items-center gap-10px">
              <TextField label="First Name" fullWidth variant="outlined" placeholder="First Name" autoFocus   
              InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {/* <LockIcon /> */}
                </InputAdornment>
              ),
            }}/>
            <img src={imgUrl.voiceIcon} className="voiceIcon"></img>
            </Grid>
            <Grid item xs={12} className="d-flex justify-content-center align-items-center gap-10px">
            <TextField label="Last Name" fullWidth variant="outlined" placeholder="Last Name" autoFocus   
              InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {/* <LockIcon /> */}
                </InputAdornment>
              ),
            }}/>
            <img src={imgUrl.voiceIcon} className="voiceIcon"></img>
            </Grid>
            {/* <Grid item xs={12}>
              <TextField label="Age" type="number" fullWidth variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Gender"
                select
                fullWidth
                variant="outlined"
                defaultValue=""
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid> */}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth className="commonButton">
                Next
              </Button>
            </Grid>
          </Grid>
        </Box>
    
    </Box>
    </div>
  );
}
