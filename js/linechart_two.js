// variables and prevent 
((() => {
// LINE CHART
d3.csv('data/cleaned_donations.csv',
  function(d){
    return { date : d3.timeParse("%m/%d/%y")(d.Date),
     value: d.total_d, value_b: d.floyd_d, value_c: d.pbp_d}
  }).then(lineChart);


var margin = {top: 10, right: 40, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

let svg1 = d3.select('#vis3')
  .append('svg')
  .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of its parent element and the page.
  .attr('width', '100%') // this is now required by Chrome to ensure the SVG shows up at all
  .attr('viewBox', [-50, -10, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
  // change the view box



function lineChart(data) {
  // Graph Title
  svg1.append("text")
        .attr("x", 10 + (width / 2))             
        .attr("y", 10 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style('stroke', 'white')
        .style("font-size", "14px")  
        .text("Daily Total Donation Amount from 1/1/20 (15 day rolling avg)");


  // Add X Axis
  var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    xAxis = svg1.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x)); 




      
    
  // X Axis Label
  svg1.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 30)
    .style("font-size", "12px")  
    .attr("transform", "rotate(-90)")
    .text("Date");


  var dollarFormat = function(d) { return d3.format('($.0f')(d) };


    // Add Y axis  
    var y = d3.scalePow()
      .domain([0, 10000])
      .exponent(.4)
      .range([ height, 30 ]);
    svg1.append("g")
      .call(d3.axisLeft(y)
        .tickFormat(dollarFormat));


    xAxis
          .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");


  // Y Axis Label
  svg1.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", -50)
      .attr("x", -60)
      .attr("dy", ".75em")
      .style("font-size", "10px")
      .style('fill', 'white')
      .text("Number of Donation (15 day rolling avg)");

    const line = svg1.append('g')
      .attr("clip-path", "url(#clip)")

    // Add the total line

    

    line.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#FB9902")
      .attr("stroke-width", 1.5)
      .attr("id", "path2")
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value_b) })
        )

    line.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#66B032")
      .attr("stroke-width", 1.5)
      .attr("id", "path3")
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value_c) })
        )

    line.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#8601AF")
      .attr("stroke-width", 1.5)
      .attr("id", "path1")
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )


      


    

    // Add Legend
    svg1.append("circle").attr("cx",278).attr("cy",30).attr("r", 6).style("fill", "#FB9902")
    svg1.append("circle").attr("cx",278).attr("cy",50).attr("r", 6).style("fill", "#66B032")
    svg1.append("circle").attr("cx",278).attr("cy",70).attr("r", 6).style("fill", "#8601AF")
    svg1.append("text").attr("x", 290).attr("y", 30).text("George Floyd Bail Fund").style("font-size", "10px").attr("alignment-baseline","middle").style("fill","white")
    svg1.append("text").attr("x", 290).attr("y", 50).text("Prison Book Program").style("font-size", "10px").attr("alignment-baseline","middle").style("fill","white")
    svg1.append("text").attr("x", 290).attr("y", 70).text("Total Donations").style("font-size", "10px").attr("alignment-baseline","middle").style("fill","white")

    var clip = svg1.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)  

    line
      .append("g")
        .attr("class", "brush")
        .call(brush);


    let idleTimeout
    function idled() { idleTimeout = null; }
        
    function updateChart(event,d) {

      // What are the selected boundaries?
      extent = event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([ 4,8]) 
      }

      else{

        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }
      // Update axis and line position
      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      xAxis
          .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");
      
      line
        .select('#path1')
        .transition(1000)
        .attr("d", d3.line()
          .x(function(d) { return x(d.date)})
          .y(function(d) { return y(d.value)})
          )
      line
        .select('#path2')
        .transition(1000)
        .attr("d", d3.line()
          .x(function(d) { return x(d.date)})
          .y(function(d) { return y(d.value_b)})
          )
      line
        .select('#path3')
        .transition(1000)
        .attr("d", d3.line()
          .x(function(d) { return x(d.date)})
          .y(function(d) { return y(d.value_c)})
          )
    }


    svg1.on("dblclick",function(){
      x.domain(d3.extent(data, function(d) { return d.date; }))
      xAxis.transition().call(d3.axisBottom(x))
      xAxis
          .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");
      line
        .select('#path1')
        .transition(1000)
        .attr("d", d3.line()
          .x(function(d) { return x(d.date)})
          .y(function(d) { return y(d.value)})
          )
      line
        .select('#path2')
        .transition(1000)
        .attr("d", d3.line()
          .x(function(d) { return x(d.date)})
          .y(function(d) { return y(d.value_b)})
          )
      line
        .select('#path3')
        .transition(1000)
        .attr("d", d3.line()
          .x(function(d) { return x(d.date)})
          .y(function(d) { return y(d.value_c)})
          )
    });
}

})());