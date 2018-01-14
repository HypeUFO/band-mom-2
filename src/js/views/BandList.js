import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/band.actions';
import { dismissNotification } from '../actions/notification.actions';
import Table from '../components/Global/Table/Table';
import TableRow from '../components/Global/Table/TableRow';
import TableRowMenu from '../components/Global/Table/TableRowMenu';
import TableRowMenuItem from '../components/Global/Table/TableRowMenuItem';
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

    this.db = database.ref().child('groups');

    this.toggleCreateBandModal = this.toggleCreateBandModal.bind(this);
    this.onCreateBandSubmit = this.onCreateBandSubmit.bind(this);
    this.onCreateBandCancel = this.onCreateBandCancel.bind(this);
    this.onDeleteBandSuccess = this.onDeleteBandSuccess.bind(this);
    this.onDeleteBandError = this.onDeleteBandError.bind(this);
    this.deleteBand = this.deleteBand.bind(this);

  }

  componentWillMount() {
    this.db.on('value', () => {
      this.props.onGetBandMany(this.props.user)
    })
    this.props.onClearBand()
  }

  handleRowClick(e, row) {
    e.preventDefault();
    this.props.history.push(`/${this.props.match.params.userId}/bands/${row.id}/dashboard`);
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

  renderNotification() {
    const { notification } = this.props;
    return (
      <Notification
        // action={this.restoreBand}
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
            <div>
              <img
                src={doc.logoUrl || "https://www.timeshighereducation.com/sites/default/files/byline_photos/anonymous-user-gravatar_0.png"}
                alt="Logo"
                style={{ height: '100px', width: '100px', borderRadius: '50%'}}
              />
            </div>
            <h3>{ doc.name }</h3>
            <p>{ doc.location }</p>
            <p>{ doc.genre1 } / { doc.genre2 }</p>
          </div>
        );

    return (
      <a href={`/${this.props.match.params.userId}/bands/${doc.id}/dashboard`} className="card__link card__link__bandlist" key={ index }>
        <div className="card"
          // onClick={ this.handleRowClick.bind(this, doc) }
        >
          { card }
        </div>
      </a>
    );
  }

  renderPreviewList(list) {
      if(list && Object.keys(list).length > 0 && list.constructor === Object) {
        console.log(list);
        let rows = Object.keys(list).map((key) => {
          // console.log('rendering row')
          console.log(list[key])
          // list[key].id = key;
          return this.renderCard(list[key], key)
        }).sort()

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

  renderTable(bands) {
      if(bands) {
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
    let breadcrumbs = [
      { link:  `/${this.props.match.params.userId}/dashboard`, name: this.props.user.displayName ||  this.props.user.email},
      { link: `/${this.props.match.params.userId}/bands`, name: 'Bands' },
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
    user: state.auth.user,
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
    dismissNotification: dismissNotification,
    updateBandEdit: actions.updateBandEdit,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BandList);