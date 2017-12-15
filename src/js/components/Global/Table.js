import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import TableRow from './TableRow';

export default class Table extends Component {
  static propTypes = {
    columnLabels: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      sortIndex: 0,
      asc: true,
    };
  }

  onClickColumnLabel(index, event) {
    this.setState(prevState => ({
      sortIndex: index,
      asc: (prevState.sortIndex === index) ? !prevState.asc : prevState.asc,
    }));
  }

  renderColumnLabels() {
    const {
      columnLabels
    } = this.props;
    const {
      sortIndex,
      asc
    } = this.state;

    let self = this;
    let labels = columnLabels.map((columnLabel, index) => {
      let arrowIcon = 'arrow_drop_up';
      let arrowStyle = { opacity: 0 };
      if(sortIndex === index) {
        arrowStyle.opacity = 1;
        arrowIcon = (asc) ? 'arrow_drop_up' : 'arrow_drop_down';
      }
      let arrowHtml = (
        <i className="material-icons" style={arrowStyle}>{ arrowIcon }</i>
      );
      let arrow = (columnLabel) ? arrowHtml : null;
      if (index < columnLabels.length -1) {
      return (
        <th key={ index } onClick={ self.onClickColumnLabel.bind(self, index) }>
          <span>
            { columnLabel }
            { arrow }
          </span>
        </th>
      );
    } else {
      return (
        <th key={ index } onClick={ () => alert("Add Show Modal/View") }>
          <span>
            { columnLabel }
          </span>
        </th>
      );
    }
    });

    return (
      <thead>
        <tr>
          { labels }
        </tr>
      </thead>
    );
  }

  renderRows() {
    const {
      children,
    } = this.props;
    const {
      sortIndex,
      asc,
    } = this.state;

    // Sort children based on column label
    let sortedChildren = React.Children.toArray(children).sort((a, b) => {
      // Get column values
      let valueA = a.props.columns[sortIndex].value;
      let valueB = b.props.columns[sortIndex].value;
      // Handle currency value
      if(valueA[0] === '$' && valueB[0] === '$') {
        valueA = parseInt(valueA.split("$")[1]);
        valueB = parseInt(valueB.split("$")[1]);
      }
      if(asc) {
        return (valueB < valueA) ? 1 : (valueB > valueA) ? -1 : 0;
      }
      else {
        return (valueB > valueA) ? 1 : (valueB < valueA) ? -1 : 0;
      }
    });

    return (
      <tbody>
        { sortedChildren }
      </tbody>
    );
  }

  render() {
    return (
      <div className="table">
        <div className="table__container">
          <table>
            { this.renderColumnLabels() }
            { this.renderRows() }
          </table>
        </div>
      </div>
    );
  }
}
