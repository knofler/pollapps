'use strict';

angular.module('poll')
  .directive('d3StackedToGroupedBars', function () {
    return {
      templateUrl: 'app/directive/d3_directives/d3-Stacked-to-Grouped-Bars/d3-Stacked-to-Grouped-Bars.html',
      restrict: 'EA',
      scope:{
      	data:'='
      },
      link: function (scope, element, attrs) {

		var n         = scope.data.layers.length ; // number of layers
		var m         = scope.data.layers[0].length; // number of samples per layer
		var stack     = d3.layout.stack();
		console.log("stack is :: ", stack);
		// var layers    = stack(d3.range(n).map(function() { return bumpLayer(m, .1); }));
		var layers    = stack(scope.data.layers);
		console.log("layers is :: ", layers);
		var yGroupMax = d3.max(layers, function(layer) {
						 console.log("layer in yGroupMax is :", layer);
						 return d3.max(layer, function(d) {
						 		console.log("d in yGroupMax is :", d);
					 			return d.y; 
					 		}); 
						 });
		var yStackMax = d3.max(layers, function(layer) {
						 console.log("layer in yStackMax is :", layer);
					 	 return d3.max(layer, function(d) {
					 	   		console.log("d in yStackMax is :", d);
					 	   		return d.y0 + d.y; 
					 	   	});
					 	 });
		var margin    = {top: 40, right: 10, bottom: 20, left: 10};
		var width 	  = 1100 - margin.left - margin.right;
		var height 	  = 400 - margin.top - margin.bottom;
		var x         = d3.scale.ordinal()
		    			.domain(d3.range(m))
		    			.rangeRoundBands([0, width], .08);
		var y         = d3.scale.linear()
		    			.domain([0, yStackMax])
		    			.range([height, 0]);
		var color     = d3.scale.linear()
		    			.domain([0, n - 1])
		    			.range(["#718d79", "#07551d"]);
		var xAxis     = d3.svg.axis()
		    			.scale(x)
		    			.tickSize(0)
		    			.tickPadding(6)
		    			.orient("bottom");
		var svg       = d3.select(scope.data.div).append("svg")
		    			.attr("width", width + margin.left + margin.right)
		    			.attr("height", height + margin.top + margin.bottom)
		    			.append("g")
		    			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		var layer     = svg.selectAll(".layer")
		    			.data(layers)
		    			.enter()
		    			.append("g")
		    			.attr("class", "layer")
		    			.style("fill", function(d, i) { return color(i); });
		var rect      = layer.selectAll("rect")
		    			.data(function(d) { return d; })
		  				.enter()
		  				.append("rect")
		  				.attr("class","rectcl")
		    			.attr("x", function(d) { return x(d.x); })
		    			.attr("y", height)
		    			.attr("width", x.rangeBand())
		    			.attr("height", 0);

		rect.transition()
		    .delay(function(d, i) { return i * 10; })
		    .attr("y", function(d) { return y(d.y0 + d.y); })
		    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });
		svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis);
		d3.selectAll("input").on("change", change);

		var timeout = setTimeout(function() {
		  d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
		 }, 2000);

		function change() {
		  clearTimeout(timeout);
		  if (this.value === "grouped") transitionGrouped();
		  else transitionStacked();
		 }
		function transitionGrouped() {
		  console.log("I am grouped and being called")
		  y.domain([0, yGroupMax]);

		  rect.transition()
		      .duration(500)
		      .delay(function(d, i) { return i * 10; })
		      .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
		      .attr("width", x.rangeBand() / n)
		      .transition()
		      .attr("y", function(d) { return y(d.y); })
		      .attr("height", function(d) { return height - y(d.y); });
		 }
		function transitionStacked() {
			console.log("I am stacked and being called")
		  y.domain([0, yStackMax]);

		  rect.transition()
		      .duration(500)
		      .delay(function(d, i) { return i * 10; })
		      .attr("y", function(d) { return y(d.y0 + d.y); })
		      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
		      .transition()
		      .attr("x", function(d) { return x(d.x); })
		      .attr("width", x.rangeBand());
		 }
		// Inspired by Lee Byron's test data generator.
		function bumpLayer(n, o) {

		  function bump(a) {
		    var x = 1 / (.1 + Math.random()),
		        y = 2 * Math.random() - .5,
		        z = 10 / (.1 + Math.random());
		    for (var i = 0; i < n; i++) {
		      var w = (i / n - y) * z;
		      a[i] += x * Math.exp(-w * w);
		    }
		  }

		  var a = [], i;
		  for (i = 0; i < n; ++i) a[i] = o + o * Math.random();
		  for (i = 0; i < 5; ++i) bump(a);
		  return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
		 }

      }
    };
  });