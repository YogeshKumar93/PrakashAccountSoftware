// convert B64 image to file
//
export const urltoFile = (url, filename, fileType) => {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: fileType });
    });
};

//   show the crop image function
export const getCroppedImg = async (image, crop, setResult, fileType) => {
  try {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // image,
    // 0,
    // 0,
    // image.naturalWidth,
    // image.naturalHeight,
    // 0,
    // 0,
    // image.naturalWidth,
    // image.naturalHeight,

    const base64Image = canvas.toDataURL(fileType && fileType.type, 1);
    setResult(base64Image);
  } catch (e) {
    console.log("crop the image");
  }
};

// functions to convert image to base64

export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};
