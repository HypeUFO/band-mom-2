import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/event.actions';
import {
  getBand,
  updateBand,
  updateBandEdit,
  uploadBandLogo,
  uploadStagePlot,
  deleteBand,
  deleteStagePlot,
  leaveBand,
} from '../../../actions/band.actions';
import { dismissNotification } from '../../../actions/notification.actions';
import genres from '../../../constants/genre_list';
import Form from './Form';
import Input from '../Input';
import classNames from 'classnames';
import { database } from '../../../config/fire'


const initialState = {
  selected: '',
  name: '',
  location: '',
  genre1: '',
  genre2: '',
  bio: '',
  logoUrl: '',
  logoName: '',
  id: '',
  stagePlotUrl: '',
  stagePlotName: '',
  selectedStagePlot: '',
};

class BandDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.id = window.location.pathname.split('/')[3];
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onUpdateBandEdit = this.onUpdateBandEdit.bind(this);
    this.updateBand = this.updateBand.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.handleAsyncUpdateButtonClick = this.handleAsyncUpdateButtonClick.bind(this);

  }

  componentWillMount() {
    Promise.resolve()
    .then(() => {
      this.props.onGetBand(this.id)
    })
    .then(() => {
      console.log(this.props.band);
      this.setState({
        name: this.props.band.name || '',
        location: this.props.band.location || '',
        genre1: this.props.band.genre1 || '',
        genre2: this.props.band.genre2 || '',
        bio: this.props.band.bio || '',
        logoUrl: this.props.band.logoUrl || '',
        logoName: this.props.band.logoName || '',
        stagePlotUrl: this.props.stagPlotUrl || '',
        stagePlotName: this.props.stagePlotName || '',
      })
    })
    .catch((err) => console.log(err));
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    if(this.refs.form.validate()) {
      this.handleAsyncUpdateButtonClick();
      // this.props.onSubmit();
    }
  }

  onCancel() {
    // this.handleFormEdit();
    this.props.updateBandEdit();
  }

  onSuccess() {
    this.props.updateBandEdit();
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
      id: this.props.band.id,
      logoUrl: this.props.band.logoUrl || '',
      logoName: this.props.band.logoName || '',
      stageplots: this.props.band.stageplots || '',
    }
    this.props.onUpdateBand(band, this.props.user)
  }


  onUpdateBandEdit() {
    Promise.resolve()
    .then(() => {
      const { activeProfile } = this.props;
      this.setState({
        name: this.props.band.name || '',
        location: this.props.band.location || '',
        genre1: this.props.band.genre1 || '',
        genre2: this.props.band.genre2 || '',
        bio: this.props.band.bio || '',
        logoUrl: this.props.band.logoUrl || '',
        logoName: this.props.band.logoName || '',
        stagePlotUrl: this.props.stagPlotUrl || '',
        stagePlotName: this.props.stagePlotName || '',
      })
    })
    .then(() => this.props.updateBandEdit())
  }

  render() {

    const {
      user,
      band,
      match,
    } = this.props;


    if (band) {
    let formBottomClasses = classNames('form__bottom', { 'form__bottom--hidden': !this.props.bandEdit });


    return (
      <Form
        // className="form__container"
        className="band__details__form"
        id="band-details__form"
        onSubmit={ this.onSubmit }
        onCancel={ this.onCancel }
        disabled={ !this.props.bandEdit }
        ref="form"
        // error={ createError || uploadError }
      >
        <div className="form__middle form__middle__band-dashboard">
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
          </div>
        </div>
        <div className={ formBottomClasses }>
          <Input type="button-thin-cancel" value="Cancel" />
          <Input type="button-thin-submit" value="Save" />
        </div>
      </Form>
    );
  }
  }
}

function mapStateToProps(state) {
  return {
    band: state.bands.activeBand,
    bandEdit: state.bands.edit,
    user: state.auth.user,
    activeBandLogo: state.bands.activeBandLogoUrl,
    activeStagePlotUrl: state.bands.activeStagePlotUrl,
    isLoading: state.app.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateBandEdit: updateBandEdit,
    onUpdateBand: updateBand,
    onGetBand: getBand,
    },
  dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(BandDashboard);