import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/band.actions';
import { dismissNotification } from '../actions/notification.actions';
import Drawer from '../components/Global/Drawer';
import Subheader from '../components/Global/Subheader';
import Form from '../components/Global/Form';
import Input from '../components/Global/Input';
import Notification from '../components/Global/Notification';
import moment from 'moment';
import history from '../history';
import classNames from 'classnames';
import genres from '../constants/genre_list';
import smoothScroll from '../helpers/smoothScroll';

import { database } from '../config/fire'

export const initialState = {
  name: '',
  location: '',
  genre1: '',
  genre2: '',
  bio: '',
  logo: '',
  id: '',
};
class BandDetails extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    // this.props.onGetGig(this.id)


    this.db = database.ref().child('bands');
    this.id = window.location.pathname.split('/')[3];

    console.log(this.id);

    this.toggleCreateBandForm = this.toggleCreateBandForm.bind(this);
    // this.onUpdateBandSubmit = this.onUpdateBandSubmit.bind(this);
    // this.onUpdateBandCancel = this.onUpdateBandCancel.bind(this);
    this.onDeleteBandSuccess = this.onDeleteBandSuccess.bind(this);
    this.onDeleteBandError = this.onDeleteBandError.bind(this);
    // this.deleteBand = this.deleteBand.bind(this);
    this.restoreBand = this.restoreBand.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);

    this.handleAsyncUpdateButtonClick = this.handleAsyncUpdateButtonClick.bind(this);

    this.handleFormEdit = this.handleFormEdit.bind(this);
  }

  componentWillMount() {
    // this.db.on('child_changed', () => {
      // this.props.onGetBand(this.id)
    // })
    Promise.resolve()
    .then(() => {
      this.props.onGetBand(this.id)
    })
    .then(() => {
      this.setState({
        // disabled: !!this.props.bandEdit,
        name: this.props.band.name || '',
        location: this.props.band.location || '',
        genre1: this.props.band.genre1 || '',
        genre2: this.props.band.genre2 || '',
        bio: this.props.band.bio || '',
        stageplots: this.props.band.stageplots || '',
        logo: this.props.band.logo,
      })
    })
    .catch((err) => console.log(err));
  }

  // componentDidMount() {
  //   console.log('ComponentDidMount' + this.props.eventEdit)
  //   if (this.props.eventEdit) {
  //     const form = this.refs.form;
  //     smoothScroll(form, 500);
  //   }
  // }

  handleFormEdit() {
    const form = document.querySelector('#bottom');
    // const form = this.refs.form;
    this.setState({
      // disabled: !!this.props.eventEdit,
      name: this.props.band.name || '',
      location: this.props.band.location || '',
      genre1: this.props.band.genre1 || '',
      genre2: this.props.band.genre2 || '',
      bio: this.props.band.bio || '',
      stageplots: this.props.band.stageplots || '',
      logo: this.props.band.logo,
      id: this.props.band.id,
    })
    this.props.updateBandEdit();
    if (!this.props.bandEdit) {
      // form.scrollIntoView();
      smoothScroll(form, 500);
    } else {
      // document.body.scrollTop = 0; // For Safari
      // document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      smoothScroll(document.body, 500);
    }
  }

  onSubmit(event) {
    event.preventDefault();
    if(this.refs.form.validate()) {
      this.handleAsyncUpdateButtonClick();
      // this.props.onSubmit();
    }
  }

  onCancel() {
    this.handleFormEdit();
    // this.props.updateEventEdit();
  }

  onSuccess() {
    // this.setState({
    //   disabled: true
    // })
    this.props.updateBandEdit();
    smoothScroll(document.body, 500);
    this.props.onGetBand(this.id);
  }

  onError(err) {
    console.log('An error occurred: ' + err)
  }

  handleAsyncUpdateButtonClick() {
    Promise.resolve()
    .then(this.updateBand())
    .then(() => this.onSuccess())
    .catch(err => this.onError(err));
  }

  updateBand() {
    const band = {
      name: this.state.name,
      location: this.state.location,
      genre1: this.state.genre1,
      genre2: this.state.genre2,
      bio: this.state.bio,
      logo: this.state.logo,
      id: this.state.id,
    }
    this.props.onUpdateEvent(band)
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleRowClick(row) {
    // history.push(`/${this.props.match.params.userId}/bands/testBand/events/${row._id}/`);
    // history.push(`/testUser/bands/testBand/gigs/${row.id}/details`);
  }

  handleRowMenuItemClick(doc, action, event) {
    event.stopPropagation();
  }

  toggleCreateBandForm() {
    this.setState(prevState => ({
      showCreateBandForm: !prevState.showCreateBandForm
    }));
  }


  onDeleteBandSuccess() {
    this.props.onGetBand();
    // alert('Show successfully deleted');
  }

  onDeleteBandError() {
    this.props.onGetBand();
    alert('An error occured :(');
  }

  restoreBand() {
    if (this.props.recentlyDeleted.length > 0) {
      this.props.onRestoreBand(this.props.recentlyDeleted[this.props.recentlyDeleted.length - 1])
    } else {
      console.log('no Bands to restore');
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

  renderForm() {
    const { band } = this.props;
    if (band) {
      let formBottomClasses = classNames('form__bottom', 'band-details__form__bottom', { 'form__bottom--hidden': !this.props.bandEdit });
      return (
        <Form
            // className="form__container"
            className="band-details__form"
            id="band-details__form"
            onSubmit={ this.onSubmit }
            onCancel={ this.onCancel }
            disabled={ !this.props.bandEdit }
            ref="form"
            // error={ createError || uploadError }
          >
            <div className="form__middle">
              <div className="form__column">
                <div className="form__row">
                  <Input type="text"
                    name="name"
                    placeholder="Band Name"
                    label="Band Name"
                    disabled={ !this.props.bandEdit }
                    value={ this.props.bandEdit ? this.state.name : band.name }
                    onChange={ this.handleInputChange }
                    validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                  <Input type="text"
                    name="location"
                    placeholder="Location"
                    label="Location"
                    disabled={ !this.props.bandEdit }
                    value={ this.props.bandEdit ? this.state.location : band.location }
                    onChange={ this.handleInputChange }
                    validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                  </div>
                  <div className="form__row">
                  <Input type="select"
                    name="genre1"
                    placeholder="Genre 1"
                    label="Genre 1"
                    disabled={ !this.props.bandEdit }
                    options={genres}
                    value={ this.props.bandEdit ? this.state.genre1 : band.genre1 }
                    onChange={ this.handleInputChange }
                    validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                  <Input type="select"
                    name="genre2"
                    placeholder="Genre 2"
                    label="Genre 2"
                    disabled={ !this.props.bandEdit }
                    options={genres}
                    value={ this.props.bandEdit ? this.state.genre2 : band.genre2 }
                    onChange={ this.handleInputChange }
                    validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                </div>
                <div className="form__row">
                  <Input type="textarea"
                    name="bio"
                    placeholder="Bio"
                    label="Bio"
                    disabled={ !this.props.bandEdit }
                    value={ this.props.bandEdit ? this.state.bio : band.bio }
                    onChange={ this.handleInputChange }
                    // validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                </div>
                <div className="form__column">
                  {/* { this.renderFiles() } */}
                </div>
              </div>
            <div
            // className="form__bottom"
            className={ formBottomClasses }
            >
              <Input type="button-thin-cancel" value="Cancel" />
              <Input type="button-thin-submit" value="Save" />
              {/* { formBottom } */}
            </div>
            </div>
          </Form>
      )
    } else {
      return (
        <div>One moment please...</div>
      )
    }
  }

  render() {

    // Subheader
    // let breadcrumbs = [
    //   { link: (authenticated) ? `/${match.params.userId}/projects` : null, name: 'Projects' },
    //   { link: null, name: project.name },
    // ];

    let breadcrumbs = this.props.band ? [
      // { link: `/${match.params.userId}/bands` : null, name: 'bands' },
      // { link: `/testUser/bands/testBand/bands`, name: '<' },
      { link: `/testUser/bands/testBand/bands`, name: <i className="icon material-icons">chevron_left</i> },
      { link: null, name: this.props.band.name },
      { link: null, name: this.props.band.location },
    ] :
    [
      // { link: `/${match.params.userId}/bands` : null, name: 'bands' },
      // { link: `/testUser/bands/testBand/bands`, name: '<' },
      { link: `/testUser/bands/testBand/bands`, name: 'band:' },
    ];

    let classes = classNames("band-details__container", {"band-details__container--hidden": !!this.props.bandEdit})

    return (
      <div className='page__container'>
        <Drawer
          // userName={ userName }
          show={ true }
          className="drawer__sidebar"
          // toggle={ this.toggleDrawer }
        />
         <Subheader breadcrumbs={ breadcrumbs }
          // buttonHide={ !!this.props.bandEdit }
          buttonLabel={ !this.props.bandEdit ? 'Edit' : 'Save'}
          buttonIcon={ !this.props.bandEdit ? 'edit' : 'save' }
          buttonOnClick={ !this.props.bandEdit ? this.handleFormEdit : this.onSubmit }
        />
        <div className='page__content page__content--two-col'>
        <div className={ classes }>
        { this.props.isLoading ? null : this.renderForm() }
        <div id="bottom" style={{width: '100%', height: 80}}></div>
      </div>
      </div>
      </div>
    );
  }
}

// export default BandDetails;

function mapStateToProps(state) {
  return {
    band: state.bands.activeBand,
    isLoading: state.app.loading,
    notification: state.notification,
    bandEdit: state.bands.edit,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onGetBand: actions.getBand,
    onDeleteBand: actions.deleteBand,
    onRestoreBand: actions.restoreBand,
    onUpdateBand: actions.updateBand,
    dismissNotification: dismissNotification,
    updateBandEdit: actions.updateBandEdit,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BandDetails);