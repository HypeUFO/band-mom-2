import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/event.actions';
import { dismissNotification } from '../actions/notification.actions';
import Table from '../components/Global/Table';
import TableRow from '../components/Global/TableRow';
import TableRowMenu from '../components/Global/TableRowMenu';
import TableRowMenuItem from '../components/Global/TableRowMenuItem';
import Drawer from '../components/Global/Drawer';
import Subheader from '../components/Global/Subheader';
import Notification from '../components/Global/Notification';
import CreateEventModal from '../modals/CreateEventModal';
import moment from 'moment';
import history from '../history';

import database from '../config/fire'


export const initialState = {
  showCreateEventModal: false,
  showShareModal: false,
  selected: '',
};
class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.db = database.ref().child('events');

    this.toggleCreateEventModal = this.toggleCreateEventModal.bind(this);
    this.onCreateEventSubmit = this.onCreateEventSubmit.bind(this);
    this.onCreateEventCancel = this.onCreateEventCancel.bind(this);
    this.onDeleteEventSuccess = this.onDeleteEventSuccess.bind(this);
    this.onDeleteEventError = this.onDeleteEventError.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.restoreEvent = this.restoreEvent.bind(this);

  }

  componentWillMount() {
    this.db.on('child_added', () => {
      this.props.onGetEventMany()
    })
    this.props.onClearEvent()
  }

  handleRowClick(row) {
    // this.props.onGetGig(this.id)
    // history.push(`/${this.props.match.params.userId}/bands/testBand/events/${row._id}/`);
    // this.props.onGetEvent(row.id)
    history.push(`/testUser/bands/testBand/events/${row.id}/details`);
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
  }

  onCreateEventError(err) {
    console.log('An error occured:' + err);
  }

  deleteEvent(event) {
    this.props.onDeleteEvent(event)
    // this.db.child(gigId).remove()
    .then(() => this.onDeleteEventSuccess())
    .catch(err => this.onDeleteEventError())
  }

  onDeleteEventSuccess() {
    this.props.onGetEventMany();
    // alert('Show successfully deleted');
  }

  onDeleteEventError() {
    this.props.onGetEventMany();
    alert('An error occured :(');
  }

  restoreEvent() {
    if (this.props.recentlyDeleted.length > 0) {
      this.props.onRestoreEvent(this.props.recentlyDeleted[this.props.recentlyDeleted.length - 1])
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
      { value: moment(doc.date).format('MM/DD/YYYY') || '' },
      { value: doc.venue || '' },
      { value: doc.address || '' },
      { value: doc.loadIn || '' },
      { value: doc.showTime || '' },
      { value: doc.type || '' },
      { value: doc.status.toUpperCase() || '', colorClass: statusColorClass },
    ];

    let menu = (
      doc.status === 'upcoming' ?
      <TableRowMenu>
        <TableRowMenuItem
          label="Edit Details"
          // onClick={ this.handleRowMenuItemClick.bind(this, doc, MENU_EDIT_SHOW_DETAILS) }
        />
        <TableRowMenuItem
          label="Share"
          // onClick={ this.handleRowMenuItemClick.bind(this, doc, MENU_SHARE) }
        />
        <TableRowMenuItem
          label="Delete"
          onClick={ () => this.deleteEvent(doc) }
        />
      </TableRowMenu>
      :
      <TableRowMenu>
      <TableRowMenuItem
        label="Edit Details"
        // onClick={ this.handleRowMenuItemClick.bind(this, doc, MENU_EDIT_SHOW_DETAILS) }
      />
      <TableRowMenuItem
        label="Share"
        // onClick={ this.handleRowMenuItemClick.bind(this, doc, MENU_SHARE) }
      />
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

  // sortData(docs) {
  //   let bands, bids;

  //   // Sort data
  //   bands = docs.filter((doc) => {
  //     return doc.key[1] === 0;
  //   });
  //   shows = docs.filter((doc) => {
  //     return doc.key[1] === 1;
  //   });

  //   // Calculate total cost
  //   bands = bands.map((doc) => {
  //     doc.doc.estimateCost = shows.reduce((a, b) => {
  //       return (b.key[0] == doc.doc._id) ? a + parseInt(b.doc.estimateCost) : a;
  //     }, 0);
  //     return doc;
  //   });

  //   return {
  //     bands: bands,
  //     shows: shows
  //   };
  // }

  renderTable() {
    const { events } = this.props;
      // docs = docs.filter((doc) => {
      //   if(doc.doc.type === "event") {
      //     return doc.doc.type === 'event';
      //   }
      //   else if(doc.doc.status === "past") {
      //     return true;
      //   }
      // });
      if(events) {
        // let results = this.sortData(events);

        let rows = Object.keys(events).map((key) => {
          events[key].id = key;
          return this.renderRow(events[key], key)
        });

        return (
          <Table columnLabels={["Date", "Venue", "Address", "Load In", "Show Time", "Type", "Status", "+"]}>
            { rows }
          </Table>
        );
      }
      else {
        return (
          // <NoContent text="No Shows" />
          <div className="no-content__wrapper">
            <div>No Shows</div>
          </div>
        );
      }
  }

  render() {

    // Subheader
    // let breadcrumbs = [
    //   { link: (authenticated) ? `/${match.params.userId}/projects` : null, name: 'Projects' },
    //   { link: null, name: project.name },
    // ];

    let breadcrumbs = [
      // { link: `/${match.params.userId}/gigs` : null, name: 'Gigs' },
      { link: null, name: 'Shows' },
      // { link: null, name: gig.venue },
    ];

    return (
      <div className='page__container'>
        <Drawer
          // userName={ userName }
          show={ true }
          className="drawer__sidebar"
          // toggle={ this.toggleDrawer }
        />
        <div className='page__content--two-col'>
        <Subheader breadcrumbs={ breadcrumbs }
          // buttonHide={ buttonHide }
          buttonLabel="Add Show"
          buttonIcon="add"
          buttonOnClick={ this.toggleCreateEventModal }
        />
        <CreateEventModal
          show={ this.state.showCreateEventModal }
          onSubmit={ this.onCreateEventSubmit }
          onCancel={ this.onCreateEventCancel }
          onSuccess={ this.onCreateEventSuccess }
          onError={ this.onCreateEventError }
        />
        {this.props.notification.display ? this.renderNotification() : null}
        { this.renderTable() }
      </div>
      </div>
    );
  }
}

// export default EventList;

function mapStateToProps(state) {
  return {
    events: state.events.events,
    recentlyDeleted: state.events.recentlyDeleted,
    notification: state.notification,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onClearEvent: actions.clearEvent,
    onGetEvent: actions.getEvent,
    onGetEventMany: actions.getEventMany,
    onDeleteEvent: actions.deleteEvent,
    onRestoreEvent: actions.restoreEvent,
    dismissNotification: dismissNotification,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EventList);