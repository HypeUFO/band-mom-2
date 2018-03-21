import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import classNames from "classnames";
import * as actions from "../../actions/search.actions";
import history from "../../history";

// import Card from './Card/Card';
// import CardSection from './Card/CardSection';
import Spinner from "./Spinner";

const searchResults = {
  user1: {
    name: "user1"
  },
  user2: {
    name: "user2"
  },
  user3: {
    name: "user3"
  }
};
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      showResults: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.handleClickAway = this.handleClickAway.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
  }

  componentDidMount() {
    // Add clickaway to close search results
    document.addEventListener("click", event => this.handleClickAway(event));
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    this.props.search(event.target.value);
  }

  handleClickAway(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        showResults: false
      });
      document.removeEventListener("click", this.handleClickAway);
    } else {
      this.setState({
        showResults: true
      });
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  renderResults() {
    const { searchResults, loading } = this.props;
    if (loading) {
      return <Spinner size="small" />;
    } else if (searchResults.users) {
      return (
        <ul>
          {Object.keys(searchResults.users).map(key => {
            return (
              <a
                href={
                  searchResults.users[key].displayName
                    ? `/${searchResults.users[key].id}/profile`
                    : `/${this.props.user.id}/bands/${
                        searchResults.users[key].id
                      }/profile`
                }
                key={key}
              >
                <li>
                  <img
                    src={
                      searchResults.users[key].imageUrl ||
                      searchResults.users[key].logoUrl ||
                      "https://www.timeshighereducation.com/sites/default/files/byline_photos/anonymous-user-gravatar_0.png"
                    }
                    alt="Profile Pic"
                  />
                  {searchResults.users[key].displayName ||
                    searchResults.users[key].name}
                </li>
              </a>
            );
          })}
        </ul>
      );
    } else {
      return null;
    }
  }

  render() {
    let classes = classNames({
      search__results: true,
      "search__results--show": this.state.showResults
    });
    return (
      <div className="search" ref={this.setWrapperRef}>
        <div className="search__input-section">
          <input
            className="search__input"
            id="search-input"
            type="text"
            name="search"
            value={this.state.search}
            placeholder="Search"
            onChange={this.handleInputChange}
            autoComplete="off"
          />
          <i className="material-icons">search</i>
        </div>
        <div className={classes} id="search-results">
          {this.renderResults()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    searchResults: state.search,
    loading: state.search.loading
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      search: actions.searchUsers
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
