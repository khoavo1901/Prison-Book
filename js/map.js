let map = L.map('mymap').setView([40,-95], 4)

let osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

//initialize svg to add to map
L.svg({clickable:true}).addTo(map)

circlesLayer = L.layerGroup().addTo(map);
circlesLayer.clearLayers()

let colorScale = d3.scaleOrdinal()
  .domain(["Doesn't accept books", "No limit on books", "Accept limited books"])
  .range(["#ca0020", "#0571b0", "#fdae61"])

d3.csv("data/finalmapdata_fixed.csv").then(function(data){
  data.forEach(function(d){
  let circle = L.circle([d.lat, d.long], 8000, {
        color: colorScale(d.accept_books),
        weight: 2,
        fillColor: colorScale(d.accept_books),
        fillOpacity: 0.5
          })
    let txt = "<b>Facility Name: </b>"+d.Facility_Name 
    +"<br><b>City: </b>"+ d.City
    +"<br><b> Numbers of books allowed: </b>" + d.Number_of_books_accepted
    +"<br><b> Require paperback book: </b>" + d.only_paperback
    +"<br><b> Good with used book: </b>" + d.condition_good_used_okay
    +"<br><b> Require bundle: </b>" + d.bundle
    +"<br><b> Good with hardcover book: </b>" + d.hardcover_okay
    circle.bindPopup(txt)
    circlesLayer.addLayer(circle) })});

  


