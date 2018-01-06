import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/search.actions';


const searchResults = {
  user1: {
    name: 'user1'
  },
  user2: {
    name: 'user2'
  },
  user3: {
    name: 'user3'
  }
}
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.renderResults = this.renderResults.bind(this);
  }

  componentDidMount() {
    // Add clickaway to close search results
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    this.props.search(event.target.value);
  }

  renderResults() {
    const { searchResults } = this.props;
    if (searchResults.users) {
      return (
        <div className="search__results">
          <ul>
            {Object.keys(searchResults.users).map(key => {
            return(
              <li>
                { searchResults.users[key].imageUrl ? <img src={searchResults.users[key].imageUrl} alt="Profile Pic" /> : null }
                {searchResults.users[key].displayName}
              </li>
            )
            })}
          </ul>
        </div>
      )
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="search">
        <div className="search__input-section">
          <input
            className="search__input"
            type="text"
            name="search"
            value={this.state.search}
            placeholder="Search"
            onChange={this.handleInputChange}
            autoComplete="off"
          />
          <i className="material-icons">search</i>
        </div>
          { this.renderResults() }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    searchResults: state.search,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    search: actions.searchUsers,
    },
  dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Search);