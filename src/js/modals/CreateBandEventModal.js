import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { createEvent } from '../actions/event.actions';
import classNames from 'classnames';
import Form from '../components/Global/Form';
import Input from '../components/Global/Input';
import { database } from '../config/fire';

export const initialState = {
  venue: '',
  address: '',
  phone: '',
  date: '',
  showTime: '',
  loadIn: '',
  notes: '',
  type: 'show',
  // files: [],
};

class CreateBandEventModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = initialState;
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    // this.handleInputFilesChange = this.handleInputFilesChange.bind(this);
    this.handleAsyncCreateButtonClick = this.handleAsyncCreateButtonClick.bind(this);
    this.addEvent = this.addEvent.bind(this);

    this.db = database.ref().child('events');
  }

  onSubmit(event) {
    event.preventDefault();
    if(this.refs.form.validate()) {
      this.handleAsyncCreateButtonClick();
      this.props.onSubmit();
    }
  }

  onCancel(event) {
    event.preventDefault();
    this.props.onCancel();
  }

  onSuccess() {
    this.setState(initialState);
    this.props.onSuccess();
  }

  onError() {
    this.props.onError();
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

   addEvent() {
    //  const bandId = this.props.bandId;
    //  const bandName = this.props.bandName;
    const bandId = this.props.activeBand.id;
    const bandName = this.props.activeBand.name || '';
    const status = new Date(this.state.date) > new Date() ? 'upcoming' : 'past';
    const event = {
      venue: this.state.venue,
      address: this.state.address,
      phone: this.state.phone,
      date: new Date(this.state.date).toISOString(),
      showTime: this.state.showTime,
      loadIn: this.state.loadIn,
      notes: this.state.notes,
      type: this.state.type,
      status: status,
      bandId,
      bandName,
    }
    this.props.onCreateEvent(event, bandId, this.props.user.id);
  }
  handleAsyncCreateButtonClick() {
    console.log('submit button clicked');
    Promise.resolve()
    .then(this.addEvent())
    .then(() => this.onSuccess())
    .catch(err => this.onError(err));
  }

  // renderFiles() {
  //   const {
  //     files,
  //   } = this.state;
  //   let filesElements = files.map((file, index) => {
  //     return (
  //       <div className="modal__file" key={ index }>
  //         <label className="model__file__name">{ truncate(file.name, 24) }</label>
  //         <button
  //           className="model__file__close"
  //           onClick={ this.removeFile.bind(this, index) }
  //           type="button"
  //         >
  //           <i className="material-icons">close</i>
  //         </button>
  //       </div>
  //     );
  //   });
  //   return filesElements;
  // }

  render() {
    const {
      asyncCreateLoading,
      asyncCreateError,
      asyncUploadLoading,
      asyncUploadError,
      show,
    } = this.props;

    const {
      venue,
      address,
      phone,
      date,
      showTime,
      loadIn,
      notes,
      type,
      // files,
    } = this.state;

    let classes = classNames('modal', { 'modal--active': show });

    // Errors
    let createError = (asyncCreateError) ? asyncCreateError.toJSON().reason : '';
    let uploadError = (asyncUploadError) ? asyncUploadError.toJSON().reason : '';

    // Normal
    return (
      <div className={ classes }>
        <Form className="modal__container"
          onSubmit={ this.onSubmit }
          onCancel={ this.onCancel }
          disabled={ asyncCreateLoading || asyncUploadLoading }
          ref="form"
          error={ createError || uploadError }
        >
          <div className="modal__top">
            <h3 className="clr-purple">Add New Event</h3>
          </div>
          <div className="modal__middle">
            {/* <div className="modal__column"> */}
              <div className="modal__row">
                <Input type="text"
                  name="venue"
                  placeholder="Venue Name"
                  value={ venue }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                />
                <Input type="text"
                  name="address"
                  placeholder="Venue Address"
                  value={ address }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                />
              </div>
               <div className="modal__row">
               <Input type="text"
                  name="phone"
                  placeholder="Venue Phone"
                  value={ phone }
                  onChange={ this.handleInputChange }
                  // validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                />
                <Input type="date"
                  name="date"
                  placeholder="Date"
                  value={ date }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                />
                </div>
                <div className="modal__row">
                <Input type="text"
                  name="showTime"
                  placeholder="Show Time"
                  value={ showTime }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                />
                <Input type="text"
                  name="loadIn"
                  placeholder="Load In Time"
                  value={ loadIn }
                  onChange={ this.handleInputChange }
                  // validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                />
              </div>
              <div className="modal__row">
                <Input type="select"
                  name="type"
                  placeholder="Show/Rehearsal"
                  options={[{value: "show", label: 'Show'}, {value: "rehearsal", label: 'Rehearsal'}, {value: "studio session", label: 'Studio Session'}]}
                  value={ type }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                />
                <Input type="textarea"
                  name="notes"
                  placeholder="Notes"
                  value={ notes }
                  onChange={ this.handleInputChange }
                  // validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                />
              </div>
              {/* <div className="modal__column">
                {/* { this.renderFiles() } */}
              {/* </div> */}
            </div>
          <div className="modal__bottom">
            <Input type="button-thin-cancel" value="Cancel" />
            <Input type="button-thin-submit" value="Create" />
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // band: state.bands.activeBand,
    user: state.app.user,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    // onCreateEvent: createEvent,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBandEventModal);

