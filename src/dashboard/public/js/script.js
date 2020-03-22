$(document).ready(() => {
  // Unsplash
  $('#form-unsplash').submit((e) => {
    e.preventDefault();
    $.ajax({
      url: '/data/unsplash',
      type: 'post',
      data: $('#form-unsplash').serialize(),
      success() {
        console.log('done');
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

  $('#form-spotify').submit((e) => {
    e.preventDefault();
    $.ajax({
      url: '/data/spotify',
      type: 'post',
      data: $('#form-spotify').serialize(),
      success() {
        location.reload();
      },
    });
  });
});
