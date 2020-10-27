import React, { Component } from "react";
import { Card, Col, Row, Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import { Link } from "react-router-dom";
import Image from "./images/fondo.JPG";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datos: {
        username: "",
        email: "",
        nombres: "",
        password: "",
        tipo: "",
      },
      cuentas: [],
    };
  }

  formSuccess = (datos) => {
    //VALIDAR QUE LOS DATOS EXISTEN PARA INGRESAR A LA api DE VUE
    let getlocal = JSON.parse(localStorage.getItem("cuentasUsuarios"));

    this.validarDatos(getlocal, datos);

    //this.enviarDatosApiRest(datos);
  };

  enviarDatosApiRest = (datos) => {
    axios
      .post(
        "http://localhost/frontendret/apiRet/apiLoginReact",
        JSON.stringify({
          usuario: datos.username,
          password: datos.password,
          funcion: "validarLoginPrueba",
        })
      )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  validarDatos = (getlocal, datos) => {
    let existe = false;

    for (var i = getlocal.length - 1; i >= 0; i--) {
      if (
        getlocal[i]["username"] === datos.username ||
        getlocal[i]["email"] === datos.username
      ) {
        existe = true;

        const datosSesion = {
          username: getlocal[i]["username"],
          email: getlocal[i]["email"],
          nombres: getlocal[i]["nombres"],
          password: getlocal[i]["password"],
          tipo: getlocal[i]["tipo"],
        };

        this.setState({
          datos: datosSesion,
        });
      }
    }

    if (existe) {
      const variableSesion = {
        username: this.state.datos.username,
        email: this.state.datos.email,
        nombres: this.state.datos.nombres,
        tipo: this.state.datos.tipo,
      };
      //valido que la clave sea igua, pero si el tipo es diferente a google y facebook pasa directo
      if (this.state.datos.tipo === "directo") {
        if (this.state.datos.password === datos.password) {
          //CREO LAS VARIABLES DE SESION Y LO REDIRECCIONO A VUE

          localStorage.setItem(
            "variableSesion",
            JSON.stringify(variableSesion)
          );

          message.success("Inicio de sesion exitoso");
          //lo redirecciono con el state cambiando el estatus
          this.redireccionoPagina();
        } else {
          message.error("Las contraseñas no coinciden, intente nuevamente");
        }
      } else {
        //si es google o facebook debo registrarlo

        localStorage.setItem("variableSesion", JSON.stringify(variableSesion));
        message.success("Inicio de sesion exitoso con google o facebook ");
        //lo redirecciono con el state cambiando el estatus
        this.redireccionoPagina();
      }
    } else {
      message.error(
        "Se ha producido un problema al iniciar sesión. Comprueba el correo electrónico y la contraseña o crea una cuenta."
      );
    }
  };

  responsefacebook = (response) => {
    //VALIDAR QUE LOS DATOS EXISTEN PARA INGRESAR A LA api DE VUE
    let getlocal = JSON.parse(localStorage.getItem("cuentasUsuarios"));

    const datosSesion = {
      username: response.email,
      email: response.email,
      nombres: response.name,
      password: "",
      tipo: "facebook",
    };

    this.setState({
      datos: datosSesion,
    });

    this.validarDatosRedes(getlocal, datosSesion);
  };

  responseGoogle = (response) => {
    console.log(response);
    if (
      response.profileObj != null &&
      response.profileObj !== "" &&
      response.profileObj !== false &&
      response.profileObj !== undefined
    ) {
      //VALIDAR QUE LOS DATOS EXISTEN PARA INGRESAR A LA api DE VUE
      let getlocal = JSON.parse(localStorage.getItem("cuentasUsuarios"));
      console.log(response);

      let correo = response.profileObj.email;

      const datosSesion = {
        username: correo,
        email: correo,
        nombres: response.profileObj.name,
        password: "",
        tipo: "google",
      };

      this.setState({
        datos: datosSesion,
      });

      this.validarDatosRedes(getlocal, datosSesion);
    }
  };

  validarDatosRedes = (getlocal, datos) => {
    let existe = false;

    let listaActual = [];

    if (
      getlocal != null &&
      getlocal !== "" &&
      getlocal !== false &&
      getlocal !== undefined
    ) {
      for (var i = getlocal.length - 1; i >= 0; i--) {
        if (getlocal[i]["email"] === datos.email) {
          existe = true;

          const datosSesion = {
            username: getlocal[i]["username"],
            email: getlocal[i]["email"],
            nombres: getlocal[i]["nombres"],
            password: getlocal[i]["password"],
            tipo: getlocal[i]["tipo"],
          };

          this.setState({
            datos: datosSesion,
          });
        }
      }
    }

    if (!existe) {
      //TENGO QUE CREAR LE REGISTRO Y POSTERIORMENTE LO REDIRECCIONO
      if (
        getlocal != null &&
        getlocal !== "" &&
        getlocal !== false &&
        getlocal !== undefined
      ) {
        listaActual = getlocal;
      }

      listaActual.push({
        username: datos.username,
        email: datos.email,
        nombres: datos.nombres,
        password: datos.password,
        tipo: datos.tipo,
      });

      localStorage.setItem("cuentasUsuarios", JSON.stringify(listaActual));
    }
    //CREO LA VARIABLE DE SESION Y LO REDIRECCIONO
    const variableSesion = {
      username: this.state.datos.email,
      email: this.state.datos.email,
      nombres: this.state.datos.nombres,
      tipo: this.state.datos.tipo,
    };
    localStorage.setItem("variableSesion", JSON.stringify(variableSesion));

    message.success("Inicio de sesion exitoso con google o facebook ");
    //lo redirecciono con el state cambiando el estatus
    this.redireccionoPagina();
  };

  redireccionoPagina = () => {
    //window.location.href = "http://192.168.1.107:8080";
  };
  render() {
    return (
      <div className="site-card-wrapper">
        <Row gutter={2} justify="center">
          <Col xs={24} sm={20} md={20} lg={6}>
            <Card title="Log in" bordered={false}>
              <Form
                name="normal_login"
                className="login-form "
                initialValues={{
                  remember: true,
                }}
                onFinish={this.formSuccess}
              >
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
                    placeholder="Username o Email"
                  />
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
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <Link to="/password" className="login-form-forgot">
                    Forgot password
                  </Link>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Log in
                  </Button>
                  Or <Link to="/register">register now!</Link>
                </Form.Item>

                <Form.Item>
                  <FacebookLogin
                    appId="677008956573662"
                    autoLoad={false}
                    fields="name,email,picture"
                    icon="fa fa-facebook"
                    textButton="&nbsp;&nbsp;Sign In with Facebook"
                    cssClass="btnFacebook"
                    callback={this.responsefacebook}
                  />
                </Form.Item>
                <Form.Item>
                  <GoogleLogin
                    clientId="179477807979-8t7rnt3l9no1i4e0p1fa0kol5tep9c80.apps.googleusercontent.com"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                    className="btnGoogle"
                    icon={false}
                  >
                    <i
                      className="fa fa-google-plus"
                      style={{ marginLeft: "40px" }}
                    />
                    <span>&nbsp;&nbsp;Sign In with Google</span>
                  </GoogleLogin>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col xs={24} sm={20} md={20} lg={10}>
            <img src={Image} alt="" />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Login;
