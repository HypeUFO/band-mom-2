import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class TableRowMenu extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      top: 0,
      left: 0,
    };
    this.onClickToggleMenu = this.onClickToggleMenu.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickAway = this.handleClickAway.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentWillMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleScroll);
  }

  handleScroll(event) {
    if(this.state.show) {
      this.setState({
        show: false
      });
    }
  }

  onClickToggleMenu(event) {
    event.stopPropagation();
    let rect = event.target.getBoundingClientRect();
    this.setState(prevState => ({
      show: !prevState.show,
      top: rect.top + rect.height + 5,
      left: rect.left + rect.width,
    }))
    document.addEventListener('click', this.handleClickAway);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickAway(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState(prevState => ({
        show: false,
      }))
      document.removeEventListener('click', this.handleClickAway);
    }
  }

  onClickToggleMenuChild(event) {
    event.stopPropagation();
    this.setState(prevState => ({
      show: !prevState.show,
    }));
  }

  render() {
    const {
      children
    } = this.props;

    const {
      show,
      top,
      left,
    } = this.state;

    let classes = classNames({
      'dropdown': true,
      'dropdown--show': show
    });
    let icon = (!show) ? 'more_horiz' : 'close';
    let style = { top: top, left: left };

    let ch = React.Children.map(children, (c, index) => {
      return React.cloneElement(c, {
        onClickCallback: this.onClickToggleMenuChild.bind(this)
      });
    });

    return (
      <td>
        <button onClick={ this.onClickToggleMenu }>
          <i className="material-icons">{ icon }</i>
        </button>
        <div className={ classes } style={ style }>
          <div className="dropdown__container" ref={this.setWrapperRef}>
            { ch }
          </div>
        </div>
      </td>
    );
  }
}

// TableRowMenu.propTypes = {
//   children: React.PropTypes.element.isRequired
// }
