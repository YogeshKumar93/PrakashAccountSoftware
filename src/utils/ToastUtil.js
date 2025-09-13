import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const Toast = Swal.mixin({
  // toast: true,
  // position: "top",
  showConfirmButton: true,
  // timer: 7000,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
  width: "max-content",
  // background: "#4caf50",
  background: "#fefefe",
  color: "#169816",
  iconColor: "#2fa92f",
  showCloseButton: true,
  allowEscapeKey: true,
  allowEnterKey: true,
});

const ToastSm = Swal.mixin({
  showClass: {
    backdrop: "swal12-noanimation",
    popup: "",
    icon: "",
  },
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
  width: "max-content",
  background: "#fefefe",
});

export const ErrorToast = Swal.mixin({
  // toast: true,
  // position: "top",
  showConfirmButton: true,
  // timer: 10000,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
  width: "max-content",
  background: "#fff",
  color: "#000",
  iconColor: "#dc5f5f",
  showCloseButton: true,
  allowEscapeKey: true,
  allowEnterKey: true,
  keydownListenerCapture: true,
  returnFocus: false,
});
const ToastAlt = Swal.mixin({
  showConfirmButton: true,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
  width: "max-content",
  background: "#e6f7ff", // slightly different from #fefefe
  color: "#0a6ebd",      // slightly different from green
  iconColor: "#0288d1",  // slightly different from green
  showCloseButton: true,
  allowEscapeKey: true,
  allowEnterKey: true,
});
export const MySwalAlt = withReactContent(ToastAlt);

//
const ConfirmSwal = (apiCallFunc, res) => {
  Swal.fire({
    title: "Are you sure you want to add this below Account",
    // text: "",
    html: res,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirm",
    allowEscapeKey: false,
    allowEnterKey: true,
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      apiCallFunc();
    }
  });
};
const confirmSettlement = (apiCallFunc, res) => {
  Swal.fire({
    title: "Are you sure you want to add this settlement Account",
    // text: "",
    html: res,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirm",
    allowEscapeKey: false,
    allowEnterKey: true,
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      apiCallFunc(res);
    }
  });
};

export const confirmButtonSwal = (apiCallFunc, res) => {
  ConfirmSwal(apiCallFunc, res);
};
export const confirmButtonSwalSettlement = (apiCallFunc, res) => {
  confirmSettlement(apiCallFunc, res);
};

export const NormalToast = Swal.mixin({
  confirmButtonColor: "#3578EA",
});
export const MySwal = withReactContent(Toast);
export const ErrorSwal = withReactContent(ErrorToast);

// small error toast
export const errorNotiToast = Swal.mixin({
  toast: true,
  position: "top-end",
  width: "26em", 
  iconHtml: "⚠️",  
  iconColor: "#FFEB3B",
  background: "#F0F8FF",
  // color: "#72A0C1", 
  confirmButtonText: "View", 
  showConfirmButton: true, 
  showCancelButton: true,  
  cancelButtonText: "Dismiss", 
  allowOutsideClick: false,  
  allowEscapeKey: false, 
  allowEnterKey: false, 
  
  // Custom classes for styling
  customClass: {
    icon: "custom-toast-icon",
    title: "custom-toast-title",
    content: "custom-toast-content", 
    confirmButton: "custom-toast-button",
    cancelButton: "custom-toast-cancel-button", 
  },

  // didOpen: (toast) => {
  //   toast.addEventListener("mouseenter", Swal.stopTimer); 
  //   toast.addEventListener("mouseleave", Swal.resumeTimer); 
  //   toast.classList.add('fade-in');
  // },
});


// type = 'success' | 'error' | 'warning' | 'info' | 'question'
export const okToast = (title, msg, type) => {
  MySwal.fire(title, msg, type);
};

export const okErrorToast = (title, msg) => {
  try {
    document.activeElement.blur();
  } catch (e) {}
  // ErrorToast.fire(title, msg, "error");
  setTimeout(() => {
    ErrorSwal.fire({
      title: title,
      text: msg ? msg : "Error can't be identified",
      icon: "error", // 'success' | 'error' | 'warning' | 'info' | 'question'
      showCancelButton: false,
      confirmButtonText: "OK",
      showConfirmButton: true,
      keydownListenerCapture: true,
      focusConfirm: true,
      inputAutoFocus: true,
      // preConfirm: () => {},
      // allowOutsideClick: () => !Swal.isLoading(),
      // backdrop: true,
    });
  }, 200);
};

export const apiErrorToast = (error, history) => {
  var msg;
  var status =
    error && error.response && error.response.status && error.response.status;
  if (error) {
    if (error.data) {
      error.response = error;
    }
    if (error.response) {
      status = error.response.status;
      if (error.response.data) {
        if (error.response.data.message) {
          if (typeof error.response.data.message === "string") {
            msg = error.response.data.message;
          } else {
            const msgObj = error.response.data.message;
            msg = "";
            for (let i in msgObj) {
              msg += msgObj[i] + "\n";
            }
          }
        } else if (error.response.data.detail) {
          if (typeof error.response.data.detail === "string") {
            msg = error.response.data.detail;
          } else {
            const msgObj = error.response.data.detail;
            msg = "";
            for (let i in msgObj) {
              msg += msgObj[i] + "\n";
            }
          }
        } else if (typeof error.response.data === "object") {
          msg = JSON.stringify(error.response.data);
        } else {
          msg = error.response.data;
        }
      } else {
        msg = JSON.stringify(error.response);
        // msg = "Something went wrong, Please try after sometime";
      }
    } else {
      if (error.message) {
        msg = error.message;
      } else {
        // msg = JSON.stringify(error);
        msg = error;
        // msg = "Something went wrong, Please try after sometime";
      }
    }
  }
  if (status === 401) {
    ErrorSwal.fire({
      title: history ? "Login Required!!" : "Error!",
      text: msg,
      icon: "error", // 'success' | 'error' | 'warning' | 'info' | 'question'
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Login",
      showConfirmButton: history,
      showLoaderOnConfirm: history,
      keydownListenerCapture: true,
      preConfirm: () => {},
      allowOutsideClick: () => !Swal.isLoading(),
      // backdrop: true,
    }).then((result) => {
      localStorage.clear();
      const location = window.location;
      let baseUrl = location.protocol + "//" + location.host;
      window.open(baseUrl, "_self");
    });
  }
  if (status === 500) {
    // ErrorSwal.fire("", "Something Went wrong", "error");
    okErrorToast("", "Something Went wrong");
  }
  if (status === 404 || status === 406) {
    // ErrorSwal.fire("", msg ? msg : "Something Went wrong", "error");
    okErrorToast("", msg ? msg : "Something Went wrong");
  } else {
    okErrorToast("", msg);
    // ErrorSwal.fire("", msg ? msg : "Error can't be identified", "error");
  }
  return msg;
};

export const okSuccessToast = (title, msg) => {
  Toast.fire(title, msg, "success");
};

export const showCopyDialog = (title, data) => {
  MySwal.fire({
    title: title,
    text: data,
    icon: "success", // 'success' | 'error' | 'warning' | 'info' | 'question'
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Copy",
    showLoaderOnConfirm: true,
    allowEscapeKey: true,
    allowEnterKey: true,
    preConfirm: () => {},
    allowOutsideClick: () => !Swal.isLoading(),
    backdrop: true,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: `${title} copied successfully`,
      });
    }
  });
};

export const toastWithTimer = (
  msg,
  timer,
  title = "Details Updated Successfully.",
  apiCallFunc
) => {
  let timerInterval;
  Swal.fire({
    title: `<div class="success-color">${title}</div>`,
    // html: "I will close in <b></b> milliseconds.",
    html: msg,
    timer: timer,
    timerProgressBar: true,
    allowEscapeKey: false,
    allowOutsideClick: false,
    allowEnterKey: true,

    didOpen: () => {
      // const content = Swal.getHtmlContainer();
      // const $ = content.querySelector.bind(content);
      Swal.showLoading();
      const b = Swal.getHtmlContainer().querySelector("strong");
      timerInterval = setInterval(() => {
        b.textContent = (Swal.getTimerLeft() / 1000).toFixed(0);
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.isDismissed) {
      apiCallFunc();
    }
  });
};
export const toastInvoicePopup = (msg, timer) => {
  let timerInterval;
  Swal.fire({
    title: '<div class="green-color">Please LogIn/SignUp to view Invoice</div>',
    // html: "I will close in <b></b> milliseconds.",
    html: msg,
    timer: timer,
    timerProgressBar: true,
    allowEscapeKey: false,
    allowOutsideClick: false,
    allowEnterKey: true,
    didOpen: () => {
      // const content = Swal.getHtmlContainer();
      // const $ = content.querySelector.bind(content);
      Swal.showLoading();
      const b = Swal.getHtmlContainer().querySelector("strong");
      timerInterval = setInterval(() => {
        b.textContent = (Swal.getTimerLeft() / 1000).toFixed(0) + " seconds";
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
    }
  });
};

// small toast
export const okSuccessToastsm = (title, msg) => {
  ToastSm.fire(title, msg, "success");
};
export const okSuccessToastAlt = (title, msg) => {
  MySwalAlt.fire(title, msg, "success");
};