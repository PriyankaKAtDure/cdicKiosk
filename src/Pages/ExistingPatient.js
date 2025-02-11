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
  AppBar,
  Modal
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import imgUrl from "../img/imgurl";
import { ArrowBack, ArrowBackOutlined } from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Html5QrcodeScanner } from "html5-qrcode";
import QRCode from 'react-qr-code';

function ExistingPatient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    phoneCode: ""
  });

  const [formDataQr, setFormDataQr] = useState({});

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
      const response = await fetch("https://cdicuat.imonitorplus.com/service/api/filter/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + btoa("botUser1" + ":" + "Dure@2025"),
        },
        body: JSON.stringify({
          "phoneNumber": "+" + formData.phoneCode + formData.phoneNumber
        }),
      });
      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        if (result.userList.length > 0) {
          setUserList(result.userList)
          handleClickOpen();
          setFormData({
            phoneCode: "",
            phoneNumber: ""
          })
        } else {
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
            phoneCode: "",
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


  const [openModal, setOpenModal] = React.useState(false);
  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };
  // Scan QR code

  const openQrScanner = async () => {
    let qrSting = null;
    if (window.cordova) {
      // ✅ Use Cordova Barcode Scanner on Mobile
      window.cordova.plugins.barcodeScanner.scan(
        function (result) {
          if (!result.cancelled) {
            // alert("QR Code Scanned: " + result.text);
            qrSting = result.text
            console.log(qrSting)
            getUserListing(qrSting)
          }
        },
        function (error) {
          alert("Scanning failed: " + error);
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
          getUserListing(qrSting)
        },
        (error) => {
          console.error("QR Scan Error:", error);
        }
      );
    }
  }
  const getUserListing = async (qrSting) => {
    if (qrSting) {
      const response = await fetch(
        "https://cdicuat.imonitorplus.com/service/api/trackedEntityInstances/query.json?ou=YUv0ube9634&ouMode=ALL&&order=created:desc&program=eAHvg6zuxvK&attribute=cbUvtO7iToD:LIKE:" + qrSting + "&pageSize=50&page=1&totalPages=false&skipPaging=true",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa("botUser1:Dure@2025"),
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        console.log(convertDHIS2Data(result))
        setFormDataQr(convertDHIS2Data(result)[0])
        handleModalOpen()
      }
    }
  }
  function convertDHIS2Data(data) {
    let result = [];
    let headers = data.headers;
    let rows = data.rows;

    rows.forEach(row => {
      let rowObj = {};
      headers.forEach((header, index) => {
        rowObj[header.column] = row[index] || null; // Assign value or null if empty
      });
      result.push(rowObj);
    });

    return result;
  }
  const getPatientDetails = async (data) => {
    console.log(data, "data")
    const response = await fetch(
      "https://cdicuat.imonitorplus.com/service/api/trackedEntityInstances/query.json?ou=YUv0ube9634&ouMode=ALL&&order=created:desc&program=eAHvg6zuxvK&attribute=Ea27uAHNmEi:LIKE:" + data.patientId + "&pageSize=50&page=1&totalPages=false&skipPaging=true",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("botUser1:Dure@2025"),
        },
      }
    );
    if (response.ok) {
      const result = await response.json();
      console.log("Success:", result);
      console.log(convertDHIS2Data(result))
      setFormDataQr(convertDHIS2Data(result)[0])
      handleModalOpen()
    }

  }
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <div className='position-relative patientMainFormSection'>
      <div className="patientbg patientMainSection existingMainSection">
        {/* back logo div */}
        <ToastContainer />
        <Grid container spacing={0} className="patientHeaderSection">
          <Grid item xs={1} md={1} lg={12}>
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
          <Grid item xs={10} md={10} lg={10}>
            <div className="patientLogo d-desktop-none">
              <img src={imgUrl.cdiclogo} className="main-logo"></img>
            </div>
          </Grid>
          <Grid item xs={1}>
          <div
              className="backButton">
              <Button
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

                <Grid container spacing={2}>
                  <Grid container spacing={1} className='mt-10px phoneNumberSection'>
                    <Grid item xs={3}>
                      <label>Code</label>
                      <TextField name="phoneCode" type="number" onChange={e => handleChange(e)} value={formData.phoneCode} label="" fullWidth variant="outlined" placeholder="Code" autoFocus
                      />
                    </Grid>
                    <Grid item xs={9} lg={9} className="d-flex justify-content-center align-items-start flex-direction-column">
                      <label>Phone Number</label>
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

                  <Grid item xs={12} lg={12} className="d-flex justify-content-center align-items-center flex-direction-column gap-10px">
                    <h5 className='mt-0px mb-0px color-white  '>OR</h5>
                    <div>
                      <img src={imgUrl.qrCode} onClick={e => { openQrScanner() }} className=""></img>
                      <div id="reader"></div>
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
                  slots={Transition}
                  className='dialog-box existingDialog'
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
                        User List
                      </Typography>
                    </Toolbar>
                  </AppBar>
                  {userList.length > 0 ?
                    <List>
                      {userList.map((user, idx) => {
                        return (
                          <>
                            <ListItemButton onClick={e => {
                              getPatientDetails(user)
                              // navigate("/search")
                            }} key={idx}>
                              <ListItemText primary={user.patientName} secondary={user.patientId} />
                            </ListItemButton>
                            <Divider />
                          </>
                        )
                      })}
                    </List>
                    : null}
                </Dialog>


              </Box>

            </Box>
          </Grid>
          <Grid item xs={0} lg={1}></Grid>
        </Grid>
        <Modal open={openModal} onClose={handleModalClose} aria-labelledby="modal-title">
          <Box
            className="modalPatientStatus"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              // boxShadow: 24,
              // p: 3,
              borderRadius: 2,
            }}
          >
            {/* Modal Header */}

            {/* Modal Content */}
            <Box mt={2}>
              <div class="content">
                <div class="card">
                  <div class="d-flex justify-content-end align-items-center">
                    <IconButton onClick={handleModalClose}>
                      <CloseIcon />
                    </IconButton>
                  </div>
                  <div class="firstinfo">

                    <Grid container spacing={0} className='justify-content-center align-items-center'>
                      <Grid items xs={5}>
                        <div className='d-flex justify-content-end align-items-center qrCodeImg'>
                          {formDataQr["QR code_QR code"] ? <QRCode
                            id="qr-gen"
                            value={formDataQr["QR code_QR code"]}
                            size={100}
                            level={"H"}
                            includeMargin={true}
                          //onClick={enlargeImg}
                          /> : <img src={imgUrl.qrCode} className=""></img>}
                        </div>
                        {/* <img src="https://bootdey.com/img/Content/avatar/avatar6.png" /> */}
                      </Grid>
                      <Grid items xs={7}>

                        <div class="profileinfo">

                          <h3>{formDataQr["Patient Name_First Name"]}</h3>
                          <h5>UIC: {formDataQr["Unique ID_Unique ID"]}</h5>
                          <h5>Gender: {formDataQr["Gender"]}</h5>
                          <h5>Age: {formDataQr["Age"]}</h5>
                          <div className='d-flex justify-content-end align-items-center'>
                            <span>
                              <img src={imgUrl.openProfile} className='cursor-pointer' onClick={e => {
                                localStorage.setItem("userData", JSON.stringify(formDataQr))
                                navigate("/search")
                              }}></img>
                            </span>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>

            </Box>
          </Box>
        </Modal>
      </div>

      {/* <video muted loop id="myVideo" autoPlay>
            <source src={videoFile} type="video/mp4"/>
          </video> */}
    </div>
  )
}

export default ExistingPatient
