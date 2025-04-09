import { useRef, useEffect, useState, useContext } from "react";
import { AccountTypeData } from './data';
import { Box, Typography, useTheme } from "@mui/material";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
  Button,
  Drawer,
  Table,
  Form,
  Row,
  Col,
  Select,
  Input,
  Space,
  message,
  Tag,
  Radio
} from "antd";
import {
  SearchOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  PlusCircleOutlined,
  FormOutlined
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import moment from 'moment';
import './style.css';
import { LoginContext } from '../../context/Context';


const Accounts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // eslint-disable-next-line no-unused-vars
  const { loginData, setLoginData } = useContext(LoginContext);
  const [form] = Form.useForm();
  const searchInput = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [accounts, setAccounts] = useState();

  // Data
  const getStudentAccount = async () => {
    const data = await fetch('/api/accounts', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await data.json();
    setAccounts(res.body);
  };

  //Pagination
  let studentAccountCount = 0;
  for (var key1 in accounts) {
    if (accounts.hasOwnProperty(key1)) {
      studentAccountCount++;
    }
  }

  // eslint-disable-next-line no-unused-vars
  const [paginationAccount, setPaginationAccount] = useState({
    defaultCurrent: 1,
    pageSize: 8,
    total: studentAccountCount,
  });


  // Modal
  const handleOpenModal = () => {
    setIsOpen(true);
  };


  const onClose = () => {
    setIsOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    const data = await fetch('/api/registration', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const res = await data.json();

    if (res.status === 200) {
      message.success("Registration Successfully Completed");
      onClose();
      getStudentAccount();
    } else {
      message.error(data.error);
    }
  };

  const onDeactivateAccount = async (record) => {
    const data = await fetch(`/api/change-account-status?userId=${record._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await data.json();

    if (res.status === 200) {
      toast.success(res.body.acctStatus === "ACTIVE"
        ? "Account Activated Succesfully"
        : "Account Deactivated Successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      getStudentAccount();
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
      title: "User ID",
      dataIndex: "_id",
      key: "_id",
      width: "10%",
      ...getColumnSearchProps("_id"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "10%",
      ...getColumnSearchProps("_id"),
    },
    {
      title: "Account Type",
      dataIndex: "userType",
      key: "userType",
      width: "10%",
      render: (_, { userType }) => {
        let color;
        if (userType === 'ADMIN') {
          color = 'red';
        } else if (userType === 'GUIDANCE OFFICER') {
          color = 'blue';
        } else {
          color = 'green';
        }
        return (
          <Tag color={color} key={userType}>
            {userType.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        {
          text: "ADMIN",
          value: "ADMIN",
        },
        {
          text: "GUIDANCE OFFICER",
          value: "GUIDANCE OFFICER",
        },
        {
          text: "STUDENT",
          value: "STUDENT",
        }
      ],
      onFilter: (value, record) => record.userType.indexOf(value) === 0,
    },
    {
      title: "Account Creation",
      dataIndex: "created",
      key: "created",
      width: "10%",
      render: (_, { created }) => {
        return (
          moment(created).format('MMMM Do YYYY, h:mm:ss a')
        );
      }
    },
    {
      title: "Status",
      dataIndex: "acctStatus",
      key: "acctStatus",
      width: "10%",
      render: (_, { acctStatus }) => {
        let color;
        if (acctStatus === 'ACTIVE') {
          color = 'green';
        } else {
          color = 'red';
        }
        return (
          <Tag color={color} key={acctStatus}>
            {acctStatus.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        {
          text: "ACTIVE",
          value: "ACTIVE",
        },
        {
          text: "DISABLE",
          value: "DISABLE",
        },
      ],
      onFilter: (value, record) => record.acctStatus.indexOf(value) === 0,
    },
    {
      title: (
        <>
          {loginData?.body?.userType === 'ADMIN' ? (
            <Button
              type="primary"
              shape="round"
              icon={<PlusCircleOutlined />}
              onClick={() => handleOpenModal()}
              style={{
                backgroundColor: "#000080",
                border: "1px solid #d9d9d9",
                float: 'right'
              }}
            >
              CREATE EMPLOYEE ACCOUNT
            </Button>) : null}
        </>
      ),
      dataIndex: "",
      key: "",
      width: "10%",
      render: (record) => (
        <>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <Button
              key="view"
              icon={record.acctStatus === "ACTIVE" ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
              type="primary"
              onClick={() => {
                onDeactivateAccount(record);
              }}
              style={{ backgroundColor: record.acctStatus === "ACTIVE" ? "red" : "green", border: "1px solid #d9d9d9" }}
            >
              {record.acctStatus === "ACTIVE" ? "DEACTIVATE" : "ACTIVATE"}
            </Button>
          </div>
        </>
      ),
    },
  ];

  useEffect(() => {
    getStudentAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const width = window.innerWidth;

  return (
    <Box m="20px">
      <ToastContainer />
      <Header title="ACCOUNTS" subtitle="Managing the User Accounts" />
      {/* <DataGrid checkboxSelection rows={mockDataTeam} columns={columns} /> */}
      <Box marginBottom="20px">
        <Typography
          variant="h5"
          fontWeight="600"
          color={colors.grey[100]}
        >
          USER ACCOUNTS
        </Typography>
      </Box>
      <Table
        key="ACCOUNTS"
        columns={columns}
        dataSource={accounts}
        pagination={paginationAccount}
      />

      <Drawer
        title="CREATE EMPLOYEE ACCOUNT"
        key="EmployeeAccount"
        placement="right"
        onClose={onClose}
        open={isOpen}
        height="100%"
        width="50%"
        style={{
          display: "flex",
          justifyContent: "center",
          // marginLeft: "342px",
        }}
        extra={<Space></Space>}
        footer={[
          <div
            style={
              width >= 450
                ? { display: "flex", justifyContent: "flex-end" }
                : { display: "flex", justifyContent: "flex-start" }
            }
          >
            <Button type="primary" onClick={() => form.submit()}>
              <FormOutlined style={{ marginTop: '1px' }} /> CONFIRM REGISTRATION
            </Button>
          </div>,
        ]}
      >
        <Form
          form={form}
          labelCol={{
            span: 8,
          }}
          layout="horizontal"
          onFinish={onFinish}
          autoComplete="off"
          style={{
            width: "100%",
          }}
        >
          <Row>
            {/* <Col xs={{ span: 0 }} md={{ span: 4 }}></Col> */}
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
                        pattern: /^[a-zA-Z]*$/,
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
                        pattern: /^[a-zA-Z]*$/,
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
                    label="Employee ID"
                    name="userId"
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
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Form.Item
                    label="Account Type"
                    name="userType"
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
                        message: "Select an Account Type",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select an Account Type"
                    // onChange={onGradeChange}
                    >
                      {AccountTypeData.map((value, index) => (
                        <Select.Option key={index} value={value.value}>
                          {value.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Form.Item
                    label="Email"
                    name="email"
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
                        type: "email",
                        required: true,
                        message: "Please enter a valid email",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your email" />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Form.Item
                    label="Password"
                    name="password"
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
                        message: "Please input your password!",
                      },
                      { whitespace: true },
                      { min: 8, message: 'Password must be at least 8 characters' },
                      { max: 26, message: 'Password cannot be longer than 26 characters' },
                      {
                        pattern:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,26}$/,
                        message:
                          "Must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
                      },
                    ]}
                  >
                    <Input.Password placeholder="********" />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 8 }}>
                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    labelCol={{
                      span: 24,
                      //offset: 2
                    }}
                    wrapperCol={{
                      span: 24,
                      //offset: 2
                    }}
                    hasFeedback
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Confirm Password is required!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }

                          return Promise.reject("Passwords does not matched.");
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="********" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
          </Row>
        </Form>
      </Drawer>
    </Box >
  );
};

export default Accounts;
