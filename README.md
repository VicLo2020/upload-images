# Upload files

Example with upload/add/remove Images with javascript

## Prerequisites

This example does not require special installation and works on the local machine, which is very convenient.
You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/) (optional)
* [PHP](https://www.php.net/downloads.php)
PS: Choose your own server suitable for you.

## Installation

### Variants:
* `git clone https://github.com/VicLo2020/uploadImage.git`, this repository
* Download ZIP and unpack into the new directory

## Running / Development

You can launch local project
Start:
* chrome.exe --allow-file-access-from-files
* php -S localhost:8000 -t {path to project}
* Visit your site at [php -S 127.0.0.1:8000](http://localhost:8000).

main_oldclass.js - old style<br>
main_class.js - new style ES2015

### Building

* Not necessary.

### Use

1. Visit your site at [http://localhost:8000](http://localhost:8000).
2. If this is your first time on a page, you need to wait about 30 seconds. 

 * A button will appear for installing the application.
 * Or just click the "+" button located on the right in the address bar.
 * The application will be installed on your desktop. Now you can launch the application from the desktop.

### Uninstall

* Not necessary. Simple delete folder.


        <link rel="stylesheet" type="text/css" href="style.css">
	<script type="text/javascript" src="main_oldclass.js"></script>

<br/>
<div class="field" align="left">
  <h3>Upload your images</h3>

<div class="Attach">

  <div class="Attach-Head">
    <input id="photos_btn" type="button" value="Выбрать файлы" onclick="document.getElementById('photos').click();"/>
    <label id="photos_label" for="photos_btn" >Файлы не выбраны</label>
  </div>
  <div class="Attach-Body">
            <form action="index.html" enctype="multipart/form-data" method="post">
                <input id="photos" style="display:none;" type="file" name="photos[]" multiple accept="image/*" />
                <div id="pips"></div><br/><br/>
                <input id="photos_send" type="button" value="Отправить" onclick="uploadfiles.sendImages('upload.php');"/>
                <input id="photos_delall" type="button" value="Удалить все изображения" onclick="uploadfiles.delImages();"/>
                <br/>
            </form>
  </div>
</div>

<br/>
</div>

<script type="text/javascript" src="prg.js" defer></script>

