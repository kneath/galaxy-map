var React = require("react")
window.$ = window.jQuery = require('../lib/jquery-2.1.1.js');

var GalaxyMap = React.createClass({displayName: 'GalaxyMap',

  render: function() {
    return (
      React.createElement("div", null, 
        "Galaxy Map!"
      )
    )
  }

})

React.render(
  (React.createElement(GalaxyMap, null)),
  document.getElementById('layout-container')
)
