'use strict';

$(function () {
  var inputOptions = [
    [ $('input[type="radio"][value="input"]'), $('#swaggerInput') ],
    [ $('input[type="radio"][value="url"]'), $('#swaggerUrl') ],
    [ $('input[type="radio"][value="file"]'), $('#swaggerFile')]
  ];

  function updateVisibility() {
    inputOptions.forEach(function (pair) {
      if (!pair[0][0].checked) {
        console.log('input valued ' + pair[0].attr('value') + ' is not checked, hiding');
        pair[1].hide();
      } else {
        console.log('input valued ' + pair[0].attr('value') + ' is checked, showing');
        pair[1].show();
      }
    });
  }

  updateVisibility();

  inputOptions.forEach(function (pair) {
    pair[0].on('change', updateVisibility);
  });
});
