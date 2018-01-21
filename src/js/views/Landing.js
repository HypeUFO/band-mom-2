import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../actions/auth.actions";
import Hero from "../components/Hero";
// import Carousel from '../components/Carousel';
import HeaderLanding from "../components/Global/HeaderLanding";
import Form from "../components/Global/Forms/Form";
import Input from "../components/Global/Input";
import { Link } from "react-router-dom";

import { auth } from "../config/fire";

class Landing extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleAsyncRegisterButtonClick = this.handleAsyncRegisterButtonClick.bind(
      this
    );
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
    let email = this.state.email;
    let password = this.state.password;
    let confirmPassword = this.state.confirmPassword;

    const promise = auth.createUserWithEmailAndPassword(email, password);
    promise.catch(err => this.setState({ registerError: err.message }));
    auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        const user = {
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber || "",
          displayName: firebaseUser.displayName || "",
          id: firebaseUser.uid,
          groups: {}
        };
        console.log("creating fireaseUser: " + JSON.stringify(user));
        this.props.onCreateUser(user);
      } else {
        console.log("not logged in");
      }
    });

    // this.props.history.push("/login");
  }
  render() {
    const { email, password, confirmPassword } = this.state;
    return (
      <div className="landing">
        <HeaderLanding />
        <Hero>
          <div className="two-column-grid two-column-grid--container">
            <div className="two-column-grid__column two-column-grid__column--1">
              <h1 className="landing__header">Keep Your Band Informed</h1>
              <p className="landing__content">Easily manage your gigs</p>
              <p className="landing__content">Share gigs with bandmates</p>
              <p className="landing__content">
                Store stage plots, receive "time-to-leave" alerts, and more!
              </p>
            </div>
            <div className="two-column-grid__column two-column-grid__column--2">
              <h1 className="landing__header">Sign Up</h1>
              <Form
                className="form-page__form"
                onSubmit={this.handleFormSubmit}
                ref="form"
                // disabled={ asyncRegisterLoading }
                // error={ registerError }
              >
                <Input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={this.handleInputChange}
                  validation={{
                    isLength: { min: 3, max: 30 },
                    isEmail: {}
                  }}
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={this.handleInputChange}
                  validation={{
                    isLength: { min: 8, max: 30 },
                    isAlphanumeric: {}
                  }}
                />
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={this.handleInputChange}
                  validation={{
                    isLength: { min: 8, max: 30 },
                    isAlphanumeric: {}
                  }}
                />
                <Input type="submit" value="Sign Up" />
                <p className="form-page__text">
                  By signing up, you agree to our{" "}
                  <Link to="/terms" style={{ color: "#7F4FFF" }}>
                    Terms & Conditions
                  </Link>
                </p>
              </Form>
            </div>
          </div>
        </Hero>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      onCreateUser: actions.createUser
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
