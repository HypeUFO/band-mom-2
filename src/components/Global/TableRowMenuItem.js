import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Table from './components/Global/Table';
// import TableRow from './components/Global/TableRow';
// import TableRowMenu from './components/Global/TableRowMenu';

export default class TableRowMenuItem extends Component {
  static propTypes = {
    label: PropTypes.string,
  }

  onClick(event) {
    this.props.onClick(event);
    this.props.onClickCallback(event);
  }

  render() {
    const {
      label,
      onClick
    } = this.props;

    return (
      <button
        className="dropdown__item"
        onClick={ this.onClick.bind(this) }
      >
        { label }
      </button>
    );
  }
}
