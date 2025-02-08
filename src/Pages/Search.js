import React from "react";
import { Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { PersonAdd, ArrowBack } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import imgUrl from "../img/imgurl";
import videoFile from '../img/videobg.mp4'
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast, ToastContainer } from "react-toastify";

export default function Search() {
  console.log(localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null)
  const navigate = useNavigate();

  const openQrScanner = async () => {
    let qrSting = null;
    if (window.cordova) {
      // ✅ Use Cordova Barcode Scanner on Mobile
      window.cordova.plugins.barcodeScanner.scan(
        function (result) {
          if (!result.cancelled) {
            // alert("QR Code Scanned: " + result.text);
            qrSting = result.text
            saveQrData(qrSting)
          }
        },
        function (error) {
          // alert("Scanning failed: " + error);
        },
        {
          preferFrontCamera: false, // Use back camera
          showFlipCameraButton: true, // Allow switching cameras
          showTorchButton: true, // Show flashlight option
          torchOn: false, // Start with flashlight off
          saveHistory: false, // Do not save scan history
          prompt: "Place a QR code inside the scan area", // Custom scan prompt
          resultDisplayDuration: 500, // How long to display result
          formats: "QR_CODE", // Only allow QR codes
          orientation: "portrait", // Force portrait mode
          disableAnimations: true, // Disable animations for faster performance
          disableSuccessBeep: false // Beep sound when scan is successful
        }
      );
    } else {
      // ✅ Use `html5-qrcode` in the Browser
      const scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });

      scanner.render(
        (decodedText) => {
          // alert("Scanned (Browser): " + decodedText);
          scanner.clear(); // Stop scanner after a successful scan
          qrSting = decodedText
          saveQrData(decodedText)
        },
        (error) => {
          console.error("QR Scan Error:", error);
        }
      );
    }
  }
  const saveQrData = async (qrSting) => {
    let formData = JSON.parse(localStorage.getItem("userData"))
    let inputJson = {
      "events": [
        {
          "trackedEntityInstance": formData["Instance"],
          "program": "eAHvg6zuxvK",
          "programStage": "wEqTrkK7QGt",
          "enrollment": "",
          "orgUnit": "bu6EEN81YD4",
          "notes": [],
          "dataValues": [
            {
              "dataElement": "K7FD3CigsPD",
              "value": qrSting
            }
          ],
          "status": "COMPLETED",
          "eventDate": new Date().toISOString().split('T')[0]
        }
      ]
    }
    const response = await fetch(
      "https://cdicuat.imonitorplus.com/service/api/events.json",
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
      toast.success('Entry is updated in registry', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      
    }
  }
  return (

    <>
      <div className='position-relative'>
        <ToastContainer />
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
            <Grid container spacing={4} justifyContent="center" className="">
              {/* New Patient Card */}
               <Grid item xs={12} lg={3}></Grid>
              <Grid item xs={6} sm={6} md={6} lg={3} onClick={() => { }} className="cursor-pointer">
                <Card sx={{ bgcolor: "#f8fbff", borderRadius: 2, boxShadow: 2, marginBottom: 2 }}>
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

              <Grid item xs={6} sm={6} md={6} lg={3} onClick={() => { }} className="cursor-pointer">

              <Card sx={{ bgcolor: "#f8fbff", borderRadius: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                      {/* <PersonAdd fontSize="large" color="primary" /> */}
                      <div className="">
                        <Typography variant="h6" fontWeight="bold">
                          Scan <br></br> QR
                        </Typography>
                      </div>
                      <div className="patientSecondDiv">
                        <img src={imgUrl.qrCodeImg} onClick={e => { openQrScanner() }} className="patientImg"></img>
                        <div id="reader"></div>
                      </div>

                    </Box>
                  </CardContent>
                </Card>
                </Grid>
                <Grid item xs={4} lg={3}></Grid>

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
