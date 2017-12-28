import React, { Component } from 'react';
import Drawer from '../components/Global/Drawer';
import Subheader from '../components/Global/Subheader';

import Carousel from '../components/Carousel';
import moment from 'moment';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/event.actions';
import { clearBand, getBandMany } from '../actions/band.actions';

import { database, auth } from '../config/fire';

import { Link } from 'react-router-dom';

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
    this.db.child('bands').on('child_added', () => {
      this.props.onGetBandMany()
    })
    this.props.onClearEvent()
    this.props.onClearBand()
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
          <div>
            <h3>{ doc.name }</h3>
            <p>{ doc.genre }</p>
            <p>{ doc.location }</p>
          </div>
        );
    } else if (type === 'event') {
      card = (
          <div>
            <h3><span className="card__type">{doc.type.toUpperCase()}</span> @ { doc.venue }</h3>
            <p>{ moment(doc.date).format('MM/DD/YYYY')} </p>
            <p>Set Time: { doc.showTime }</p>
          </div>
      );
    }

    return (
      <a
        href={`/testUser/bands/testBand/events/${doc.id}/details`}
        className="card__link"
        key={ index }
      >
        <div className="card">
          { card }
        </div>
      </a>
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
      } else {
          if (type === 'event') {
            return (
              // <NoContent text="No Shows" />
              <div className="no-content__wrapper">
                <div>No Events</div>
              </div>
            );
          } else if (type === 'band') {
            return (
              // <NoContent text="No Shows" />
              <div className="no-content__wrapper">
                <div>No Events</div>
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

    let breadcrumbs = [
      // { link: `/${match.params.userId}/gigs` : null, name: 'Gigs' },
      { link: null, name: this.props.user.displayName || this.props.user.email },
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
          buttonHide={ this.props.user.emailVerified }
          // buttonHide={ true }
          buttonLabel="Verify Email"
          // buttonIcon="add"
          buttonOnClick={ () => {
            auth.currentUser.sendEmailVerification()
            .then(() => {
              // Email sent.
              console.log('Email sent')
            }).catch((error) =>{
              // An error happened.
              console.log('An error occurred' + error)
            });
          } }
        />
        <div className='page__content page__content--two-col'>
        <div className="page__content__container">
          <h1>User Dashboard</h1>

          <h3>Charts to come (time spent, most booked, most lucrative, etc...)</h3>
          <Link to={`/${this.props.user.uid}}/bands`}>
            <h3>Bands</h3>
          </Link>
          { this.renderPreviewList(this.props.bands, 'band') }

          <Link to={`/${this.props.user.uid}/bands/testBand/events`}><h3>Events</h3></Link>
          { this.renderPreviewList(this.props.events, 'event') }
        </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.app.user,
    events: state.events.events,
    bands: state.bands.bands,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onClearEvent: actions.clearEvent,
    onGetEvent: actions.getEvent,
    onGetEventMany: actions.getEventMany,
    onDeleteEvent: actions.deleteEvent,
    onGetBandMany: getBandMany,
    onClearBand: clearBand,
    // onRestoreEvent: actions.restoreEvent,
    // filterEventsByStatus: actions.filterEventsByStatus,
    // filterEventsByType: actions.filterEventsByType,
    // updateEventEdit: actions.updateEventEdit,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard);