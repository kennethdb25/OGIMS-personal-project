import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import moment from 'moment';
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

const LoginHistory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loginHistoryList, setLoginHistoryList] = useState({});

  const getLoginHistory = async () => {
    const data = await fetch('/api/login-history-list', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await data.json();
    setLoginHistoryList(res?.body);
  };

  useEffect(() => {
    getLoginHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    { field: "id", headerName: "User ID", flex: 1 },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "middleName",
      headerName: "Middle Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "userType",
      headerName: "User Type",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "created",
      headerName: "Login Date",
      flex: 1,
      valueFormatter: params =>
        moment(params?.value).format("LLLL"),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="HISTORY"
        subtitle="List of Login History"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={loginHistoryList}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default LoginHistory;
