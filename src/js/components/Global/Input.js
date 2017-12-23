import React, { Component } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import CalenderModal from '../../modals/CalendarModal';

export default class Input extends Component {
  static propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    accept: PropTypes.string,
    options: PropTypes.array,
    rows: PropTypes.string,
    cols: PropTypes.string,
    name: PropTypes.string,
    error: PropTypes.string,
    validation: PropTypes.object,
    onChange: PropTypes.func,
    onCancel: PropTypes.func,
    disabled: PropTypes.bool,
  }

  constructor() {
    super();
    this.state = {
      errors: [],
      showCalender: false,
    };
    this.validate = this.validate.bind(this);
    this.onClickDate = this.onClickDate.bind(this);
    this.onClickDateCancel = this.onClickDateCancel.bind(this);
    this.onClickDateOk = this.onClickDateOk.bind(this);
  }

  validate() {
    let {
      // name,
      value,
      validation,
    } = this.props;

    if (value === undefined) {
      value = '';
    }

    const specialChars = [' ', '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '\\', '^', '_', '`', '{', '|', '}', '~'];

    let vs = {
      isAlphanumeric: (value, options) => {
        if (options.blacklist) options.blacklist.push(...options.blacklist, specialChars);
        else options.blacklist = specialChars;
        if(!value) { return { valid: true, error: `` } }
        return {
          valid: validator.isAlphanumeric(validator.blacklist(value, options.blacklist)),
          error: `Must be alphanumeric.`,
        }
      },
      isAlpha: (value, options) => {
        if (options.blacklist) options.blacklist.push(...options.blacklist, specialChars);
        else options.blacklist = specialChars;
        if(!value) { return { valid: true, error: `` } }
        return {
          valid: validator.isAlpha(validator.blacklist(value, options.blacklist)),
          error: `Must be alpha.`,
        }
      },
      isNumeric: (value, options) => {
        if(!value) { return { valid: true, error: `` } }
        return {
          valid: validator.isNumeric(validator.blacklist(value, options.blacklist)),
          error: `Must be numeric.`,
        }
      },
      isEmail: (value, options) => {
        if(!value) { return { valid: true, error: `` } }
        return {
          valid: validator.isEmail(validator.blacklist(value, options.blacklist)),
          error: `Must be email.`,
        }
      },
      isLength: (value, options) => {
        return {
          valid: validator.isLength(value, { min: options.min, max: options.max }),
          error: `Must be between ${options.min} and ${options.max} characters.`,
        }
      },
    };

    let errors = [];
    for (let key in validation) {
      let options = validation[key];
      let v;
      if(typeof vs[key] === 'function') {
        v = vs[key](value, options);
        if(!v.valid) {
          errors.push(v.error);
        }
      }
    }

    this.setState({
      errors: errors
    });

    return errors.length === 0;
  }

  onClickDate(event) {
    event.preventDefault();
    this.setState(prevState => ({
      showCalender: !prevState.showCalender,
    }));
  }

  onClickDateCancel (event) {
    event.preventDefault();
    this.setState(prevState => ({
      showCalender: !prevState.showCalender,
    }));
  }

  onClickDateOk (event, date) {
    event.preventDefault();
    this.setState(prevState => ({
      showCalender: !prevState.showCalender,
    }));
    this.props.onChange({ target: { name: this.props.name, value: date } });
  }

  renderErrorLabel() {
    const {
      error,
    } = this.props;
    let errorLabel = (this.state.errors.length) ? this.state.errors[0] : null;
    // If manual error is set, override validation error
    errorLabel = (error) ? error : errorLabel;
    return (
      <label className="input__error anim--fade-up-in">
        { errorLabel }
      </label>
    );
  }

  render() {
    const {
      type,
      placeholder,
      value,
      options,
      rows,
      cols,
      name,
      label,
      accept,
      onChange,
      onCancel,
      disabled,
    } = this.props;

    const {
      showCalender,
    } = this.state;

    if (disabled === true) {
      return (
        <div className="input--disabled">
          <label className="input__label">{ label }</label>
          <p>{ value }</p>
        </div>
      )
    }

    else if (type === 'button-thin-submit') {
      return (
        <button
          className="btn-thin bg-clr-purple"
          type="submit"
        >
          { value }
        </button>
      );
    }

    else if (type === 'button-thin-cancel') {
      return (
        <button
          className="btn-thin clr-grey"
          type="button"
          onClick={ onCancel }
        >
          { value }
        </button>
      );
    }

    else if (type === 'select') {
      let opt = options.map((option, index) => {
        return (
          <option value={ option.value } key={ index }>
            {  option.label }
          </option>
        );
      });
      return (
        <div className="input">
          <label className="input__label">{ label }</label>
          <select
            className={"input__input " + this.props.className}
            id={ this.props.id }
            ref={ this.props.ref }
            defaultValue={ this.props.defaultValue }
            name={ name }
            value={ value }
            onChange={ onChange }
          >
            { opt }
          </select>
        </div>
      );
    }

    else if (type === 'textarea') {
      let errorLabel = this.renderErrorLabel();
      return (
        <div className="input">
          <label className="input__label">{ label }</label>
          <textarea
            className="input__input"
            name={ name }
            placeholder={ placeholder }
            rows={ rows }
            cols={ cols }
            onChange={ onChange }
            value={ value }
          >
          </textarea>
          { errorLabel }
        </div>
      );
    }

    else if (type === 'date') {
      return (
        <div className="input">
        <label className="input__label">{ label }</label>
        <div className="date">
          <div className="btn-calendar btn-calendar--light"
            onClick={ this.onClickDate }
          >
            <i className="material-icons btn-calendar__icon">date_range</i>
            <label>{ placeholder }: </label>
            <label className="btn-calendar__date">{ value }</label>
          </div>
          </div>
          <CalenderModal
            show={ showCalender }
            onClickCancel={ this.onClickDateCancel }
            onClickOk={ this.onClickDateOk }
            value={ value }
          />
        </div>
      );
    }

    else if (type === 'file') {
      let errorLabel = this.renderErrorLabel();
      return (
        <div className="input">
          <label className="input__label">{ label }</label>
          <input
            className="input__input"
            type={ type }
            name={ name }
            placeholder={ placeholder }
            value={ value }
            accept={ accept }
            onChange={ onChange }
            multiple
          />
          { errorLabel }
        </div>
      );
    }

    else {
      let errorLabel = this.renderErrorLabel();
      return (
        <div className="input">
          <label className="input__label">{ label }</label>
          <input
            className="input__input"
            type={ type }
            name={ name }
            placeholder={ placeholder }
            value={ value }
            onChange={ onChange }
          />
          { errorLabel }
        </div>
      );
    }

  }
}
