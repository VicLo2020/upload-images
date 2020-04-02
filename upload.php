<?php
$name = 'photos';
$target_dir = "uploads/";

$cou = count($_FILES[$name]['name']);
for( $i=0; $i < $cou; $i++ )
{

$target_file = $target_dir . basename($_FILES[$name]['name'][$i]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
// Check if image file is a actual image or fake image
if(isset($_POST['submit'])) {
    $check = getimagesize($_FILES[$name]['tmp_name'][$i]);
    if($check !== false) {
        echo 'File is an image - ' . $check['mime'] . '.';
        $uploadOk = 1;
    } else {
        echo 'File is not an image.';
        $uploadOk = 0;
    }
}
// Check if file already exists
if (file_exists($target_file)) {
    echo 'Sorry, file already exists.';
    $uploadOk = 0;
}
// Check file size
if ($_FILES[$name]['size'][$i] > 500000) {
    echo 'Sorry, your file is too large.';
    $uploadOk = 0;
}
// Allow certain file formats
if($imageFileType != 'jpg' && $imageFileType != 'png' && $imageFileType != 'jpeg'
&& $imageFileType != 'gif' ) {
    echo 'Sorry, only JPG, JPEG, PNG & GIF files are allowed.';
    $uploadOk = 0;
}
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo 'Sorry, your file was not uploaded.';
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES[$name]['tmp_name'][$i], $target_file)) {
        echo 'The file '. basename( $_FILES[$name]['name'][$i]). ' has been uploaded.';
    } else {
        echo 'Sorry, there was an error uploading your file.';
    }
}

}

var_dump($_FILES);
