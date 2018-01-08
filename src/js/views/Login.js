import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/auth.actions';

import { getEventMany } from '../actions/event.actions';

import PropTypes from 'prop-types';
import Form from '../components/Global/Form';
import Input from '../components/Global/Input';

class Login extends Component {
  static propTypes = {
    setNextRoute: PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleAsyncLoginButtonClick = this.handleAsyncLoginButtonClick.bind(this);
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    let location;
    if (this.props.history.location.state) {
      location = this.props.history.location.state.from.pathname;
    } else {
      location = null;
    }
    this.props.setNextRoute(location);

    if(this.refs.form.validate()) {
      this.handleAsyncLoginButtonClick();
    }
  }

  handleAsyncLoginButtonClick() {

      const params = {
        email: this.state.email,
        password: this.state.password,
      }

      this.props.signIn(params);
  }

  render() {

    const {
      email,
      password,
    } = this.state;

    const loginError = this.props.error ? this.props.error : null;

    return (
      <div className="page__content">
        <section className="form-page">
          <div className="form-page__container">
            <h2 className="form-page__title">BandMom</h2>
            <Form className="form-page__form"
              onSubmit={ this.handleFormSubmit }
              ref="form"
              // disabled={ this.props.loading }
              error={ loginError }
            >
              <Input type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={this.handleInputChange}
                // validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: {} }}
              />
              <Input type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={this.handleInputChange}
                // validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: {} }}
              />
              <p className="form-page__text">
                <Link to="/forgot-password">Forgot password?</Link>
              </p>
              <Input type="submit"
                value="Login"
              />
              <p className="form-page__text">
                Dont have an account? <Link to="/register">Sign Up</Link>
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
    user: state.auth.user,
    error: state.app.error,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onGetUser: actions.getUser,
    onGetEventMany: getEventMany,
    setNextRoute: actions.setNextRoute,
    signIn: actions.signIn,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
