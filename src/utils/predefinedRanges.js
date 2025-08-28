import { Box } from "@mui/material";

const predefinedRanges = [

    {
      label: 'Today',
      value: [new Date(), new Date()],
    },
    {
      label: 'Yesterday',
      value: [
        new Date(new Date().setDate(new Date().getDate() - 1)),
        new Date(new Date().setDate(new Date().getDate() - 1)),
      ],
    },
    {
      label: 'Last 7 Days',
      value: [
        new Date(new Date().setDate(new Date().getDate() - 7)),
        new Date(),
      ],
    },
   
  ];
  

  export default predefinedRanges;