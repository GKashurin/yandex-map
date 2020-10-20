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

function addListeners(myMap) {  // код функции взят из документации Яндекс maps
  myMap.events.add('click', function (e) {
    if (!myMap.balloon.isOpen()) {
        var coords = e.get('coords');
        myMap.balloon.open(coords, {
            contentHeader:'<div class= "header">Событие!</div>',
            contentBody:
            '<div class="review-list"></div>' +
            '<div class="form" data-role="review-form">' +
              '<div><hr></div>' +
              '<h3 class="form__title">ВАШ ОТЗЫВ</h3>' +
              '<div class="field"><input class="field__content" data-role="review-name" type="text" placeholder="Ваше имя" id="myName"></div>' +
              '<div class="field"><textarea class="field__content" data-role="review-place" type="text" placeholder="Укажите место" id="myPlace"></textarea></div>' +
              '<div class="field"><textarea class="field__content" data-role="review-text" placeholder="Поделитесь впечатлениями" rows="5" id="myField"></textarea></div>' +
              '<button class="form__button" data-role="review-add" id="myBtn">Добавить</button>' +
              '<span class="form-error"></span>' +
            '</div>'
                // '<p>Координаты щелчка: ' + [
                // coords[0].toPrecision(6),
                // coords[1].toPrecision(6)
                // ].join(', ') + '</p>',
            //contentFooter:'<sup>Щелкните еще раз</sup>'
        });
    }
    else {
        myMap.balloon.close();
    }
  })
  }
  addListeners(myMap);
}

ymaps.ready(init);

const myName = document.querySelector("#myName");
const myPlace = document.querySelector("#myPlace");
const myField = document.querySelector("#myField");

const myBtn = document.querySelector("#myBtn");

let storage = localStorage; 
myBtn.addEventListener('click', function() {
            storage.data = JSON.stringify ({
                myName: myName.value,
                myPlace: myPlace.value,
                myField: myField.value
            });
        });
