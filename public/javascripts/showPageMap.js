mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/light-v11', // style URL
	center: property.geometry.coordinates, // starting position [lng, lat]
	zoom: 9, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
	.setLngLat(property.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${property.title}</h3>`)
	)
	.addTo(map);
