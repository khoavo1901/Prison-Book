//Define data
d3.json('data/topdonors.json').then(function(data) {





    // Create SVG
    let
      width = 500,
      height = 300;
     
    let margin = {
      top: 40,
      bottom: 70,
      left: 30,
      right: 30
    };
    
    let svg = d3.select('#vis2')
    .append('svg')
    .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of its parent element and the page.
    .attr('width', '100%') // this is now required by Chrome to ensure the SVG shows up at all
    .attr('viewBox', [-50, -10, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
    // change the view box
    
    // Define Scales
    let yScale = d3.scaleLinear()
      .domain([0, 250]) // make this dynamic
      .range([height - margin.bottom, margin.top]);
    
    let xScale = d3.scaleBand()
      .domain(
        data.map(function(d) {
          return d.donor;
        })
      )
      .range([margin.left, width - margin.right - 10])
      .padding(0.35);
    
    //Draw Axes
    let yAxis = svg
      .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));
    
    //Add label
    yAxis
      .append('text')
        .attr('y', 30)
        .attr('x', 20)
        .style('stroke', 'white')
        .text('Count');
    
    let xAxis = svg
      .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        //.attr("transform", "rotate(0)")
        .call(d3.axisBottom().scale(xScale));
    
        // Trying to add some rotation to the x-labels
        xAxis
          .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");
     
    //Add label
    xAxis
      .append('text')
        .attr('x', width - margin.left + 5)
        .attr('y', -10)
        .style('stroke', 'white')
        .text('Donor');

    // Three function that change the tooltip when user hover / move / leave a cell
    var div = d3.select("#vis2").append("div")
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("opacity", 0);

    var mouseover = function(event, d) {
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html("Count: " + d.count)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
        };


    var mouseout = function(event, d) {
        div.transition()
            .duration(500)
            .style("opacity", 0);
        };

 
  //Draw bars
  let bar = svg
    .selectAll('rect')
      .data(data)
    .enter()
    .append('rect')
      .attr('x', function(d) {
        return xScale(d.donor);
      })
      .attr('y', function(d) {
        return yScale(d.count);
      })
      .attr('width', xScale.bandwidth())
      .attr('fill', 'steelblue')
      .attr('height', function(d) {
        return height - margin.bottom - yScale(d.count);
      })
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
  
    });
  
