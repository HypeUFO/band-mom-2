import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/auth.actions';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Form from '../components/Global/Forms/Form';
import Input from '../components/Global/Input';

import { auth } from '../config/fire';

class Register extends Component {
  static propTypes = {
    onCreateUser: PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      registerError: '',
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
    let email = this.state.email;
    let password = this.state.password;

    const promise = auth.createUserWithEmailAndPassword(email, password);
    promise
    .catch((err) => this.setState({registerError: err.message}));

    auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        const user = {
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber || '',
          displayName: firebaseUser.displayName || '',
          id: firebaseUser.uid,
          groups: {},
        }
        console.log('creating fireaseUser: ' + JSON.stringify(user))
        this.props.onCreateUser(user);
      } else {
        console.log('not logged in');
      }
    })
  }

  render() {
    const {
      email,
      password,
      confirmPassword,
      registerError,
    } = this.state;

    // Error
    const registerErrorMessage = registerError ? registerError : '';

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
              error={ registerErrorMessage }
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

const mapStateToProps = (state) => {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onCreateUser: actions.createUser,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);