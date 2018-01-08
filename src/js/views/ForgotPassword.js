// import React from 'react';

// const ForgotPassword = () => {
//   return (
//     <div>
//       Forgot Password Page
//     </div>
//   )
// }

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/auth.actions';

import { getEventMany } from '../actions/event.actions';

import PropTypes from 'prop-types';
import Form from '../components/Global/Form';
import Input from '../components/Global/Input';

class ForgotPassword extends Component {
  static propTypes = {
    resetPassword: PropTypes.func,
    setNextRoute: PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      email: '',
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
    this.props.setNextRoute('/login');

    if(this.refs.form.validate()) {
      this.handleAsyncLoginButtonClick();
    }
  }

  handleAsyncLoginButtonClick() {

      let email = this.state.email;

      // this.props.resetPassword(email);
  }

  render() {

    const {
      email,
    } = this.state;

    const resetPWError = this.props.error

    return (
      <div className="page__content">
        <section className="form-page">
          <div className="form-page__container">
            <h2 className="form-page__title">BandMom</h2>
            <p className="form-page__title">Reset Password</p>
            <Form className="form-page__form"
              onSubmit={ this.handleFormSubmit }
              ref="form"
              // disabled={ asyncLoginLoading }
              error={ resetPWError }
            >
              <Input type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={this.handleInputChange}
                // validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: {} }}
              />
              <Input type="submit"
                value="Reset"
              />
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
    resetPassword: actions.resetPassword,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);


// export default ForgotPassword;