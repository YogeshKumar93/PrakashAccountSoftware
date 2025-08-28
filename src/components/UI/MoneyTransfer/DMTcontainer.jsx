import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  AccountBalance as BankIcon,
  AccountCircle as UserIcon,
  Phone as PhoneIcon,
  VerifiedUser as VerifiedIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../../api/apiClient";
import ApiEndpoints from "../../../api/ApiEndpoints";
import AuthContext from "../../../contexts/AuthContext";
import { PATTERNS } from "../../../utils/validators";
import { capitalize1 } from "../../../utils/TextUtil";
import CustomTabs from "../../common/CustomTabs";
import CommonCardServices from "./CommonCardServices";
import DmtAddRemModal from "./DmtAddRemModal";
import DmrVrifyNewUser from "./DmrVrifyNewUser";

// Bank logos mapping
const bankImageMapping = {
  SBIN: "/banks/sbi.png", 
  IBKL: "/banks/idbi.png",
  UTIB: "/banks/axis.png",
  HDFC: "/banks/hdfc.png",
  ICIC: "/banks/icici.png",
  KKBK: "/banks/kotak.png",
  BARB: "/banks/bob.png",
  PUNB: "/banks/pnb.png",
  MAHB: "/banks/bom.png",
  UBIN: "/banks/union.png",
  DBSS: "/banks/dbs.png",
  RATN: "/banks/rbl.png",
  YESB: "/banks/yes.png",
  INDB: "/banks/indusind.png",
  AIRP: "/banks/airtel.png",
  ABHY: "/banks/abhyudaya.png",
  CNRB: "/banks/canara.png",
  BDBL: "/banks/bandhan.png",
  CBIN: "/banks/cbi.png",
  IDIB: "/banks/idfc.png",
  SCBL: "/banks/standard.png",
  JAKA: "/banks/jk.png",
};

// DMT types configuration
const DMT_TYPES = {
  DMT1: {
    label: "DMT 1",
    key: "dmt1",
    endpoints: {
      remStatus: ApiEndpoints.GET_REMMITTER_STATUS_NEW,
      addRem: ApiEndpoints.ADD_REM,
      addBene: ApiEndpoints.ADD_BENE,
      moneyTransfer: ApiEndpoints.DMR_MONEY_TRANSFER,
      removeBene: ApiEndpoints.REMOVE_BENE
    }
  },
  DMT2: {
    label: "DMT 2",
    key: "dmt2",
    endpoints: {
      remStatus: ApiEndpoints.DMT2_REM_STAT,
      addRem: ApiEndpoints.DMT2_ADD_REM,
      addBene: ApiEndpoints.DMT2_ADD_BENE,
      moneyTransfer: ApiEndpoints.DMT2_MT,
      removeBene: ApiEndpoints.DMT2_REM_BENE
    }
  },
  DMT3: {
    label: "DMT 3",
    key: "dmt3",
    endpoints: {
      remStatus: ApiEndpoints.GET_REMMITTER_STATUS_DMT3,
      addRem: ApiEndpoints.DMT3_ADD_REM,
      addBene: ApiEndpoints.DMT3_ADD_BENE,
      moneyTransfer: ApiEndpoints.DMT3_MT,
      removeBene: ApiEndpoints.DMT3_REM_BENE
    }
  },
  Vendor: {
    label: "Vendor",
    key: "dmt4",
    endpoints: {
      remStatus: ApiEndpoints.NEW_GET_REMMITTER_STATUS,
      addRem: ApiEndpoints.ADD_REM_EXPRESS,
      addBene: ApiEndpoints.DMT3_ADD_BENE,
      moneyTransfer: ApiEndpoints.DMT3_MT,
      removeBene: ApiEndpoints.DMT3_REM_BENE
    }
  },
  WALLET: {
    label: "Wallet",
    key: "st",
    endpoints: {
      remStatus: ApiEndpoints.GET_REMMITTER_STATUS_SUPER,
      addRem: ApiEndpoints.ADD_REM_SUPER,
      addBene: ApiEndpoints.DMT3_ADD_BENE,
      moneyTransfer: ApiEndpoints.DMT3_MT,
      removeBene: ApiEndpoints.DMT3_REM_BENE
    }
  }
};

// Main component
const DmtContainer = ({ setMoney = false, id, resetView, dataCategories, handleCardClick }) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const { user, location } = authCtx;
  const { lat: userLat, long: userLong } = location;
  
  const scrollContainerRef = useRef(null);
  const [activeDmtType, setActiveDmtType] = useState(
    user?.dmt1 === 1 ? "DMT1" : 
    user?.dmt2 === 1 ? "DMT2" : 
    user?.dmt3 === 1 ? "DMT3" : 
    user?.dmt4 === 1 ? "DMT4" : 
    user?.st === 1 ? "st" : "DMT1"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [isValidMobile, setIsValidMobile] = useState(true);
  const [remitterStatus, setRemitterStatus] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [otpRefId, setOtpRefId] = useState("");
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [showAddRemitter, setShowAddRemitter] = useState(false);
  const [remitterRefKey, setRemitterRefKey] = useState({});
  const [showRemitterKyc, setShowRemitterKyc] = useState(false);
  const [dmr2RemResponse, setDmr2RemResponse] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  // Filter available DMT types based on user permissions
  const availableDmtTypes = Object.keys(DMT_TYPES).filter(
    type => user?.[DMT_TYPES[type].key] === 1
  );

  useEffect(() => {
    setMobile("");
    setRemitterStatus(null);
    setBeneficiaries([]);
  }, [activeDmtType]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = beneficiaries.filter(ben => 
        (ben.name || ben.bene_name || "").toUpperCase().includes(searchQuery.toUpperCase())
      );
      setFilteredBeneficiaries(filtered);
    } else {
      setFilteredBeneficiaries(beneficiaries);
    }
  }, [searchQuery, beneficiaries]);

  const getRemitterStatus = useCallback(async (number) => {
    if (!PATTERNS.MOBILE.test(number)) return;
    
    setIsLoading(true);
    const endpoint = DMT_TYPES[activeDmtType].endpoints.remStatus;
    
    const { error, response } = await apiCall("POST", endpoint, {
      number,
      type: "M",
      latitude: userLat,
      longitude: userLong
    });
    
    setIsLoading(false);
    
    if (error) {
      handleRemitterError(error, number);
      return;
    }
    
    if (response?.message === "OTP Sent") {
      setOtpRefId(response.otpReference);
      setShowOtpVerification(true);
      return;
    }
    
    handleRemitterSuccess(response, number);
  }, [activeDmtType, userLat, userLong]);

  // Handle successful remitter status response
  const handleRemitterSuccess = (response, number) => {
    const isDmt1OrSt = activeDmtType === "DMT1" ;

    // Pick remitter data
    const remitterData = isDmt1OrSt ? response.remitter :activeDmtType === "WALLET"?response.remitter: response?.remitter;

    setMobile(number);
    setRemitterStatus(remitterData);

    // Pick beneficiaries
    const beneData = activeDmtType === "DMT1" ? remitterData?.beneficiaries :activeDmtType === "WALLET"?response.data: response?.data;
    setBeneficiaries(beneData || []);
  };

  // Handle remitter status error
  const handleRemitterError = (error, number) => {
    if (error) {
      switch (error.message) {
        case "Please do remitter e-kyc.":
          if (activeDmtType === "DMT2") setShowRemitterKyc(true);
          break;
        case "Remitter Not Found":
          setRemitterRefKey(error.data || {});
          setShowAddRemitter(true);
          break;
        case "Please validate your aadhaar number.":
          setShowAddRemitter(true);
          break;
        default:
          console.error("Remitter error:", error);
      }
    } else if (error?.step === 3) {
      setShowOtpVerification(true);
      setDmr2RemResponse(error.data);
    }
  };

  // Handle mobile input change
  const handleMobileChange = (e) => {
    const value = e.target.value;
    const isValid = PATTERNS.MOBILE.test(value) || value === "";
    
    setIsValidMobile(isValid);
    setMobile(value);
    
    if (value === "" || value.length === 9) {
      setRemitterStatus(null);
      setBeneficiaries([]);
    }
    
    if (PATTERNS.MOBILE.test(value)) {
      getRemitterStatus(value);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (remitterStatus) {
      setRemitterStatus(null);
      setMobile("");
      setBeneficiaries([]);
    } else if (resetView) {
      resetView(false);
    } else {
      navigate(-1);
    }
  };

  // Handle horizontal scroll
  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const selectedType = availableDmtTypes[newValue];
    setActiveDmtType(selectedType);
  };

  // Handle money transfer
  const handleMoneyTransfer = (beneficiary, transferType) => {
    console.log(`Initiate ${transferType} transfer to:`, beneficiary);
    // Implement money transfer logic based on transferType (NEFT, IMPS, PORT)
  };

  // Handle delete beneficiary
  const handleDeleteBeneficiary = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setDeleteDialogOpen(true);
  };

  // Confirm delete beneficiary
  const confirmDeleteBeneficiary = async () => {
    if (!selectedBeneficiary) return;
    
    setIsLoading(true);
    const endpoint = DMT_TYPES[activeDmtType].endpoints.removeBene;
    
    const { error, response } = await apiCall("POST", endpoint, {
      mobile: mobile,
      bene_id: selectedBeneficiary.id || selectedBeneficiary.bene_id
    });
    
    setIsLoading(false);
    
    if (error) {
      console.error("Error deleting beneficiary:", error);
      return;
    }
    
    // Remove beneficiary from list
    setBeneficiaries(prev => prev.filter(ben => 
      ben.id !== selectedBeneficiary.id && ben.bene_id !== selectedBeneficiary.bene_id
    ));
    
    setDeleteDialogOpen(false);
    setSelectedBeneficiary(null);
  };

  // Render remitter info table
  const renderRemitterInfo = () => (
    <Card sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back
        </Button>
        <Typography variant="h6" color="primary" fontWeight="bold">
          {DMT_TYPES[activeDmtType].label} - Remitter Details
        </Typography>
        <Box width={100} /> {/* Spacer for balance */}
      </Box>
      
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Mobile</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Limit Available</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Per Transaction Limit</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                {remitterStatus?.firstName || remitterStatus?.name} {remitterStatus?.lastName || remitterStatus?.lname}
              </TableCell>
              <TableCell>
                {remitterStatus?.mobileNumber || remitterStatus?.mobile||remitterStatus?.number}
                <IconButton size="small" onClick={() => setRemitterStatus(null)} sx={{ ml: 1 }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </TableCell>
              <TableCell>{remitterStatus?.rem_limit || remitterStatus?.limitTotal}</TableCell>
              <TableCell>{remitterStatus?.limitPerTransaction || 5000}</TableCell>
              <TableCell>
                <Chip 
                  icon={<VerifiedIcon />} 
                  label="Verified" 
                  size="small" 
                  color="success" 
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );

  // Render beneficiary table
  const renderBeneficiaryTable = () => (
    <Card sx={{ p: 2, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Beneficiaries
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            placeholder="Search beneficiaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ width: 250 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
          <Typography variant="body2" color="textSecondary">
            {filteredBeneficiaries.length} Beneficiaries
          </Typography>
        </Box>
      </Box>
      
      {filteredBeneficiaries.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Bank</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Account Number</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>IFSC</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBeneficiaries.map((beneficiary, index) => {
                const bankCode = beneficiary?.ifsc?.slice(0, 4).toUpperCase();
                const bankLogo = bankImageMapping[bankCode] || "/banks/default.png";
                const displayName = beneficiary.name || beneficiary.bene_name;
                const accountNumber = beneficiary.bene_acc || beneficiary.accno;

                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar src={bankLogo} sx={{ width: 30, height: 30, mr: 1 }} />
                        {bankCode}
                      </Box>
                    </TableCell>
                    <TableCell>{capitalize1(displayName)}</TableCell>
                    <TableCell>{accountNumber}</TableCell>
                    <TableCell>{beneficiary.ifsc}</TableCell>
                    <TableCell>
                      {beneficiary.last_success_date ? (
                        <Chip 
                          icon={<VerifiedIcon />} 
                          label="Verified" 
                          size="small" 
                          color="success" 
                        />
                      ) : (
                        <Chip 
                          label="Pending" 
                          size="small" 
                          color="warning" 
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => handleMoneyTransfer(beneficiary, "NEFT")}
                        >
                          NEFT
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => handleMoneyTransfer(beneficiary, "IMPS")}
                        >
                          IMPS
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => handleMoneyTransfer(beneficiary, "PORT")}
                        >
                          PORT
                        </Button>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteBeneficiary(beneficiary)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="textSecondary">
            No beneficiaries found. Add a beneficiary to get started.
          </Typography>
        </Box>
      )}
    </Card>
  );

  // Render initial form
  const renderInitialForm = () => (
    <Card sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center">
        {DMT_TYPES[activeDmtType].label}
      </Typography>
      
      <Typography variant="body2" color="textSecondary" textAlign="center" mb={3}>
        Enter remitter's mobile number to proceed
      </Typography>
      
      <FormControl fullWidth>
        <TextField
          label="Mobile Number"
          value={mobile}
          onChange={handleMobileChange}
          error={!isValidMobile}
          helperText={!isValidMobile ? "Enter valid 10-digit mobile number" : ""}
          inputProps={{ maxLength: 10 }}
          disabled={isLoading}
          fullWidth
        />
      </FormControl>
      
      <Divider sx={{ my: 3 }}>OR</Divider>
      
      <Typography variant="body2" color="textSecondary" textAlign="center" mb={2}>
        Search by account number
      </Typography>
      
      <FormControl fullWidth>
        <TextField
          label="Account Number"
          disabled={isLoading}
          fullWidth
        />
      </FormControl>
      
      <Button 
        variant="contained" 
        fullWidth 
        sx={{ mt: 2 }}
        disabled={isLoading}
        endIcon={<ArrowForwardIosIcon />}
      >
        {isLoading ? <CircularProgress size={24} /> : "Proceed"}
      </Button>
    </Card>
  );

  const renderServicesCarousel = () => (
    <Box sx={{ mb: 3, position: "relative" }}>
      <IconButton
        onClick={() => handleScroll("left")}
        sx={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", zIndex: 2 }}
      >
        <ArrowBackIosIcon />
      </IconButton>
      
      <Box
        ref={scrollContainerRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          px: 1,
          py: 2,
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { display: "none" }
        }}
      >
        {dataCategories
          ?.filter(category => category.title === "Banking")
          .flatMap(category => category.data)
          .map((service, index) => (
            <CommonCardServices
              key={index}
              title={service.name}
              img={service.img}
              isSelected={id === service.id}
              onClick={() => handleCardClick(service)}
            />
          ))}
      </Box>
      
      <IconButton
        onClick={() => handleScroll("right")}
        sx={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", zIndex: 2 }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );

  return (
    <Box sx={{ p: 2, maxWidth: 1200, margin: "0 auto" }}>
      
      {renderServicesCarousel()}
      
      {!remitterStatus && availableDmtTypes.length > 1 && (
        <Box sx={{ mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            {availableDmtTypes.map(type => (
              <Tab key={type} label={DMT_TYPES[type].label} />
            ))}
          </Tabs>
        </Box>
      )}
      
      {/* Main Content */}
      {isLoading && (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      )}
      
      {remitterStatus ? (
        <>
          {renderRemitterInfo()}
          {renderBeneficiaryTable()}
        </>
      ) : (
        renderInitialForm()
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete beneficiary {selectedBeneficiary?.name || selectedBeneficiary?.bene_name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteBeneficiary} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modals */}
      {showAddRemitter && (
        <DmtAddRemModal
          rem_mobile={mobile}
          dmtValue={DMT_TYPES[activeDmtType].key}
          getRemitterStatus={getRemitterStatus}
          apiEnd={DMT_TYPES[activeDmtType].endpoints.addRem}
          onClose={() => setShowAddRemitter(false)}
          remRefKey={remitterRefKey}
        />
      )}
      
      {showOtpVerification && (
        <DmrVrifyNewUser
          rem_mobile={mobile}
          getRemitterStatus={getRemitterStatus}
          onClose={() => setShowOtpVerification(false)}
          otpRefId={otpRefId}
          dmr2RemResponse={dmr2RemResponse}
        />
      )}
    </Box>
  );
};

export default DmtContainer;