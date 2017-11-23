import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';

export default class TableRow extends Component {
  static propTypes = {
    columns: PropTypes.array,
    onClick: PropTypes.func,
  }

  renderColumns() {
    const {
      columns
    } = this.props;

    let cols = columns.map((column, index) => {
      return <td key={ index } className={ column.colorClass }>{ column.value }</td>
    });

    return (
      cols
    );
  }

  render() {
    const {
      onClick,
      children
    } = this.props;

    return (
      <tr onClick={ onClick }>
        { this.renderColumns() }
        { children }
      </tr>
    );
  }
}
