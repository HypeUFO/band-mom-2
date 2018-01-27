import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import classNames from "classnames";
import moment from "moment";
import { database } from "../config/fire";
import * as actions from "../actions/event.actions";
import {
  getBand,
  updateBand,
  updateBandEdit,
  updateMemberEdit,
  updateMember,
  uploadBandLogo,
  uploadStagePlot,
  deleteBand,
  deleteStagePlot,
  leaveBand
} from "../actions/band.actions";
import { dismissNotification } from "../actions/notification.actions";
import Drawer from "../components/Global/Drawer";
import Loader from "../components/Global/Loader";
import Subheader from "../components/Global/Subheader";
import CreateEventModal from "../modals/CreateEventModal";
import BandEditForm from "../components/Global/Forms/BandEditForm";
import Carousel from "../components/Carousel";
import Input from "../components/Global/Input";
import history from "../history";
import FileUploadModal from "../modals/FileUploadModal";
import AlertModal from "../modals/AlertModal";
import BandMemberList from "../components/BandMemberList";

const initialState = {
  showCreateEventModal: false,
  showDeleteStagePlotAlert: false,
  showStagePlotActionsModal: false,
  showDeleteBandAlert: false,
  showLeaveBandAlert: false,
  showShareModal: false,
  selected: "",
  showStageplotModal: false
};

class BandDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.toggleCreateEventModal = this.toggleCreateEventModal.bind(this);
    this.onCreateEventSubmit = this.onCreateEventSubmit.bind(this);
    this.onCreateEventCancel = this.onCreateEventCancel.bind(this);
    this.onCancelStageplotUpload = this.onCancelStageplotUpload.bind(this);
    this.onCancelLogoUpload = this.onCancelLogoUpload.bind(this);
    this.onDeleteBand = this.onDeleteBand.bind(this);
    this.onLeaveBand = this.onLeaveBand.bind(this);
    this.onCancelAlert = this.onCancelAlert.bind(this);
    this.onDeleteStagePlot = this.onDeleteStagePlot.bind(this);
    this.downloadStagePlot = this.downloadStagePlot.bind(this);
  }

  componentWillMount() {
    Promise.resolve()
      .then(() => {
        this.props.onGetBand(this.props.match.params.bandId);
      })
      .catch(err => console.log(err));

    database.ref(`events`).on("value", () => {
      this.props.onGetEventMany(this.props.match.params.bandId);
    });
    database.ref(`groups/${this.props.match.params.bandId}`).on("value", () => {
      this.props.onGetBand(this.props.match.params.bandId);
    });
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
  }

  onCreateEventError(err) {
    console.log("An error occured:" + err);
  }

  onCancelStageplotUpload() {
    this.setState({ showStageplotModal: false });
  }

  onCancelLogoUpload() {
    this.setState({ showLogoModal: false });
  }

  onDeleteStagePlot() {
    Promise.resolve()
      .then(() =>
        this.props.deleteStagePlot(
          this.state.selectedStagePlot,
          this.props.band.id
        )
      )
      .then(() => {
        if (!this.props.uploading) {
          this.setState({ showDeleteStagePlotAlert: false });
        }
      });
  }

  onCancelAlert() {
    this.setState({
      showDeleteStagePlotAlert: false,
      showStagePlotActionsModal: false,
      showDeleteBandAlert: false,
      showLeaveBandAlert: false,
      showStageplotModal: false,
      showLogoModal: false
    });
  }

  onSubmitDeleteStagePlot() {
    this.setState({ showDeleteStagePlotAlert: false });
  }

  onDeleteBand() {
    Promise.resolve()
      .then(() => this.props.deleteBand(this.props.band, this.props.user))
      .then(() => {
        this.props.updateBandEdit();
        this.props.history.push(`/${this.props.user.id}/bands`);
      })
      .catch(err => console.log(err));
  }

  onLeaveBand() {
    Promise.resolve()
      .then(() => this.props.leaveBand(this.props.band, this.props.user))
      .then(() => {
        this.props.updateBandEdit();
        this.props.history.push(`/${this.props.user.id}/bands`);
      })
      .catch(err => console.log(err));
  }

  renderEventCard(doc, index) {
    let statusColorClass = "";
    switch (doc.status) {
      case "past":
        statusColorClass = "clr-red";
        break;
      default:
        statusColorClass = "clr-purple";
    }

    let card = (
      <div>
        <h3>
          <span className="card__type">{doc.type.toUpperCase()}</span> @{" "}
          {doc.venue}
        </h3>
        <p>{moment(doc.date).format("MM/DD/YYYY")} </p>
        <p>Set Time: {doc.showTime}</p>
      </div>
    );

    return (
      <a
        href={`/${this.props.match.params.userId}/bands/${
          this.props.match.params.bandId
        }/events/${doc.id}/details`}
        className="card__link card__link__list"
        key={doc.id}
      >
        <div className="card" key={doc.date}>
          {card}
        </div>
      </a>
    );
  }

  renderStagePlotCard(doc, index) {
    let card = (
      <div>
        <img src={doc.url} alt={doc.name} />
      </div>
    );

    return (
      <div
        // href={doc.url}
        className="card__link card__link__stageplot card__link__list"
        key={index}
        onClick={event => {
          event.preventDefault();
          Promise.resolve()
            .then(() => {
              this.setState({
                showStagePlotActionsModal: true,
                selectedStagePlot: doc
              });
              console.log(doc);
            })
            .then(() => {
              this.props.onGetBand(this.props.band.id);
            });
        }}
      >
        <div className="card card__stageplot" key={doc.id}>
          {card}
        </div>
      </div>
    );
  }

  renderEventPreview() {
    const { events } = this.props;
    if (
      events &&
      Object.keys(events).length > 0 &&
      events.constructor === Object
    ) {
      let rows = Object.keys(events)
        .map(key => {
          events[key].id = key;
          let index = events[key].date;
          if (events[key].status === "upcoming") {
            return this.renderEventCard(events[key], index);
          }
        })
        .sort((a, b) => {
          const valueA = new Date(a.key);
          const valueB = new Date(b.key);
          return valueB < valueA ? 1 : valueB > valueA ? -1 : 0;
        });

      return <Carousel>{rows}</Carousel>;
    } else {
      return (
        // <NoContent text="No Shows" />
        <div className="no-content__wrapper">
          <div>No Events</div>
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
        </div>
      );
    }
  }

  renderStagePlots() {
    const { stageplots } = this.props.band;
    if (
      stageplots &&
      Object.keys(stageplots).length > 0 &&
      stageplots.constructor === Object
    ) {
      let rows = Object.keys(stageplots).map(key => {
        stageplots[key].id = key;
        return this.renderStagePlotCard(stageplots[key], key);
      });

      return <Carousel>{rows}</Carousel>;
    } else {
      return (
        // <NoContent text="No Shows" />
        <div className="no-content__wrapper">
          <div>No stageplots</div>
        </div>
      );
    }
  }

  downloadStagePlot(blob, fileName) {
    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
  }

  render() {
    const { user, band, bandEdit, match } = this.props;

    let breadcrumbs = [
      {
        link: `/${match.params.userId}/dashboard`,
        name: user ? user.displayName : "Dashboard"
      },
      { link: `/${match.params.userId}/bands`, name: "Bands" },
      {
        link: `/${match.params.userId}/bands/${match.params.bandId}`,
        name: band ? band.name : "Band Name"
      }
    ];

    if (band) {
      const lastMember = Object.keys(band.members).length === 1;

      let formBottomClasses = classNames("form__bottom", {
        "form__bottom--hidden": !bandEdit
      });

      let removeActions = classNames("band__details__remove-actions", {
        "band__details__remove-actions--hidden": !bandEdit
      });

      return (
        <div className="page__container">
          <Drawer
            // userName={ userName }
            show={true}
            className="drawer__sidebar"
            // toggle={ this.toggleDrawer }
          />
          <Subheader
            breadcrumbs={breadcrumbs}
            // buttonHide={ buttonHide }
            buttonLabel="Add Event"
            buttonIcon="add"
            buttonOnClick={this.toggleCreateEventModal}
          />
          <div className="page__content page__content--two-col">
            <div className="page__content__container">
              <FileUploadModal
                show={this.state.showStageplotModal}
                onCancel={this.onCancelStageplotUpload}
                onUpload={this.props.uploadStagePlot}
                uploader={this.props.band}
                header="Upload Stageplot"
                isLoading={this.props.uploading}
                error={this.props.uploadError}
              />

              <FileUploadModal
                show={this.state.showLogoModal}
                onCancel={this.onCancelLogoUpload}
                onUpload={this.props.uploadBandLogo}
                uploader={this.props.band}
                header="Upload Logo"
                isLoading={this.props.uploading}
                error={this.props.uploadError}
              />

              <AlertModal
                show={this.state.showStagePlotActionsModal}
                title="Actions"
                onCancel={this.onCancelAlert}
                isLoading={this.props.uploading}
              >
                <Input
                  type="button-danger"
                  value="DELETE"
                  full
                  onClick={event => {
                    event.preventDefault();
                    Promise.resolve()
                      .then(() => {
                        this.setState({
                          showDeleteStagePlotAlert: true
                        });
                      })
                      .then(() => {
                        this.props.onGetBand(this.props.band.id);
                      });
                  }}
                />
                <Input
                  type="button-thin-button"
                  value="DOWNLOAD"
                  full
                  onClick={event => {
                    event.preventDefault();
                    var xhr = new XMLHttpRequest();
                    xhr.responseType = "blob";
                    xhr.onload = function(event) {
                      var blob = xhr.response;
                      console.log(blob);
                      const fileName = "stageplot";
                      var a = document.createElement("a");
                      a.href = window.URL.createObjectURL(blob);
                      a.download = fileName;
                      a.click();
                    };
                    xhr.open("GET", this.state.selectedStagePlot.url);
                    xhr.send();
                  }}
                />
                {/* Not functional yet */}
                {/* <Input
                  type="button-thin-button"
                  value="EMAIL"
                  full
                  onClick={event => {
                    event.preventDefault();
                    var xhr = new XMLHttpRequest();
                    xhr.responseType = "blob";
                    xhr.onload = function(event) {
                      var blob = xhr.response;
                      console.log(blob);
                    };
                    xhr.open("GET", this.state.selectedStagePlot.url);
                    xhr.send();
                  }}
                /> */}
              </AlertModal>

              <AlertModal
                show={this.state.showDeleteStagePlotAlert}
                title="Are you sure you want to delete this stageplot?"
                actionType="Delete"
                action={this.onDeleteStagePlot}
                onCancel={this.onCancelAlert}
                isLoading={this.props.uploading}
              >
                <p>This action can not be undone</p>
              </AlertModal>

              <AlertModal
                show={this.state.showDeleteBandAlert}
                title="Are you sure you want to delete this band?"
                actionType="Delete"
                action={this.onDeleteBand}
                onCancel={this.onCancelAlert}
                // isLoading={ this.props.uploading }
              >
                <p>This action can not be undone</p>
              </AlertModal>

              <AlertModal
                show={this.state.showLeaveBandAlert}
                title={
                  !lastMember
                    ? "Are you sure you want to leave this band?"
                    : "You are the only band member"
                }
                actionType={!lastMember ? "Leave" : null}
                action={!lastMember ? this.onLeaveBand : null}
                onCancel={this.onCancelAlert}
                // isLoading={ this.props.uploading }
              >
                {Object.keys(this.props.band.members).length > 1 ? (
                  <p>This action can not be undone</p>
                ) : (
                  <p>
                    Invite someone to maintain this band before you leave, or
                    delete the band
                  </p>
                )}
              </AlertModal>

              <CreateEventModal
                show={this.state.showCreateEventModal}
                onSubmit={this.onCreateEventSubmit}
                onCancel={this.onCreateEventCancel}
                onSuccess={this.onCreateEventSuccess}
                onError={this.onCreateEventError}
                onCreateEvent={this.props.onCreateEvent}
                band={this.props.band}
                user={this.props.user}
              />
              <div className={removeActions}>
                <Input
                  type="button-danger"
                  value="DELETE BAND"
                  onClick={event => {
                    this.setState({ showDeleteBandAlert: true });
                  }}
                />

                <Input
                  type="button-danger"
                  value="LEAVE BAND"
                  onClick={event => {
                    this.setState({ showLeaveBandAlert: true });
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <h3>Band Details</h3>
                {!bandEdit && (
                  <Input
                    type="button-link"
                    value="Edit"
                    onClick={this.props.updateBandEdit}
                    onSubmit={this.onSubmitDeleteStagePlot}
                    onCancel={this.onCancelAlert}
                  />
                )}
              </div>
              <div className="band__details__container">
                <div className="band__details__image__wrapper">
                  <img
                    src={
                      band.logoUrl ||
                      "https://www.timeshighereducation.com/sites/default/files/byline_photos/anonymous-user-gravatar_0.png"
                    }
                    alt="Logo"
                    className="band__logo"
                    style={{ marginBottom: 24 }}
                  />
                  <Input
                    type="button-link"
                    value={band.logoUrl ? "Change logo" : "Upload logo"}
                    onClick={() => this.setState({ showLogoModal: true })}
                  />
                </div>
                <BandEditForm
                  band={this.props.band}
                  bandEdit={bandEdit}
                  user={this.props.user}
                  updateBandEdit={this.props.updateBandEdit}
                  onUpdateBand={this.props.onUpdateBand}
                  onGetBand={this.props.onGetBand}
                />
              </div>
              <hr />
              <BandMemberList
                user={this.props.user}
                band={this.props.band}
                memberEdit={this.props.memberEdit}
                updateMemberEdit={this.props.updateMemberEdit}
                onUpdateMember={this.props.updateMember}
                removeMember={this.props.leaveBand}
              />
              <hr />
              <div className="slide-header">
                <h3>Upcoming Events</h3>
                <a
                  href={`/${this.props.match.params.userId}/bands/${
                    this.props.match.params.bandId
                  }/events`}
                >
                  View All
                </a>
              </div>
              {this.renderEventPreview()}
              <hr />
              <div className="slide-header">
                <h3>StagePlots</h3>
                <Input
                  type="button-link"
                  value="Upload Stageplot"
                  onClick={() => this.setState({ showStageplotModal: true })}
                />
              </div>
              {this.renderStagePlots()}
            </div>
            <hr />
          </div>
        </div>
      );
    } else {
      return <Loader />;
    }
  }
}

function mapStateToProps(state) {
  return {
    events: state.events.events,
    band: state.bands.activeBand,
    bandEdit: state.bands.bandEdit,
    memberEdit: state.bands.memberEdit,
    user: state.auth.user,
    activeBandLogo: state.bands.activeBandLogoUrl,
    activeStagePlotUrl: state.bands.activeStagePlotUrl,
    isLoading: state.app.loading,
    uploading: state.bands.loading,
    uploadError: state.bands.error,
    notification: state.notification
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateBandEdit: updateBandEdit,
      updateMemberEdit: updateMemberEdit,
      updateMember: updateMember,
      deleteBand: deleteBand,
      leaveBand: leaveBand,
      onUpdateBand: updateBand,
      onGetBand: getBand,
      onClearEvent: actions.clearEvent,
      onGetEvent: actions.getEvent,
      onCreateEvent: actions.createEvent,
      onGetEventMany: actions.getEventMany,
      uploadBandLogo: uploadBandLogo,
      uploadStagePlot: uploadStagePlot,
      deleteStagePlot: deleteStagePlot,
      onDeleteBand: deleteBand,
      dismissNotification: dismissNotification
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(BandDashboard);
