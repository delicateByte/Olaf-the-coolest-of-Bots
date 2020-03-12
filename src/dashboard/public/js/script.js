$(document).ready(() => {
  $('#form-unsplash').submit((e) => {
    e.preventDefault();

    $.ajax({
      url: '/data/unsplash',
      type: 'post',
      data: $('#form-unsplash').serialize(),
      success() {
        location.reload();
      },
    });
  });
});
