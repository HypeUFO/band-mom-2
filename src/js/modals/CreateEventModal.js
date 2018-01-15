import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CreateEventForm from '../components/Global/Forms/CreateEventForm';

class CreateEventModal extends Component {
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

    // Normal
    return (
      <div className={ classes }>
        <CreateEventForm
          show={ this.props.show }
          onSubmit={ this.props.onSubmit }
          onCancel={ this.props.onCancel }
          onSuccess={ this.props.onSuccess }
          onError={ this.props.onError }
          activeBand={this.props.band || ''}
          onCreateEvent={this.props.onCreateEvent}
          band={this.props.band || null}
          bands={this.props.bands || null}
          user={this.props.user}
        />
      </div>
    );
  }
}

export default CreateEventModal;

