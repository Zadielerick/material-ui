let React = require('react');
let RadioButton = require('./radio-button');

let RadioButtonGroup = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    valueSelected: React.PropTypes.string,
    defaultSelected: React.PropTypes.string,
    labelPosition: React.PropTypes.oneOf(['left', 'right']),
    onChange: React.PropTypes.func
  },

  _hasCheckAttribute: function(radioButton) {
    return radioButton.props.hasOwnProperty('checked') &&
      radioButton.props.checked;
  },

  getInitialState: function() {
    return {
      numberCheckedRadioButtons: 0,
      selected: this.props.valueSelected || this.props.defaultSelected || ''
    };
  },

  componentWillMount: function() {
    let cnt = 0;

    React.Children.forEach(this.props.children, function(option) {
      if (this._hasCheckAttribute(option)) cnt++;
    }, this);

    this.setState({numberCheckedRadioButtons: cnt});
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.hasOwnProperty('valueSelected')) {
      this.setState({selected: nextProps.valueSelected});
    }
  },

  render: function() {

    let options = React.Children.map(this.props.children, function(option) {

      let {
        name,
        value,
        label,
        onCheck,
        ...other
      } = option.props;

      return <RadioButton
        {...other}
        ref={option.props.value}
        name={this.props.name}
        key={option.props.value}
        value={option.props.value}
        label={option.props.label}
        labelPosition={this.props.labelPosition}
        onCheck={this._onChange}
        checked={option.props.value == this.state.selected}/>

    }, this);

    return (
      <div
        style={this.props.style}
        className={this.props.className || ''}>
        {options}
      </div>
    );
  },

  _updateRadioButtons: function(newSelection) {
    if (this.state.numberCheckedRadioButtons === 0) {
      this.setState({selected: newSelection});
    } else if (process.env.NODE_ENV !== 'production') {
      let message = "Cannot select a different radio button while another radio button " +
                    "has the 'checked' property set to true.";
      console.error(message);
    }
  },

  _onChange: function(e, newSelection) {
    this._updateRadioButtons(newSelection);

    // Successful update
    if (this.state.numberCheckedRadioButtons === 0) {
      if (this.props.onChange) this.props.onChange(e, newSelection);
    }
  },

  getSelectedValue: function() {
    return this.state.selected;
  },

  setSelectedValue: function(newSelectionValue) {
    this._updateRadioButtons(newSelectionValue);
  },

  clearValue: function() {
    this.setSelectedValue('');
  }

});

module.exports = RadioButtonGroup;