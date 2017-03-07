// original code: https://bl.ocks.org/mbostock/3883245

import * as d3Axis from "d3-axis";
import * as d3Array from "d3-array";
import * as d3Dispatch from "d3-dispatch";
import * as d3Dsv from "d3-dsv";
import * as d3Annotation from "d3-svg-annotation";
import * as d3Request from "d3-request";
import * as d3Scale from "d3-scale";
import * as d3Selection from "d3-selection";
import * as d3Shape from "d3-shape";
import * as d3TimeFormat from "d3-time-format";

var svg = d3Selection.select("svg"),
    margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var parseTime = d3TimeFormat.timeParse("%d-%b-%y");

var x = d3Scale.scaleTime()
    .rangeRound([0, width]);

var y = d3Scale.scaleLinear()
    .rangeRound([height, 0]);

var line = d3Shape.line()
    .x(d => x(d.date))
    .y(d => y(d.close));


d3Request.tsv(
    "data.tsv",
    d => {
        d.date = parseTime(d.date);
        d.close = +d.close;
        return d;
    },
    (error, data) => {
        if (error) throw error;


        x.domain(d3Array.extent(data, d => d.date));
        y.domain(d3Array.extent(data, d => d.close));

        g.append("g")
            .attr("transform", "translate(0, " + height + ")")
            .call(d3Axis.axisBottom(x))
            .select(".domain")
            .remove();

        g.append("g")
            .call(d3Axis.axisLeft(y))
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

        var makeAnnotations = d3Annotation.annotation()
            .type(d3Annotation.annotationCalloutCircle)
            .accessors({
                x: d => x(parseTime(d.date)),
                y: d => y(d.close)
            })
            .accessorsInverse({
                date: d => timeFormat(x.invert(d.x)),
                close: d => y.invert(d.y)
            })
            .annotations([
                {
                    note: {label: "This is awesome!", title: "Awesome"},
                    data: data[100],
                    dy: 137,
                    dx: 162,
                    subject: {
                        radius: 50,
                        radiusPadding: 5
                    }
                }
            ])

        d3Selection.select("svg")
            .append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations)
    }
);