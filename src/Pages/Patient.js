import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, Slide, AppBar, Toolbar, IconButton, Modal } from "@mui/material";
import { PersonAdd, Person, ArrowBack } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import imgUrl from "../img/imgurl";
import videoFile from '../img/videobg.mp4'
import CloseIcon from '@mui/icons-material/Close';
import { toast, ToastContainer } from "react-toastify";
import QRCode from "react-qr-code";

export default function Patient() {

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  // Code for Text-to-Speack

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);

  // Modal variable

  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false)
    handleClose()
  };

  const [formData, setFormData] = useState({
    firstname: "",
    lastName: "Bot User",
    age: "",
    gender: "",
    phoneNumber: "",
  });


  const existingQuestions = [
    "What is your name?",
    "What is your gender? Male , Female , Other",
    "What is your Age?",
    "What is your Phonenumber?"
  ];

  const [text, setText] = useState("Hello, Please select your patient type , New or Exisiting");
  const [isReady, setIsReady] = useState(false);

  const voiceTTS = (text, action) => {
    if (window.TTS) {
      window.TTS.speak(
        {
          text: text,
          locale: "en-US",
          rate: 1,
        },
        () => {
          console.log("Speech successful")
          if (action == 'close') {
            handleClose()
          }
        },
        (error) => {
          setIsSpeaking(false);
          console.error("Speech failed:", error)
        }
      );
    } else {
      alert("TTS plugin is not available! Make sure you're running this on a real device.");
    }
  };

  const startTTS = (text, questionIdx) => {
    setIsListening(false)
    setIsSpeaking(true)
    console.log(text, "InsideFunction")
    if (window.TTS) {
      window.TTS.speak(
        {
          text: text,
          locale: "en-US",
          rate: 1,
        },
        () => {
          console.log("Speech successful")
          setIsSpeaking(false);
          if (questionIdx != null)
            startListening(questionIdx);
          else {
            registerVoiceFlow()
          }
        },
        (error) => {
          setIsSpeaking(false);
          console.error("Speech failed:", error)
        }
      );
    } else {
      alert("TTS plugin is not available! Make sure you're running this on a real device.");
    }
  };

  const registerVoiceFlow = async () => {
    try {
      console.log("Form Data:", formData);
      let inputJson = { ...formData, timeIn: "1" };
      inputJson["phoneNumber"] = "91" + formData["phoneNumber"]
      inputJson["qrCode"] = generateQRCode(8);
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
        inputJson.uic = result.uic;
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
        //   // handleClose()
        //   voiceTTS("Thank you for your response,you're registered successfully, the voice flow is closing", "close")
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

  const [recognizedText, setRecognizedText] = useState([]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setResponses([])
    setQuestionIndex(0)
    setOpen(true);
  };

  const handleClose = () => {
    setFormData({
      firstname: "",
      lastName: "Bot User",
      age: "",
      gender: "",
      phoneNumber: "",
    })
    setResponses([])
    setOpen(false);
  };


  const MAX_RETRIES = 3;
  let retryCount = 0;
  const startListening = (questionIdx) => {
    if (window.cordova) {
      setIsListening(true)
      setIsSpeaking(false)
      window.plugins.speechRecognition.requestPermission(
        () => {
          const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          const speechRecognizer = new recognition();

          speechRecognizer.continuous = false;
          speechRecognizer.interimResults = false;
          speechRecognizer.lang = "en-US";

          let receivedResponse = false;

          // setTimeout(() => {
          //   if (!receivedResponse) {
          //     console.log("🕒 No response detected, asking again...");
          //     startTTS(existingQuestions[questionIndex]); // Repeat the question
          //   }
          // }, 10000);

          // speechRecognizer.onstart = () => console.log("🎤 Listening...");
          speechRecognizer.onstart = () => {
            console.log("🎤 Listening...");

            // Set a timeout for 5 seconds to check if no response is received
            let timer = 5000
            if (questionIdx == 3)
              timer = 10000

            setTimeout(() => {
              if (!receivedResponse) {
                console.log("🕒 No response detected, asking again...");
                if (retryCount < MAX_RETRIES) {
                  retryCount++; // Increment retry count
                  console.log(`🕒 No response detected, retrying... (${retryCount}/${MAX_RETRIES})`);
                  validateNoResponse(questionIdx);
                } else {
                  console.log("❌ Max retries reached. Moving on.");
                  ValidateInput("exit", null)
                  receivedResponse = true
                  retryCount = 0; // Reset retry count for the next question
                }
                // setTimeout(() => startListening(questionIdx), 2000); // Restart listening after 2 seconds
              }
            }, timer); // 5-second timeout
          };
          speechRecognizer.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            console.log("📝 Recognized text:", speechResult);
            ValidateInput(speechResult, questionIdx)
            // setRecognizedText((prev) => [...prev, speechResult] );
            receivedResponse = true;
            retryCount = 0
            // setResponses((prev) => [...prev, speechResult]);
            setIsListening(false);

            // if (questionIndex < existingQuestions.length - 1) {
            //   setTimeout(() => {
            //     setQuestionIndex((prevIndex) => prevIndex + 1);
            //     startTTS(existingQuestions[questionIndex + 1]); // Move to next question
            //     console.log(questionIndex,"questionIndex")
            //   }, 1000);
            // } else {
            //   console.log("✅ All questions answered:", responses);
            // }
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

  const validateNoResponse = (questionIdx) => {
    switch (questionIdx) {
      case 0:
        if (formData["firstname"] == "")
          startTTS("No response recorded, Please enter your name", questionIdx)
        break;
      case 1:
        if (formData["gender"] == "")
          startTTS("No response recorded, Please select your gender, Male , Female , Other", questionIdx)
        break;
      case 2:
        if (formData["age"] == "")
          startTTS("No response recorded, Please enter Age", questionIdx)
        break;
      case 3:
        if (formData["phoneNumber"] == "")
          startTTS("No response recorded, Please enter Phonenumber", questionIdx)
        break;
      default:
        break;
    }
  }
  const ValidateInput = (response, questionIdx) => {
    let tempholder = formData
    let test = ""
    test = response;
    if (test.toLowerCase().includes("exit")) {
      voiceTTS("Thank you for your response, the voice flow is closing", "close")
      return
    }
    if (questionIdx == 0) {
      if (response) {
        console.log(response, "response for first question")
        tempholder["firstname"] = response
        setFormData(tempholder)
        // setFormData((prevData) => ({ ...prevData, ["firstname"]: response }));
        setResponses((prev) => [...prev, response]);
        startTTS("What is your gender? Male , Female , Other", 1)
      }
    }
    if (questionIdx == 1) {
      console.log(response, "response for second question")
      if (test.toLowerCase().includes("male"))
        tempholder['gender'] = "1";
      // setFormData((prevData) => ({ ...prevData, ["gender"]: "1", }));
      else if (test.toLowerCase().includes("female"))
        tempholder['gender'] = "2";
      // setFormData((prevData) => ({ ...prevData, ["gender"]: "2", }));
      else if (test.toLowerCase().includes("other"))
        tempholder['gender'] = "3";
      // setFormData((prevData) => ({ ...prevData, ["gender"]: "3", }));
      else {
        startTTS("Invalid option selected, please select from Male , Female or Other", 1)
        return
      }
      setFormData(tempholder)
      setResponses((prev) => [...prev, response]);
      startTTS("What is your Age?", 2)
    }
    if (questionIdx == 2) {
      console.log(response, "response for third question")
      if (getNumberFromString(response))
        tempholder['age'] = getNumberFromString(response)
      // setFormData((prevData) => ({ ...prevData, ["age"]: getNumberFromString(response) }));
      else {
        startTTS("Invalid entry, Please enter your age", 2)
        return
      }
      setFormData(tempholder)
      setResponses((prev) => [...prev, response]);
      startTTS("What is your Phonenumber?", 3)
    }
    if (questionIdx == 3) {
      let number = sanitizeNumber(response)
      if (getNumberLength(number) == 10) {
        tempholder["phoneNumber"] = getNumberFromString(number)
        // setFormData((prevData) => ({ ...prevData, ["phoneNumber"]: getNumberFromString(number) }));
        setFormData(tempholder)
        setResponses((prev) => [...prev, number]);
        startTTS("Thank You, you will be registered with the provided details", null)
      }
      else if (getNumberLength(number) < 10)
        startTTS("Invalid phone number, Please enter phone number", 3)
      console.log(number, "response for fourth question")
    }
  }

  const sanitizeNumber = (str) => {
    return str.replace(/\D/g, ''); // Remove all non-digit characters
  };

  const getNumberFromString = (str) => {
    const match = str.match(/\d+/); // Finds first number
    return match ? Number(match[0]) : null;
  };

  const getNumberLength = (str) => {
    const match = str.match(/\d+/); // Extract first number
    return match ? match[0].length : 0;
  };

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
  return (

    <>
      <div className='position-relative'>
        <div className="patientbg patientMainSection patientPage mainPatientLanding">
          <ToastContainer />
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
            <img src={imgUrl.botIcon}></img>
            <img src={imgUrl.voiceAudioIcon} onClick={e => {
              voiceTTS("The voice flow is starting", "null")
              setTimeout(() => {
                startTTS(existingQuestions[0], 0)
              }, 2000);
              // startTTS("Hello, Please select your patient type , New or Exisiting")
              handleClickOpen()
            }} className="" />
          </div>
        </div>
        {/* <video muted loop id="myVideo" autoPlay>
          <source src={videoFile} type="video/mp4" />
        </video> */}
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          slots={Transition}
          className='dialog-box voice-dialog-box'
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar className='existingPatientList'>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Voice Flow
              </Typography>
            </Toolbar>
          </AppBar>
          <div className="voiceChatListen">
            {/* <button onClick={e => { setIsListening(!isListening); setIsSpeaking(!isSpeaking) }}>new</button> */}

            <div className={`fade ${isListening ? "fade-in" : "fade-out"} d-flex justify-content-center align-items-center`}>
              {isListening && <div className="d-flex flex-column justify-content-center">
                <p>Start Speaking</p>
                <img src={imgUrl.voiceLoaderGif} className="loaderVoice" alt="Listening..." />
              </div>}
            </div>

            <div className={`fade ${isSpeaking ? "fade-in" : "fade-out"}`}>
              {isSpeaking && <img src={imgUrl.voiceIcon} alt="Speaking..." />}
            </div>



            {/* <div>
              <p>
                Let's Start!
              </p>
              <p>
                <ul>
                  {responses.map((response, index) => (
                    <li key={index}>
                      <strong>Q:</strong> {existingQuestions[index]} <br />
                      <strong>A:</strong> {response}
                    </li>
                  ))}
                </ul>
              </p>
            </div> */}
          </div>
          <div className="voiceChatDialog">
          </div>
          {/* <video muted loop id="myVideo"  style={{ zIndex: 1 }} autoPlay>
            <source src={videoFile} type="video/mp4" />
          </video> */}

          <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="modal-title">
            <Box
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
                      <IconButton onClick={handleCloseModal}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                    <div class="firstinfo">
                      <QRCode
                        id="qr-gen"
                        value={"dureProg_ggUeSw7r"}
                        size={100}
                        level={"H"}
                        includeMargin={true}
                      //onClick={enlargeImg}
                      />
                      {/* <img src="https://bootdey.com/img/Content/avatar/avatar6.png" /> */}
                      <div class="profileinfo">

                        <h3>{formData["firstname"]}</h3>
                        <h5>UIC: {formData["uic"]}</h5>
                        <h5>Gender: {formData["gender"]}</h5>
                        <h5>Age: {formData["age"]}</h5>
                      </div>
                    </div>
                  </div>
                </div>

              </Box>
            </Box>
          </Modal>

        </Dialog>
      </div>

    </>
  );
}
