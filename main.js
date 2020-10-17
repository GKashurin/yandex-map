var placemarks = [
  {
    latitude: 56.833,
    longitude: 60.5445,
    hintContent: 'Это хинт',
    balloonContent: 'Это балун'
  },
  {
    latitude: 56.842,
    longitude: 60.584,
    hintContent: 'Это хинт',
    balloonContent: 'Это балун'
  }
],

geoObjects = [];

let myMap;

const init = () => {
  myMap = new ymaps.Map("map", {
    center: [56.8407, 60.6098], // координаты центра
    zoom: 11, // масштаб
    controls: ['zoomControl'], // элементы управления. В моем случае только ползунок масштаба
    behaviors: ['drag'] // чтобы карта не зумилась при прокрутке. drag - возможность перетаскивать карту левой кнопкой мыши
});

for (var i = 0; i<placemarks.length; i++) {
  geoObjects[i] = new ymaps.Placemark([placemarks[i].latitude, placemarks[i].longitude], {  //создание метки, добавление координат
      hintContent: placemarks[i].hintContent,
      balloonContent: placemarks[i].balloonContent
    },
    { 
      iconLayout: "default#image",
      iconImageHref: "marker.png",
      iconImageSize: [27, 40]
  });
};

var clusterer = new ymaps.Clusterer({

});

myMap.geoObjects.add(clusterer);
clusterer.add(geoObjects);
}

ymaps.ready(init);