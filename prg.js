  if (window.File && window.FileList && window.FileReader) {

    var uploadfiles = new UploadImages('en');
    document.getElementById('photos_btn').value = uploadfiles.msg('selectfiles');
    document.getElementById('photos_send').value = uploadfiles.msg('send');
    document.getElementById('photos_delall').value = uploadfiles.msg('delall');
    document.getElementById('photos_label').innerText = uploadfiles.msg('nofiles');

  } else {
    alert("Your browser doesn't support to File API")
  }
