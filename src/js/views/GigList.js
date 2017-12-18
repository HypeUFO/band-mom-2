import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/gig.actions';
import { dismissNotification } from '../actions/notification.actions';
import Table from '../components/Global/Table';
import TableRow from '../components/Global/TableRow';
import TableRowMenu from '../components/Global/TableRowMenu';
import TableRowMenuItem from '../components/Global/TableRowMenuItem';
import Drawer from '../components/Global/Drawer';
import Subheader from '../components/Global/Subheader';
import Notification from '../components/Global/Notification';
import CreateGigModal from '../modals/CreateGigModal';
import moment from 'moment';

import database from '../config/fire'


export const initialState = {
  gigs: [],
  showCreateGigModal: false,
  showShareModal: false,
  selected: '',
};
class GigList extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.db = database.ref().child('gigs');

    this.toggleCreateGigModal = this.toggleCreateGigModal.bind(this);
    this.onCreateGigSubmit = this.onCreateGigSubmit.bind(this);
    this.onCreateGigCancel = this.onCreateGigCancel.bind(this);
    this.onDeleteGigSuccess = this.onDeleteGigSuccess.bind(this);
    this.onDeleteGigError = this.onDeleteGigError.bind(this);
    this.deleteGig = this.deleteGig.bind(this);
    this.restoreGig = this.restoreGig.bind(this);

  }

  componentWillMount() {
    this.db.on('child_added', () => {
      this.props.onGetGig()
    })
  }

  handleRowClick(row) {
  }

  handleRowMenuItemClick(doc, action, event) {
    event.stopPropagation();
  }

  toggleCreateGigModal() {
    this.setState(prevState => ({
      showCreateGigModal: !prevState.showCreateGigModal
    }));
  }

  onCreateGigSubmit() {
    console.log('gig submitted');
    this.toggleCreateGigModal();
  }

  onCreateGigCancel() {
    this.toggleCreateGigModal();
  }

  onCreateGigSuccess() {
    console.log('Show successfully created');
  }

  onCreateGigError(err) {
    console.log('An error occured:' + err);
  }

  deleteGig(gig) {
    this.props.onDeleteGig(gig)
    // this.db.child(gigId).remove()
    .then(() => this.onDeleteGigSuccess())
    .catch(err => this.onDeleteGigError())
  }

  onDeleteGigSuccess() {
    this.props.onGetGig();
    // alert('Show successfully deleted');
  }

  onDeleteGigError() {
    this.props.onGetGig();
    alert('An error occured :(');
  }

  restoreGig() {
    if (this.props.recentlyDeleted.length > 0) {
      this.props.onRestoreGig(this.props.recentlyDeleted[this.props.recentlyDeleted.length - 1])
    } else {
      console.log('no gigs to restore');
      this.props.dismissNotification();
    }
  }

  renderNotification() {
    const { notification } = this.props;
    return (
      <Notification
        action={this.restoreGig}
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
        statusColorClass = 'clr-purple';
        break;
      case 'past':
        statusColorClass = 'clr-red';
        break;
      default:
        statusColorClass = 'clr-purple';
    }

    let columns = [
      { value: moment(doc.date).format('MM/DD/YYYY') },
      { value: doc.venue },
      { value: doc.address },
      { value: doc.loadIn },
      { value: doc.showTime },
      { value: doc.status.toUpperCase(), colorClass: statusColorClass },
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
          onClick={ () => this.deleteGig(doc) }
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
        onClick={ () => this.deleteGig(doc) }
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
    const { gigs } = this.props;
      // docs = docs.filter((doc) => {
      //   if(doc.doc.type === "gig") {
      //     return doc.doc.type === 'gig';
      //   }
      //   else if(doc.doc.status === "past") {
      //     return true;
      //   }
      // });
      if(gigs) {
        // let results = this.sortData(gigs);

        let rows = Object.keys(gigs).map((key) => {
          gigs[key].id = key;
          return this.renderRow(gigs[key], key)
        });

        return (
          <Table columnLabels={["Date", "Venue", "Address", "Load In", "Show Time", "Status", "+"]}>
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
          buttonOnClick={ this.toggleCreateGigModal }
        />
        <CreateGigModal
          show={ this.state.showCreateGigModal }
          onSubmit={ this.onCreateGigSubmit }
          onCancel={ this.onCreateGigCancel }
          onSuccess={ this.onCreateGigSuccess }
          onError={ this.onCreateGigError }
        />
        {this.props.notification.display ? this.renderNotification() : null}
        { this.renderTable() }
      </div>
      </div>
    );
  }
}

// export default GigList;

function mapStateToProps(state) {
  return {
    gigs: state.gigs.gigs,
    recentlyDeleted: state.gigs.recentlyDeleted,
    notification: state.notification,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onGetGig: actions.getGig,
    onDeleteGig: actions.deleteGig,
    onRestoreGig: actions.restoreGig,
    dismissNotification: dismissNotification,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GigList);