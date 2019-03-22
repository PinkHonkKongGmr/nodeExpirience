ymaps.ready(init);

function init() {
  var geolocation = ymaps.geolocation,
    myMap = new ymaps.Map('map', {
      center: [55, 34],
      zoom: 10
    }, {
      searchControlProvider: 'yandex#search'
    });
  // Сравним положение, вычисленное по ip пользователя и
  // положение, вычисленное средствами браузера.
  // geolocation.get({
  //     provider: 'yandex',
  //     mapStateAutoApply: true
  // }).then(function (result) {
  //     // Красным цветом пометим положение, вычисленное через ip.
  //     result.geoObjects.options.set('preset', 'islands#redCircleIcon');
  //     result.geoObjects.get(0).properties.set({
  //         balloonContentBody: 'Мое местоположение'
  //     });
  //     myMap.geoObjects.add(result.geoObjects);
  // });
  geolocation.get({
    provider: 'browser',
    mapStateAutoApply: true
  }).then(function(result) {
    // Синим цветом пометим положение, полученное через браузер.
    // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
    myMap.geoObjects.add(result.geoObjects);
    $('.city').text(result.geoObjects.get(0).properties.getAll().name)
    $('.nope').click(function() {
      $('.city').text(result.geoObjects.get(0).properties.getAll().description.split(',').reverse())
    });
  });

  // geolocation.get({
  //     provider: 'browser',
  //     mapStateAutoApply: true
  // }).then(function (result) {
  //     // Синим цветом пометим положение, полученное через браузер.
  //     // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
  //     myMap.geoObjects.add(result.geoObjects);
  //
  // });
}
