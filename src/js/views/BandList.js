import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/band.actions';
import { dismissNotification } from '../actions/notification.actions';
import Table from '../components/Global/Table';
import TableRow from '../components/Global/TableRow';
import TableRowMenu from '../components/Global/TableRowMenu';
import TableRowMenuItem from '../components/Global/TableRowMenuItem';
import Drawer from '../components/Global/Drawer';
import Subheader from '../components/Global/Subheader';
import Notification from '../components/Global/Notification';
import CreateBandModal from '../modals/CreateBandModal';

import Input from '../components/Global/Input';
import moment from 'moment';
import history from '../history';

import { database } from '../config/fire'


export const initialState = {
  showCreateBandModal: false,
  showShareModal: false,
  selected: '',
};
class BandList extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.db = database.ref().child('events');

    this.toggleCreateBandModal = this.toggleCreateBandModal.bind(this);
    this.onCreateBandSubmit = this.onCreateBandSubmit.bind(this);
    this.onCreateBandCancel = this.onCreateBandCancel.bind(this);
    this.onDeleteBandSuccess = this.onDeleteBandSuccess.bind(this);
    this.onDeleteBandError = this.onDeleteBandError.bind(this);
    this.deleteBand = this.deleteBand.bind(this);
    this.restoreBand = this.restoreBand.bind(this);

  }

  componentWillMount() {
    this.db.on('child_added', () => {
      this.props.onGetBandMany()
    })
    this.props.onClearBand()
  }

  handleRowClick(e, row) {
    e.preventDefault();
    window.location = `/${this.props.match.params.userId}/bands/${row.id}/details`;
    // history.push(`/${this.props.match.params.userId}/bands/testBand/bands/${row.id}/details`);
    // history.push(`/testUser/bands/testBand/bands/${row.id}/details`);
  }

  handleRowMenuItemClick(doc, action, event) {
    event.stopPropagation();
  }

  toggleCreateBandModal() {
    this.setState(prevState => ({
      showCreateBandModal: !prevState.showCreateBandModal
    }));
  }

  onCreateBandSubmit() {
    console.log('Band submitted');
    this.toggleCreateBandModal();
  }

  onCreateBandCancel() {
    this.toggleCreateBandModal();
  }

  onCreateBandSuccess() {
    console.log('Show successfully created');
  }

  onCreateBandError(err) {
    console.log('An error occured:' + err);
  }

  deleteBand(band) {
    this.props.onDeleteBand(band)
    // this.db.child(gigId).remove()
    .then(() => this.onDeleteBandSuccess())
    .catch(err => this.onDeleteBandError())
  }

  onDeleteBandSuccess() {
    this.props.onGetBandMany();
    // alert('Show successfully deleted');
  }

  onDeleteBandError() {
    this.props.onGetBandMany();
    alert('An error occured :(');
  }

  restoreBand() {
    if (this.props.recentlyDeleted.length > 0) {
      this.props.onRestoreBand(this.props.recentlyDeleted[this.props.recentlyDeleted.length - 1])
    } else {
      console.log('no bands to restore');
      this.props.dismissNotification();
    }
  }

  renderNotification() {
    const { notification } = this.props;
    return (
      <Notification
        action={this.restoreBand}
        actionLabel={notification.actionLabel}
        dismiss={this.props.dismissNotification}
        display={notification.display}
        message={notification.message}
      />
    );
  }

  renderCard(doc, index) {
    let card = (
          <div>
            { doc.logo ? <img src={doc.logo} alt="Logo"/> : null }
            <h3>{ doc.name }</h3>
            <p>{ doc.location }</p>
            <p>{ doc.genre1 } / { doc.genre2 }</p>
          </div>
        );

    return (
      <a href={`/${this.props.match.params.userId}/bands/${doc.id}/details`} className="card__link card__link__bandlist" key={ index }>
        <div className="card"
          // onClick={ this.handleRowClick.bind(this, doc) }
        >
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

  renderPreviewList(list) {
      if(list) {
        let rows = Object.keys(list).map((key) => {
          // console.log('rendering row')
          list[key].id = key;
          return this.renderCard(list[key], key)
        }).sort()

        rows.sort((a, b) => {
          const valueA = a.name;
          const valueB = b.name;
          return (valueB < valueA) ? 1 : (valueB > valueA) ? -1 : 0;
          // return 1;
        })


        // .sort((a, b) => {
        //   const valueA = new Date(a.key);
        //   const valueB = new Date(b.key);
        //   return (valueB < valueA) ? 1 : (valueB > valueA) ? -1 : 0;
        // })

        return (
          <div className="band__list">
            { rows }
          </div>
        );
      }
      else {
        return (
          // <NoContent text="No Shows" />
          <div className="no-content__wrapper">
            <div>No Bands</div>
          </div>
        );
      }
  }


  renderRow(doc, index) {
    let columns = [
      { value: doc.name || ''},
      { value: doc.location || '' },
      { value: `${doc.genre1} / ${doc.genre2}` || '' },
      { value: doc.bio || '' },
    ];

    let menu = (
      <TableRowMenu>
        <TableRowMenuItem
          label="Delete"
          onClick={ () => this.deleteEvent(doc) }
        />
      </TableRowMenu>
    )

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
  //   let events;
  //   // Sort data
  //   events = Object.keys(docs)

  //   return {
  //     events,
  //   };
  // }

  renderTable(bands) {
    // const { bands } = this.props;
      if(bands) {
        // let results = this.sortData(bands);
        // console.log(results);

        let rows = Object.keys(bands).map((key) => {
          console.log('rendering row: ' + bands[key])
          bands[key].id = key;

        });

        return (
          <Table columnLabels={[
            "Name",
            "Location",
            "Genres",
            "Bio",
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
            <div>No Bands</div>
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
      { link: null, name: 'Bands' },
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
          buttonLabel="Add Band"
          buttonIcon="add"
          buttonOnClick={ this.toggleCreateBandModal }
        />
        <div className='page__content page__content--two-col'>
          <CreateBandModal
            show={ this.state.showCreateBandModal }
            onSubmit={ this.onCreateBandSubmit }
            onCancel={ this.onCreateBandCancel }
            onSuccess={ this.onCreateBandSuccess }
            onError={ this.onCreateBandError }
          />
          <div className="page__content__container">
            {this.props.notification.display ? this.renderNotification() : null}
            { this.renderPreviewList(this.props.bands) }
            {/* { this.renderTable(this.props.bands) } */}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    bands: state.bands.bands,
    recentlyDeleted: state.bands.recentlyDeleted,
    notification: state.notification,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onClearBand: actions.clearBand,
    onGetBand: actions.getBand,
    onGetBandMany: actions.getBandMany,
    onDeleteBand: actions.deleteBand,
    onRestoreBand: actions.restoreBand,
    dismissNotification: dismissNotification,
    updateBandEdit: actions.updateBandEdit,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BandList);