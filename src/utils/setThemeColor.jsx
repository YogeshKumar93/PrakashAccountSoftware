// Primary and secondary colors
export const primaryColor = () => "#014A50";
export const primaryLight = () => "#1877F2";
export const primaryLightest = () => "#baa7d1";
export const secondaryColor = () => "#D3AA07";

export const getHoverActive = () => "#231942";
export const getHoverInActive = () => "#4045A1";

export const getTableHeadRowColor = () => "#d3aa07";

export const getEnv = () => "Transup";

// Basic colors
export const blackColor = () => "#1a1a1a";
export const whiteColor = () => "#f5f5f5";

// User icon bg color by role
export const getUserColor = (role) => {
  switch (role) {
    case "Asm":
      return "#1C2E46";
    case "ZSM":
      return "#FFC0CB";
    case "Ad":
      return "#16BA75";
    case "Md":
      return "#beb83a";
    case "Ret":
      return "#f48f26";
    case "Dd":
      return "#4F46E5";
    case "Api":
      return "#FF3B30";
    default:
      return "#ccc"; // fallback color
  }
};

// Random colors array
export const randomColors = () => {
  const colors = [
    "rgba(255, 99, 132, 0.8)",
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(153, 102, 255, 0.8)",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Status color mapping
export const getStatusColor = (status) => {
  const st = status?.toLowerCase();
  if (st === "total") return "#4045A1";
  if (st === "success" || st === "paid") return "#00bf78";
  if (st === "pending" || st === "post") return "#FFCC56";
  if (st === "failed") return "#DC5F5F";
  if (st === "refund") return "#9F86C0";
  return "#DC5F5F"; // fallback
};

// Firm details
export const getFirmAddress = () =>
  `Ground Floor,Shop No.6,Madhusudan Complex Radar Road, Gokul Nagar Jamnagar,Jamnagar Gujarat, 361004`;
export const getFirmContact = () => `1212121212`;
export const getFirmEmail = () => `transup@gmail.com`;

// Priority colors
export const getPriorityBg = (priority) => {
  if (priority === "HIGH") return "#f98f90";
  if (priority === "MEDIUM") return "#fbd288";
  if (priority === "LOW") return "#fbd48d";
};

export const getPriorityColor = (priority) => {
  if (priority === "HIGH") return "#440304";
  if (priority === "MEDIUM") return "#ae3e07";
  if (priority === "LOW") return "#452d02";
};
