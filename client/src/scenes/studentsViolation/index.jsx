import { useState, useEffect, useRef, useContext } from "react";
import { ViolationData } from './Data';
import { ToastContainer, toast, Bounce } from "react-toastify";
import {
  Table, Tag, Divider, Drawer, Input, Space, Form, Row, Col, Select, DatePicker, Radio
} from "antd";
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
import Highlighter from "react-highlight-words";
import moment from 'moment';
import { ViewDetailsMOdal } from './Modal';
import { LoginContext } from '../../context/Context';
const { TextArea } = Input;

const StudentsViolation = () => {
  const theme = useTheme();
  const [form] = Form.useForm();
  const colors = tokens(theme.palette.mode);
  // eslint-disable-next-line no-unused-vars
  const { loginData, setLoginData } = useContext(LoginContext);
  const [visible, setVisible] = useState(false);
  const [listOfViolations, setListOfViolations] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [viewDetailsData, setViewDetailsData] = useState(null);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const searchInput = useRef(null);

  //Pagination
  let violationCount = 0;
  for (var violation in listOfViolations) {
    if (listOfViolations.hasOwnProperty(violation)) {
      violationCount++;
    }
  }

  // eslint-disable-next-line no-unused-vars
  const [paginationViolation, setPaginationViolation] = useState({
    defaultCurrent: 1,
    pageSize: 6,
    total: violationCount,
  });

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

  const onViewDetails = async (record, e) => {
    setViewDetailsData(record);
    setViewDetailsModal(true);
  };

  const onClose = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    form.submit();
  };

  const onFinish = async (values) => {
    values.violationDate = values.violationDate.format("YYYY-MM-DD");

    const data = await fetch("/api/violation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const res = await data.json();
    if (res.status === 200) {
      onClose();
      toast.success("Details Successfully Submitted", {
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
      violationDataFetch();
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
      violationDataFetch();
    }
  };

  const violationDataFetch = async () => {
    const data = await fetch('/api/violation', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await data.json();
    if (res.status === 200) {
      setListOfViolations(res.body);
    }
  };

  const columns = [
    {
      title: "Student ID",
      dataIndex: "studentId",
      key: "studentId",
      width: "10%",
      ...getColumnSearchProps("studentId"),
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      width: "10%",
      ...getColumnSearchProps("firstName"),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      width: "10%",
      ...getColumnSearchProps("lastName"),
    },
    {
      title: "Violation",
      dataIndex: "violation",
      key: "violation",
      width: "10%",
      ...getColumnSearchProps("violation"),
    },
    {
      title: "Violation Date",
      dataIndex: "violationDate",
      key: "violationDate",
      width: "10%",
      render: (_, { violationDate }) => {
        return (
          moment(violationDate).format('LL')
        );
      }
    },
    {
      title: "Status",
      dataIndex: "violationStatus",
      key: "violationStatus",
      width: "10%",
      render: (_, { violationStatus }) => {
        let color;
        if (violationStatus === 'COMPLETED') {
          color = 'green';
        } else if (violationStatus === 'INCOMPLETE') {
          color = 'orange';
        } else if (violationStatus === 'CANCELLED') {
          color = 'red';
        } else {
          color = 'blue';
        }
        return (
          <Tag color={color} key={violationStatus}>
            {violationStatus.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        {
          text: "DONE",
          value: "DONE",
        },
        {
          text: "IN PROGRESS",
          value: "IN PROGRESS",
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
    violationDataFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const width = window.innerWidth;

  return (
    <Box m="20px">
      <ToastContainer />
      <Header title="Violations" subtitle="List of Student's Violations" />
      {loginData?.body?.userType === "GUIDANCE OFFICER" ? (
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
            Add Violation
          </Button>
        </>
      ) : null}
      <Divider orientation="center" orientationMargin="0" style={{ borderColor: 'blue' }}>
        <Header subtitle="LISTS OF VIOLATIONS" />
      </Divider>
      <Table columns={columns} dataSource={listOfViolations} pagination={paginationViolation} />

      {/* Set an Appointment Drawer  */}
      <Drawer
        title="VIOLATION DETAILS"
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
              CONFIRM DETAILS
            </Button>
          </div>,
        ]}
      >
        <Row>
          <h2>VIOLATOR DETAILS:</h2>
          <Col xs={{ span: 24 }} md={{ span: 24 }}>
            <Form
              form={form}
              labelCol={{
                span: 8,
              }}
              onFinish={onFinish}
              layout="horizontal"
              autoComplete="off"
              style={{
                width: "100%",
              }}>

              <Row>
                <Col xs={{ span: 24 }} md={{ span: 24 }}>
                  <Row gutter={12}>
                    <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                      <Form.Item
                        label="First Name"
                        name="firstName"
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
                            message: "Please input your first name!",
                          },
                          {
                            pattern: /^[a-zA-Z_ ]*$/,
                            message: "Numbers or special character are not allowed",
                          },
                        ]}
                      >
                        <Input placeholder="Enter your first name" />
                      </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} md={{ span: 8 }}>
                      <Form.Item
                        label="Middle Name"
                        name="middleName"
                        labelCol={{
                          span: 24,
                        }}
                        wrapperCol={{
                          span: 24,
                        }}
                        hasFeedback
                        rules={[
                          {
                            pattern: /^[a-zA-Z_ ]*$/,
                            message: "Numbers or special character are not allowed",
                          },
                          {
                            required: true,
                            message: "Please input your first name!",
                          },
                        ]}
                      >
                        <Input placeholder="Enter your middle name" />
                      </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} md={{ span: 8 }}>
                      <Form.Item
                        label="Last Name"
                        name="lastName"
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
                            message: "Please input your last name!",
                          },
                          {
                            pattern: /^[a-zA-Z_ ]*$/,
                            message: "Numbers or special character are not allowed",
                          },
                        ]}
                      >
                        <Input placeholder="Enter your last name" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={12}>
                    <Col xs={{ span: 24 }} md={{ span: 8 }}>
                      <Form.Item
                        label="Student ID"
                        name="studentId"
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
                            message: "Please input your Employee ID!",
                          },
                        ]}
                      >
                        <Input placeholder="Enter your Employee ID" />
                      </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} md={{ span: 8 }}>
                      <Form.Item
                        label="Contact Number"
                        name="contact"
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
                            message: "Please input your 11 digits mobile number!",
                          },
                          { whitespace: true },
                          { min: 11, message: 'Contact Number must be at least 11 characters' },
                          { max: 11, message: 'Contact Number cannot be longer than 11 characters' },
                          {
                            pattern:
                              /[0-9]/,
                            message:
                              "Invalid Character",
                          },
                        ]}
                      >
                        <Input placeholder="Enter your 11 digits mobile number" />
                      </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} md={{ span: 8 }}>
                      <Form.Item
                        label="Gender"
                        name="gender"
                        labelCol={{
                          span: 24,
                          //offset: 2
                        }}
                        wrapperCol={{
                          span: 24,
                        }}
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: "Please select your gender!",
                          },
                        ]}
                      >
                        <Radio.Group style={{ width: "100%" }}>
                          <Radio value="Male">Male</Radio>
                          <Radio value="Female">Female</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={12}>
                    <Col xs={{ span: 24 }} md={{ span: 16 }}>
                      <Form.Item
                        label="Address"
                        name="address"
                        labelCol={{
                          span: 24,
                          //offset: 2
                        }}
                        wrapperCol={{
                          span: 24,
                        }}
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: "Please enter your address!",
                          },
                        ]}
                      >
                        <Input placeholder="House No./Street Name/Barangay/Municipality/Province" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
              </Row>
              <h2>VIOLATION DETAILS:</h2>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 12 }} layout="vertical">
                  <Form.Item
                    label="Violation"
                    name="violation"
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
                        message: "Please select a violation!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select an Account Type"
                    // onChange={onGradeChange}
                    >
                      {ViolationData.map((value, index) => (
                        <Select.Option key={index} value={value.value}>
                          {value.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }}>
                  <Form.Item
                    label="Violation Date"
                    name="violationDate"
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
                        message: "Please input a date!",
                      },
                    ]}
                  >
                    <DatePicker
                      format="YYYY-MM-DD"
                      // disabledDate={disableDates}
                      // onChange={(date) => setSelectedDate(date)}
                      style={{ width: "100%", marginBottom: 20 }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 24 }}>
                  <Form.Item
                    label="Sanction"
                    name="sanction"
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
                        message: "Please input a sanction!",
                      },
                    ]}
                  >
                    <TextArea
                      rows={5}
                      maxLength={500}
                      showCount
                      placeholder="Enter Sanction"
                    />
                  </Form.Item>
                </Col>
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
          violationDataFetch={violationDataFetch}
        />
      ) : null}
    </Box >
  );
};

export default StudentsViolation;
