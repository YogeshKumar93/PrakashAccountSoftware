import React, { useState, useEffect, useContext } from "react";
import {
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
  Button,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SubdirectoryArrowLeftIcon from "@mui/icons-material/SubdirectoryArrowLeft";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import AuthContext from "../../contexts/AuthContext";
import ApiEndpoints from "../../api/ApiEndpoints";
import { apiCall } from "../../api/apiClient";
import { dateToTime, ddmmyy } from "../../utils/DateUtils";
import { formatDistanceToNow } from "date-fns";

const NotificationModal = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleClose = () => setAnchorEl(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const { response } = await apiCall("POST", ApiEndpoints.GET_NOTIFICATION);
      if (response) {
        setNotifications(response?.data?.data || []);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Mark single/all notifications as read/unread
  const handleMarkAsRead = async (id = null, isRead = 1) => {
    try {
      const payload = id ? { id, is_read: isRead } : { is_read: isRead };
      const { response } = await apiCall("POST", ApiEndpoints.MARK_READ_NOTI, payload);

      if (response) {
        setNotifications((prev) =>
          prev.map((n) =>
            id ? (n.id === id ? { ...n, is_read: isRead } : n) : { ...n, is_read: isRead }
          )
        );
      }
    } catch (err) {
      console.error("Error marking notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      {/* Notification Icon */}
      <IconButton sx={{ color: "#526484", mr: 1 }} onClick={handleClick}>
        <Badge
          badgeContent={notifications.filter((n) => n.is_read === 0).length}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#09c2de",
              color: "#fff",
              fontSize: "0.75rem",
              minWidth: "18px",
              height: "18px",
            },
          }}
        >
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>

      {/* Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 420,
            borderRadius: 2,
            overflow: "hidden",
            borderTop: "3px solid #9D72F0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1.5,
          }}
        >
          <Typography variant="subtitle1" fontWeight={500}>
            Notifications
          </Typography>
          <Typography
            variant="body2"
            color="#9d72f0"
            sx={{ cursor: "pointer", fontWeight: 500 }}
            onClick={() => handleMarkAsRead(null)}
          >
            Mark All as Read
          </Typography>
        </Box>
        <Divider />

        {/* List */}
        <Box
          sx={{
            maxHeight: 320,
            overflowY: "auto",
            px: 0.5,
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { backgroundColor: "#f0f0f0", borderRadius: "8px" },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "#9d72f0", borderRadius: "8px" },
            "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#7a4ed8" },
            scrollbarWidth: "thin",
            scrollbarColor: "#9d72f0 #f0f0f0",
          }}
        >
          {notifications.length === 0 ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                🎉 No new notifications
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.map((row) => (
                <ListItem
                  key={row.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    mt:1,
                    py: 1.2,
                    borderBottom: "1px solid #f0f0f0",
                    bgcolor: "background.paper",
                    gap: 2.5,
                  }}
                >
                  {/* Read/Unread indicator */}
               
                    <IconButton
                     
                      onClick={() =>
                        handleMarkAsRead(row.id, row.is_read ? 0 : 1)
                      } // toggle read/unread
                      sx={{
                        color: row.is_read ? "#1fe0ac" : "#f4bd0e",
                        bgcolor: row.is_read ? "#E2FBF4" : "#fef6e0",
                        width: 45,
                        height: 45,
                      }}
                    >
                      {row.is_read ? (
                        <SubdirectoryArrowLeftIcon />
                      ) : (
                        <SubdirectoryArrowRightIcon />
                      )}
                    </IconButton>
         

                  {/* Notification Text */}
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        fontWeight={row.is_read ? 400 : 600}
                        sx={{ color: "#555" }}
                      >
                        {row.message}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="#888"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                         {ddmmyy(row.created_at)} • {formatDistanceToNow(new Date(row.created_at), { addSuffix: true })}

                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        <Divider />
        <Box sx={{ p: 1, textAlign: "center" }}>
          <Button variant="text" size="small" sx={{ color: "#9d72f0", fontWeight: 500 }}>
            View All
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationModal;
