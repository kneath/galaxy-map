window.$ = window.jQuery = require('../lib/jquery-2.1.1.js');

var React = require("react")
var ReactART = require("react-art")

var Circle = require("react-art/shapes/circle")
var Surface = ReactART.Surface

var GalaxyMap = React.createClass({displayName: 'GalaxyMap',

  render: function() {
    return (
      React.createElement(Surface, {width: 500, height: 500 }, 
        React.createElement(Circle, {radius: 20, fill: "#dddddd"})
      )
    )
  }

})

React.render(
  (React.createElement(GalaxyMap, null)),
  document.getElementById('layout-container')
)
