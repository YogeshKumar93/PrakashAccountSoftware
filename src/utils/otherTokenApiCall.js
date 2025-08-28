import axios from "axios";
import { onInValidAuth } from "../network/ApiController";

export const otherTokenApiCallPost = async (
  url,
  data,
  token,
  setRequest,
  onSuccess,
  onError
) => {
  setRequest(true);
  try {
    const res = await axios.post(
      url,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Cookie: "cookie1-value;",
        },
      },
      { withCredentials: true }
    );
    if (res) {
      onSuccess(res);
      setRequest(false);
    }
  } catch (error) {
    if (error && error.message === "Network Error") {
      // history.pushState(history.state, "login", "/login");
      // location.reload();
    } else {
      if (setRequest) setRequest(false);
      onInValidAuth(error, onError);
    }
    if (setRequest) setRequest(false);

    setRequest(false);
  }
};
