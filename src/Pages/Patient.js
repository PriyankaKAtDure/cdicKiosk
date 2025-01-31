import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, Slide, AppBar, Toolbar, IconButton } from "@mui/material";
import { PersonAdd, Person, ArrowBack } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import imgUrl from "../img/imgurl";
import videoFile from '../img/videobg.mp4'
import CloseIcon from '@mui/icons-material/Close';

export default function Patient() {

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  // Code for Text-to-Speack
  const [text, setText] = useState("Hello, Please select your patient type , New or Exisiting");
  const [isReady, setIsReady] = useState(false);

  const speakText = () => {
    console.log("InsideFunction")
    if (window.TTS) {
      window.TTS.speak(
        {
          text: text,
          locale: "en-US",
          rate: 1.0,
        },
        () => {
          console.log("Speech successful")
          startListening();
        },
        (error) => console.error("Speech failed:", error)
      );
    } else {
      alert("TTS plugin is not available! Make sure you're running this on a real device.");
    }
  };


  const [recognizedText, setRecognizedText] = useState([]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const startListening = () => {
    if (window.cordova) {
      window.plugins.speechRecognition.requestPermission(
        () => {
          const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          const speechRecognizer = new recognition();

          speechRecognizer.continuous = false;
          speechRecognizer.interimResults = false;
          speechRecognizer.lang = "en-US";

          speechRecognizer.onstart = () => console.log("🎤 Listening...");
          speechRecognizer.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            console.log("📝 Recognized text:", speechResult);
            setRecognizedText((prev) => [...prev, speechResult]);
          };

          speechRecognizer.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
          };

          speechRecognizer.start();
        },
        (err) => console.error("🚨 Permission denied!", err)
      );
    }
  };

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
            <img src={imgUrl.voiceAudioIcon} onClick={e => {
              speakText()
              handleClickOpen()
            }} className="" />
          </div>
        </div>
        <video muted loop id="myVideo" autoPlay>
          <source src={videoFile} type="video/mp4" />
        </video>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          slots={Transition}
          className='dialog-box'
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar className='existingPatientList'>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Voice Flow
              </Typography>
            </Toolbar>
          </AppBar>
          <video muted loop id="myVideo" autoPlay style={{zIndex:1}}>
            <source src={videoFile} type="video/mp4"/>
          </video>

        </Dialog>
      </div>

    </>
  );
}
