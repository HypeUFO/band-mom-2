import React, { Component } from 'react';

class FilterSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.setFilterWidth = this.setFilterWidth.bind(this);
    this.handleFilterWidth = this.handleFilterWidth.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentDidMount() {
    this.handleFilterWidth()
    window.addEventListener('resize', this.handleFilterWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleFilterWidth);
  }

  setFilterWidth(id) {
    const filterDiv = document.querySelector(`#${id}`);
    const template = document.querySelector('#template');
    template.options[0].innerHTML = filterDiv.options[filterDiv.selectedIndex].textContent;

    filterDiv.style.width = `${template.getBoundingClientRect().width}px`;
  }

  handleFilterWidth() {
    const selectList = document.querySelectorAll('.event__filter');

    selectList.forEach((sel) => {
        this.setFilterWidth(sel.getAttribute('id'));
    });
  }

  handleFilterChange(filter, action) {
    this.handleFilterWidth();
    action(filter);
  }

  render() {
        let opts = this.props.options.map((option, index) => {
          return (
            <option value={ option.value } key={ index }>
              {  option.label }
            </option>
          );
        });
        return (
          <div className="filter__link">
            <p className="filter__label">Filter: </p>
            <select
              className={this.props.className}
              id={this.props.id}
              defaultValue={this.props.statusFilter}
              // ref="statusFilter"
              ref={this.props.reference}
              onChange={ () => this.handleFilterChange(this.refs[this.props.reference].value, this.props.action) }
            >
              { opts }
            </select>
            <i className="material-icons">chevron_right</i>
          </div>
        );
      }
    };

export default FilterSelect
