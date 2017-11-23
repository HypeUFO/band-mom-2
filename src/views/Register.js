import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Form from '../components/Global/Form';
import Input from '../components/Global/Input';

export default class Register extends Component {
  // static propTypes = {
  //   asyncRegisterData: PropTypes.object,
  //   asyncRegisterError: PropTypes.object,
  //   asyncRegisterLoading: PropTypes.bool,
  //   asyncRegisterSuccess: PropTypes.bool,
  //   // from react-redux connect
  //   dispatch: PropTypes.func,
  // }

  constructor() {
    super();
    this.state = {
      email: '',
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
        this.props.history.push('/login');
  }

  render() {
    const {
      // asyncRegisterData,
      // asyncRegisterError,
      // asyncRegisterLoading,
    } = this.props;

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

    // Error
    // const registerError = (asyncRegisterError) ? 'Server Error' : '';

    return (
      <div className="page__content">
        <section className="form-page">
          <div className="form-page__container">
            <h2 className="form-page__title">BandMom</h2>
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
                By signing up, you agree to our <Link to="/terms">
                Terms & Conditions</Link>
              </p>
            </Form>
          </div>
        </section>
      </div>
    );
  }
}
