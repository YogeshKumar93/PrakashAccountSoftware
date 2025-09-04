import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Help as HelpIcon
} from '@mui/icons-material';

const CommonModal = ({
  open = false,
  onClose,
  title = "Modal Title",
  children,
  footerButtons = [
    { text: "Cancel", variant: "outlined", onClick: () => {} },
    { text: "Confirm", variant: "contained", onClick: () => {} }
  ],
  size = "medium", // small, medium, large
  iconType = "info", // info, success, warning, error, help
  showCloseButton = true,
  closeOnBackdropClick = true,
  maxWidth,
  dividers = false
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Handle escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27 && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  // Icon configuration
  const getIcon = () => {
    const iconConfig = {
      info: { icon: <InfoIcon />, color: theme.palette.info.main },
      success: { icon: <SuccessIcon />, color: theme.palette.success.main },
      warning: { icon: <WarningIcon />, color: theme.palette.warning.main },
      error: { icon: <ErrorIcon />, color: theme.palette.error.main },
      help: { icon: <HelpIcon />, color: theme.palette.primary.main },
    };
    
    const { icon, color } = iconConfig[iconType] || iconConfig.info;
    return React.cloneElement(icon, { sx: { color, fontSize: 24 } });
  };

  // Determine maxWidth value
  const getMaxWidth = () => {
    if (maxWidth) return maxWidth;
    
    const sizeMap = {
      small: 'sm',
      medium: 'md',
      large: 'lg'
    };
    
    return sizeMap[size] || 'md';
  };

  return (
    <Dialog
      open={open}
      onClose={closeOnBackdropClick ? onClose : null}
      fullScreen={fullScreen}
      maxWidth={getMaxWidth()}
      fullWidth
      aria-labelledby="modal-title"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        m: 0, 
        p: 3, 
        display: 'flex', 
        alignItems: 'center',
        borderBottom: dividers ? 1 : 0,
        borderColor: 'divider',
        bgcolor: '#014C50',
        color:'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center',justifyContent:'center', flexGrow: 1, }}>
          <Box sx={{ mr: 1.5, display: 'flex' }}>
            {getIcon()}
          </Box>
          <Typography variant="h5" component="h2" id="modal-title">
            {title}
          </Typography>
        </Box>
        
        {showCloseButton && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      {/* Content */}
      <DialogContent dividers={dividers} sx={{ p: 3 }}>
        {children}
      </DialogContent>

      {/* Footer */}
      {footerButtons && footerButtons.length > 0 && (
        <DialogActions sx={{ 
          p: 2, 
          gap: 1,
          borderTop: dividers ? 1 : 0,
          borderColor: 'divider',
          bgcolor: '#014C50',
          color:'white'
        }}>
          {footerButtons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              variant={button.variant || "outlined"}
              color={button.color || "primary"}
              startIcon={button.startIcon}
              endIcon={button.endIcon}
              disabled={button.disabled}
              sx={{ borderRadius: 2 }}
            >
              {button.text}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CommonModal;