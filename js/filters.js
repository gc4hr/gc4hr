var BAR_HEIGHT = 25,
    BAR_MARGIN = 1;

var max;

var FONT_STYLE = {
    "font-family": "Roboto, sans-serif",
    "text-transform": "uppercase",
    "letter-spacing": "1px"
}

var COLOR = "#F08282",
    HOVER_COLOR = "#AE5D5D";

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

function genderChart(data) {
    var svg = {};
    svg.width = 480;
    svg.height = 150;

    svg.svg = d3.select("#gender")
        .append("svg")
        .attr("width", svg.width)
        .attr("height", svg.height);

    var offset = 110;
    var g = svg.svg.selectAll(".gender")
        .data(data)
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(" + (i*(svg.width-2*offset)/(data.length-1) + offset) + ", " + svg.height/2 + ")"; });

    var circles = g.append("circle")
        .attr("r", function(d) { return Math.sqrt(d.value*180); })
        .attr("fill", COLOR)
        .attr("cursor", "pointer")
        .on("mouseover", function() {
            d3.select(this).attr("fill", HOVER_COLOR);
        })
        .on("mouseout", function() {
            var bar = d3.select(this);
            if (!bar.classed("clicked")) {
                bar.attr("fill", COLOR);
            }
        })
        .on("click", function() {
            var bar = d3.select(this);
            bar.classed("clicked", !bar.classed("clicked"));
            if (bar.classed("clicked")) {
                bar.attr("fill", HOVER_COLOR);
            } else {
                bar.attr("fill", COLOR);
            }
        });

    var text = g.append("text")
        .attr("fill", "white")
        .attr("font-size", 12)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("pointer-events", "none")
        .style(FONT_STYLE)
        .text(function(d) { return d.gender + " (" + d.value + ")"; });
}

function ageChart(data) {
    var svg = {};
    svg.width = 480;
    svg.height = 200;

    svg.svg = d3.select("#age")
        .append("svg")
        .attr("width", svg.width)
        .attr("height", svg.height);

    var x = d3.scale.ordinal()
        .domain(data.map(function(d) { return d.age; }))
        .rangeRoundBands([0, svg.width], 0.3);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.value; })])
        .range([svg.height-18, 18]);

    var g = svg.svg.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x(d.age) + ", " + y(d.value) + ")"; })

    var bars = g.append("rect")
        .attr("fill", COLOR)
        .attr("width", function(d) { return x.rangeBand(); })
        .attr("height", function(d) { return svg.height - 18 - y(d.value); })
        .attr("cursor", "pointer")
        .on("mouseover", function() {
            d3.select(this).attr("fill", HOVER_COLOR);
        })
        .on("mouseout", function() {
            var bar = d3.select(this);
            if (!bar.classed("clicked")) {
                bar.attr("fill", COLOR);
            }
        })
        .on("click", function() {
            var bar = d3.select(this);
            bar.classed("clicked", !bar.classed("clicked"));
            if (bar.classed("clicked")) {
                bar.attr("fill", HOVER_COLOR);
            } else {
                bar.attr("fill", COLOR);
            }
        });

    g.append("text")
        .attr("fill", "white")
        .attr("font-size", 12)
        .attr("text-anchor", "middle")
        .attr("pointer-events", "none")
        .attr("dy", "1.2em")
        .attr("x", x.rangeBand()/2)
        .style(FONT_STYLE)
        .text(function(d) { return d.value; });

    g.append("text")
        .attr("font-size", 12)
        .attr("text-anchor", "middle")
        .attr("x", x.rangeBand()/2)
        .attr("y", function(d) { return svg.height - y(d.value) - 2; })
        .style(FONT_STYLE)
        .text(function(d) { return d.age; });
}

function violationsChart(data) {
    var scale = d3.scale.log()
        .domain(d3.extent(data, function(d) { return d.value; }))
        .range([0.6, 1]);

    var boxes = d3.select("#violations")
        .selectAll(".box")
        .data(data)
      .enter().append("div")
        .style("display", "inline-block")
        .append("a")
        .attr("class", "box")
        .style("background-color", COLOR)
        .style("opacity", function(d) { return scale(d.value); })
        .on("mouseover", function() {
            d3.select(this).style("background", HOVER_COLOR);
        })
        .on("mouseout", function() {
            var bar = d3.select(this);
            if (!bar.classed("clicked")) {
                bar.style("background", COLOR);
            }
        })
        .on("click", function() {
            var bar = d3.select(this);
            bar.classed("clicked", !bar.classed("clicked"));
            if (bar.classed("clicked")) {
                bar.style("background", HOVER_COLOR);
            } else {
                bar.style("background", COLOR);
            }
        })
        .text(function(d) { return d.violation + " (" + d.value + ")"; });
}

function professionsChart(data) {
    var svg = {};
    svg.width = 480;
    svg.height = data.length * (BAR_HEIGHT+BAR_MARGIN);

    svg.svg = d3.select("#profession")
        .append("svg")
        .attr("width", svg.width)
        .attr("height", svg.height);

    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.value; })]);

    var g = svg.svg.selectAll(".profession")
        .data(data)
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0, " + (BAR_HEIGHT+BAR_MARGIN)*i + ")"; });

    var text = g.append("text")
        .style("font-size", 10)
        .attr("dy", "1.6em")
        .attr("text-anchor", "end")
        .style(FONT_STYLE)
        .text(function(d) { return d.profession; });

    max = d3.max(text[0], function(d) { return d.getComputedTextLength(); }) + 5;

    text.attr("x", max - 5);
    x.range([0, svg.width - max]);

    var bars = g.append("g")
        .attr("class", "bar")
        .attr("cursor", "pointer")
        .attr("transform", "translate(" + max + ", 0)");

    bars.append("rect")
        .attr("fill", COLOR)
        .attr("width", function(d) { return x(d.value); })
        .attr("height", BAR_HEIGHT)
        .on("mouseover", function() {
            d3.select(this).attr("fill", HOVER_COLOR);
        })
        .on("mouseout", function() {
            var bar = d3.select(this);
            if (!bar.classed("clicked")) {
                bar.attr("fill", COLOR);
            }
        })
        .on("click", function() {
            var bar = d3.select(this);
            bar.classed("clicked", !bar.classed("clicked"));
            if (bar.classed("clicked")) {
                bar.attr("fill", HOVER_COLOR);
            } else {
                bar.attr("fill", COLOR);
            }
        });

    bars.append("text")
        .attr("fill", "white")
        .attr("text-anchor", "end")
        .style("font-size", 10)
        .attr("x", function(d) { return x(d.value) - 3; })
        .attr("dy", "1.6em")
        .attr("font-weight", "bold")
        .attr("pointer-events", "none")
        .style(FONT_STYLE)
        .text(function(d) { return d.value; });
}

function countriesChart(data) {
    var svg = {};
    svg.width = 480;
    svg.height = data.length * (BAR_HEIGHT+BAR_MARGIN);

    svg.svg = d3.select("#countries")
        .append("svg")
        .attr("width", svg.width)
        .attr("height", svg.height);

    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.value; })]);

    var g = svg.svg.selectAll(".country")
        .data(data)
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0, " + (BAR_HEIGHT+BAR_MARGIN)*i + ")"; });

    var text = g.append("text")
        .style("font-size", 10)
        .attr("dy", "1.6em")
        .attr("text-anchor", "end")
        .style(FONT_STYLE)
        .text(function(d) { return d.country; });

    //var max = d3.max(text[0], function(d) { return d.getComputedTextLength(); }) + 5;

    text.attr("x", max - 5);
    x.range([0, svg.width - max]);

    var bars = g.append("g")
        .attr("class", "bar")
        .attr("cursor", "pointer")
        .attr("transform", "translate(" + max + ", 0)");

    bars.append("rect")
        .attr("fill", COLOR)
        .attr("width", function(d) { return x(d.value); })
        .attr("height", BAR_HEIGHT)
        .on("mouseover", function() {
            d3.select(this).attr("fill", HOVER_COLOR);
        })
        .on("mouseout", function() {
            var bar = d3.select(this);
            if (!bar.classed("clicked")) {
                bar.attr("fill", COLOR);
            }
        })
        .on("click", function() {
            var bar = d3.select(this);
            bar.classed("clicked", !bar.classed("clicked"));
            if (bar.classed("clicked")) {
                bar.attr("fill", HOVER_COLOR);
            } else {
                bar.attr("fill", COLOR);
            }
        });

    bars.append("text")
        .attr("fill", "white")
        .attr("text-anchor", "end")
        .style("font-size", 10)
        .attr("x", function(d) { return x(d.value) - 3; })
        .attr("font-weight", "bold")
        .attr("pointer-events", "none")
        .attr("dy", "1.6em")
        .style(FONT_STYLE)
        .text(function(d) { return d.value; });
}

var path = "data/data.csv";
d3.csv(path, function(error, data) {
    if (error) { console.log(error); }

    var countries = [],
        professions = [],
        violations = [],
        age = [],
        gender = [];

    var countryCounts = {},
        professionsCounts = {},
        violationsCounts = {},
        ageCounts = {
            "< 20 yo": 0,
            "20-25 yo": 0,
            "26-35 yo": 0,
            "36-45 yo": 0,
            "> 45 yo": 0,
        },
        genderCounts = {};

    data.forEach(function(d) {
        if (!countryCounts[d.Country]) {
            countryCounts[d.Country] = 0;
        }
        countryCounts[d.Country]++;

        if (!professionsCounts[d.Profession]) {
            professionsCounts[d.Profession] = 0;
        }
        professionsCounts[d.Profession]++;

        var violations = d["Text of Experiences"].split(", ").map(function(d) { return d.capitalize(); });
        violations.forEach(function(violation) {
            if (!violationsCounts[violation]) {
                violationsCounts[violation] = 0;
            }
            violationsCounts[violation]++;
        });

        if (d.Age < 20) {
            ageCounts["< 20 yo"]++;
        } else if (d.Age < 26) {
            ageCounts["20-25 yo"]++;
        } else if (d.Age < 36) {
            ageCounts["26-35 yo"]++;
        } else if (d.Age < 46) {
            ageCounts["36-45 yo"]++;
        } else {
            ageCounts["> 45 yo"]++;
        }

        if (!genderCounts[d.Gender]) {
            genderCounts[d.Gender] = 0;
        }
        genderCounts[d.Gender]++;
    });

    Object.keys(countryCounts).forEach(function(country) {
        countries.push({
            country: country,
            value: countryCounts[country]
        });
    });

    Object.keys(professionsCounts).forEach(function(profession) {
        professions.push({
            profession: profession,
            value: professionsCounts[profession]
        });
    });

    Object.keys(violationsCounts).forEach(function(violation) {
        violations.push({
            violation: violation,
            value: violationsCounts[violation]
        });
    });

    Object.keys(ageCounts).forEach(function(d) {
        age.push({
            age: d,
            value: ageCounts[d]
        });
    });

    Object.keys(genderCounts).forEach(function(d) {
        gender.push({
            gender: d,
            value: genderCounts[d]
        });
    });

    professionsChart(professions);
    countriesChart(countries);
    violationsChart(violations);
    ageChart(age);
    genderChart(gender);
});
