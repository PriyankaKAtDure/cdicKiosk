import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import imgUrl from "../img/imgurl";
import { ArrowBack, ArrowBackOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import FamilyRestroomOutlinedIcon from "@mui/icons-material/FamilyRestroomOutlined";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import videoFile from '../img/videobg.mp4';

export default function Forms() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastName: "",
    age: "",
    gender: "",
    phoneNumber: "",
  });

  const [currentTab, setCurrentTab] = useState("step1");

  const changeStep = (step) => {
    setCurrentTab(step);
  };

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
      let inputJson = { ...formData, timeIn: "1" };
      inputJson["phoneNumber"] = formData["phoneCode"] + formData["phoneNumber"]
      console.log("Form Data:", inputJson);
      const response = await fetch(
        "https://cdicuat.imonitorplus.com/service/api/filter/createBotRegistration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa("botUser1:Dure@2025"),
          },
          body: JSON.stringify(inputJson),
        }
      );
      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        toast.success(
          `🎉 Congratulations! You have been registered successfully with UIC: ${result.uic}`,
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: "Slide"
          }
        );
        setTimeout(() => {
          navigate("/patient");
        }, 3000);
      } else {
        toast.error("Error submitting form. Please try again.", {
          position: "top-center",
        });
        console.error("Error submitting form");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.", {
        position: "top-center",
      });
      console.error("Error:", error);
    }
  };

  return (
    <div className='position-relative'>
      <div className="patientbg patientMainSection">
        <ToastContainer />
        <Grid container spacing={0} className="patientHeaderSection">
          <Grid item xs={1} className="keyboard-none">
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
          <Grid item xs={10} className="keyboard-none">
            <div className="patientLogo">
              <img src={imgUrl.cdiclogo} className="main-logo"></img>
            </div>
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>

        <Box p={4} className="patientSection">

          <img src={imgUrl.userButtonIcon} className="userButtonIcon"></img>
          <Box mb={4} p={2} border="1px solid #e0e0e0" borderRadius={2} boxShadow={1} className="boxCard">
            {/* <Typography variant="h6" mb={2}>

          </Typography> */}
            {currentTab == "step1" ?
              <Grid container spacing={2}>
                <Grid item xs={12} lg={12} className="d-flex justify-content-center align-items-start flex-direction-column gap-10px">
                  <label>First Name</label>
                  <TextField name="firstname" onChange={e => handleChange(e)} value={formData.firstname} label="" fullWidth variant="outlined" placeholder="Enter First Name" autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* <LockIcon /> */}
                          <AccountCircleOutlinedIcon />
                        </InputAdornment>
                      ),
                    }} />
                  {/* <img src={imgUrl.voiceIcon} className="voiceIcon"></img> */}
                </Grid>
                <Grid item xs={12} lg={12} className="d-flex justify-content-center align-items-center gap-10px">
                  <Button onClick={e => changeStep("step2")} variant="contained" color="primary" fullWidth className="commonButton">
                    Next <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
                  </Button>
                </Grid>
              </Grid> : null}

            {currentTab == "step2" ?
              <Grid container spacing={2}>
                <Grid item xs={12} className="d-flex justify-content-center align-items-start gap-10px flex-direction-column ">
                  <label>Gender</label>
                  <TextField name="gender" select onChange={e => handleChange(e)} value={formData.gender} fullWidth variant="outlined" placeholder="Choose Gender" autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* <LockIcon /> */}
                          <WcOutlinedIcon />
                        </InputAdornment>
                      ),
                    }} >
                    {/* <MenuItem value="1" disabled selected sx={{ color: '#9e9e9e' }}>Choose Gender</MenuItem> */}
                    <MenuItem value="1">Male</MenuItem>
                    <MenuItem value="2">Female</MenuItem>
                    <MenuItem value="3">Other</MenuItem>
                  </TextField>
                  {/* <img src={imgUrl.voiceIcon} className="voiceIcon"></img> */}
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
                <Grid item xs={12} className="d-flex justify-content-center align-items-center gap-10px mt-10px">
                  <Button onClick={e => changeStep("step1")} variant="contained" color="primary" fullWidth className="commonButton backButton">
                    <KeyboardArrowLeftIcon></KeyboardArrowLeftIcon>
                    Back
                  </Button>
                  <Button onClick={e => changeStep("step3")} variant="contained" color="primary" fullWidth className="commonButton">
                    Next <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
                  </Button>
                </Grid>
              </Grid> : null}

            {currentTab == "step3" ?
              <Grid container spacing={2}>
                <Grid item xs={12} className="d-flex justify-content-center align-items-start gap-10px flex-direction-column ">
                  <label>Age</label>
                  <TextField name="age" type="number" onChange={e => handleChange(e)} value={formData.age} label="" fullWidth variant="outlined" placeholder="Enter Age" autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* <LockIcon /> */}
                          <FamilyRestroomOutlinedIcon />
                        </InputAdornment>
                      ),
                    }} />
                  {/* <img src={imgUrl.voiceIcon} className="voiceIcon"></img> */}
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
                <Grid item xs={12} className="d-flex justify-content-center align-items-center gap-10px mt-10px">
                  <Button onClick={e => changeStep("step2")} variant="contained" color="primary" fullWidth className="commonButton backButton">
                    <KeyboardArrowLeftIcon></KeyboardArrowLeftIcon>
                    Back
                  </Button>
                  <Button onClick={e => changeStep("step4")} variant="contained" color="primary" fullWidth className="commonButton">
                    Next <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
                  </Button>
                </Grid>
              </Grid> : null}

            {currentTab == "step4" ?
              <Grid container spacing={2}>

                <Grid container spacing={1} className='mt-10px phoneNumberSection'>
                  <Grid item xs={12}>
                    <label>Phone Number</label>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField name="phoneCode" type="number" onChange={e => handleChange(e)} value={formData.phoneCode} label="" fullWidth variant="outlined" placeholder="Code" autoFocus
                      InputProps={{

                        startAdornment: (
                          <InputAdornment position="start" className="d-none">

                            {/* <LockIcon /> */}
                            {/* <ContactPhoneOutlinedIcon /> */}
                          </InputAdornment>
                        ),
                      }} />
                  </Grid>
                  <Grid item xs={9} lg={9} className="d-flex justify-content-center align-items-center gap-10px">
                    <TextField name="phoneNumber" type="number" onChange={e => handleChange(e)} label="" value={formData.phoneNumber} fullWidth variant="outlined" placeholder="Enter Phone No" autoFocus
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {/* <LockIcon /> */}
                            {/* <ContactPhoneOutlinedIcon /> */}
                          </InputAdornment>
                        ),
                      }} />
                    {/* <img src={imgUrl.voiceIcon} className="voiceIcon"></img> */}
                  </Grid>
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
                <Grid item xs={12} className="d-flex justify-content-center align-items-center gap-10px mt-10px">
                  <Button onClick={e => changeStep("step3")} variant="contained" color="primary" fullWidth className="commonButton backButton">
                    <KeyboardArrowLeftIcon></KeyboardArrowLeftIcon>
                    Back
                  </Button>
                  <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth className="commonButton submitFormButton">
                    Submit <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
                  </Button>
                </Grid>
              </Grid> : null}
          </Box>

        </Box>
      </div>
      <video muted loop id="myVideo" autoPlay>
        <source src={videoFile} type="video/mp4" />
      </video>
    </div>
  );
}
