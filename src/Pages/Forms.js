import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  Modal,
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
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import QRCode from "react-qr-code";

export default function Forms() {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
    navigate("/patient");
  };

  const [generateQrString, setGenerateQrString] = React.useState(false);

  function generateQRCode(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return "dureProg_" + result;
  }

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
      inputJson["qrCode"] = generateQRCode(8);
      setGenerateQrString(inputJson["qrCode"]); 
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
        inputJson['uic'] = result.uic
        setFormData(inputJson)
        handleOpen()
        // toast.success(
        //   `🎉 Congratulations! You have been registered successfully with UIC: ${result.uic}`,
        //   {
        //     position: "top-center",
        //     autoClose: 3000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     theme: "light",
        //     transition: "Slide"
        //   }
        // );
        // setTimeout(() => {
        //   navigate("/patient");
        // }, 3000);
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
    <div className='position-relative patientMainFormSection'>
      <div className="patientbg patientMainSection">
        <ToastContainer />
        <Grid container spacing={0} className="patientHeaderSection">
          <Grid item xs={1} md={1} lg={11} className="keyboard-none">
            <div
              className="backButton keyboard-none">
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)} // Navigate to the previous page
              // sx={{ mb: 2 }}
              >
              </Button>
            </div>
          </Grid>
          <Grid item xs={10} md={10} lg={0} className="d-desktop-none">
            <div className="patientLogo keyboard-none">
              <img src={imgUrl.cdiclogo} className="main-logo"></img>
            </div>
          </Grid>
          <Grid item xs={1} md={1} lg={1}>
          <div
              className="backButton homeButton keyboard-none">
              <Button
                onClick={e => navigate("/patient")}
                startIcon={<img src={imgUrl.homeIcon} />}>
              </Button>
            </div>
          </Grid>
        </Grid>

        <Grid container spacing={2} className="desktop-form-section">
          <Grid item xs={0} lg={1}></Grid>
          <Grid item xs={0} lg={5} className="pl-0px desktop-form-section mobile-form-section pt-0px">
            <div className="patientLogo">
                <img src={imgUrl.cdiclogo} className="main-logo"></img>
              </div>
          </Grid>
           <Grid item xs={12} lg={5} className="desktop-form-section">
            <Box p={4} className="patientSection patientFormMainSection">
         
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
           </Grid>
           <Grid item xs={0} lg={1}></Grid>
        </Grid>
       
       
      </div>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <Box
        className="modalPatientStatus"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            // boxShadow: 24,
            p: 3,
            borderRadius: 2,
          }}
        >
          {/* Modal Header */}

          {/* Modal Content */}
          <Box mt={2}>
            <div class="content">
              <div class="card">
                <div class="d-flex justify-content-end align-items-center">
                  <IconButton onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </div>
                <div class="firstinfo">
                 <Grid container spacing={0} className='justify-content-center align-items-center'>
                  <Grid items xs={5}>
                  <div className='d-flex justify-content-end align-items-center qrCodeImg'>
                  <QRCode
                    id="qr-gen"
                    value={generateQrString}
                    size={100}
                    level={"H"}
                    includeMargin={true}
                  //onClick={enlargeImg}
                  />
                  </div>
                  </Grid>
                   <Grid items xs={7}>
                   <div class="profileinfo">

                        <h3>{formData["firstname"]}</h3>
                        <h5>UIC: {formData["uic"]}</h5>
                        <h5>Gender: {formData["gender"] == "1" ? "Male" : (formData["gender"] == "2" ? "Female": "Others" )}</h5>
                        <h5>Age: {formData["age"]}</h5>
                    </div>
                   </Grid>
                 </Grid>
                  
                  {/* <img src="https://bootdey.com/img/Content/avatar/avatar6.png" /> */}

                </div>
              </div>
            </div>

          </Box>
        </Box>
      </Modal>
    </div>
  );
}
