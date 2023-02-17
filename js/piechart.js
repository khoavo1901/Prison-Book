// set the dimensions and margins of the graph
const width = 550,
    height = 450,
    margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin;

// append the svg object to the div called 'piechart'
const svg = d3.select("#piechart")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`);

    // Handmade legend
svg.append("circle").attr("cx",200).attr("cy",130).attr("r", 6).style("fill", d3.schemeDark2[0])
svg.append("circle").attr("cx",200).attr("cy",160).attr("r", 6).style("fill", d3.schemeDark2[1])
svg.append("text").attr("x", 220).attr("y", 130).text("True").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 220).attr("y", 160).text("False").style("font-size", "15px").attr("alignment-baseline","middle")


// create the datasets
const data1 = {true: 479, false: 763} // only paperback
const data2 = {true: 51, false: 1191} // condition_good_used_okay
const data3 = {true: 35, false: 1207} // bundle
const data4 = {true: 78, false: 1164} // has_no_restrictions
const data5 = {true: 89, false: 1153} // condition_new
const data6 = {true: 20, false: 1222} // needs_prior_approval
const data7 = {true: 34, false: 1208} // hardcover_okay

// set the color scale
const color = d3.scaleOrdinal()
  .domain(["true", "false"])
  .range(d3.schemeDark2);

// A function that create / update the plot for a given variable:
function update(data) {

  // Compute the position of each group on the pie:
  const pie = d3.pie()
    .value(function(d) {return d[1]; })
    .sort(function(a, b) { return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
  const data_ready = pie(Object.entries(data))

  // map to data
  const u = svg.selectAll("path")
    .data(data_ready)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  u
    .join('path')
    .transition()
    .duration(1000)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data[0])) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)


}

// Initialize the plot with the first dataset
update(data1)
