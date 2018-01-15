import React, { Component } from 'react';
import instrumentList from '../../../constants/instrument_list';
import Form from './Form';
import Input from '../Input';
// import moment from 'moment';
import classNames from 'classnames';

const initialState = {
  displayName: '',
  location: '',
  about: '',
  imageUrl: '',
  instruments: {},
};

class UserEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.renderCheckboxes = this.renderCheckboxes.bind(this);
    this.renderInstrumentList = this.renderInstrumentList.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.onUpdateUserEdit = this.onUpdateUserEdit.bind(this)
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentDidMount() {
      const { activeProfile } = this.props;
      this.setState({
      displayName: activeProfile.displayName || '',
      location: activeProfile.location || '',
      about: activeProfile.about || '',
      imageUrl: activeProfile.imageUrl || '',
      instruments: activeProfile.instruments || {},
    })
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleCheckboxChange(event) {
    const name = [event.target.name];
    const value = event.target.checked

    this.setState(prevState => ({
      instruments: {
          ...prevState.instruments,
          [name]: value,
      }
    }))
  }

  onSubmit(event) {
    event.preventDefault();
    if(this.refs.form.validate()) {
      this.handleAsyncUpdateButtonClick();
    }
  }

  onCancel() {
    this.setState({disabled: true})
    this.props.updateUserEdit();
    this.props.onGetActiveProfile(this.props.activeProfile.id);
  }

  onSuccess() {
    this.props.updateUserEdit();
    this.props.onGetActiveProfile(this.props.activeProfile.id);
  }

  onError(err) {
    console.log('An error occurred: ' + err)
  }

  handleAsyncUpdateButtonClick() {
    Promise.resolve()
    .then(this.updateUser())
    .then(() => this.onSuccess())
    .catch(err => this.onError(err));
  }

  updateUser() {
    const user = {
      displayName: this.state.displayName,
      location: this.state.location,
      about: this.state.about,
      imageUrl: this.state.imageUrl || '',
      instruments: this.state.instruments || {},
      id: this.props.activeProfile.id,
    }
    this.props.onUpdateUser(user)
  }

  onUpdateUserEdit() {
    Promise.resolve()
    .then(() => {
      const { activeProfile } = this.props;
      this.setState({
        displayName: activeProfile.displayName || '',
        location: activeProfile.location || '',
        about: activeProfile.about || '',
        imageUrl: activeProfile.imageUrl || '',
        instruments: activeProfile.instruments || '',
      })
    })
    .then(() => this.props.updateUserEdit())
  }

  renderCheckboxes(list) {
    return (
      list.map((item, index) => {
        return (
          <Input
            type="checkbox"
            name={item.value}
            label={item.label}
            key={index}
            disabled={ !this.props.userEdit }
            onChange={ this.handleCheckboxChange }
            isChecked={ this.state.instruments[item.label] ? true : false }
          />
        );
      })
    );
  }

  renderInstrumentList(list) {
    if (list) {
      let listItems = []
      Object.keys(list).map(key => {
        if (list[key]) {
          listItems.push(
            <li key={key}>
              { key }
            </li>
          );
        }
      })
      return listItems;
    }
  }


  render() {

    const {
      user,
      activeProfile,
      userEdit,
    } = this.props;


      let formBottomClasses = classNames('form__bottom', { 'form__bottom--hidden': !this.props.userEdit });
      let checkboxGroupClasses = classNames('checkbox__group', { 'checkbox__group--disabled': !this.props.userEdit });

      return (
        <Form
          // className="form__container"
          className="user__profile__form"
          id="user-details__form"
          onSubmit={ this.onSubmit }
          onCancel={ this.onCancel }
          // disabled={ !this.props.userEdit }
          disabled={ !userEdit }
          ref="form"
          // error={ createError || uploadError }
        >
          <div className="form__middle form__middle__user-dashboard">
            <div className="form__column">
              <div className="form__row">
                <Input type="text"
                  name="displayName"
                  placeholder="Display Name"
                  label="Display Name"
                  // disabled={ !this.props.userEdit }
                  disabled={ !userEdit }
                  value={ this.props.userEdit ? this.state.displayName : activeProfile.displayName }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                />
                <Input type="text"
                  name="location"
                  placeholder="Location"
                  label="Location"
                  // disabled={ !this.props.userEdit }
                  disabled={ !userEdit }
                  value={ this.props.userEdit ? this.state.location : activeProfile.location }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                />
              </div>
              <div className="form__row">
                <Input type="textarea"
                  name="about"
                  placeholder="About"
                  label="About"
                  // disabled={ !this.props.userEdit }
                  disabled={ !userEdit }
                  value={ this.props.userEdit ? this.state.about : activeProfile.about }
                  onChange={ this.handleInputChange }
                  // validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                />
              </div>
              <div className="form__column">
                <label className="input__label">Instruments</label>
                <div className="form__row">
                  <div className={checkboxGroupClasses}>
                    { this.props.userEdit
                      ? this.renderCheckboxes(instrumentList)
                      : <ul>{this.renderInstrumentList(this.props.activeProfile.instruments)}</ul>
                    }
                  </div>
                </div>
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

export default UserEditForm;
