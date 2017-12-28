import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { createBand } from '../actions/band.actions';
import classNames from 'classnames';
import Form from '../components/Global/Form';
import Input from '../components/Global/Input';
import { database } from '../config/fire';
import genres from '../constants/genre_list';

export const initialState = {
  name: '',
  location: '',
  email: '',
  genre1: '',
  genre2: '',
  bio: '',
  stageplots: [],
  type: 'band',
};

class CreateBandModal extends Component {
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
    this.addBand = this.addBand.bind(this);

    this.db = database.ref().child('bands');
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

   addBand() {
     const userId = this.props.user.uid;
     const roles = {}
     roles[userId] = 'owner';
      const band = {
      name: this.state.name,
      location: this.state.location,
      email: this.state.email,
      genre1: this.state.genre1,
      genre2: this.state.genre2,
      bio: this.state.bio,
      stageplots: this.state.stageplots,
      type: this.state.type,
      roles,
      events: {},
    }
    this.props.onCreateBand(band);
  }
  handleAsyncCreateButtonClick() {
    console.log('submit button clicked');
    Promise.resolve()
    .then(this.addBand())
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
      name,
      location,
      email,
      genre1,
      genre2,
      bio,
      stageplots,
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
            <h3 className="clr-purple">Start A Band</h3>
          </div>
          <div className="modal__middle">
            {/* <div className="modal__column"> */}

            {/* Add this back when users can create venues */}
            {/* <div className="modal__row">
              <Input type="select"
                name="type"
                placeholder="Type"
                options={[{value: 'band', label: 'Band'}, {value: 'venue', label: 'Venue'}]}
                value={ this.state.type }
                onChange={ this.handleInputChange }
                validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
              />
            </div> */}
            <div className="modal__row">
              <Input type="text"
                name="name"
                placeholder="Band Name"
                value={ name }
                onChange={ this.handleInputChange }
                validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
              />
              <Input type="text"
                name="location"
                placeholder="Location"
                value={ location }
                onChange={ this.handleInputChange }
                validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
              />
            </div>

            <div className="modal__row">
              <Input type="select"
                name="genre1"
                placeholder="Genre 1"
                options={genres}
                value={ genre1 }
                onChange={ this.handleInputChange }
                validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
              />
              <Input type="select"
                name="genre2"
                placeholder="Genre 2"
                options={genres}
                value={ genre2 }
                onChange={ this.handleInputChange }
                validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
              />
            </div>
            <div className="modal__row">
              <Input type="text"
                  name="email"
                  placeholder="Band Email"
                  value={ email }
                  onChange={ this.handleInputChange }
                  // validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                />
              <Input type="textarea"
                name="bio"
                placeholder="Bio"
                value={ bio }
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
    user: state.app.user,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onCreateBand: createBand,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBandModal);
