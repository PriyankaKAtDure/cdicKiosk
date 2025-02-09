import React, { useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Button, Modal, IconButton } from "@mui/material";
import { PersonAdd, ArrowBack } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import imgUrl from "../img/imgurl";
import videoFile from '../img/videobg.mp4'
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast, ToastContainer } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';
import { CardHeader, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import _ from "underscore";
import metadata from "./metdaData.json"

export default function Search() {
  console.log(metadata, localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null)

  const [formData, setFormData] = useState(localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null);

  const [eventData, setEventData] = useState({});

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
  const [openModal, setOpenModal] = React.useState(false);
  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const getStageDetails = async () => {
    // https://cdicuat.imonitorplus.com/service/api/trackedEntityInstances/UcU4nLV3cUp.json?program=eAHvg6zuxvK&fields=*?
    const response = await fetch(
      "https://cdicuat.imonitorplus.com/service/api/trackedEntityInstances/" + formData["Instance"] + ".json?program=eAHvg6zuxvK&fields=*?",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("botUser1:Dure@2025"),
        },
      }
    )
    if (response.ok) {
      const result = await response.json();
      console.log("Success:", result);
      console.log(GroupEventstage(result.enrollments[0]?.events))
      setEventData(GroupEventstage(result.enrollments[0]?.events))
      handleModalOpen()
    }
  }
  const GroupEventstage = (arrayData) => {
    let GroupArrData, arrayDataSort;

    if (arrayData && arrayData.length > 0) {
      // Sorting by lastUpdated date
      arrayDataSort = _.sortBy(arrayData, [function (o) { return o.lastUpdated; }]).reverse();

      // Grouping by programStage
      GroupArrData = arrayDataSort.reduce(function (r, a) {
        r[a.programStage] = r[a.programStage] || [];
        r[a.programStage].push(a);
        return r;
      }, Object.create(null));
    } else {
      GroupArrData = [];
    }

    return GroupArrData;
  };
  const renderStages = (stage,stageObject,index) => {
    console.log( index,"stage")
    return (
      <Accordion defaultExpanded={index === 0} style={{overflow:"auto"}}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="span">{stage.created}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* <Typography variant="h6" gutterBottom>Outcome</Typography> */}
          <Grid container spacing={2}>
            {
              stage.dataValues.map(value => {
                
                return(
                  <Grid item xs={12}>
                    <Typography>{ _.find(stageObject.programStageDataElements, (item) => item.dataElement.id === value.dataElement).dataElement.displayName}:{value.value}</Typography>
                  </Grid>
                )
              })
            }
          </Grid>
        </AccordionDetails>
      </Accordion>
    )
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
                        <img onClick={e => getStageDetails()} src={imgUrl.generateReport} className="patientImg"></img>
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
          <Modal open={openModal} onClose={handleModalClose} aria-labelledby="modal-title">
            <Box
              className="modalPatientStatus modalPatientSummary"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 1000, // Fixed width
                height: 500, // Fixed height
                // overflowY: "auto", 
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 3,
                borderRadius: 2,
              }}
            >
              {/* Modal Header */}

              {/* Modal Content */}
              <Box>
                <div class="content summarydiv">
                  <div class="">
                    {/* <div class="d-flex justify-content-end align-items-center">
                      <IconButton onClick={handleModalClose}>
                        <CloseIcon />
                      </IconButton>
                    </div> */}
                    <div className="p-4 bg-gray-100 rounded-lg">
                      {/* Header */}
                      <div className="d-flex justify-content-space mb-4">
                        <h3 className="p-0 text-xl font-semibold">PATIENT SUMMARY</h3>
                        {/* <div className="space-x-2">
                          <Button >Download Prescription</Button>
                          <Button >Download Summary</Button>
                        </div> */}
                        <IconButton onClick={handleModalClose}>
                          <CloseIcon />
                        </IconButton>
                      </div>

                      {/* Patient Details */}
                      <Grid container spacing={1} className=''>
                        <Grid items xs={12} sm={4} md={4} lg={4} className="patientLeftSummary">
                          <Card className="bg-transparent patientRegisterDetails" >
                            <CardContent>
                              <Typography variant="h6" gutterBottom>Registration Details</Typography>
                              <Typography><strong>First Name : </strong>{formData['Patient Name_First Name']} </Typography>
                              <Typography><strong>Gender : </strong> {formData['Gender']}</Typography>
                              <Typography><strong>Age : </strong> {formData['Age']}</Typography>
                              <Typography><strong>Unique ID : </strong> {formData['Unique ID_Unique ID']}</Typography>
                            </CardContent>
                          </Card>

                        </Grid>
                        {/* <Grid items xs={0.5}></Grid> */}
                        <Grid items xs={12} sm={8} md={8} lg={8} className="patientRightSummary" sx={{ overflowY: "auto", maxHeight: 390 }}>
                          <Card sx={{boxShadow: "none"}}>
                            {
                              Object.keys(eventData).length > 0 ? <>
                                {
                                  Object.keys(eventData).map((event,idx) => {
                                    let stageObjet = _.find(metadata.programStages, { "id": event })
                                    console.log(stageObjet, "stageObjet new")
                                    return (
                                      <>
                                      <div className="patientSummarySubSection">
                                        <CardHeader style={{padding:"5px"}} title={stageObjet.name} />
                                        {
                                          renderStages(_.sortBy(eventData[event], "lastUpdated")[0],stageObjet,idx)
                                          // eventData.event.dataValues
                                        }
                                        </div>
                                      </>
                                    )
                                  })
                                }
                              </> : "No data"
                            }
                          </Card>
                        </Grid>
                      </Grid>
                      {/* Outcome Section */}
                    </div>
                  </div>
                </div>

              </Box>
            </Box>
          </Modal>
        </div>
        {/* <video muted loop id="myVideo" autoPlay>
                <source src={videoFile} type="video/mp4" />
              </video> */}
      </div>
    </>
  );
}
