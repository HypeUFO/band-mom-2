import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { createBand } from '../actions/band.actions';
import classNames from 'classnames';
import Form from '../components/Global/Forms/Form';
import Input from '../components/Global/Input';
import { database } from '../config/fire';
import genres from '../constants/genre_list';
import Spinner from '../components/Global/Spinner';

export default class AlertModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    // onSubmit: PropTypes.func.isRequired,
    // onCancel: PropTypes.func.isRequired,
    // onSuccess: PropTypes.func.isRequired,
    // onError: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    // this.onSuccess = this.onSuccess.bind(this);
    // this.onError = this.onError.bind(this);

  }

 

  onCancel(event) {
    event.preventDefault();
    console.log('alert cancelled')
    this.props.onCancel();
  }

  handleAsyncCreateButtonClick() {
    console.log('submit button clicked');
    Promise.resolve()
    .then(this.props.action())
    .then(() => this.onSuccess())
    .catch(err => this.onError(err));
  }

   onSubmit(event) {
    event.preventDefault();
    if(this.refs.form.validate()) {
      this.handleAsyncCreateButtonClick();
      // this.props.onSubmit();
    }
  }

  onSuccess() {
    // this.setState(initialState);
    this.props.onSuccess();
  }

  onError() {
    this.props.onError();
  }


  // onSubmit() {
  //   this.props.action()
  // }



  render() {
    const {
      show,
    } = this.props;

    let classes = classNames('modal', { 'modal--active': show });

    return (
      <div className={ classes }>
        <div className="modal__container">
          <div className="modal__top">
            <h3 className="clr-purple">{ this.props.title }</h3>
          </div>
          <div className="modal__middle">
            { this.props.isLoading ? <Spinner /> : null }
            { this.props.children }
            {this.props.error ? <p>this.props.error</p> : null}
          </div>
          <div className="modal__bottom">
            <Input type="button-thin-cancel" value="Cancel" onCancel={ this.onCancel } />
            <Input type="button-thin-button" value={ this.props.actionType } onClick={this.props.action}/>
          </div>
      </div>
    </div>
    );
  }
}

