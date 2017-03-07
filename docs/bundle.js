// original code: https://bl.ocks.org/mbostock/3883245

var svg = d3.select("svg");
var margin = { top: 20, right: 20, bottom: 30, left: 50 };
var width = +svg.attr("width") - margin.left - margin.right;
var height = +svg.attr("height") - margin.top - margin.bottom;
var g = svg.append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var parseTime = d3.timeParse("%d-%b-%y");

var _x = d3.scaleTime().rangeRound([0, width]);

var _y = d3.scaleLinear().rangeRound([height, 0]);

var line = d3.line().x(function (d) {
    return _x(d.date);
}).y(function (d) {
    return _y(d.close);
});

d3.tsv("data.tsv", function (d) {
    d.date = parseTime(d.date);
    d.close = +d.close;
    return d;
}, function (error, data) {
    if (error) throw error;

    _x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    _y.domain(d3.extent(data, function (d) {
        return d.close;
    }));

    g.append("g").attr("transform", "translate(0, " + height + ")").call(d3.axisBottom(_x)).select(".domain").remove();

    g.append("g").call(d3.axisLeft(_y)).append("text").attr("fill", "#000").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", "0.71em").attr("text-anchor", "end").text("Price ($)");

    g.append("path").datum(data).attr("fill", "none").attr("stroke", "steelblue").attr("stroke-linejoin", "round").attr("stroke-linecap", "round").attr("stroke-width", 1.5).attr("d", line);

    var makeAnnotations = d3.annotation().type(d3.annotationCalloutCircle).accessors({
        x: function x(d) {
            return _x(parseTime(d.date));
        },
        y: function y(d) {
            return _y(d.close);
        }
    }).accessorsInverse({
        date: function date(d) {
            return timeFormat(_x.invert(d.x));
        },
        close: function close(d) {
            return _y.invert(d.y);
        }
    }).annotations([{
        note: { label: "This is awesome!", title: "Awesome" },
        data: data[100],
        dy: 137,
        dx: 162,
        subject: {
            radius: 50,
            radiusPadding: 5
        }
    }]);

    d3.select("svg").append("g").attr("class", "annotation-group").call(makeAnnotations);
});
