import React, { Component } from 'react'
import { Row, Col, Input, Button, Form, notification, Icon } from 'antd'
import logo from '../image/logoChokChai.png'
import jwtDecode from "jwt-decode";
import Axios from '../config/axios.setup'
import { withRouter } from 'react-router-dom'


class Login extends Component {
  state = {
    email: '',
    password: '',
    isAdmin: false,
    userId: '',
  };

  // componentDidMount = () => {
  //   let token = localStorage.getItem("ACCESS_TOKEN");
  //   console.log("token", token);
  //   if (token) {
  //     let userInfo = jwtDecode(token);
  //     console.log(userInfo);
  //     this.setState({
  //       isAdmin: userInfo.role === "admin" ? true : false,
  //       userId: userInfo.id
  //     });
  //   }

  //   Axios.post("/loginUser")
  //     .then(result => {
  //       localStorage.setItem("ACCESS_TOKEN",result.data.token)
  //       console.log(result.data)
  //     })
  //     .catch(err => {
  //       console.error(err);
  //     });
  // };

  openLoginSuccessNotification = () => {
    notification.open({
      message: `Login Successfully`,
      description: `Login Successfully`,
      placement: 'bottomRight',
      icon: <Icon type="check-circle" style={{ fontSize: 24, color: "green" }} />
    })
  }

  openLoginFailedNotification = () => {
    notification.open({
      message: `Login Failed`,
      description: `Login Failed`,
      placement: 'bottomRight',
      icon: <Icon type="close-circle" style={{ fontSize: 24, color: "crimson" }} />
    })
  }


  handleLogin = async (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll();
    try {
      const result = await Axios.post('/loginUser', {
        username: this.state.email,
        password: this.state.password
      })
      console.log('result', result)
      localStorage.setItem("ACCESS_TOKEN", result.data.token);
      this.props.history.push("/profile");
      this.openLoginSuccessNotification()
    } catch (err) {
      console.error(err.response.data)
      this.openLoginFailedNotification()
    }
  }

  handleLogOut = e => {
    e.preventDefault();
    localStorage.removeItem("ACCESS_TOKEN");
    // console.log("islogin", this.state.isLogin);
    this.setState({ isLogin: false });
  };

  checkOnline = () => {
    let token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
      Axios.post("/isTokenExpired", {})
        .then(result => {
          console.log(result.data);
          // this.props.history.push("/home");
        })
        .catch(err => {
          console.error(err);
        });
    }
  };


  render() {
    const { form } = this.props
    return (
      <Row style={{ height: '100%' }} type='flex' align="middle" justify="center">
        <Col >
          <Row type="flex" justify="center" align="middle">
            <Col type="flex" justify="center" align="middle">
              <img src={logo} alt="Logo Market" style={{ height: '100%', maxHeight: '300px', marginBottom: '100px' }}></img>
            </Col>
          </Row>
          <Row>
            <Form onSubmit={(e) => this.handleLogin(e)}>
              <Form.Item label="Email">
                {form.getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      message: 'Email is required',
                    },
                  ],
                })(<Input type="email" onChange={(e) => this.setState({ email: e.target.value })} />)}
              </Form.Item>
              <Form.Item label="Password">
                {form.getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: 'password is required',
                    },
                  ],
                })(<Input.Password onChange={(e) => this.setState({ password: e.target.value })} />)}
              </Form.Item>
              <Form.Item>
                <Row type="flex" justify="center" style={{ marginTop: '10px' }}>
                  <Button size="large" htmlType="submit" type="primary">
                    Login
                </Button>
                </Row>
              </Form.Item>
            </Form>
          </Row>
        </Col>
      </Row>
    )
  }
}

const loginForm = Form.create({ name: 'login' })(Login)
export default withRouter(loginForm)