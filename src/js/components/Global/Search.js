import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/search.actions';

// import Card from './Card/Card';
// import CardSection from './Card/CardSection';
import Spinner from './Spinner';


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
    const { searchResults, loading } = this.props;
    if (loading) {
      return (
        <div className="search__results">
          <Spinner size="small"/>
        </div>
      )
    }
    else if (searchResults.users) {
      return (
         // <Card className="search__results">
        <div className="search__results">
          {/* <CardSection> */}
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
          {/* </CardSection> */}
          </div>
        // </Card>
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
    loading: state.search.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    search: actions.searchUsers,
    },
  dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Search);