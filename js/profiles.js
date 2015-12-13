var path = "data/data.csv";
d3.csv(path, function(error, data) {
    if (error) { console.log(error); }

    var ul = d3.select("#MixItUpBF4793");

    data.forEach(function(d) {
        var figure = ul.append("li")
            .attr("class", "mix " + d.Name)
            .style("display", "inline-block")
            .append("div")
            .attr("class", "grid")
            .append("figure")
            .attr("class", "effect-sadie")
            .style("background-image", "url(" + d["Link to picture"] + ")")
            .style("background-size", "cover")
            .append("a")
            .attr("href", function() {
                if (d.Name === "Nabeel Rajab") {
                    return "profilepage.html";
                } else if (d.Name === "Atena Farghadani") {
                    return "profilepage2.html";
                } else if (d.Name === "Bassel Khartabil") {
                    return "profilepage3.html";
                } else {
                    return "#";
                }
            });

        var figcaption = figure.append("figcaption");

        figcaption.append("h2")
            .text(d.Name);

        figcaption.append("h3")
            .text(d.Age + " years old | " + d.Country + " | " + d.Profession);

        figcaption.append("p")
            .text(d["Key Snippet (Clickbait) Torture"]);
    });

    ul.append("li")
        .attr("class", "gap");
});
