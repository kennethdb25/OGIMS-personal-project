import React, { useState, useContext, useRef, useEffect } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { ToastContainer, toast, Bounce } from "react-toastify";
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { tokens } from '../../theme';
import { Table, Divider, Drawer, Space, Form, Row, Col, Select, Input, DatePicker, Tag } from "antd";
import {
  SearchOutlined,
} from "@ant-design/icons";
// import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { RequestData, StudentStatusData } from './Data';
import { LoginContext } from '../../context/Context';
import Highlighter from "react-highlight-words";
import moment from 'moment';
import { ViewDetailsMOdal } from './Modal';
import dayjs from 'dayjs';

const RequestForm = () => {
  const [form] = Form.useForm();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const isNonMobile = useMediaQuery("(min-width:600px)");
  const [visible, setVisible] = useState(false);
  const [rqstForm, setRqstForm] = useState('');
  const [studentStats, setStudentStats] = useState('');
  const [requestForms, setRequestForms] = useState();
  const [viewDetailsData, setViewDetailsData] = useState(null);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const { loginData, setLoginData } = useContext(LoginContext);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const getRequestForms = async () => {
    let data;
    if (loginData && loginData?.body?.userType !== "STUDENT") {
      data = await fetch('/api/requests/all', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      data = await fetch(`/api/requests/student?email=${loginData?.body.email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const res = await data.json();

    if (res.status === 200) {
      setRequestForms(res.body);
    }
  };

  const onViewDetails = async (record, e) => {
    setViewDetailsData(record);
    setViewDetailsModal(true);
  };

  const onFinish = async (values) => {
    values.studentId = loginData?.body.identification;
    values.userId = loginData?.body._id;
    values.requestorName = `${loginData?.body.firstName} ${loginData?.body.middleName} ${loginData?.body.lastName}`;
    values.email = loginData?.body.email;
    values.contact = loginData?.body.contact;

    const data = await fetch("/api/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const res = await data.json();
    if (res.status === 200) {
      getRequestForms();
      setVisible(false);
      setRequestForms('');
      form.resetFields();
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

  const onFinishFailed = (error) => {
    console.log(error);
  };

  const onClose = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleOptionChange = async (value) => {
    setRqstForm(value);
    setStudentStats('');
  };

  const handleStudentStatusChange = async (value) => {
    setStudentStats(value);
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
      title: "Request",
      dataIndex: "request",
      key: "request",
      width: "10%",
      filters: [
        {
          text: "Transcript of Records",
          value: "Transcript of Records",
        },
        {
          text: "Diploma",
          value: "Diploma",
        },
        {
          text: "Certificate of Enrollment",
          value: "Certificate of Enrollment",
        },
        {
          text: "Certificate of Grades",
          value: "Certificate of Grades",
        },
        {
          text: "Certificate of Good Moral",
          value: "Certificate of Good Moral",
        },
      ],
      onFilter: (value, record) => record.request.indexOf(value) === 0,
    },
    {
      title: "Request Creation Date",
      dataIndex: "requestDate",
      key: "requestDate",
      width: "10%",
      render: (_, { requestDate }) => {
        return (
          moment(requestDate).format('LL')
        );
      }
    },
    {
      title: "Distribution Date",
      dataIndex: "approximateDistributionDate",
      key: "approximateDistributionDate",
      width: "10%",
      sorter: (a, b) => dayjs(a.approximateDistributionDate).unix() - dayjs(b.approximateDistributionDate).unix(),
      render: (_, { approximateDistributionDate }) => {
        return (
          moment(approximateDistributionDate).format('LL')
        );
      }
    },
    {
      title: "Status",
      dataIndex: "requestStatus",
      key: "requestStatus",
      width: "10%",
      render: (_, { requestStatus }) => {
        let color;
        if (requestStatus === 'APPROVED') {
          color = 'green';
        } else if (requestStatus === 'PENDING') {
          color = 'blue';
        } else {
          color = 'red';
        }
        return (
          <Tag color={color} key={requestStatus}>
            {requestStatus.toUpperCase()}
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

  useEffect(() => {
    getRequestForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const width = window.innerWidth;

  return (
    <Box m="20px">
      <ToastContainer />
      <Header title="REQUEST FORM" subtitle="Create a New Request Form" />
      {loginData?.body?.userType === "STUDENT" ? (
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
            Request Form
          </Button>
        </>
      ) : null}
      <Divider orientation="center" orientationMargin="0" style={{ borderColor: 'blue' }}>
        <Header subtitle="LISTS OF REQUEST" />
      </Divider>
      <Table columns={columns} dataSource={requestForms} />

      {/* Request Form Drawer  */}
      <Drawer
        title="Request Form"
        placement={width >= 450 ? 'right' : 'left'}
        onClose={onClose}
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
              onClick={() => form.submit()}
            >
              <CheckCircleOutlinedIcon sx={{ mr: "10px" }} />
              CONFIRM REQUEST
            </Button>
          </div>,
        ]}
      >
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 24 }}>
            <Form
              form={form}
              labelCol={{
                span: 24,
              }}
              layout="horizontal"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              style={{
                width: "100%",
              }}
            >
              <Row gutter={12}>
                <Col xs={24} md={12} layout="vertical">
                  <Form.Item
                    label="Type of Request"
                    name="request"
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
                        message: "Please select a type of request!",
                      },
                    ]}
                  >
                    <Select placeholder="Select a type of request" onChange={handleOptionChange}>
                      {RequestData.map((value, index) => (
                        <Select.Option key={index} value={value.value}>
                          {value.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Divider orientation="left" orientationMargin="0" style={{ borderColor: 'blue' }}>
                <h3>OTHER INFORMATION</h3>
              </Divider>
              {rqstForm === 'Certificate of Good Moral' ? (
                <Row gutter={12}>
                  <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                    <Form.Item
                      label="Please choose"
                      name="studentStatus"
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
                          message: "Please select a valid option",
                        },
                      ]}
                    >
                      <Select placeholder="Please select" onChange={handleStudentStatusChange}>
                        {StudentStatusData.map((value, index) => (
                          <Select.Option key={index} value={value.value}>
                            {value.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              ) : null}
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                  <Form.Item
                    label="Course"
                    name="course"
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
                        message: "Please input your course!",
                      },
                      {
                        pattern: /^[a-zA-Z-_ ]*$/,
                        message: "Numbers or special character (except _ or -) are not allowed",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your course" />
                  </Form.Item>
                </Col>
                {rqstForm === 'Certificate of Enrollment' || rqstForm === 'Certificate of Grades' || studentStats === 'Non-Graduate' ? (
                  < Col xs={{ span: 24 }} md={{ span: 8 }}>
                    <Form.Item
                      label="Year"
                      name="year"
                      labelCol={{
                        span: 24,
                      }}
                      wrapperCol={{
                        span: 24,
                      }}
                      hasFeedback
                      rules={[
                        {
                          pattern: /^[a-zA-Z0-9]*$/,
                          message: "Special character are not allowed",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your Year" />
                    </Form.Item>
                  </Col>
                ) : null}
                {rqstForm === 'Certificate of Enrollment' || rqstForm === 'Certificate of Grades' || studentStats === 'Non-Graduate' ? (
                  <Col xs={{ span: 24 }} md={{ span: 8 }}>
                    <Form.Item
                      label="Section"
                      name="section"
                      labelCol={{
                        span: 24,
                      }}
                      wrapperCol={{
                        span: 24,
                      }}
                      hasFeedback
                      rules={[
                        {
                          pattern: /^[a-zA-Z0-9]*$/,
                          message: "Special character are not allowed",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your section" />
                    </Form.Item>
                  </Col>
                ) : null}
                {rqstForm === 'Transcript of Records' || rqstForm === 'Diploma' || studentStats === 'Graduate' ? (
                  <Col xs={{ span: 24 }} md={{ span: 8 }}>
                    <Form.Item
                      label="Year Graduated"
                      name="yearGraduated"
                      labelCol={{
                        span: 24,
                      }}
                      wrapperCol={{
                        span: 24,
                      }}
                      hasFeedback
                    >
                      <DatePicker picker="year" placeholder="Enter year graduated" />
                    </Form.Item>
                  </Col>
                ) : null}
                {rqstForm === 'Certificate of Grades' ? (
                  <Col xs={{ span: 24 }} md={{ span: 24 }}>
                    <Form.Item
                      label="What year and semester for the request?"
                      name="requestRange"
                      labelCol={{
                        span: 24,
                      }}
                      wrapperCol={{
                        span: 24,
                      }}
                      hasFeedback
                    >
                      <Input placeholder="(e.g 1st Year 1st sem to 2nd year 2nd sem or 1st year 1st sem only)" />
                    </Form.Item>
                  </Col>
                ) : null}
              </Row>
            </Form>
          </Col>
        </Row>
      </Drawer>

      {/* View Details Modal */}
      {viewDetailsData ? (
        <ViewDetailsMOdal
          viewDetailsData={viewDetailsData}
          viewDetailsModal={viewDetailsModal}
          setViewDetailsData={setViewDetailsData}
          setViewDetailsModal={setViewDetailsModal}
          loginData={loginData}
          getRequestForms={getRequestForms}
        />
      ) : null}
    </Box >
  );
};



export default RequestForm;
