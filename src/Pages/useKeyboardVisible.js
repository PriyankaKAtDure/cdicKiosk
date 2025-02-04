import { useEffect, useState } from "react";

const useKeyboardVisible = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (window.cordova) {
      const initialHeight = window.innerHeight;

      const handleResize = () => {
        const currentHeight = window.innerHeight;
        if (currentHeight < initialHeight){
          document.body.classList.add("keyboard-open");
          // alert("Open")
        }else{
          document.body.classList.remove("keyboard-open");
        }
        setIsKeyboardVisible(currentHeight < initialHeight);
        
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);
}

export default useKeyboardVisible;
