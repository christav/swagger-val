'use strict';

$(function () {
  var inputOptions = [
    [ $('input[type="radio"][value="input"]'), $('#swaggerInput') ],
    [ $('input[type="radio"][value="url"]'), $('#swaggerUrl') ],
    [ $('input[type="radio"][value="file"]'), $('#swaggerFile') ]
  ];

  function updateVisibility() {
    inputOptions.forEach(function (pair) {
      if (!pair[0][0].checked) {
        pair[1].hide();
      } else {
        pair[1].show();
      }
    });
  }

  updateVisibility();

  $('input[type="radio"]').on('change', updateVisibility);
});
