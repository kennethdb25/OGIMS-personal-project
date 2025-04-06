import React, { useState } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { LoginContext } from '../../context/Context';
import UserProfileModal from './UserProfileModal/UserProfileModal';
import { List, Badge, App, Avatar, Drawer } from 'antd';

const initialNotification = [
  {
    id: 1,
    title: "New Request From",
    description: "You have a new message",
    read: false
  },
  {
    id: 2,
    title: "New Appointment Scheduled",
    description: "You have a new message",
    read: false
  },
  {
    id: 3,
    title: "New Request From",
    description: "You have a new message",
    read: false
  },
  {
    id: 4,
    title: "New Appointment Scheduled",
    description: "You have a new message",
    read: false
  },
  {
    id: 5,
    title: "New Request From",
    description: "You have a new message",
    read: false
  },
  {
    id: 6,
    title: "New Appointment Scheduled",
    description: "You have a new message",
    read: false
  },
];

const Topbar = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { notification } = App.useApp();
  // eslint-disable-next-line no-unused-vars
  const { loginData, setLoginData } = useContext(LoginContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNotifDrawerVisibile, setIsNotifDrawerVisible] = useState(false);
  const [notificationList, setNotificationList] = useState(initialNotification);

  const { setData } = props;

  // mark as read
  const markAsRead = (id) => {
    setNotificationList((prev) => {
      prev.map((item) =>
        item.id === id ? { ...item, read: true } : item
      );
    });
  };

  // show notifcations
  const openNotification = (title, description, id) => {
    notification?.info({
      message: title,
      description: description,
      onClose: () => markAsRead(id),
    });
  };

  const user = {
    name: `${loginData?.body.firstName} ${loginData?.body.lastName}`,
    id: loginData?.body.identification,
    contact: loginData?.body.contact,
    email: loginData?.body.email,
    gender: loginData?.body.gender,
    address: loginData?.body.address,
    user: loginData?.body.userType,
    acctStatus: loginData?.body.acctStatus
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={() => setIsNotifDrawerVisible(true)}>
          <Badge count={notificationList?.filter((n) => !n.read).length}>
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <IconButton onClick={() => setIsModalVisible(true)} >
          <PersonOutlinedIcon />
        </IconButton>
      </Box>

      {/* User Profile Modal */}
      <UserProfileModal
        user={user}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        setData={setData}
      />

      {/* Notification List Drawer */}
      <Drawer
        title="NOTIFICATION LIST"
        placement='right'
        onClose={() => setIsNotifDrawerVisible(false)}
        open={isNotifDrawerVisibile}
        height="100%"
      >
        <List
          itemLayout='vertical'
          dataSource={notificationList}
          renderItem={(item) => (
            <List.Item
              style={{
                background: item.read ? "#f0f0f0" : "#fff",
                cursor: "pointer",
                padding: 10,
                borderRadius: 5,
                marginBottom: 5
              }}
              onClick={() => openNotification(item.title, item.description, item.id)}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<NotificationsOutlinedIcon />} />}
                title={item.title}
                description={item.description}
              />
              {!item.read && <Badge dot />}
            </List.Item>
          )}
        ></List>
      </Drawer>
    </Box>
  );
};

export default Topbar;
