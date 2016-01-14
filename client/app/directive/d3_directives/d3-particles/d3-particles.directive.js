'use strict';

angular.module('poll')
  .directive('d3Particles', function () {
    return {
      templateUrl: 'app/directive/d3_directives/d3-particles/d3-particles.html',
      restrict: 'EA',
      scope:{
      	data:'='
      },
      link: function (scope, element, attrs) {
      	//alternative dimenssion could be innerwidth,innerheight
      	var width  = Math.max(580, 1110),
    		height = Math.max(100, 300);

		var i = 0;

		var svg = d3.select(scope.data.div).append("svg")
		    .attr("width", width)
		    .attr("height", height);

		svg.append("rect")
		    .attr("width", width)
		    .attr("height", height)
		    .attr("class",'particle')
		    .on("ontouchstart" in document ? "touchmove" : "mousemove", particle);

		function particle() {
		  var m = d3.mouse(this);

		  svg.insert("circle", "rect")
		      .attr("cx", m[0])
		      .attr("cy", m[1])
		      .attr("r", 1e-6)
		      .style("stroke", d3.hsl((i = (i + 1) % 360), 1, .5))
		      .style("stroke-opacity", 1)
		    .transition()
		      .duration(2000)
		      .ease(Math.sqrt)
		      .attr("r", 100)
		      .style("stroke-opacity", 1e-6)
		      .remove();

		  d3.event.preventDefault();
		}
      }
    };
  });