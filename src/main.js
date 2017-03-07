// original code: https://bl.ocks.org/mbostock/3883245

import * as d3_axis from "d3-axis";
import * as d3_array from "d3-array";
import * as d3_dsv from "d3-dsv";
import * as d3_request from "d3-request";
import * as d3_scale from "d3-scale";
import * as d3_selection from "d3-selection";
import * as d3_shape from "d3-shape";
import * as d3_time_format from "d3-time-format";

var svg = d3_selection.select("svg"),
margin = {top: 20, right: 20, bottom: 30, left: 50},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom,
g = svg.append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var parseTime = d3_time_format.timeParse("%d-%b-%y");

var x = d3_scale.scaleTime()
.rangeRound([0, width]);

var y = d3_scale.scaleLinear()
.rangeRound([height, 0]);

var line = d3_shape.line()
.x(d => x(d.date))
.y(d => y(d.close));


d3_request.tsv(
"data.tsv",
d => {
    d.date = parseTime(d.date);
    d.close = +d.close;
    return d;
},
(error, data) => {
    if (error) throw error;
    
    y.domain(d3_array.extent(data, d => d.date));
    x.domain(d3_array.extent(data, d => d.close));
    
    g.append("g")
    .attr("transform", "translate(0, " + height + ")")
    .call(d3_axis.axisBottom(x))
    .select(".domain")
    .remove();
    
    g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Price ($)");
    
    g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);
}
);