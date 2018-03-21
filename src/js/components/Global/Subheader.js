import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class Subheader extends Component {
  static propTypes = {
    breadcrumbs: PropTypes.array,
    buttonHide: PropTypes.bool,
    buttonLabel: PropTypes.string,
    buttonIcon: PropTypes.string,
    buttonOnClick: PropTypes.func,
  }

  renderButton() {
    const {
      buttonHide,
      buttonLabel,
      buttonIcon,
      buttonOnClick,
    } = this.props;

    if(buttonHide) {
      return null;
    }

    return (
      <div className="subheader__actions">
        <button className="btn-icon" onClick={ buttonOnClick }>
          <span className="btn-icon__text">{ buttonLabel }</span>
          <i className="material-icons btn-icon__icon">{ buttonIcon }</i>
        </button>
      </div>
    );
  }

  renderBreadcrumbs() {
    const {
      breadcrumbs,
    } = this.props;

    let parts = breadcrumbs.map((bc, index) => {
      let backslash = (breadcrumbs.length > 1 && index !== breadcrumbs.length - 1) ? ' /' : '';
      let link;
      if(bc.link) {
        link = <Link to={ bc.link }>{ bc.name }{ backslash }</Link>;
      } else {
        link = bc.name + backslash;
      }
      return (
        <h4 className="subheader__breadcrumb" key={ index }>{ link }</h4>
      );
    });

    return(
      <div className="subheader__breadcrumbs">
        { parts }
      </div>
    );
  }

  render() {
    return (
      <div className="subheader">
        { this.renderBreadcrumbs() }
        { this.renderButton() }
      </div>
    );
  }
}
