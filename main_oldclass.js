'use strict';

function UploadImagesMessages(lang)
{
    this.msg = { 
      'ru': { files:'Файлов: ', size:' размер: ', b:'Б',kb:'КБ', mb:'МБ', nofiles: 'Файлы не выбраны', 
              selectfiles:'Выбрать файлы', send:'Отправить', delall: 'Удалить все изображения',
      },
      'en': { files:'Files: ', size:' size ', b:'B',kb:'KB', mb:'MB', nofiles: 'No files', 
              selectfiles: 'Select files', send:'Send', delall: 'Dlelete all images',
      }
    };
    this.lang = lang;
    this.getMsg = function(msg) {
      let m = this.msg[this.lang];
      return m[msg];
    }
};

function UploadImages(lang = 'ru')
{
    this.Store = [];
    this.file_idx_cur = 0;
    this.file_idx = 0;
    this._id_file = 'photos';
    this._id_images = 'pips';
    this._id_img_label = 'photos_label';
    this.imgTimeout = 20;

    this.lang = lang;
    // create an off-screen img
    this.img = document.createElement('img');
    // create an off-screen canvas
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this._msg = new UploadImagesMessages(lang);

    // ID of the <input ID="photos" type="file" multiple...> item
    // The name should be the same as the ID, with the addition of an array identification.
    // <input type="file" multiple NAME="photos[]"...>
    // Example: ID="photos"
    //   <input id="photos" type="file" name="photos[]" multiple accept="image/*" style="display:none;"/>
    this.id_file = function(newValue) { this._id_file = newValue; }
    // ID of the container for preview\delete selected images.
    this.id_images = function(newValue) { this._id_images = newValue; }
    // ID of the item where information about the selected files is displayed.
    this.id_img_info = function(newValue) { this._id_img_label = newValue; }

    this.addListeners = function() {
      const _this = this;
      var item = document.getElementById(this._id_file);
      if( item )
      {
        const _this = this;
        item.addEventListener('change', function(e) { _this.eventChange(e); } );
      }
    }

    this.eventChange = function(e) 
    {
        if (!e.target.files.length) return;
        var files = Object.keys(e.target.files).map((i) => [e.target.files[i], false, this.file_idx++] );
        this.Store = this.Store.concat(files);
        document.getElementById(this._id_file).value = '';
        const _this = this;
        setTimeout( function() { _this.addImage(); }, 25);
    }

    this.addImage = function()
    {
        for (let i = 0; i < this.Store.length; i++) {
            if( this.Store[i][1] === false ) {
              if ( /^image/.test( this.Store[i][0].type ) ) {
                this.file_idx_cur = i;
                let fileReader = new FileReader();
                const _this = this;
                fileReader.addEventListener('loadend', function(e) { _this.addView2(e); } );
                fileReader.readAsDataURL(this.Store[i][0]);
                break;
              }
              else {
              }
            }
        }
    }

    this.addView2 = function(e)
    {
        this.img.src = e.target.result;
        const _this = this;
        setTimeout( function(e) { _this.addView(); }, this.imgTimeout);
    }

    this.addView = function()
    {
      let item = this.Store[this.file_idx_cur];
      // resize image for preview
      let srcImage = this.imageToDataUri(this.img, 100, 75);
      let type = item[0].type.replace(/^image\//, '');

      let str = `<div class="pip" style="background-image:url('${srcImage}'); display: inline-block;">
             <br/>
             <div class="attach-file-type">${type}</div>
             <div class="attach-del" id="spic${item[2]}">
               <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15">
                 <path d="M 5 5 L 10 10 M 5 10 L 10 5" stroke-width="2" stroke="white"/>
               </svg>
             </div>
           </div>`;

      document.getElementById(this._id_images).insertAdjacentHTML('afterbegin', str);
      const _this = this;
      document.getElementById('spic' + item[2].toString()).addEventListener('click', 
        function(event) { _this.removeImage(event) } );

      item[1] = true;
      this.file_idx_cur++;
      if( this.file_idx_cur < this.Store.length ) {
        const _this = this;
        setTimeout( function(){ _this.addImage(); }, this.imgTimeout);
      }
      else {
        this.labelText();
      }
    }

    this.removeImage = function(e) {
      var id = e.currentTarget.id;
      if( id.match(/^spic\d+/) ) {
        var idx = parseInt( id.replace( /^spic/, '' ) );
        this.Store = this.Store.filter( (pic) => { return pic[2] !== idx; });
        e.currentTarget.parentElement.remove();

        this.labelText();
      }
    }
    this.msg = function(name) { return this._msg.getMsg(name); }          
    this.labelText = function() {
        let info = document.getElementById(this._id_img_label);
        if( info ) {
          if( this.Store.length > 0 ) {
            let size = 0;
            this.Store.map( (item) => { size += item[0].size; } );
            let b = this._msg.getMsg('b');
            if( size > 1024*1024 ) { size = size /(1024*1024); b = this._msg.getMsg('mb'); }
            else if( size > 1024 ) { size = size /1024; b = this._msg.getMsg('kb'); }
            info.innerText = this._msg.getMsg('files') + this.Store.length.toString() + this._msg.getMsg('size') + Math.round(size) + ' ' + b;
          }
          else {
            info.innerText = this._msg.getMsg('nofiles');
          }
        }
    }

    this.imageToDataUri = function(img, width, height) {
      // set its dimension to target size
      let h = img.height * (width/img.width);
      this.canvas.width = width;
      this.canvas.height = h;
      // draw source image into the off-screen canvas:
      this.ctx.drawImage(img, 0, 0, width, h);
//      this.ctx.drawImage(img, 0, 0, width, height);
      // encode image to data-uri with base64 version of compressed image
      return this.canvas.toDataURL();
    }

    this.sendImages = function(route) {
      if( this.Store.length ) {
        const formData = this.getFilesFormData(this.Store);
        this.uploadFile(route, formData);
      }
    }
    
    this.uploadFile = function(url, formData) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);

      xhr.onload = function() {
        console.log(`Stored: ${xhr.status} ${xhr.response}`); 
      };

      xhr.onerror = function() {
        console.log('Error connection');// Ошибка соединения');
      };

      xhr.onprogress = function(event) { // запускается периодически
        // event.loaded - количество загруженных байт
        // event.lengthComputable = равно true, если сервер присылает заголовок Content-Length
        // event.total - количество байт всего (только если lengthComputable равно true)
        console.log(`Stored ${event.loaded} from ${event.total}`);
      };
      xhr.ontimeout = function() {
        console.log('Timeout');
      };
      xhr.send(formData);
    }

    this.delImages = function() {
      document.getElementById(this._id_images).innerHTML = '';
      this.Store = [];
      this.labelText();
    }

    // Make FormData with files
    this.getFilesFormData = function(files) {
      const formData = new FormData();
      files.map((file, index) => {
        formData.append( this._id_file +'[]', file[0]);
      });
      formData.append('submit', '');
      return formData;
    }

    this.addListeners();

};
