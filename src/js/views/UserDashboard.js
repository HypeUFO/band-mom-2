import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import classNames from "classnames";
import moment from "moment";
import { database, auth } from "../config/fire";
import * as actions from "../actions/event.actions";
import { clearBand, getBand, getBandMany } from "../actions/band.actions";
import Drawer from "../components/Global/Drawer";
import Subheader from "../components/Global/Subheader";
import Carousel from "../components/Carousel";
import CreateBandModal from "../modals/CreateBandModal";
import CreateEventModal from "../modals/CreateEventModal";
import Input from "../components/Global/Input";

const initialState = {
  showCreateBandModal: false,
  showCreateEventModal: false,
  selected: ""
};
class UserDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.toggleCreateEventModal = this.toggleCreateEventModal.bind(this);
    this.onCreateEventSubmit = this.onCreateEventSubmit.bind(this);
    this.onCreateEventCancel = this.onCreateEventCancel.bind(this);
    this.toggleCreateBandModal = this.toggleCreateBandModal.bind(this);
    this.onCreateBandSubmit = this.onCreateBandSubmit.bind(this);
    this.onCreateBandCancel = this.onCreateBandCancel.bind(this);
  }
  componentWillMount() {
    database.ref().on("value", () => {
      this.props.onGetBandMany(this.props.user);
      this.props.onGetUserEventMany(this.props.user.id);
    });
    this.props.onClearEvent();
    this.props.onClearBand();
  }

  toggleCreateBandModal() {
    this.setState(prevState => ({
      showCreateBandModal: !prevState.showCreateBandModal
    }));
  }

  onCreateBandSubmit() {
    console.log("Band submitted");
    this.toggleCreateBandModal();
  }

  onCreateBandCancel() {
    this.toggleCreateBandModal();
  }

  onCreateBandSuccess() {
    console.log("Show successfully created");
  }

  onCreateBandError(err) {
    console.log("An error occured:" + err);
  }

  toggleCreateEventModal() {
    this.setState(prevState => ({
      showCreateEventModal: !prevState.showCreateEventModal
    }));
  }

  onCreateEventSubmit() {
    console.log("Event submitted");
    this.toggleCreateEventModal();
  }

  onCreateEventCancel() {
    this.toggleCreateEventModal();
  }

  onCreateEventSuccess() {
    console.log("Show successfully created");
    // this.props.onGetBandMany(this.props.match.params.userId);
  }

  onCreateEventError(err) {
    console.log("An error occured:" + err);
  }

  renderCard(doc, index, type) {
    let card;

    if (type === "band") {
      card = (
        <a
          href={`/${this.props.match.params.userId}/bands/${doc.id}/dashboard`}
          className="card__link"
          key={doc.id}
        >
          <div className="card">
            <div>
              {doc.logo ? <img src={doc.logo} alt="logo" /> : null}
              <h3>{doc.name}</h3>
              <p>
                {doc.genre1} / {doc.genre2}
              </p>
              <p>{doc.location}</p>
            </div>
          </div>
        </a>
      );
    } else if (type === "event") {
      card = (
        <a
          href={`/${this.props.match.params.userId}/bands/${
            doc.bandId
          }/events/${doc.id}/details`}
          className="card__link"
          key={doc.id}
        >
          <div className="card">
            <div>
              <h3>
                <span className="card__type">{doc.type.toUpperCase()}</span> @{" "}
                {doc.venue}
              </h3>
              <p>{moment(doc.date).format("MM/DD/YYYY")} </p>
              <p>Set Time: {doc.showTime}</p>
            </div>
          </div>
        </a>
      );
    }
    return card;
  }

  renderPreviewList(list, type) {
    const { loading, bands } = this.props;
    if (
      !loading &&
      list &&
      Object.keys(list).length > 0 &&
      list.constructor === Object
    ) {
      let rows = Object.keys(list).map(key => {
        if (list[key]) {
          let index = list[key].date || key;
          return this.renderCard(list[key], index, type);
        }
      });
      if (type === "event") {
        rows.sort((a, b) => {
          const valueA = new Date(a.key);
          const valueB = new Date(b.key);
          return valueB < valueA ? 1 : valueB > valueA ? -1 : 0;
        });
      }

      return <Carousel>{rows}</Carousel>;
    } else {
      if (type === "event") {
        return (
          // <NoContent text="No Shows" />
          <div className="no-content__wrapper">
            <div>No Events</div>
            {Object.keys(bands).length > 0 && (
              <div className="no-content__wrapper__actions">
                <Input
                  type="button-thin-button"
                  onClick={this.toggleCreateEventModal}
                  value="Create Event"
                />

                {/* <Input
                type="button-thin-button"
                onClick={() => console.log("Search is coming soon!")}
                value="Search Events"
              /> */}
              </div>
            )}
          </div>
        );
      } else if (type === "band") {
        return (
          // <NoContent text="No Shows" />
          <div className="no-content__wrapper">
            <div>No Bands</div>
            <div className="no-content__wrapper__actions">
              <Input
                type="button-thin-button"
                onClick={this.toggleCreateBandModal}
                value="Create Band"
              />
              {/* <Input
                type="button-thin-button"
                onClick={() => console.log("Search is coming soon!")}
                value="Search Events"
              /> */}
            </div>
          </div>
        );
      } else {
        return (
          // <NoContent text="No Shows" />
          <div className="no-content__wrapper">
            <div>No Content</div>
          </div>
        );
      }
    }
  }

  render() {
    let verifyEmailButtonClasses = classNames("btn-icon", {
      "btn--hide": this.props.user.emailVerified
    });

    let breadcrumbs = [
      { link: `${this.props.match.params.userId}/dashboard`, name: "Dashboard" }
    ];

    return (
      <div className="page__container">
        <Drawer show={true} className="drawer__sidebar" />
        <Subheader breadcrumbs={breadcrumbs} buttonHide={true} />
        <div className="page__content page__content--two-col">
          <div className="page__content__container">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <h1>
                Welcome{" "}
                {this.props.user.displayName ? this.props.user.displayName : ""}
              </h1>
              <button
                className={verifyEmailButtonClasses}
                onClick={() => {
                  auth.currentUser
                    .sendEmailVerification()
                    .then(() => {
                      // Email sent.
                      console.log("Email sent");
                    })
                    .catch(error => {
                      // An error happened.
                      console.log("An error occurred" + error);
                    });
                }}
              >
                Verify Email
              </button>
            </div>
            <Link to={`/${this.props.user.id}}/bands`}>
              <h3>Bands</h3>
            </Link>
            {this.renderPreviewList(this.props.bands, "band")}

            <Link to={`/${this.props.user.id}/events`}>
              <h3>Events</h3>
            </Link>
            {this.renderPreviewList(this.props.userEvents, "event")}

            <CreateBandModal
              show={this.state.showCreateBandModal}
              onSubmit={this.onCreateBandSubmit}
              onCancel={this.onCreateBandCancel}
              onSuccess={this.onCreateBandSuccess}
              onError={this.onCreateBandError}
            />

            <CreateEventModal
              show={this.state.showCreateEventModal}
              onSubmit={this.onCreateEventSubmit}
              onCancel={this.onCreateEventCancel}
              onSuccess={this.onCreateEventSuccess}
              onError={this.onCreateEventError}
              // band={this.props.band || null}
              bands={this.props.bands}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    loading: state.app.loading,
    events: state.events.events,
    userEvents: state.events.userEvents,
    bands: state.bands.bands
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      onClearEvent: actions.clearEvent,
      onGetEvent: actions.getEvent,
      onGetEventMany: actions.getEventMany,
      onGetUserEventMany: actions.getUserEventMany,
      onDeleteEvent: actions.deleteEvent,
      onGetBandMany: getBandMany,
      onGetBand: getBand,
      onClearBand: clearBand
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard);
