import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/event.actions';
import { getBandMany } from '../actions/band.actions';
import { dismissNotification } from '../actions/notification.actions';
import Table from '../components/Global/Table/Table';
import TableRow from '../components/Global/Table/TableRow';
import TableRowMenu from '../components/Global/Table/TableRowMenu';
import TableRowMenuItem from '../components/Global/Table/TableRowMenuItem';
import Drawer from '../components/Global/Drawer';
import Subheader from '../components/Global/Subheader';
import Notification from '../components/Global/Notification';
import CreateEventModal from '../modals/CreateEventModal';
import FilterLink from '../components/Global/FilterLink';
import Input from '../components/Global/Input';
import moment from 'moment';
import history from '../history';

import { database } from '../config/fire'


export const initialState = {
  showCreateEventModal: false,
  showShareModal: false,
  selected: '',
  userEvents: null,
};
class UserEventList extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.toggleCreateEventModal = this.toggleCreateEventModal.bind(this);
    this.onCreateEventSubmit = this.onCreateEventSubmit.bind(this);
    this.onCreateEventCancel = this.onCreateEventCancel.bind(this);
    this.onDeleteEventSuccess = this.onDeleteEventSuccess.bind(this);
    this.onDeleteEventError = this.onDeleteEventError.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.restoreEvent = this.restoreEvent.bind(this);
    this.setFilterWidth = this.setFilterWidth.bind(this);
    this.handleFilterWidth = this.handleFilterWidth.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);

  }

  componentWillMount() {
    database.ref().on('value', () => {
      this.props.onGetUserEventMany(this.props.match.params.userId)
    })
  }

  componentDidMount() {
    this.handleFilterWidth()
    window.addEventListener('resize', this.handleFilterWidth);
  }

  setFilterWidth(id) {
    const filterDiv = document.querySelector(`#${id}`);
    const template = document.querySelector('#template');
    template.options[0].innerHTML = filterDiv.options[filterDiv.selectedIndex].textContent;

    filterDiv.style.width = `${template.getBoundingClientRect().width}px`;
  }

  handleFilterWidth() {
    const selectList = document.querySelectorAll('.event__filter');

    selectList.forEach((sel) => {
        this.setFilterWidth(sel.getAttribute('id'));
    });
  }

  handleFilterChange(filter, action) {
    this.handleFilterWidth();
    action(filter);
  }

  handleRowClick(row) {
    window.location = `/${this.props.match.params.userId}/bands/${row.bandId}/events/${row.id}/details`;
    // history.push(`/${this.props.match.params.userId}/bands/testBand/events/${row.id}/details`);
  }

  handleRowMenuItemClick(doc, action, event) {
    event.stopPropagation();
  }

  toggleCreateEventModal() {
    this.setState(prevState => ({
      showCreateEventModal: !prevState.showCreateEventModal
    }));
  }

  onCreateEventSubmit() {
    console.log('Event submitted');
    this.toggleCreateEventModal();
  }

  onCreateEventCancel() {
    this.toggleCreateEventModal();
  }

  onCreateEventSuccess() {
    console.log('Show successfully created');
    // this.props.onGetBandMany(this.props.match.params.userId);
  }

  onCreateEventError(err) {
    console.log('An error occured:' + err);
  }

  deleteEvent(event,) {
    const bandId = this.props.match.params.bandId;
    this.props.onDeleteEvent(event, bandId)
    // this.db.child(gigId).remove()
    .then(() => this.onDeleteEventSuccess())
    .catch(err => this.onDeleteEventError())
  }

  onDeleteEventSuccess() {
    this.props.onGetEventMany(this.props.match.params.bandId);
    // alert('Show successfully deleted');
  }

  onDeleteEventError() {
    this.props.onGetEventMany();
    alert('An error occured :(');
  }

  restoreEvent() {
    if (this.props.recentlyDeleted.length > 0) {
      this.props.onRestoreEvent(this.props.recentlyDeleted[this.props.recentlyDeleted.length - 1], this.props.band.id, this.props.user.id)
    } else {
      console.log('no Events to restore');
      this.props.dismissNotification();
    }
  }

  renderNotification() {
    const { notification } = this.props;
    return (
      <Notification
        action={this.restoreEvent}
        actionLabel={notification.actionLabel}
        dismiss={this.props.dismissNotification}
        display={notification.display}
        message={notification.message}
      />
    );
  }

  renderRow(doc, index) {

    let statusColorClass = '';
    switch(doc.status) {
      case 'upcoming':
        // statusColorClass = 'clr-purple';
        break;
      case 'past':
        statusColorClass = 'clr-red';
        break;
      default:
        // statusColorClass = 'clr-purple';
    }

    let columns = [
      { value: moment(doc.date).format('MM/DD/YYYY') || '' , colorClass: statusColorClass},
      { value: doc.bandName.toUpperCase(), colorClass: 'clr-purple' || '' },
      { value: doc.venue || '' },
      { value: doc.address || '' },
      { value: doc.phone || '' },
      { value: doc.loadIn || '' },
      { value: doc.showTime || '' },
      { value: doc.type || '' },
      // { value: doc.status.toUpperCase() || '', colorClass: statusColorClass },
    ];

    let menu = (
      doc.status === 'upcoming' ?
      <TableRowMenu>
        <TableRowMenuItem
          label="Delete"
          onClick={ () => this.deleteEvent(doc) }
        />
      </TableRowMenu>
      :
      <TableRowMenu>
      <TableRowMenuItem
        label="Delete"
        onClick={ () => this.deleteEvent(doc) }
      />
      <TableRowMenuItem
        label="Archive"
        // onClick={ this.handleRowMenuItemClick.bind(this, doc, MENU_ARCHIVE) }
      />
    </TableRowMenu>

    );

    return (
      <TableRow
        key={ index }
        columns={ columns }
        onClick={ this.handleRowClick.bind(this, doc) }
      >
      { menu }
      </TableRow>
    );
  }

  renderTable() {
    const {userEvents, loading} = this.props;
      if(userEvents && Object.keys(userEvents).length > 0 && userEvents.constructor === Object && !loading) {

        let rows = Object.keys(userEvents).map((key) => {

          const status = this.props.statusFilter === 'ALL';
          const type = this.props.typeFilter === 'ALL';

          if ((userEvents[key].status === this.props.statusFilter.toLowerCase() || status) &&
            (userEvents[key].type === this.props.typeFilter.toLowerCase() || type)) {
            return this.renderRow(userEvents[key], key)
          } else {
            return null;
          }
        });

        return (
          <Table columnLabels={[
            "Date",
            "Band",
            "Venue",
            "Address",
            "Phone",
            "Load In",
            "Show Time",
            "Type",
            // "Status",
            ""
          ]}
          >
            { rows }
          </Table>
        );
      }
      else {
        return (
          // <NoContent text="No Shows" />
          <div className="no-content__wrapper">
            <div>No Events</div>
          </div>
        );
      }
  }

  render() {

    // Subheader
    let breadcrumbs = [
      { link: `/${this.props.match.params.userId}/dashboard`, name: this.props.user.displayName || this.props.user.email },
      { link: null, name: 'Events' },
    ];

    return (
      <div className='page__container'>
        <Drawer
          // userName={ userName }
          show={ true }
          className="drawer__sidebar"
          // toggle={ this.toggleDrawer }
        />
        <Subheader breadcrumbs={ breadcrumbs }
          // buttonHide={ buttonHide }
          buttonLabel="Add Event"
          buttonIcon="add"
          buttonOnClick={ this.toggleCreateEventModal }
        />
        <div className='page__content page__content--two-col'>
          {/* <CreateEventModal
            show={ this.state.showCreateEventModal }
            onSubmit={ this.onCreateEventSubmit }
            onCancel={ this.onCreateEventCancel }
            onSuccess={ this.onCreateEventSuccess }
            onError={ this.onCreateEventError }
            bands={ this.props.bands }
            user={ this.props.user }
          /> */}

          <CreateEventModal
            show={ this.state.showCreateEventModal }
            onSubmit={ this.onCreateEventSubmit }
            onCancel={ this.onCreateEventCancel }
            onSuccess={ this.onCreateEventSuccess }
            onError={ this.onCreateEventError }
            onCreateEvent={this.props.onCreateEvent}
            // band={this.props.band || null}
            bands={ this.props.bands }
            user={this.props.user}
          />

          <div className="page__content__container">
            {this.props.notification.display ? this.renderNotification() : null}
            <div className="filter__section">
              <p className="filter__label">Filter: </p>
              <p className="filter__link">
                {/* Filter by status: */}
                <select
                  className="event__filter"
                  id="statusFilter"
                  defaultValue={this.props.statusFilter}
                  ref="statusFilter"
                  onChange={ () => this.handleFilterChange(this.refs.statusFilter.value,this.props.filterEventsByStatus) }
                >
                  <option value="ALL" key={ 0 }>
                    All
                  </option>
                  <option value="UPCOMING" key={ 1 }>
                    Upcoming
                  </option>
                  <option value="PAST" key={ 2 }>
                    Past
                  </option>
                </select>
                <i className="material-icons">chevron_right</i>
              </p>
              <p className="filter__link">
                {/* Filter by type: */}
              <select
                className="event__filter"
                id="typeFilter"
                defaultValue={this.props.typeFilter}
                ref="typeFilter"
                onChange={ () => this.handleFilterChange(this.refs.typeFilter.value, this.props.filterEventsByType) }
              >
                <option value="ALL" key={ 0 }>
                  All
                </option>
                <option value="SHOW" key={ 1 }>
                  Show
                </option>
                <option value="REHEARSAL" key={ 2 }>
                  Rehearsal
                </option>
              </select>
              <i className="material-icons">chevron_right</i>
            </p>
            </div>
            { this.renderTable(this.props.userEvents) }
            <select id="template" style={{visibility: 'hidden'}}>
              <option id="templateOption" />
            </select>
          </div>
        </div>
      </div>
    );
  }
}

// export default EventList;

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    events: state.events.events,
    userEvents: state.events.userEvents,
    bands: state.bands.bands,
    band: state.bands.activeBand,
    statusFilter: state.events.statusFilter,
    typeFilter: state.events.typeFilter,
    recentlyDeleted: state.events.recentlyDeleted,
    notification: state.notification,
    loading: state.app.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onGetBandMany: getBandMany,
    onClearEvent: actions.clearEvent,
    onGetEvent: actions.getEvent,
    onGetEventMany: actions.getEventMany,
    onGetUserEventMany: actions.getUserEventMany,
    onCreateEvent: actions.createEvent,
    onDeleteEvent: actions.deleteEvent,
    onRestoreEvent: actions.restoreEvent,
    dismissNotification: dismissNotification,
    filterEventsByStatus: actions.filterEventsByStatus,
    filterEventsByType: actions.filterEventsByType,
    updateEventEdit: actions.updateEventEdit,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserEventList);
