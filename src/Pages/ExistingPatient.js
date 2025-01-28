import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  Dialog,
  Slide,
  ListItemButton,
  List,
  Divider,
  ListItemText,
  Toolbar,
  AppBar
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import imgUrl from "../img/imgurl";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { ArrowBack, ArrowBackOutlined } from "@mui/icons-material";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function ExistingPatient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: ""
  });
  const [userList, setUserList] = useState([]);
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
      formData.phoneNumber = "+" + formData.phoneNumber;
      const response = await fetch("https://cdicuat.imonitorplus.com/service/api/filter/getUser", {
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
        if(result.userList.length > 0){
          setUserList(result.userList)
          handleClickOpen();
        }else{
          toast.info('No record found', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
            setFormData({
              phoneNumber: ""
            })
        }

      }
    } catch (error) {

    }
  }
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (

    <div className="patientbg patientMainSection">
      {/* back logo div */}
      <ToastContainer />
      <Grid container spacing={0}>
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
            <Grid container spacing={0} className='mt-10px phoneNumberSection'>
              <Grid item xs={3}>
              <TextField name="phoneCode" type="number" label="Code" fullWidth variant="outlined" placeholder="" autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {/* <LockIcon /> */}
                      {/* <ContactPhoneOutlinedIcon /> */}
                    </InputAdornment>
                  ),
                }} />
              </Grid>
                <Grid item xs={9} lg={9} className="d-flex justify-content-center align-items-center gap-10px">
              <TextField name="phoneNumber" type="number" onChange={e => handleChange(e)} label="Phone Number" value={formData.phoneNumber} fullWidth variant="outlined" placeholder="Enter Phone No" autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {/* <LockIcon /> */}
                      {/* <ContactPhoneOutlinedIcon /> */}
                    </InputAdornment>
                  ),
                }} />
              <img src={imgUrl.voiceIcon} className="voiceIcon"></img>
                </Grid>
            </Grid>
           
            <Grid item xs={12} lg={12} className="d-flex justify-content-center align-items-center flex-direction-column gap-10px">
              <h5 className='mt-0px mb-0px'>OR</h5>
              <div>
                <img src={imgUrl.qrCode} className=""></img>
              </div>
            </Grid>
            <Grid item xs={12} lg={12} className="d-flex justify-content-center align-items-center gap-10px">
              <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth className="commonButton">
                Search <SearchIcon></SearchIcon>
              </Button>
            </Grid>
          </Grid>

          <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
          >
            <AppBar sx={{ position: 'relative' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                  User List
                </Typography>
              </Toolbar>
            </AppBar>
            
            <List>
              <ListItemButton>
                <ListItemText primary="Phone ringtone" secondary="Titania" />
              </ListItemButton>
              <Divider />
              <ListItemButton>
              </ListItemButton>
            </List>
          </Dialog>
        </Box>

      </Box>
    </div>

  )
}

export default ExistingPatient
