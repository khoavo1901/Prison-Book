//set the dimensions and margins of the graph
const margin5 = {top: 10, right: 30, bottom: 20, left: 50},
    width5 = 460 - margin5.left - margin5.right + 400,
    height5 = 400 - margin5.top - margin5.bottom - 100;

// append the svg object to the body of the page
const svg5 = d3.select("#stackedbar")
  .append("svg")
    .attr("width", width5 + margin5.left + margin5.right)
    .attr("height", height5 + margin5.top + margin5.bottom + 200)
  .append("g")
    .attr("transform", `translate(${margin5.left},${margin5.top})`);

// Parse the Data
d3.csv("data/common_rest_aggregated_count.csv").then ( function(data) {

  // Three function that change the tooltip when user hover / move / leave a cell
  var tooltip = d3.select("#stackedbar").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("background-color", "black")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "10px")
  .style("padding", "10px");

  var mouseover = function(event, d) {
    tooltip.html("Percentage: " + Math.round((d[1] - d[0]))+ '%')
      .style("left", (event.pageX) + "px")
      .style("top", (event.pageY - 28) + "px")
      .style("fill", "black")
      .style("opacity", 1);
      };


  var mouseout = function(event, d) {
      tooltip.transition()
          .duration(200)
          .style("opacity", 0);
      };
  // List of subgroups = header of the csv files = soil condition here
  const subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  const groups = data.map(d => d.group)

  // Add X axis
  const x = d3.scaleBand()
      .domain(groups)
      .range([0, width5 + 10])
      .padding([0.1])
  svg5.append("g")
    .attr("transform", `translate(0, ${height5})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height5, 0 ]);
  svg5.append("g")
    .call(d3.axisLeft(y));


        // Handmade legend
svg5.append("rect").attr("x",0).attr("y",342).attr("width", 15).attr("height", 15).style("fill", '#377eb8')
svg5.append("rect").attr("x",0).attr("y",372).attr("width", 15).attr("height", 15).style("fill", '#e41a1c')
svg5.append("text").attr("x", 20).attr("y", 355).text("Yes").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "white")
svg5.append("text").attr("x", 20).attr("y", 385).text("No").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "white")



  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e41a1c','#377eb8','#4daf4a'])

  // Normalize the data -> sum of each group must be 100!
  dataNormalized = []
  data.forEach(function(d){
    // Compute the total
    tot = 0
    for (i in subgroups){ name=subgroups[i] ; tot += +d[name] }
    // Now normalize
    for (i in subgroups){ name=subgroups[i] ; d[name] = d[name] / tot * 100}
  })

  //stack the data? --> stack per subgroup
  const stackedData = d3.stack()
    .keys(subgroups)
    (data)

  // Show the bars
  svg5.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .join("rect")
        .attr("x", d => x(d.data.group))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
})


////
