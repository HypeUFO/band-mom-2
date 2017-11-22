import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from './Input';

let numInputs = 0;

export default class Form extends Component {
  // static propTypes = {
  //   className: PropTypes.string,
  //   error: PropTypes.string,
  //   onSubmit: PropTypes.func,
  //   onCancel: PropTypes.func,
  //   disabled: PropTypes.bool,
  // }

  validate() {
    let validForm = true;
    for (let key in this.refs) {
      validForm = (this.refs[key].validate()) ? validForm : false;
    }
    return validForm;
  }

  renderChildren(children, onCancel, notReset) {
    if(!notReset) {
      numInputs = 0;
    }
    return React.Children.map(children, child => {
      var childProps = {};
      if (React.isValidElement(child)) {
          if(child.type == Input) {
            numInputs++;
            childProps = {
              key: 0,
              ref: numInputs,
              onCancel: onCancel,
            };
          }
      }
      if (child.props) {
        childProps.children = this.renderChildren(child.props.children, onCancel, true);
        return React.cloneElement(child, childProps);
      }
      return child;
    });
  }

  render() {
    const {
      className,
      error,
      onSubmit,
      onCancel,
      children,
      disabled,
    } = this.props;
    let errorLabel = (error) ?
    <label className="input__error">{ error }</label> : null;
    let fieldsetStyle = {
      opacity: (disabled) ? 0.8 : 1.0
    };
    return (
      <form className={ className } onSubmit={ onSubmit }>
        <fieldset disabled={ disabled } style={ fieldsetStyle }>
          { this.renderChildren(children, onCancel) }
          { errorLabel }
        </fieldset>
      </form>
    );
  }
}
