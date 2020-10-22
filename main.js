
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

const reviews = document.querySelector(".form");

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
  myMap.events.add('click', async function (e) {
    if (!myMap.balloon.isOpen()) {
        var coords = e.get('coords');
        const posX = event.clientX;
        const posY = event.clientY;

        console.log(posX);
        console.log(posY);
        console.log(coords);
        
        async function geocoder(coords) {
          var response = await ymaps.geocode(coords);
          return response.geoObjects.get(0).getAddressLine();
      }
      var address = await geocoder(coords); //распарписли координаты и получили адрес

      showform(coords, address);
      
    }
    else {
        myMap.balloon.close();
    }
  })
  }
  addListeners(myMap);
  
}

ymaps.ready(init);

const title = document.querySelector(".title");

const reviews = document.querySelector(".form-wrapper");
const myName = document.querySelector("#myName");
const myPlace = document.querySelector("#myPlace");
const myField = document.querySelector("#myField");

const myBtn = document.querySelector(".formBtn")
const reviewList = document.querySelector(".review-list")


function showform(coords, address) {
  title.textContent = address;
  reviews.style.display = "block";
  myBtn.addEventListener('click', function() {

    let addNewReviewName = document.createElement('li')
    addNewReviewName.innerHTML = myName.value
    reviewList.appendChild(addNewReviewName)
    myName.value = '';

    let addNewReviewPlace = document.createElement('li')
    addNewReviewPlace.innerHTML = myPlace.value
    reviewList.appendChild(addNewReviewPlace)
    myPlace.value = '';

    let addNewReviewText = document.createElement('li')
    addNewReviewText.innerHTML = myField.value
    reviewList.appendChild(addNewReviewText)
    myField.value = '';
  })
  
}


// валидация формы
// const form = document.querySelector('.form');
// form.addEventListener('submit', function(event) {
//   event.preventDefault()
//   console.log('click');
// })