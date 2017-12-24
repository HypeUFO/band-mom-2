import React, { Component } from 'react';
import Drawer from '../components/Global/Drawer';
import Subheader from '../components/Global/Subheader';
import Carousel from '../components/Carousel';
import moment from 'moment';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/event.actions';

import database from '../config/fire'

const testBands = {
  1: {
    name: 'OLDSPORT',
    genre: 'Penetentiary Surf Rock',
    location: 'Los Angeles',
  }
}

class UserDashboard extends Component {
  constructor(props) {
    super(props)
    this.db = database.ref();
  }

  componentWillMount() {
    this.db.child('events').on('child_added', () => {
      this.props.onGetEventMany()
    })
    this.props.onClearEvent()
  }

  renderCard(doc, index, type) {

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

    let card;

    if (type === 'band') {
        card = (
          <a href={`/testUser/bands/testBand/dashboard`} className="card__link">
          <div>
            <h3>{ doc.name }</h3>
            <p>{ doc.genre }</p>
            <p>{ doc.location }</p>
            </div>
          </a>
        );
    } else if (type === 'event') {
      card = (
        <a href={`testUser/bands/testBand/events/${doc.id}`} className="card__link">
          <h3><span className="card__type">{doc.type.toUpperCase()}</span> @ { doc.venue }</h3>
          <p>{ moment(doc.date).format('MM/DD/YYYY')} </p>
          <p>Set Time: { doc.showTime }</p>
        </a>
      );
    }

    return (
      <div className="card"
        key={ index }
        // onClick={ this.handleRowClick.bind(this, doc) }
      >
      { card }
      </div>
    );
  }

  // sortData(docs) {
  //   let events;
  //   // Sort data
  //   events = Object.keys(docs)

  //   return {
  //     events,
  //   };
  // }

  renderPreviewList(list, type) {
      if(list) {
        // let results = this.sortData(events);
        // console.log(results);

        let rows = Object.keys(list).map((key) => {
          // console.log('rendering row')
          list[key].id = key;

          // if (list[key].status === 'upcoming') {
            return this.renderCard(list[key], key, type)
          // }
        })
        if (type === 'event') {
        rows.sort((a, b) => {
          const valueA = new Date(a.key);
          const valueB = new Date(b.key);
          // return (valueB < valueA) ? 1 : (valueB > valueA) ? -1 : 0;
          return 1;
        })
      }

        // .sort((a, b) => {
        //   const valueA = new Date(a.key);
        //   const valueB = new Date(b.key);
        //   return (valueB < valueA) ? 1 : (valueB > valueA) ? -1 : 0;
        // })

        return (
          <Carousel>
            { rows }
          </Carousel>
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

    let breadcrumbs = [
      // { link: `/${match.params.userId}/gigs` : null, name: 'Gigs' },
      { link: null, name: 'Test User' },
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
        <Subheader breadcrumbs={ breadcrumbs }
          // buttonHide={ buttonHide }
          buttonHide={ true }
          // buttonLabel="Add Show"
          // buttonIcon="add"
          // buttonOnClick={ this.toggleCreateEventModal }
        />
        <div className='page__content page__content--two-col'>
          <h1>User Dashboard</h1>

          <h3>Charts to come (time spent, most booked, most lucrative, etc...)</h3>
          <a href="/testUser/bands/testBand/dashboard"><h3>Bands</h3></a>
          { this.renderPreviewList(testBands, 'band') }

          <a href="/testUser/bands/testBand/events"><h3>Events</h3></a>
          { this.renderPreviewList(this.props.events, 'event') }
        </div>
      </div>
    )
  }
}

// export default UserDashboard;

function mapStateToProps(state) {
  return {
    events: state.events.events,
    statusFilter: state.events.statusFilter,
    typeFilter: state.events.typeFilter,
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
    filterEventsByStatus: actions.filterEventsByStatus,
    filterEventsByType: actions.filterEventsByType,
    updateEventEdit: actions.updateEventEdit,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard);