import React, { useState } from "react";
import { Button, Input, Divider, Space, Form, Row, Col, Modal, Typography } from "antd";
import {
  RollbackOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  FormOutlined
} from "@ant-design/icons";
import { ToastContainer, toast, Bounce } from "react-toastify";
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;

export const ViewDetailsMOdal = (props) => {
  const [form] = Form.useForm();
  const { viewDetailsData, viewDetailsModal, setViewDetailsData, setViewDetailsModal, loginData, getRequestForms } = props;
  const [requestStatusChange, setRequestStatusChange] = useState(null);
  const [addNoteModal, setAddNoteModal] = useState(false);

  const buttonClick = async (action) => {
    setRequestStatusChange(action);
    setAddNoteModal(true);
    setViewDetailsModal(false);
  };

  const onConfirmUpdate = () => {
    form.submit();
  };

  const onFinishUpdate = async (values) => {
    values.requestStatus = requestStatusChange;
    console.log(values);
    const data = await fetch(`/api/requests/status/${viewDetailsData._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const res = await data.json();

    if (res.status === 200) {
      toast.success(`${requestStatusChange} SUCCESSFULLY`, {
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
      getRequestForms();
      setRequestStatusChange('');
      setAddNoteModal(false);
      setViewDetailsData('');
      form.resetFields();
    }

  };
  const onFinishUpdateFailed = async () => { };
  return (
    <>
      <ToastContainer />
      <Modal
        key="RequestFormDetails"
        title="DETAILS"
        width={1200}
        open={viewDetailsModal}
        onCancel={() => {
          setViewDetailsModal(false);
          setViewDetailsData();
        }}
        footer={[
          loginData && loginData?.body?.userType !== "STUDENT" && viewDetailsData && viewDetailsData.requestStatus === "PENDING" ? (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              key="approve"
              onClick={() => {
                buttonClick('APPROVED');
              }}
            >
              APPROVE
            </Button>
          ) : null,
          loginData && loginData?.body?.userType !== "STUDENT" && viewDetailsData && viewDetailsData.requestStatus === "PENDING" ? (
            <Button
              type="primary"
              danger
              icon={<CloseCircleOutlined />}
              key="reject"
              onClick={() => {
                buttonClick('REJECTED');
              }}
            >
              REJECT
            </Button>
          ) : null,
          loginData && loginData?.body?.userType === "STUDENT" && viewDetailsData.requestStatus === "PENDING" ? (
            <Button
              type="primary"
              danger
              icon={<CloseCircleOutlined />}
              key="cancel"
              onClick={() => {
                buttonClick('CANCELLED');
              }}
            >
              CANCEL
            </Button>
          ) : null,

          <Button
            danger
            icon={<RollbackOutlined />}
            key="close"
            onClick={() => {
              setViewDetailsModal(false);
              setViewDetailsData();
            }}
          >
            CLOSE
          </Button>,
        ]}
        extra={<Space></Space>}
      >
        <Row>
          <Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
          <Col xs={{ span: 24 }} md={{ span: 16 }}>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Title
                  level={5}
                  style={{
                    marginTop: "20px",
                  }}
                >
                  Request Type
                </Title>
                <Input
                  value={viewDetailsData?.request}
                  readOnly
                  style={{ borderRadius: "10px" }}
                />
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }} layout="vertical">
                <Title
                  level={5}
                  style={{
                    marginTop: "20px",
                  }}
                >
                  Requestor Name
                </Title>
                <Input
                  value={viewDetailsData?.requestorName}
                  readOnly
                  style={{ borderRadius: "10px" }}
                />
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Title
                  level={5}
                  style={{
                    marginTop: "20px",
                  }}
                >
                  Student Id
                </Title>
                <Input
                  value={viewDetailsData?.studentId}
                  readOnly
                  style={{ borderRadius: "10px" }}
                />
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Title
                  level={5}
                  style={{
                    marginTop: "20px",
                  }}
                >
                  Email
                </Title>
                <Input
                  value={viewDetailsData?.email}
                  readOnly
                  style={{ borderRadius: "10px" }}
                />
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Title
                  level={5}
                  style={{
                    marginTop: "20px",
                  }}
                >
                  Contact Number
                </Title>
                <Input
                  value={viewDetailsData?.contact}
                  readOnly
                  style={{ borderRadius: "10px" }}
                />
              </Col>

            </Row>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Title
                  level={5}
                  style={{
                    marginTop: "20px",
                  }}
                >
                  Request Date
                </Title>
                <Input
                  value={moment(viewDetailsData?.requestDate).format('LL')}
                  readOnly
                  style={{ borderRadius: "10px" }}
                />
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Title
                  level={5}
                  style={{
                    marginTop: "20px",
                  }}
                >
                  Approximate Distribution Date
                </Title>
                <Input
                  value={moment(viewDetailsData?.approximateDistributionDate).format('LL')}
                  readOnly
                  style={{ borderRadius: "10px" }}
                />
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Title
                  level={5}
                  style={{
                    marginTop: "20px",
                  }}
                >
                  Request Status
                </Title>
                <Input
                  value={viewDetailsData?.requestStatus}
                  readOnly
                  style={{ borderRadius: "10px" }}
                />
              </Col>
            </Row>
            <Divider orientation="left" orientationMargin="0" style={{ borderColor: 'blue' }}>
              <h3>REQUEST DETAILS</h3>
            </Divider>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Title
                  level={5}
                  style={{
                    marginTop: "20px",
                  }}
                >
                  Course
                </Title>
                <Input
                  value={viewDetailsData?.course}
                  readOnly
                  style={{ borderRadius: "10px" }}
                />
              </Col>
              {viewDetailsData?.request === 'Certificate of Enrollment' || viewDetailsData?.request === 'Certificate of Grades' || viewDetailsData?.studentStatus === 'Non-Graduate' ? (
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                  <Title
                    level={5}
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    Year
                  </Title>
                  <Input
                    value={viewDetailsData?.year}
                    readOnly
                    style={{ borderRadius: "10px" }}
                  />
                </Col>
              ) : null}
              {viewDetailsData?.request === 'Certificate of Enrollment' || viewDetailsData?.request === 'Certificate of Grades' || viewDetailsData?.studentStatus === 'Non-Graduate' ? (
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                  <Title
                    level={5}
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    Section
                  </Title>
                  <Input
                    value={viewDetailsData?.section}
                    readOnly
                    style={{ borderRadius: "10px" }}
                  />
                </Col>
              ) : null}
              {viewDetailsData?.request === 'Transcript of Records' || viewDetailsData?.request === 'Diploma' || viewDetailsData?.studentStatus === 'Graduate' ? (
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                  <Title
                    level={5}
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    Year Graduated
                  </Title>
                  <Input
                    value={viewDetailsData?.yearGraduated}
                    readOnly
                    style={{ borderRadius: "10px" }}
                  />
                </Col>
              ) : null}
              {viewDetailsData?.request === 'Certificate of Grades' ? (
                <Col xs={{ span: 24 }} md={{ span: 16 }} layout="vertical">
                  <Title
                    level={5}
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    Request Range (COG)
                  </Title>
                  <Input
                    value={viewDetailsData?.requestRange}
                    readOnly
                    style={{ borderRadius: "10px" }}
                  />
                </Col>
              ) : null}
            </Row>
            {viewDetailsData?.requestStatus === "REJECTED" || viewDetailsData?.requestStatus === "APPROVED" || viewDetailsData?.requestStatus === "CANCELLED" ? (
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 24 }} layout="vertical">
                  <Title
                    level={5}
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    {viewDetailsData?.requestStatus === "REJECTED" ? "Rejection Notes" : viewDetailsData?.requestStatus === "APPROVED" ? "Approval Notes" : "Cancellation Notes"}
                  </Title>
                  <TextArea
                    rows={3}
                    maxLength={500}
                    showCount
                    placeholder="Enter Notes"
                    value={viewDetailsData?.notes}
                    readOnly
                  />
                </Col>
              </Row>
            ) : null}
            <br />
            <br />
          </Col>
        </Row>
      </Modal>

      <Modal
        key="addNotesModal"
        title="ADD NOTE"
        width={400}
        open={addNoteModal}
        onCancel={() => {
          setAddNoteModal(false);
        }}

        footer={[
          <Button
            icon={<FormOutlined />}
            type="primary"
            key="update"
            onClick={() => onConfirmUpdate()}
            style={{ marginRight: "10px" }}
          >
            Update
          </Button>,
          <Button
            type="primary"
            danger
            icon={<RollbackOutlined />}
            key="cancel"
            onClick={() => {
              setAddNoteModal(false);
              setViewDetailsData('');
              form.resetFields();
            }}
          >
            Cancel
          </Button >,
        ]}
      >
        <Form
          form={form}
          labelCol={{
            span: 12,
          }}
          layout="horizontal"
          onFinish={onFinishUpdate}
          onFinishFailed={onFinishUpdateFailed}
          autoComplete="off"
          style={{
            width: "100%",
          }}
        >
          <Col xs={{ span: 24 }} md={{ span: 24 }} layout="vertical">
            <Form.Item
              label="Notes"
              name="notes"
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
                  message: "Please input notes!",
                },
              ]}
            >
              <TextArea
                rows={5}
                maxLength={500}
                showCount
                placeholder="Enter Notes"
              />
            </Form.Item>
            <br />
            <br />
          </Col>
        </Form>
      </Modal >

    </>
  );
};