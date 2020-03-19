$(document).ready(() => {
  // Unsplash
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

  $('#form-reddit-memes').submit((e) => {
    e.preventDefault();
    $.ajax({
      url: '/data/redditMemes',
      type: 'post',
      data: $('#form-reddit-memes').serialize(),
      success() {
        location.reload();
      },
    });
  });
});
