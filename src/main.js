// original code: https://bl.ocks.org/mbostock/3883245

import * as d3_selection from "d3-selection";
import * as d3_time_format from "d3-time-format";
import * as d3_scale from "d3-scale";

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
