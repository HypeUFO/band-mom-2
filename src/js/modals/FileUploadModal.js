import React, { Component } from 'react';
import classNames from 'classnames';
import FileUpload from '../components/Global/FileUpload';

export default class FileUploadModal extends Component {
constructor(props: any) {
    super(props);
    this.onCancel     = this.onCancel.bind(this);
}

onCancel(event) {
  event.preventDefault();
  this.props.onCancel();
}

render() {
    let props = this.props;

    let classes = classNames('modal', { 'modal--active': props.show });

    return (
      <div className={ classes }>
        <div className="modal__container"
        >
          <div className="modal__top" style={{display: 'flex', justifyContent: 'space-between'}}>
            <h3 className="clr-purple">{ this.props.header }</h3>
            <button className="modal__close" onClick={ this.onCancel }><i className="material-icons">close</i></button>
          </div>
          <div className="modal__middle">
            <FileUpload
              onUpload={ this.props.onUpload }
              onCancel={ this.props.onCancel }
              pathId={this.props.pathId}
            />
          </div>
        </div>
      </div>
    );
  }
}
