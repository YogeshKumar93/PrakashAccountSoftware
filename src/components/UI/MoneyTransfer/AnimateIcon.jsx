import { useLottie } from "lottie-react";
import scanFailed from "../assets/animate-icons/fingerprint_scan.json";

// https://assets5.lottiefiles.com/datafiles/zc3XRzudyWE36ZBJr7PIkkqq0PFIrIBgp4ojqShI/newAnimation.json
const AnimateIcon = ({ src = scanFailed, width, height }) => {
  const options = {
    animationData: src,
    loop: true,
    autoplay: true,
    style: {
      width: width ? width : "100px",
      height: height ? height : "100px",
    },
  };
  const { View } = useLottie(options);

  return View;
  // return (
  //   <>
  //     {mySrc}
  //     {/* <lottie-player
  //       src={mySrc}
  //       background="transparent"
  //       speed="1"
  //       style={{
  //         width: width,
  //         height: height,
  //         margin: "0 auto",
  //       }}
  //       loop
  //       autoplay
  //     ></lottie-player> */}
  //     <LottiePlayer
  //       animationData={mySrc} />
  //   </>
  // );
};

export default AnimateIcon;
