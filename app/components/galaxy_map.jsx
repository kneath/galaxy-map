var React = require("react")
window.$ = window.jQuery = require('../lib/jquery-2.1.1.js');

var GalaxyMap = React.createClass({

  render: function() {
    return (
      <div>
        Galaxy Map!
      </div>
    )
  }

})

React.render(
  (<GalaxyMap />),
  document.getElementById('layout-container')
)
