(function(){
	var margin = {top: 0, right: 10, bottom: 10, left: 10};

	var width = 1500 - margin.left - margin.right,
	height = 760 - margin.top - margin.bottom;

	var projection = d3.geoRobinson().scale(160);

	var path = d3.geoPath()
	.projection(projection);

	queue()
	.defer(d3.json, "data/world_countries.json")
	.defer(d3.csv, "data/geocoded.csv?8")
	.await(ready);

	function ready(err, geodata, data) {

		if (err) console.warn(err, "error loading data");

		var svg = d3.select("#map").append("svg")
		.append("g")
		.attr('id', 'container');

    svg.append('g')
      .attr('class', 'countries')
      .selectAll('path')
      .data(geodata.features)
      .enter().append('path')
        .attr('d', path)
				.style('fill', '#888')
        .style('stroke', 'white')
        .style('opacity', 1)
        .style('stroke-width', 0.3);

		// Bubble size
	  var valueExtent = d3.extent(data, function(d) { return +d.n; })
	  var size = d3.scaleSqrt()
	    .domain(valueExtent)
	    .range([ 3, 60]) // Size in pixel

		svg
	    .selectAll("circles")
	    .data(data.sort(function(a,b) { return +b.n - +a.n }))
	    .enter()
	    .append("circle")
				.attr("class", "circle")
	      .attr("cx", function(d){ return projection([+d.lng, +d.lat])[0] })
	      .attr("cy", function(d){ return projection([+d.lng, +d.lat])[1] })
	      .attr("r", function(d){ return size(+d.n) })
	      .style("fill", function(d){ return '#C32E1E' })
	      .attr("fill-opacity", .5)
				.on("click", function(d) {
					d3.event.preventDefault();
					displayDetail(d);
				})
				.on("mouseover", function(d) {
					displayDetail(d);
				});

			// Legend: from Bubblemap Template by Yan Holtz
			// https://www.d3-graph-gallery.com/graph/bubble_legend.html
			// https://www.d3-graph-gallery.com/graph/bubblemap_template.html
			var valuesToShow = [1, 200, 1000, 3500]
			var xCircle = 80
			var xLabel = xCircle + 100;
			var yCircle = height / 2;

			svg
			  .selectAll("legend")
			  .data(valuesToShow)
			  .enter()
			  .append("circle")
			    .attr("cx", xCircle)
			    .attr("cy", function(d){ return yCircle - size(d) } )
			    .attr("r", function(d){ return size(d) })
			    .style("fill", "none")
			    .attr("stroke", "black")

			// Add legend: segments
			svg
			  .selectAll("legend")
			  .data(valuesToShow)
			  .enter()
			  .append("line")
			    .attr('x1', function(d){ return xCircle + size(d) } )
			    .attr('x2', xLabel)
			    .attr('y1', function(d){ return yCircle - size(d) } )
			    .attr('y2', function(d){ return yCircle - size(d) } )
			    .attr('stroke', 'black')
			    .style('stroke-dasharray', ('2,2'))

			// Add legend: labels
			svg
			  .selectAll("legend")
			  .data(valuesToShow)
			  .enter()
			  .append("text")
			    .attr('x', xLabel)
			    .attr('y', function(d){ return yCircle - size(d) } )
			    .text( function(d){ return d == 3500 ? d + ' cas' : d } )
			    .style("font-size", 12)
			    .attr('alignment-baseline', 'middle')

			// right details panel (mobile devices: bottom)
			function displayDetail(d) {
				d3.select(".map-details")
				.html(function() {
					var location = d['country'];
					if(d['Province/State']){
						location += ', ' + d['Province/State']
					}
					return `<h4>${location}</h4>
						<p><span class="stats">Cas confirmés</span> ${d.Confirmed}</p>
						<p><span class="stats">Décès</span> ${d.Deaths}</p>
						<p><span class="stats">Rétablissements</span> ${d.Recovered}</p>
					`;})
					.style('opacity', 1);
				}

				function sizeChange() {
					// TODO adapter pour version embed
					d3.select("g#container").attr("transform", "scale(" + $("#map").width() / 1000 + ")");
					$("#map svg").height($("#map").width()*0.5);
				}
				d3.select(window)
				.on("resize", sizeChange);

				sizeChange();
	}
})();
