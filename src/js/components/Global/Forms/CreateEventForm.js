import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import moment from "moment";
import { createEvent } from "../../../actions/event.actions";
import Form from "./Form";
import Input from "../Input";
import Timepicker from "../../Timpicker";
// import TimePicker from "react-times/lib/components/TimePicker";

export const initialState = {
  venue: "",
  address: "",
  phone: "",
  date: "",
  showTime: "22:00",
  loadIn: "19:00",
  notes: "",
  type: "show",
  bandId: "",
  bandName: "",
  band: ""
  // files: [],
};

class CreateEventForm extends Component {
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
    this.handleBandChange = this.handleBandChange.bind(this);
    // this.handleInputFilesChange = this.handleInputFilesChange.bind(this);
    this.handleAsyncCreateButtonClick = this.handleAsyncCreateButtonClick.bind(
      this
    );
    this.addEvent = this.addEvent.bind(this);
    this.handleShowTimeChange = this.handleShowTimeChange.bind(this);
    this.handleShowMeridiemChange = this.handleShowMeridiemChange.bind(this);
    this.handleLoadInTimeChange = this.handleLoadInTimeChange.bind(this);
    this.handleLoadInMeridiemChange = this.handleLoadInMeridiemChange.bind(
      this
    );

    this.renderBandSelect = this.renderBandSelect.bind(this);
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

  handleBandChange(event) {
    console.log(this.props.bands[event.target.value.split("/")[1]]);
    this.setState({
      bandName: event.target.value.split("/")[0],
      bandId: event.target.value.split("/")[1],
      band: this.props.bands[event.target.value.split("/")[1]]
    });
    console.log(this.state);
  }

  handleShowTimeChange(time) {
    this.setState({ showTime: time });
  }

  handleLoadInTimeChange(time) {
    this.setState({ loadIn: time });
  }

  handleLoadInMeridiemChange(time) {
    this.setState({ loadInMeridiem: time });
  }

  handleShowMeridiemChange(time) {
    this.setState({ showMeridiem: time });
  }

  addEvent() {
    const { band, user, onCreateEvent } = this.props;

    const eventDate = moment(this.state.date).format("MM/DD/YYYY");

    const showTime =
      this.state.showMeridiem === "PM"
        ? new Date(
            moment(eventDate + " " + this.state.showTime).add(12, "hours")
          ).toISOString()
        : new Date(moment(eventDate + " " + this.state.showTime)).toISOString();

    const loadIn =
      this.state.loadInMeridiem === "PM"
        ? new Date(
            moment(eventDate + " " + this.state.loadIn).add(12, "hours")
          ).toISOString()
        : new Date(moment(eventDate + " " + this.state.loadIn)).toISOString();

    const activeBand = band || this.state.band;
    const activeBandId = band ? band.id : this.state.bandId;
    const activeBandName = band ? band.name : this.state.bandName;
    const status = new Date(this.state.date) > new Date() ? "upcoming" : "past";
    const event = {
      venue: this.state.venue,
      address: this.state.address,
      phone: this.state.phone,
      date: new Date(this.state.date).toISOString(),
      showTime: showTime,
      loadIn: loadIn,
      notes: this.state.notes,
      type: this.state.type,
      status: status,
      bandId: activeBandId,
      bandName: activeBandName
    };
    onCreateEvent(event, activeBand, user);
  }

  handleAsyncCreateButtonClick() {
    Promise.resolve()
      .then(this.addEvent())
      .then(() => this.onSuccess())
      .catch(err => this.onError(err));
  }

  renderBandSelect(band, bands) {
    if (!band) {
      let bandList = [];
      if (bands) {
        Object.keys(bands).map(key => {
          let addBandInfo = {
            label: bands[key].name,
            value: bands[key].name + "/" + bands[key].id
          };
          return bandList.push(addBandInfo);
        });
      }
      bandList.unshift({ label: "Select Band", value: "" });
      return (
        <div className="modal__row">
          <Input
            type="select"
            label="Band"
            name="band"
            placeholder="Band"
            options={bandList}
            value={`${this.state.bandName}/${this.state.bandId}`}
            onChange={this.handleBandChange}
            validation={{
              isLength: { min: 1, max: 80 }
            }}
          />
        </div>
      );
    } else {
      return false;
    }
  }

  render() {
    const {
      asyncCreateLoading,
      asyncCreateError,
      asyncUploadLoading,
      asyncUploadError,
      bands
    } = this.props;

    const {
      venue,
      address,
      phone,
      date,
      showTime,
      showMeridiem,
      loadInMeridiem,
      loadIn,
      notes,
      type
      // files,
    } = this.state;

    // Errors
    let createError = asyncCreateError ? asyncCreateError.toJSON().reason : "";
    let uploadError = asyncUploadError ? asyncUploadError.toJSON().reason : "";

    return (
      <Form
        className="modal__container"
        onSubmit={this.onSubmit}
        onCancel={this.onCancel}
        // disabled={asyncCreateLoading || asyncUploadLoading}
        ref="form"
        // error={createError || uploadError}
      >
        <div className="modal__top">
          <h3 className="clr-purple">Add New Event</h3>
        </div>
        <div className="modal__middle">
          {this.renderBandSelect(this.props.band, this.props.bands)}

          {/* <div className="modal__column"> */}
          <div className="modal__row">
            <Input
              type="text"
              label="Venue Name"
              name="venue"
              placeholder="Venue Name"
              value={venue}
              onChange={this.handleInputChange}
              validation={{
                isLength: { min: 3, max: 30 },
                isAlphanumeric: { blacklist: [" "] }
              }}
            />
            <Input
              type="text"
              label="Venue Address"
              name="address"
              placeholder="Venue Address"
              value={address}
              onChange={this.handleInputChange}
              validation={{
                isLength: { min: 3, max: 80 },
                isAlphanumeric: { blacklist: [" "] }
              }}
            />
          </div>
          <div className="modal__row">
            <Input
              type="tel"
              label="Venue Phone"
              name="phone"
              placeholder="Venue Phone"
              value={phone}
              onChange={this.handleInputChange}
              validation={{
                isLength: { min: 10, max: 30 }
                // isAlphanumeric: { blacklist: [" "], whitelist: ["-", "(", ")"] }
              }}
            />
            <Input
              type="date"
              label="Event Date"
              name="date"
              placeholder="Date"
              value={date}
              onChange={this.handleInputChange}
              validation={{
                isLength: { min: 3, max: 30 },
                isAlphanumeric: { blacklist: [" "] }
              }}
            />
          </div>
          <div className="modal__row">
            <Input
              type="time"
              label="Show Time"
              name="showTime"
              placeholder="Show Time"
              value={showTime}
              onChange={this.handleShowTimeChange}
              onMeridiemChange={this.handleShowMeridiemChange}
              meridiem={showMeridiem}
              validation={{
                isLength: { min: 4, max: 8 },
                isAlphanumeric: { blacklist: [" "] }
              }}
            />
            <Input
              type="time"
              label="Load In Time"
              name="loadIn"
              placeholder="Load In Time"
              value={loadIn}
              meridiem={loadInMeridiem}
              onChange={this.handleLoadInTimeChange}
              onMeridiemChange={this.handleLoadInMeridiemChange}
              validation={{
                isLength: { min: 4, max: 8 },
                isAlphanumeric: { blacklist: [" "] }
              }}
            />
          </div>
          <div className="modal__row">
            <Input
              type="select"
              label="Event Type"
              name="type"
              placeholder="Show/Rehearsal"
              options={[
                { value: "show", label: "Show" },
                { value: "rehearsal", label: "Rehearsal" },
                { value: "studio session", label: "Studio Session" }
              ]}
              value={type}
              onChange={this.handleInputChange}
              validation={{
                isLength: { min: 3, max: 80 },
                isAlphanumeric: { blacklist: [" "] }
              }}
            />
            <Input
              type="textarea"
              label="Notes"
              name="notes"
              placeholder="Notes"
              value={notes}
              onChange={this.handleInputChange}
              validation={{
                isLength: { min: 0, max: 80 },
                isAlphanumeric: { blacklist: [" "] }
              }}
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
      onCreateEvent: createEvent
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEventForm);
