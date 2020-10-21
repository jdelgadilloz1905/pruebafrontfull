import React, { Component } from "react";
import { Card, Col, Row, Form, Input, Button, message } from "antd";
import { Link, Redirect } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Image from "./images/fondo.JPG";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false,
    };
  }
  formSuccess = (datos) => {
    console.log("Cuenta creada con exito", datos);

    let getlocal = localStorage.getItem("cuentasUsuarios");

    let listaActual = [];

    const datosAcount = [
      {
        username: datos.username,
        email: datos.email,
        nombres: datos.nombres,
        password: datos.password,
        tipo: "directo",
      },
    ];

    if (
      getlocal != null &&
      getlocal != "" &&
      getlocal != false &&
      getlocal != undefined
    ) {
      //comprobamos que nuestra variable CUENTAS EXISTA

      listaActual = JSON.parse(getlocal);

      listaActual.push({
        username: datos.username,
        email: datos.email,
        nombres: datos.nombres,
        password: datos.password,
        tipo: "directo",
      });

      localStorage.setItem("cuentasUsuarios", JSON.stringify(listaActual));
    } else {
      localStorage.setItem("cuentasUsuarios", JSON.stringify(datosAcount));
    }

    message.success(
      "Cuenta creada con exito, sera redireccionado en breve",
      3,
      this.protectedComponent
    );
  };

  protectedComponent = () => {
    this.setState({
      status: true,
    });
  };

  render() {
    if (this.state.status) {
      return <Redirect to="/login" />;
    }

    return (
      <div className="site-card-wrapper">
        <Row gutter={2} justify="center">
          <Col xs={24} sm={20} md={20} lg={6}>
            <Card title="Register" bordered={false}>
              <Form
                name="normal_login"
                className="login-form "
                initialValues={{
                  remember: true,
                }}
                onFinish={this.formSuccess}
              >
                <Form.Item
                  name="nombres"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, ingrese nombre completo",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Nombres"
                  />
                </Form.Item>
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, ingrese el usuario",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Username"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Por favor, ingrese un email valido",
                    },
                  ]}
                >
                  <Input prefix="@" placeholder="Email" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrase la constraseña",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Create Acount
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Link to="/login">back!</Link>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col xs={24} sm={20} md={20} lg={10}>
            <img src={Image} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Register;
