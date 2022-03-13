// Socket
var socket = io();

socket.on('connect', () => {
  console.log('Socket ID: ' + socket.id);
});
socket.on('route:my', async (route) => {
  var myRoute = await route.routePoints.map(point => {
    return point.locationData;
  });
  var distance = 0;
  var time;

  var polyline = L.polyline(myRoute, {color: 'red'}).addTo(map);

  for (let i = 1; i < myRoute.length; i += 1) {
    distance += L.latLng(myRoute[i - 1]).distanceTo(myRoute[i]);
  }

  time = Date.parse(route.routePoints[route.routePoints.length - 1].currentDateTime) - Date.parse(route.routePoints[0].currentDateTime);
  min = Math.floor((time/1000/60) << 0),
  sec = Math.floor((time/1000) % 60);

  map.fitBounds(polyline.getBounds());
  marker.bindTooltip(`Пройдено ${distance.toFixed(1)} метров<br>за ${min} минут и ${sec} секунд`).openTooltip();
});

// Map
var map = L.map('map').setView([44.60607, 33.52785], 18);

var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1
}).addTo(map);

var myIcon = L.icon({
  iconUrl: '../images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [13, 41]
});

var marker = L.marker([44.60607, 33.52785], { icon: myIcon }).addTo(map);

var moveSteps = [
  [44.60607, 33.52785],
  [44.60616, 33.52771],
  [44.60623, 33.5276],
  [44.6063, 33.52757],
  [44.60637, 33.52764],
  [44.60644, 33.52781],
  [44.60654, 33.52794],
  [44.60663, 33.52802],
  [44.60663, 33.52815],
  [44.60659, 33.52826]
];

for (let i = 1; i < moveSteps.length; i += 1) {
  if (i === 1) {
    socket.emit('route:start', moveSteps[i - 1]);
  }

  setTimeout(() => {
    socket.emit('route:move',moveSteps[i]);
    map.panTo(moveSteps[i]);
    marker.setLatLng(moveSteps[i]);
  }, i * 3000);
}

// Get route button
document.getElementById('display-route').addEventListener('click', (evt) => {
  socket.emit('route:get');
});
