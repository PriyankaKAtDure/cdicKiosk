import React, { useState } from "react";
import { Box, Typography, Grid, TextField, Button, MenuItem, InputAdornment, } from "@mui/material";
import imgUrl from "./img/imgurl";
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { ArrowBack, ArrowBackOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Forms() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastName: "",
    age: "",
    gender: "",
    phoneNumber:""
  });

  const [currentTab, setCurrentTab] = useState("step1");

  const changeStep = (step) => {
    setCurrentTab(step);
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log("Form Data:", formData);
      let inputJson = formData;
      inputJson.timeIn ="1"
      // Example API call
      const response = await fetch("https://cdicuat.imonitorplus.com/service/api/filter/createBotRegistration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + btoa("botUser1" + ":" + "Dure@2025"),
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        toast.success('🎉 Congratulations! You have been registered successfully with UIC : '+ response.uic, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
          setTimeout(() => {
            navigate("/patient"); // Navigate to the next page
          }, 1000);
      } else {
        console.error("Error submitting form");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="patientbg patientMainSection">
      <div
        className="backButton">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)} // Navigate to the previous page
        // sx={{ mb: 2 }}
        >
        </Button>
      </div>
      <div className="patientLogo">
        <img src={imgUrl.cdiclogo} className="main-logo" style={{ paddingTop: "17px" }}></img>
      </div>
      <Box p={4} className="patientbg">



        <Box mb={4} p={2} border="1px solid #e0e0e0" borderRadius={2} boxShadow={1} className="boxCard">
          <Typography variant="h6" mb={2}>

          </Typography>
          {currentTab == "step1" ?
            <Grid container spacing={2}>
              <Grid item xs={12} className="d-flex justify-content-center align-items-center gap-10px">
                <TextField name="firstname" onChange={e => handleChange(e)} value={formData.firstname} label="First Name" fullWidth variant="outlined" placeholder="First Name" autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {/* <LockIcon /> */}
                      </InputAdornment>
                    ),
                  }} />
                <img src={imgUrl.voiceIcon} className="voiceIcon"></img>
              </Grid>
              <Grid item xs={12} className="d-flex justify-content-center align-items-center gap-10px">
                <TextField name="lastName" value={formData.lastName} onChange={e => handleChange(e)} label="Last Name" fullWidth variant="outlined" placeholder="Last Name" autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {/* <LockIcon /> */}
                      </InputAdornment>
                    ),
                  }} />
                <img src={imgUrl.voiceIcon} className="voiceIcon"></img>
              </Grid>
              <Grid item xs={12} className="d-flex justify-content-center align-items-center ">
                <Button onClick={e => changeStep("step2")} variant="contained" color="primary" fullWidth className="commonButton">
                  Next <ArrowForwardOutlinedIcon></ArrowForwardOutlinedIcon>
                </Button>
              </Grid>
            </Grid> : null}

          {currentTab == "step2" ?
          <Grid container spacing={2}>
            <Grid item xs={12} className="d-flex justify-content-center align-items-center gap-10px">
                <TextField name="gender" select onChange={e => handleChange(e)} value={formData.gender} label="Gender" fullWidth variant="outlined" placeholder="Gender" autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {/* <LockIcon /> */}
                      </InputAdornment>
                    ),
                  }} >
                    <MenuItem value="1">Male</MenuItem>
                    <MenuItem value="2">Female</MenuItem>
                    <MenuItem value="3">Other</MenuItem>
                    </TextField>
                <img src={imgUrl.voiceIcon} className="voiceIcon"></img>
              </Grid>
            <Grid item xs={12} className="d-flex justify-content-center align-items-center gap-10px">
              <TextField name="age" type="number" onChange={e => handleChange(e)} value={formData.age} label="Age" fullWidth variant="outlined" placeholder="Age" autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {/* <LockIcon /> */}
                    </InputAdornment>
                  ),
                }} />
              <img src={imgUrl.voiceIcon} className="voiceIcon"></img>
            </Grid>
            {/* 
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
            <Grid item xs={12} className="d-flex justify-content-center align-items-center ">
            <Button onClick={e => changeStep("step1")} variant="contained" color="primary" fullWidth className="commonButton">
              <ArrowBackOutlined></ArrowBackOutlined>
                Back 
              </Button>
              <Button onClick={e => changeStep("step3")} variant="contained" color="primary" fullWidth className="commonButton">
                Next <ArrowForwardOutlinedIcon></ArrowForwardOutlinedIcon>
              </Button>
            </Grid>
          </Grid> : null}

          {currentTab == "step3" ?
            <Grid container spacing={2}>
              <Grid item xs={12} className="d-flex justify-content-center align-items-center gap-10px">
                <TextField name="phoneNumber" type="number" onChange={e => handleChange(e)} value={formData.phoneNumber} label="Phone Number" fullWidth variant="outlined" placeholder="Phone Number" autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {/* <LockIcon /> */}
                      </InputAdornment>
                    ),
                  }} />
                <img src={imgUrl.voiceIcon} className="voiceIcon"></img>
              </Grid>
              {/* 
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
              <Grid item xs={12} className="d-flex justify-content-center align-items-center ">
              <Button onClick={e => changeStep("step2")} variant="contained" color="primary" fullWidth className="commonButton">
                <ArrowBackOutlined></ArrowBackOutlined>
                  Back 
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth className="commonButton">
                  Subimt <ArrowForwardOutlinedIcon></ArrowForwardOutlinedIcon>
                </Button>
              </Grid>
            </Grid> : null}
        </Box>

      </Box>
    </div>
  );
}
