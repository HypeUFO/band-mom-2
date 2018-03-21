import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { createBand } from '../actions/band.actions';
import classNames from 'classnames';
import CreateBandForm from '../components/Global/Forms/CreateBandForm';

class CreateBandModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  }

  render() {
    const {
      show,
    } = this.props;

    let classes = classNames('modal', { 'modal--active': show });

    return (
      <div className={ classes }>
        <CreateBandForm
          onSubmit={ this.props.onSubmit }
          onCancel={ this.props.onCancel }
          onSuccess={ this.props.onSuccess }
          onError={ this.props.onError }
        />
      </div>
    );
  }
}

export default CreateBandModal;
