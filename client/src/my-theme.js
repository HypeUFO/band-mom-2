import getMuiTheme from 'material-ui/styles/getMuiTheme';

const myTheme = getMuiTheme({
  palette: {
    primary1Color: '#2E2D88',
    primary2Color: '#fff',
    accent1Color: '#ff6a00',
    accent2Color: '#2E2D88',
    textColor: '#2E2D88',
    alternateTextColor: '#fff',

  },
  textField: {
    disabledTextColor: '#2E2D88',
  },
  datePicker: {
    color: '#ccc',
    textColor: '#FFF',
    calendarTextColor: '#2E2D88',
    selectColor: '#2E2D88',
    selectTextColor: '#eee',
    calendarYearBackgroundColor: '#FFF',
    disabledTextColor: '#2E2D88',
  },
  toolbar: {
      backgroundColor: '#2E2D88',
    },
    raisedButton: {
      backgroundColor: '#2E2D88',
      color: '#fff'
    }
});

export default myTheme;
