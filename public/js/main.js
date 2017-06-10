$(document).ready(function() {
  $('.delete').click(deleteNickname);

  function deleteNickname() {
    var confirmation = confirm("Are your sure?");
    if (confirmation) {
      $.ajax({
        type: 'DELETE',
        url: '/delete/' + $(this).data('id')
      }).done(function(response) {
        window.location.replace('/');
      });
      window.location.replace('/');
    } else {
      return false;
    }
  }

});
