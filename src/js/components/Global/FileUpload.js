import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from './Spinner';
import { connect } from 'react-redux';

var propTypes = {
  baseColor: PropTypes.string,
  activeColor: PropTypes.string
},

defaultProps = {
  baseColor: '#7F4FFF',
  activeColor: '#b79cff',
  overlayColor: 'rgba(255,255,255,0.3)'
};

class FileUploadModal extends Component {
constructor(props: any) {
    super(props);
    this.state = {
        active: false,
        imageSrc: '',
        loaded: false,
    }

    this.onDragEnter  = this.onDragEnter.bind(this);
    this.onDragLeave  = this.onDragLeave.bind(this);
    this.onDrop       = this.onDrop.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onCancel     = this.onCancel.bind(this);
    this.clearFileObject = this.clearFileObject.bind(this);
}

onDragEnter(e) {
    this.setState({ active: true });
}

onDragLeave(e) {
    this.setState({ active: false });
}

onDragOver(e) {
    e.preventDefault();
}

onDrop(e) {
    e.preventDefault();
    this.setState({ active: false });
    this.onFileChange(e, e.dataTransfer.files[0]);
}

onFileChange(e, file) {
    var file = file || e.target.files[0],
        pattern = /image-*/,
        reader = new FileReader();

    if (!file.type.match(pattern)) {
        alert('Formato inválido');
        return;
    }

    this.setState({ loaded: false });

    reader.onload = (e) => {
        this.setState({
            imageSrc: reader.result,
            loaded: true
        });
        this.props.onCancel();
    }

    reader.readAsDataURL(file);
    this.props.onUpload(file, this.props.pathId);
}


getFileObject() {
    return this.refs.input.files[0];
}

clearFileObject() {
  return this.refs.input.value = null;
}

getFileString() {
    return this.state.imageSrc;
}

onCancel(event) {
  event.preventDefault();
  this.props.onCancel();
}

render() {
    const state = this.state;
    const props = this.props;
    const labelClass  = `uploader ${state.loaded && 'loaded'}`;
    const borderColor = state.active ? props.activeColor : props.baseColor;
    const iconColor   = state.active
        ? props.activeColor
        : (state.loaded)
            ? props.overlayColor
            : props.baseColor;

    return (
      <div>
        { this.props.isLoading ? <Spinner /> : null }
        <label
          className={labelClass}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
          style={{outlineColor: borderColor}}
        >
          <img src={state.imageSrc} alt="upload" />
          <i
            className="icon icon-upload"
            style={{ color: iconColor }}
          >
          </i>
          <input type="file" accept="image/*" onChange={this.onFileChange} ref="input" />
        </label>
        <p>{this.props.error.message}</p>
      </div>
    );
  }
}

FileUploadModal.propTypes = propTypes;
FileUploadModal.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    isLoading: state.bands.loading,
    error: state.bands.error,
  };
}



export default connect(mapStateToProps)(FileUploadModal);

