import React from 'react';
import Hero from '../components/Hero';
import Carousel from '../components/Carousel';
import Header from '../components/Global/Header';
import Form from '../components/Global/Form';
import Input from '../components/Global/Input';
import { Link } from 'react-router-dom';

class Landing extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      email: '',
      fullName: '',
      company: '',
      address: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleAsyncRegisterButtonClick = this.handleAsyncRegisterButtonClick.bind(this);
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.refs.form.validate()) {
      this.handleAsyncRegisterButtonClick();
    }
  }

  handleAsyncRegisterButtonClick() {
    const { dispatch } = this.props;
    let params = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
    };
    console.log(params);
    // dispatch(registerAsync(params))
    // .then(() => {
      // if (this.props.asyncRegisterSuccess) {
        // FIX ME:
        // router is undefined?
        // using router.push works on login
        // not sure why it threw an error here
        // this.props.router.push('/login');
        this.props.history.push('/login');
      // }
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  }
  render() {
    const {
      username,
      email,
      fullName,
      company,
      address,
      phoneNumber,
      password,
      confirmPassword,
    } = this.state;
  return (
    <div className="landing">
      <Header />
      <Hero>
        {/* <Carousel /> */}
        {/* <div className="two-column-grid--container"> */}
        <div className="two-column-grid two-column-grid--container">
        <div className="two-column-grid__column two-column-grid__column--1">
        <h1 className="landing__header">Keep Your Team Informed</h1>
          <p className="landing__content">Easily manage your gigs</p>
          <p className="landing__content">Share gigs with bandmates</p>
          <p className="landing__content">Store stage plots, receive "time-to-leave" alerts, and more!</p>
        </div>
        <div className="two-column-grid__column two-column-grid__column--2">
        <h1 className="landing__header">Sign Up</h1>
        <Form
              className="form-page__form"
              onSubmit={ this.handleFormSubmit }
              ref="form"
              // disabled={ asyncRegisterLoading }
              // error={ registerError }
            >
              <Input
                type="text"
                name="email"
                placeholder="Email"
                value={ email }
                onChange={ this.handleInputChange }
                validation={ {
                  isLength: { min: 3, max: 30 },
                  isEmail: {}
                } }
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={ password }
                onChange={ this.handleInputChange }
                validation={ {
                  isLength: { min: 8, max: 30 },
                  isAlphanumeric: {},
                } }
              />
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={ confirmPassword }
                onChange={ this.handleInputChange }
                validation={ {
                  isLength: { min: 8, max: 30 },
                  isAlphanumeric: {}
                } }
              />
              <Input type="submit"
                value="Sign Up"
              />
              <p className="form-page__text">
                By clicking Sign Up, you agree to our <Link to="/terms">
                Terms & Conditions</Link>
              </p>
            </Form>
        </div>
        </div>
        {/* </div> */}
      </Hero>
    </div>
  )
}
}

export default Landing;