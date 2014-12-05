window.$ = window.jQuery = require('../lib/jquery-2.1.1.js');

var React = require("react")
var ReactART = require("react-art")

var Circle = require("react-art/shapes/circle")
var Group = ReactART.Group
var Path = ReactART.Path
var Props = React.PropTypes
var Shape = ReactART.Shape
var Surface = ReactART.Surface
var Transform = ReactART.Transform

var Ellipse = React.createClass({displayName: 'Ellipse',

  propTypes: {
    width: Props.number.isRequired,
    height: Props.number.isRequired
  },

  render: function() {
    var rx = this.props.width/2
    var ry = this.props.height/2

    var path = Path().moveTo(0, ry)
      .arc(this.props.width, 0, rx, ry)
      .arc(-this.props.width, 0, rx, ry)
      .close()

    return React.createElement(Shape, React.__spread({},  this.props, {d: path}))
  }

})

var OrbitLine = React.createClass({displayName: 'OrbitLine',

  propTypes: {
    diameter: React.PropTypes.number.isRequired, // longest diameter
    angularOffset: React.PropTypes.number.isRequired // in degrees
  },

  render: function() {
    var e = Galaxy.edgeEccentricity // eccentricity

    var width = this.props.diameter
    var height = ((1 - e)/(1 + e)) * width
    var x =  250 - width/2
    var y = 250 - height/2

    var rotation = new Transform().rotate(this.props.angularOffset, width/2, height/2)

    return React.createElement(Ellipse, {x: x, y: y, 
                    width: width, height: height, 
                    stroke: "rgba(255,255,255,0.1)", strokeWidth: 1, 
                    transform: rotation })
  }
})


var Orbit = React.createClass({displayName: 'Orbit',

  propTypes: {
    diameter: React.PropTypes.number.isRequired, // longest diameter
    angularOffset: React.PropTypes.number.isRequired, // in degrees
    stars: React.PropTypes.number.isRequired
  },

  render: function() {
    var e = Galaxy.edgeEccentricity // eccentricity

    var width = this.props.diameter
    var a = width/2
    var height = ((1 - e)/(1 + e)) * width
    var b = height/2
    var cx =  250
    var cy = 250

    var rotation = new Transform().rotate(this.props.angularOffset, cx, cy)
    var stars = []
    for(i=0; i<this.props.stars; i++){
      var radStep = (2*Math.PI) * i/this.props.stars
      var x = a * Math.cos(radStep) + cx
      var y = b * Math.sin(radStep) + cy
      var brightness = Math.random() * (0.8 - 0.1) + 0.1
      var fillColor = "rgba(255,255,255," + brightness + ")"
      stars.push(React.createElement(Circle, {x: x, y: y, radius: 1, fill: fillColor}))
    }

    return (
      React.createElement(Group, {transform: rotation }, 
        stars
      )
    )
  }
})

var Galaxy = {
  starCount: 5000,

  outerRadius: 100,
  coreRadius: 10,

  angularOffset: 0.0004,
  coreEccentricity: 0.9,
  edgeEccentricity: 0.3,

  coreVelocity: 200,
  edgeVelocity: 300,

  maxBounds: 450 // max bounds of canvas in pixels

}

var GalaxyMap = React.createClass({displayName: 'GalaxyMap',

  render: function() {
    var numOrbits = 50
    var minDiameter = Galaxy.coreRadius/100 * Galaxy.maxBounds
    var maxDiameter = Galaxy.outerRadius/100 * Galaxy.maxBounds
    var rotation = 360

    var orbits = []
    for(var i=0; i<numOrbits; i++) {
      var diameter = minDiameter + (maxDiameter - minDiameter) * (i/numOrbits)
      orbits.push(React.createElement(Orbit, {key: i, stars:  Math.random() * (300 - 50) + 50, diameter: diameter, angularOffset:  rotation * (i/numOrbits) }))
    }

    return (
      React.createElement(Surface, {width: 500, height: 500, className: "galaxy-container"}, 
        React.createElement(Circle, {x: 250, y: 250, radius: 4, fill: "#ffffff"}), 
        orbits 
      )
    )
  }

})

React.render(
  (React.createElement(GalaxyMap, null)),
  document.getElementById('layout-container')
)
