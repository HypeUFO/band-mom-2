import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import {
//   projectsAsyncCreate,
//   projectsAsyncUpload,
// } from 'actions/projects';
import classNames from 'classnames';
import Form from '../components/Global/Form';
import Input from '../components/Global/Input';
// import truncate from 'utils/truncate';

export const initialState = {
  venue: '',
  address: '',
  date: '',
  showTime: '',
  loadIn: '',
  type: '',
  status: 'building',
  files: [],
};

// @connect(state => ({
//   asyncLoginData: state.auth.get('asyncLoginData'),
//   asyncCreateData: state.projects.get('asyncCreateData'),
//   asyncCreateError: state.projects.get('asyncCreateError'),
//   asyncCreateLoading: state.projects.get('asyncCreateLoading'),
//   asyncUploadData: state.projects.get('asyncUploadData'),
//   asyncUploadError: state.projects.get('asyncUploadError'),
//   asyncUploadLoading: state.projects.get('asyncUploadLoading'),
// }))
export default class CreateGigtModal extends Component {
  static propTypes = {
    // asyncLoginData: PropTypes.object,
    // asyncCreateData: PropTypes.object,
    // asyncCreateError: PropTypes.object,
    // asyncCreateLoading: PropTypes.bool,
    // asyncUploadData: PropTypes.object,
    // asyncUploadError: PropTypes.object,
    // asyncUploadLoading: PropTypes.bool,
    // show: PropTypes.bool,
    // // from react-redux connect
    // dispatch: PropTypes.func,
    // //
    // onSubmit: PropTypes.func.isRequired,
    // onCancel: PropTypes.func.isRequired,
    // onSuccess: PropTypes.func.isRequired,
    // onError: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = initialState;
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputFilesChange = this.handleInputFilesChange.bind(this);
    this.handleAsyncCreateButtonClick = this.handleAsyncCreateButtonClick.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    if(this.refs.form.validate()) {
      this.handleAsyncCreateButtonClick();
      this.props.onSubmit();
    }
  }

  onCancel(event) {
    event.preventDefault();
    this.props.onCancel();
  }

  onSuccess() {
    this.setState(initialState);
    this.props.onSuccess();
  }

  onError() {
    this.props.onError();
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleInputFilesChange(event) {
    if(!event.target.files) {
      return;
    }
    let newFiles = [];
    for(let i = 0; i < event.target.files.length; i++) {
      newFiles.push(event.target.files[i]);
    }
    this.setState(prevState => ({
      files: prevState.files.concat(newFiles)
    }));
  }

  removeFile(index) {
    let files = this.state.files.slice();
    files.splice(index, 1);
    this.setState({
      files: files
    });
  }

  handleAsyncCreateButtonClick() {
    Promise.resolve()
    .then(() =>{
      let user = this.props.asyncLoginData.toJSON();
      let params = {
        type: 'project',
        userId: user._id,
        name: this.state.name,
        address: this.state.address,
        status: this.state.status,
      };
      // return this.props.dispatch(projectsAsyncCreate(params))
    })
    .then((data) =>{
      if(!this.props.asyncCreateData) {
        return;
      }
      if(!this.state.files.length) {
        return;
      }
      let project = this.props.asyncCreateData.toJSON();
      let uploadParams = {
        id: project._id,
        files: this.state.files,
      };
      // return this.props.dispatch(projectsAsyncUpload(uploadParams))
    })
    .then(this.onSuccess)
    .catch(this.onError);
  }

  // renderFiles() {
  //   const {
  //     files,
  //   } = this.state;
  //   let filesElements = files.map((file, index) => {
  //     return (
  //       <div className="modal__file" key={ index }>
  //         <label className="model__file__name">{ truncate(file.name, 24) }</label>
  //         <button
  //           className="model__file__close"
  //           onClick={ this.removeFile.bind(this, index) }
  //           type="button"
  //         >
  //           <i className="material-icons">close</i>
  //         </button>
  //       </div>
  //     );
  //   });
  //   return filesElements;
  // }

  render() {
    const {
      asyncCreateLoading,
      asyncCreateError,
      asyncUploadLoading,
      asyncUploadError,
      show,
    } = this.props;

    const {
      venue,
      address,
      date,
      showTime,
      loadIn,
      type,
      files,
    } = this.state;

    let classes = classNames('modal', { 'modal--active': show });

    // Errors
    let createError = (asyncCreateError) ? asyncCreateError.toJSON().reason : '';
    let uploadError = (asyncUploadError) ? asyncUploadError.toJSON().reason : '';

    // Normal
    return (
      <div className={ classes }>
        <Form className="modal__container"
          onSubmit={ this.onSubmit }
          onCancel={ this.onCancel }
          disabled={ asyncCreateLoading || asyncUploadLoading }
          ref="form"
          error={ createError || uploadError }
        >
          <div className="modal__top">
            <h3 className="clr-purple">Add New Show</h3>
          </div>
          <div className="modal__middle">
            {/* <div className="modal__column"> */}
              <div className="modal__row">
                <Input type="text"
                  name="venue"
                  placeholder="Venue Name"
                  value={ venue }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                />
                <Input type="text"
                  name="address"
                  placeholder="Venue Address"
                  value={ address }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                />
              </div>
               <div className="modal__row">
                <Input type="text"
                  name="showTime"
                  placeholder="Show Time"
                  value={ showTime }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                />
                <Input type="text"
                  name="loadIn"
                  placeholder="Load In Time"
                  value={ loadIn }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                />
              </div>
              <div className="modal__row">
                <Input type="date"
                  name="date"
                  placeholder="Date"
                  value={ date }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                />
                <Input type="select"
                  name="type"
                  placeholder="Show/Rehearsal"
                  options={[{value: "show", label: 'Show'}, {value: "rehearsal", label: 'Rehearsal'}]}
                  value={ type }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                />
              </div>
              {/* <div className="modal__column">
                {/* { this.renderFiles() } */}
              {/* </div> */}
            </div>
          <div className="modal__bottom">
            <Input type="button-thin-cancel" value="Cancel" />
            <Input type="button-thin-submit" value="Create" />
          </div>
        </Form>
      </div>
    );
  }
}
