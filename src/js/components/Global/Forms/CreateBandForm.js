import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { createBand } from "../../../actions/band.actions";
import Form from "./Form";
import Input from "../Input";
import genres from "../../../constants/genre_list";

const initialState = {
  name: "",
  location: "",
  email: "",
  genre1: "",
  genre2: "",
  bio: "",
  instruments: "",
  stageplots: [],
  type: "band"
};

class CreateBandForm extends Component {
  static propTypes = {
    show: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = initialState;
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    // this.handleInputFilesChange = this.handleInputFilesChange.bind(this);
    this.handleAsyncCreateButtonClick = this.handleAsyncCreateButtonClick.bind(
      this
    );
    this.addBand = this.addBand.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.refs.form.validate()) {
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
    const { user } = this.props;
    const members = {};
    const founder = {
      name: user.displayName || "",
      id: user.id || "",
      email: user.email || "",
      imageUrl: user.imageUrl || "",
      instruments: this.state.instruments || ""
    };
    members[user.id] = founder;
    const userId = user.id;
    const roles = {};
    roles[userId] = "owner";
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
      members
    };
    this.props.onCreateBand(band, user);
  }
  handleAsyncCreateButtonClick() {
    console.log("submit button clicked");
    Promise.resolve()
      .then(this.addBand())
      .then(() => this.onSuccess())
      .catch(err => this.onError(err));
  }

  render() {
    const {
      asyncCreateLoading,
      asyncCreateError,
      asyncUploadLoading,
      asyncUploadError
    } = this.props;

    const {
      name,
      location,
      email,
      genre1,
      genre2,
      bio,
      instruments
      // stageplots,
      // type,
      // files,
    } = this.state;

    // Errors
    let createError = asyncCreateError ? asyncCreateError.toJSON().reason : "";
    let uploadError = asyncUploadError ? asyncUploadError.toJSON().reason : "";

    // Normal
    return (
      <Form
        className="modal__container"
        onSubmit={this.onSubmit}
        onCancel={this.onCancel}
        disabled={asyncCreateLoading || asyncUploadLoading}
        ref="form"
        error={createError || uploadError}
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
            <Input
              type="text"
              label="Band Name"
              name="name"
              placeholder="Band Name"
              value={name}
              onChange={this.handleInputChange}
              validation={{
                isLength: { min: 3, max: 30 },
                isAlphanumeric: { blacklist: [" "] }
              }}
            />
            <Input
              type="text"
              label="Location"
              name="location"
              placeholder="Location"
              value={location}
              onChange={this.handleInputChange}
              validation={{
                isLength: { min: 3, max: 80 },
                isAlphanumeric: { blacklist: [" "] }
              }}
            />
          </div>

          <div className="modal__row">
            <Input
              type="select"
              label="Genre 1"
              name="genre1"
              placeholder="Genre 1"
              options={genres}
              value={genre1}
              onChange={this.handleInputChange}
              validation={{
                isLength: { min: 3, max: 80 },
                isAlphanumeric: { blacklist: [" "] }
              }}
            />
            <Input
              type="select"
              label="Genre 2"
              name="genre2"
              placeholder="Genre 2"
              options={genres}
              value={genre2}
              onChange={this.handleInputChange}
              validation={{
                isLength: { min: 3, max: 80 },
                isAlphanumeric: { blacklist: [" "] }
              }}
            />
          </div>
          <div className="modal__row">
            <Input
              type="email"
              label="Band Email"
              name="email"
              placeholder="Band Email"
              value={email}
              onChange={this.handleInputChange}
              // validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
            />
            <Input
              type="textarea"
              label="Band Bio"
              name="bio"
              placeholder="Bio"
              value={bio}
              onChange={this.handleInputChange}
              // validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
            />
          </div>
          <div className="modal__row">
            <Input
              type="text"
              label="Your Instrument(s)"
              name="instruments"
              placeholder="What instrument do you play?"
              value={instruments}
              onChange={this.handleInputChange}
              // validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
            />
          </div>
        </div>
        <div className="modal__bottom">
          <Input type="button-thin-cancel" value="Cancel" />
          <Input type="button-thin-submit" value="Create" />
        </div>
      </Form>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      onCreateBand: createBand
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBandForm);
