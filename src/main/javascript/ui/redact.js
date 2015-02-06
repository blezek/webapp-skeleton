/** @jsx React.DOM */
var React = require('react');  // Browserify!
var Dispatcher = require('./AppDispatcher');


var BooleanControl = React.createClass({
  render: function() {
    return <input type="checkbox" onChange={this.handleChange} checked={this.props.object[this.props.field]}> {this.props.field}</input>;
  },
  handleChange: function(event) {
    console.log("handleChange", event.target.checked);
    this.props.object[this.props.field] = event.target.checked;
    this.setState({value: event.target.checked});
  }
});

var RangeControl = React.createClass({
  render: function() {
    return <div>
      <input type="range" onChange={this.handleChange} defaultValue={this.props.object[this.props.field]} min={this.props.min} max={this.props.max} step={this.props.step} >{this.props.field}</input>
      </div>;
  },
  handleChange: function(event) {
    this.props.object[this.props.field] = event.target.value;
    this.setState({value: event.target.value});
  }
});

var DoSomething = React.createClass({
  render: function() {
    return <div>
      <button class="btn" onClick={this.handleChange}>Button</button>
      </div>;
  },
  handleChange: function(event) {
    this.props.callback();
  }
})

var HelloMessage = React.createClass({  // Create a component, HelloMessage.
  render: function() {
    return <div>Hello {this.props.name}</div>;  // Display a property.
  }
});

var mesh = {
  visibility: true,
  opacity: 1.0
}
var show = function() {
  console.log(mesh);
}
//
// React.render(  // Render HelloMessage component at #name.
//   <div>
//     <HelloMessage name="John" />
//     <BooleanControl object={mesh} field="visibility"/>
//     <RangeControl object={mesh} field="opacity" min={0.0} max={1.0} step={0.05} />
//     <DoSomething callback={show}/>
//   </div>,
//   document.getElementById('name'));
