import React, { useState } from "react";
import { Button, Input, Divider, Space, Form, Row, Col, Modal, Typography } from "antd";
import {
  RollbackOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  FormOutlined
} from "@ant-design/icons";
import { toast, Bounce } from "react-toastify";
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;

export const ViewDetailsMOdal = (props) => {
  const [form] = Form.useForm();
  const { viewDetailsData, viewDetailsModal, setViewDetailsData, setViewDetailsModal, violationDataFetch } = props;
  const [requestStatusChange, setRequestStatusChange] = useState(null);
  const [addNoteModal, setAddNoteModal] = useState(false);

  const buttonClick = async (action) => {
    setRequestStatusChange(action);
    setAddNoteModal(true);
    setViewDetailsModal(false);
  };

  const onConfirmUpdate = () => {
    form.submit();
    setAddNoteModal(false);
    violationDataFetch();
  };

  const onFinishUpdate = async (values) => {
    values.requestStatus = requestStatusChange;
    const data = await fetch(`/api/violation/status/${viewDetailsData._id}`, {
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
      violationDataFetch();
      setRequestStatusChange('');
      setAddNoteModal(false);
      setViewDetailsData('');
      form.resetFields();
    }

  };
  const onFinishUpdateFailed = async () => { };
  return (
    <>
      {/* <ToastContainer /> */}
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
          viewDetailsData?.violationStatus === "IN PROGRESS" ? (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              key="approve"
              onClick={() => {
                buttonClick('COMPLETED');
              }}
            >
              COMPLETED
            </Button>
          ) : null,
          viewDetailsData?.violationStatus === "IN PROGRESS" ? (
            <Button
              type="primary"
              danger
              icon={<CloseCircleOutlined />}
              key="reject"
              onClick={() => {
                buttonClick('INCOMPLETE');
              }}
            >
              INCOMPLETE
            </Button>
          ) : null,
          viewDetailsData?.violationStatus === "IN PROGRESS" ? (
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
            <Divider orientation="left" orientationMargin="0" style={{ borderColor: 'blue' }}>
              <h3>VIOLATOR DETAILS:</h3>
            </Divider>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Title
                  level={5}
                  style={{
                    marginTop: "20px",
                  }}
                >
                  First Name
                </Title>
                <Input
                  value={viewDetailsData?.firstName}
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
                  Middle Name
                </Title>
                <Input
                  value={viewDetailsData?.middleName}
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
                  Last Name
                </Title>
                <Input
                  value={viewDetailsData?.lastName}
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
                  Contact Number
                </Title>
                <Input
                  value={viewDetailsData?.contact}
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
                  Gender
                </Title>
                <Input
                  value={viewDetailsData?.gender}
                  readOnly
                  style={{ borderRadius: "10px" }}
                />
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 16 }} layout="vertical">
                <Title
                  level={5}
                  style={{
                    marginTop: "20px",
                  }}
                >
                  Address
                </Title>
                <Input
                  value={viewDetailsData?.address}
                  readOnly
                  style={{ borderRadius: "10px" }}
                />
              </Col>
            </Row>
            <Divider orientation="left" orientationMargin="0" style={{ borderColor: 'blue' }}>
              <h3>VIOLATION DETAILS:</h3>
            </Divider>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Title
                  level={5}
                  style={{
                    marginTop: "20px",
                  }}
                >
                  Violation
                </Title>
                <Input
                  value={viewDetailsData?.violation}
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
                  Date of Violation
                </Title>
                <Input
                  value={moment(viewDetailsData?.violationDate).format('LL')}
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
                  Status
                </Title>
                <Input
                  value={viewDetailsData?.violationStatus}
                  readOnly
                  style={{ borderRadius: "10px" }}
                />
              </Col>
            </Row>
            {viewDetailsData?.violationStatus === "COMPLETED" || viewDetailsData?.violationStatus === "INCOMPLETE" || viewDetailsData?.violationStatus === "CANCELLED" ? (
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 24 }} layout="vertical">
                  <Title
                    level={5}
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    Notes
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