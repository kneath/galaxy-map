window.$ = window.jQuery = require('../lib/jquery-2.1.1.js');

var React = require("react")
var ReactART = require("react-art")

var Circle = require("react-art/shapes/circle")
var Surface = ReactART.Surface

var GalaxyMap = React.createClass({

  render: function() {
    return (
      <Surface width={ 500 } height={ 500 }>
        <Circle radius={ 20 } fill="#dddddd" />
      </Surface>
    )
  }

})

React.render(
  (<GalaxyMap />),
  document.getElementById('layout-container')
)
