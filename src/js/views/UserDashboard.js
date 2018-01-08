import React, { Component } from 'react';
import Drawer from '../components/Global/Drawer';
import Subheader from '../components/Global/Subheader';

import Carousel from '../components/Carousel';
import moment from 'moment';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import * as actions from '../actions/event.actions';
import { clearBand, getBand, getBandMany } from '../actions/band.actions';

import { database, auth } from '../config/fire';

import { Link } from 'react-router-dom';


class UserDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {userEvents: null}
    this.db = database.ref();
  }

  componentWillMount() {
    this.db.on('value', () => {
      this.props.onGetBandMany(this.props.user);
      this.props.onGetUserEventMany(this.props.user.id);
    })
    this.props.onClearEvent()
    this.props.onClearBand()
  }

  renderCard(doc, index, type) {
    // if (doc) {
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
            <a
              href={`/${this.props.match.params.userId}/bands/${doc.id}/dashboard`}
              className="card__link"
              key={ index }
            >
              <div className="card">
                <div>
                  { doc.logo ? <img src={ doc.logo } alt="logo" /> : null }
                  <h3>{ doc.name }</h3>
                  <p>{ doc.genre1 } / { doc.genre2 }</p>
                  <p>{ doc.location }</p>
                </div>
              </div>
            </a>
          );
      } else if (type === 'event') {
        card = (
          <a
            href={`/${this.props.match.params.userId}/bands/${doc.bandId}/events/${doc.id}/details`}
            className="card__link"
            key={ index }
          >
            <div className="card">
              <div>
                <h3><span className="card__type">{doc.type.toUpperCase()}</span> @ { doc.venue }</h3>
                <p>{ moment(doc.date).format('MM/DD/YYYY')} </p>
                <p>Set Time: { doc.showTime }</p>
              </div>
            </div>
          </a>
        );
      }

      return card;
    // }
  }

  renderPreviewList(list, type) {
    const { loading } = this.props;
      if (!loading && list && Object.keys(list).length > 0 && list.constructor === Object) {
        let rows = Object.keys(list).map((key) => {
          if (list[key]) {
            let index = list[key].date || key
            return this.renderCard(list[key], index, type)
          }
        })
        if (type === 'event') {
        rows.sort((a, b) => {
          const valueA = new Date(a.key);
          const valueB = new Date(b.key);
          return (valueB < valueA) ? 1 : (valueB > valueA) ? -1 : 0;
          // return 1;
        })
      }

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
                <div>No Bands</div>
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

    let verifyEmailButtonClasses = classNames('btn-icon', {'btn--hide': this.props.user.emailVerified})

    let breadcrumbs = [
      // { link: null, name: this.props.user.displayName || this.props.user.email },
      { link: `${this.props.match.params.userId}/dashboard`, name: 'Dashboard' },
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
          // buttonHide={ this.props.user.emailVerified }
          buttonHide={ true }
          // buttonLabel="Verify Email"
          // // buttonIcon="add"
          // buttonOnClick={ () => {
          //   auth.currentUser.sendEmailVerification()
          //   .then(() => {
          //     // Email sent.
          //     console.log('Email sent')
          //   }).catch((error) =>{
          //     // An error happened.
          //     console.log('An error occurred' + error)
          //   });
          // } }
        />
        <div className='page__content page__content--two-col'>
        <div className="page__content__container">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1>Welcome {this.props.user.displayName ? this.props.user.displayName : ''}</h1>
            <button
              className="btn-icon btn--hide"
              onClick={() => {
                auth.currentUser.sendEmailVerification()
                .then(() => {
                  // Email sent.
                  console.log('Email sent')
                }).catch((error) =>{
                  // An error happened.
                  console.log('An error occurred' + error)
                });
              }}
            >
              Verify Email
            </button>
          </div>

          {/* <h3>Charts to come (time spent, most booked, most lucrative, etc...)</h3> */}
          <Link to={`/${this.props.user.id}}/bands`}>
            <h3>Bands</h3>
          </Link>
          { this.renderPreviewList(this.props.bands, 'band') }

          <Link to={`/${this.props.user.id}/events`}><h3>Events</h3></Link>
          { this.renderPreviewList(this.props.userEvents, 'event') }
        </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    loading: state.app.loading,
    events: state.events.events,
    userEvents: state.events.userEvents,
    bands: state.bands.bands,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onClearEvent: actions.clearEvent,
    onGetEvent: actions.getEvent,
    onGetEventMany: actions.getEventMany,
    onGetUserEventMany: actions.getUserEventMany,
    onDeleteEvent: actions.deleteEvent,
    onGetBandMany: getBandMany,
    onGetBand: getBand,
    onClearBand: clearBand,
    // onRestoreEvent: actions.restoreEvent,
    // filterEventsByStatus: actions.filterEventsByStatus,
    // filterEventsByType: actions.filterEventsByType,
    // updateEventEdit: actions.updateEventEdit,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard);