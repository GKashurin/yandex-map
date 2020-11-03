var geoObjects = [];
const placemarks = []; // Собираем сюда все метки

let myMap;

const init = () => {
  myMap = new ymaps.Map("map", {
    center: [56.8407, 60.6098], // координаты центра
    zoom: 11, // масштаб
    controls: ['zoomControl'], // элементы управления. В моем случае только ползунок масштаба
    behaviors: ['drag'] // чтобы карта не зумилась при прокрутке. drag - возможность перетаскивать карту левой кнопкой мыши
});

const reviews = document.querySelector(".form-wrapper");

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
}

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

        reviews.style.position = 'absolute'; //чтоб окно открывалось на месте клика
        reviews.style.top = posY + 'px';
        reviews.style.left = posX + 'px';

        async function geocoder(coords) {
          var response = await ymaps.geocode(coords);
          return response.geoObjects.get(0).getAddressLine();
      }
      var address = await geocoder(coords); //распарписли координаты и получили адрес

      showform(coords, address);

      const newPlacemark = new ymaps.Placemark(
        coords,
        {
          balloonContentHeader: 'dasd',
          balloonContentBody: '' // Тело для балуна
        },
        {
          iconLayout: 'default#image',
          draggable: false,
          openBalloonOnClick: false
        }
      );

      // добавление метки на карту
      myMap.geoObjects.add(newPlacemark);
      clusterer.add(newPlacemark);
      placemarks.push(newPlacemark);

      newPlacemark.events.add("click", () => {
        openBalloon();
      });
    }
    else {
        myMap.balloon.close();
    }
  })
  }
  addListeners(myMap);

  //функцию загрузки данных вызываем при инициализации карты, чтобы загрузить данные о всех отзывах, ранее созданных, в локалсторедж:
  let markers = loadFromStorage();
  if (markers) {
    markers.forEach((marker) => {
      console.log('marker: ', marker);
    });
  }
}

ymaps.ready(init);

const title = document.querySelector(".title");

const reviews = document.querySelector(".form-wrapper");
const myName = document.querySelector("#myName");
const myPlace = document.querySelector("#myPlace");
const myField = document.querySelector("#myField");

const myBtn = document.querySelector(".formBtn")
const reviewList = document.querySelector(".review-list")
const storage = localStorage;
let reviewsData = [];


function showform(coords, address) {
  title.textContent = address;
  reviews.style.display = "block";
  
  myBtn.addEventListener('click', function() {
    getValue(coords);
    console.log(reviewsData);

    let addNewReviewName = document.createElement('li') //здесб создаются элементы и добавляются в них текст отзыва
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
    reviews.style.display = "none";
  });
}

function getValue(coords) { //эта функция создает массив из input.value. Вызывается она по клику(стр 97)
  let nameInput = document.querySelector('.field__input-name');
  let placeInput = document.querySelector('.field__input-place');
  let textInput = document.querySelector('.field__input-text');
 
  let obj = {
    coords: [],
    review: {
      name: "",
      place: "",
      text: ""
    }
  };

  obj.review.name = nameInput.value;
  obj.review.place = placeInput.value;
  obj.review.text = textInput.value;
  obj.coords = coords;

  reviewsData.push(obj);
  addToStorage(obj); //вызываем создание данных об отзыве в локалсторедж в тот момент, когда создаем объект из данных полей
}

const close = document.querySelector(".close");  //закрытие крестиком
close.addEventListener('click', event => {
  event.preventDefault();
  reviews.style.display = "none";
})

const openBalloon = () => {
  reviews.style.display = "block";
};

function addToStorage(obj) {
  let markers = [];
  if (localStorage.getItem('markers')) {
      markers = JSON.parse(localStorage.getItem('markers'));
  }
  markers.push(reviewsData);
  localStorage.setItem('markers', JSON.stringify(markers));
}

function loadFromStorage() {
  if (localStorage.getItem('markers')) {
      return JSON.parse(localStorage.getItem('markers'));
  }
}
