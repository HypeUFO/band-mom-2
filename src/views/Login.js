import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import history from '../history';
// import { authAsyncLogin } from 'actions/auth';
// import backgroundImg from '../../../assets/img/login/login-bg.png';
import Form from '../components/Global/Form';
import Input from '../components/Global/Input';

export default class Login extends Component {
  static propTypes = {
    // asyncLoginData: PropTypes.object,
    // asyncLoginError: PropTypes.object,
    // asyncLoginLoading: PropTypes.bool,
    // authenticated: PropTypes.bool,
    // from react-redux connect
    // dispatch: PropTypes.func,
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
    if(this.refs.form.validate()) {
      this.handleAsyncLoginButtonClick();
    }
  }

  handleAsyncLoginButtonClick() {
    const { dispatch } = this.props;
    let params = {
      name: this.state.username,
      password: this.state.password,
    };
    // dispatch(authAsyncLogin(params))
    // .then(() => {
      // history.push(`/${params.name}/dashboard`);
      history.push(`/dashboard`);
    // });
  }

  render() {
    const {
      // asyncLoginData,
      // asyncLoginError,
      // asyncLoginLoading,
    } = this.props;

    const {
      email,
      password,
    } = this.state;

    // Error
    // let loginError = (asyncLoginError) ? asyncLoginError.get('error')  : '';

    return (
      <div className="page__content">
        <section className="form-page">
          <div className="form-page__container">
            <h2 className="form-page__title">BandMom</h2>
            <Form className="form-page__form"
              onSubmit={ this.handleFormSubmit }
              ref="form"
              // disabled={ asyncLoginLoading }
              // error={ loginError }
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
