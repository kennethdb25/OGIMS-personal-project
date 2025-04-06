import React, { useState, useEffect, useContext, useRef } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import dayjs from 'dayjs';
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { Table, Tag, Divider, Drawer, Input, Space, Form, Row, Col, Select, DatePicker, message } from "antd";
import {
  Box,
  Button,
  useTheme,
} from "@mui/material";
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import {
  SearchOutlined,
} from "@ant-design/icons";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { LoginContext } from '../../context/Context';
import Highlighter from "react-highlight-words";
import moment from 'moment';
import { ViewDetailsMOdal } from './Modal';

const { Option } = Select;

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const Calendar = () => {
  const theme = useTheme();
  const [form] = Form.useForm();
  const colors = tokens(theme.palette.mode);
  const [viewDetailsData, setViewDetailsData] = useState(null);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [fullyBookedDates, setFullyBookedDates] = useState([]);
  const [listOfBookedDate, setListOfBookedDate] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const { loginData, setLoginData } = useContext(LoginContext);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  //Pagination
  let appointmentCount = 0;
  for (var account in listOfBookedDate) {
    if (listOfBookedDate.hasOwnProperty(account)) {
      appointmentCount++;
    }
  }

  // eslint-disable-next-line no-unused-vars
  const [paginationAppointment, setPaginationAppointment] = useState({
    defaultCurrent: 1,
    pageSize: 6,
    total: appointmentCount,
  });

  const onClose = () => {
    setVisible(false);
    form.resetFields();
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const onViewDetails = async (record, e) => {
    setViewDetailsData(record);
    setViewDetailsModal(true);
  };

  //disableDays
  const disableDates = (current) => {
    return (
      current.isBefore(dayjs(), "day") ||
      current.day() === 0 || current.day() === 6 ||
      fullyBookedDates.includes(current.format("YYYY-MM-DD"))
    );
  };

  const availableTime = ["8:30:00", "9:00:00", "9:30:00", "10:00:00", "10:30:00", "11:00:00", "11:30:00", "12:00:00", "13:00:00", "13:30:00", "14:00:00", "14:30:00", "15:00:00", "15:30:00", "16:00:00", "16:30:00"].filter(
    (time) => !bookedSlots.includes(time)
  );

  const handleSubmit = async () => {
    let values = {};
    if (!selectedDate || !selectedTime) {
      message.error('Please select date and time');
    }
    const formattedDate = selectedDate.format('YYYY-MM-DD');
    const formattedTime = selectedTime;

    values.studentId = loginData?.body.identification;
    values.userId = loginData?.body._id;
    values.requestorName = `${loginData?.body.firstName} ${loginData?.body.middleName} ${loginData?.body.lastName}`;
    values.email = loginData?.body.email;
    values.contact = loginData?.body.contact;
    values.date = formattedDate;
    values.time = formattedTime;

    const data = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const res = await data.json();
    if (res.status === 200) {
      onClose();
      toast.success("Request Successfully Submitted", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      toast.error(res.body, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      const data = await fetch('/api/appointments', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await data.json();

      const bookedDates = res.body?.reduce((acc, appointment) => {
        acc[appointment?.date] = (acc[appointment?.date] || 0) + 1;
        return acc;
      }, {});
      const fullyBooked = Object.keys(bookedDates).filter((date) => bookedDates[date] >= 16);
      setFullyBookedDates(fullyBooked);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (selectedDate) {
        const data = await fetch('/api/appointments', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const res = await data.json();
        const filtered = res.body.filter((a) => a.date === selectedDate.format("YYYY-MM-DD")).map((a) => a.time);
        setBookedSlots(filtered);
      }
    }
    fetchData();
    appointmentDataFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);


  const appointmentDataFetch = async () => {
    let data;
    if (loginData && loginData?.body.userType !== "STUDENT") {
      data = await fetch('/api/appointments', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      data = await fetch(`/api/appointments/student?email=${loginData?.body.email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const res = await data.json();
    if (res.status === 200) {
      setListOfBookedDate(res.body);
    }
  };

  // Table
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 100,
            }}
          >
            Search
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
              confirm({
                closeDropdown: true,
              });
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: colors.grey[100],
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Student ID",
      dataIndex: "studentId",
      key: "studentId",
      width: "10%",
      ...getColumnSearchProps("studentId"),
    },
    {
      title: "Requestor Name",
      dataIndex: "requestorName",
      key: "requestorName",
      width: "10%",
      ...getColumnSearchProps("requestorName"),
    },
    {
      title: "Appointment Date",
      dataIndex: "date",
      key: "date",
      width: "10%",
      render: (_, { date }) => {
        return (
          moment(date).format('LL')
        );
      }
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: "10%",
    },
    {
      title: "Status",
      dataIndex: "appointmentStatus",
      key: "appointmentStatus",
      width: "10%",
      render: (_, { appointmentStatus }) => {
        let color;
        if (appointmentStatus === 'APPROVED') {
          color = 'green';
        } else if (appointmentStatus === 'PENDING') {
          color = 'blue';
        } else {
          color = 'red';
        }
        return (
          <Tag color={color} key={appointmentStatus}>
            {appointmentStatus.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        {
          text: "APPROVED",
          value: "APPROVED",
        },
        {
          text: "REJECTED",
          value: "REJECTED",
        },
        {
          text: "CANCELLED",
          value: "CANCELLED",
        },
        {
          text: "PENDING",
          value: "PENDING",
        },
      ],
      onFilter: (value, record) => record.requestStatus.indexOf(value) === 0,
    },
    {
      title: "",
      dataIndex: "",
      key: "",
      width: "10%",
      render: (record) => (
        <>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <Button
              sx={{
                backgroundColor: colors.blueAccent[500],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
              onClick={(e) => {
                onViewDetails(record, e);
              }}
            >
              <VisibilityIcon sx={{ mr: "10px", marginTop: "2px" }} />
              VIEW DETAILS
            </Button>
          </div>
        </>
      ),
    },
  ];

  const width = window.innerWidth;

  return (
    <Box m="20px">
      <ToastContainer />
      <Header title="Calendar" subtitle="Request New Appointment for Guidance Officer" />
      {loginData?.body.userType === "STUDENT" ? (
        <>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[500],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={() => setVisible(true)}
          >
            <NoteAddOutlinedIcon sx={{ mr: "10px" }} />
            Set an Appointment
          </Button>
        </>
      ) : null}

      <Divider orientation="center" orientationMargin="0" style={{ borderColor: 'blue' }}>
        <Header subtitle="LISTS OF APPOINTMENT" />
      </Divider>
      <Table columns={columns} dataSource={listOfBookedDate} pagination={paginationAppointment} />

      {/* View Details Modal */}
      {viewDetailsData ? (
        <ViewDetailsMOdal
          viewDetailsData={viewDetailsData}
          viewDetailsModal={viewDetailsModal}
          setViewDetailsData={setViewDetailsData}
          setViewDetailsModal={setViewDetailsModal}
          loginData={loginData}
          appointmentDataFetch={appointmentDataFetch}
        />
      ) : null}


      {/* Set an Appointment Drawer  */}
      <Drawer
        title="SCHEDULE AN APPOINTMENT"
        placement="right"
        onClose={() => onClose()}
        open={visible}
        height="100%"
        width={900}
        style={{ display: "flex", justifyContent: "center" }}
        extra={<Space></Space>}
        footer={[
          <div
            style={
              width >= 450
                ? { display: "flex", justifyContent: "flex-end" }
                : { display: "flex", justifyContent: "flex-start" }
            }
          >
            <Button
              sx={{
                backgroundColor: colors.blueAccent[500],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
              onClick={() => handleSubmit()}
            >
              <CheckCircleOutlinedIcon sx={{ mr: "10px" }} />
              CONFIRM REQUEST
            </Button>
          </div>,
        ]}
      >
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 24 }}>
            <h2>Schedule Appointment</h2>
            <Form form={form}>
              <Form.Item
                label="Select Date"
                name="date"
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please select a date!",
                  },
                ]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  disabledDate={disableDates}
                  onChange={(date) => setSelectedDate(date)}
                  style={{ width: "100%", marginBottom: 20 }}
                />
              </Form.Item>

              <Form.Item
                label="Select Time"
                name="time"
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please select a time!",
                  },
                ]}
              >
                <Select
                  placeholder="Select Time"
                  value={selectedTime}
                  onChange={setSelectedTime}
                  style={{ width: "100%", marginBottom: 20 }}
                >
                  {availableTime.length > 0 ? (
                    availableTime.map((time) => <Option key={time}>{time}</Option>)
                  ) : (
                    <Option disabled>No Available Time</Option>
                  )}
                </Select>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Drawer>
    </Box>
  );
};

export default Calendar;