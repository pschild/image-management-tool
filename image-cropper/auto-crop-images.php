<?php
echo '<style>body { background: #ccc; }</style>';

ini_set('display_errors', 1);
error_reporting(E_ALL);

set_time_limit(0);

//phpinfo();

$testObjects = array(
  array("1.jpg", "#ffffff"),
  array("1a.jpg", "#ffffff"),
  array("imgage.jpg", "#ffffff"),
  array("imgage_green.jpg", "#3dff00"),
  array("ext1.png", "#e2e2e0"),
  array("ext2.jpg", "#f9f6f1")
);

// INPUT
$testIndex = $_GET["testIndex"];
$originalImagePath = $testObjects[$testIndex][0];
$tempFolderPath = "./tmp/";
$backgroundColor = $testObjects[$testIndex][1];
$imageAreaColor = "#ff0000";
$gridSize = 100;
$maxImages = 10;
$fuzzPercent = 0.06;

echo '<img width="100" src="./'.$originalImagePath.'"/><br><hr>';

$im = new Imagick($originalImagePath);
$originalWidth = $im->getImageWidth();
$im->scaleImage($originalWidth / 2, 0);
//$im->setImageCompressionQuality(1);
$im->writeImage($tempFolderPath."out.png");

copy($tempFolderPath."out.png", $tempFolderPath."in.png");

// Step 1: Make the background color transparent

$im = new Imagick($tempFolderPath."in.png");

$im->borderImage($backgroundColor, 1, 1);

$fuzz = $fuzzPercent * $im->getQuantumRange()['quantumRangeLong'];
$im->transparentPaintImage($backgroundColor, 0.0, $fuzz, false);

$im->shaveImage(1, 1);

$im->writeImage($tempFolderPath."out1.png");

// Step 2: Make all but transparent parts red

$im = new Imagick($tempFolderPath."out1.png");

$fuzz = $fuzzPercent * $im->getQuantumRange()['quantumRangeLong'];
$im->opaquePaintImage(new ImagickPixel('transparent'), $imageAreaColor, $fuzz, true);

$im->writeImage($tempFolderPath."tmp2.png");

$startRow = 0;
$startCol = 0;
for ($i = 1; $i <= $maxImages; $i++) {
  $x = null;
  $y = null;

  // Step 3: Loop through the image's pixel and find red ones

  $im = new Imagick($tempFolderPath."tmp2.png");
  $imageIterator = $im->getPixelIterator();
  foreach ($imageIterator as $row => $pixels) {
    if ($row % $gridSize === 0 && $row >= $startRow) {
      foreach ($pixels as $column => $pixel) {
            if ($column % $gridSize === 0 && $column >= $startCol) {
              //echo "investigate ".$column.",".$row."<br>";
              $startCol = $column;
                $color = $pixel->getColor();
                if ($color['r'] === 255 && $color['g'] === 0 && $color['b'] === 0) {
                  $x = $column;
                  $y = $row;
                  //echo "red at ".$x.",".$y;
                  break 2; // break both foreach loops
                }
            }
        }
        $startRow += $gridSize;
        $startCol = 0;
    }
    $imageIterator->syncIterator();
  }

  if ($x !== null && $y !== null) {
    // Step 4: If a red pixel was found at position (x,y), begin flood-filling from this position with white color

    $fuzz = $fuzzPercent * $im->getQuantumRange()['quantumRangeLong'];
    $im->floodFillPaintImage("#ffffff", $fuzz, $imageAreaColor, $x, $y, false);

    $im->writeImage($tempFolderPath."tmp3.png");

    // Step 5: Make all non-white pixels transparent and set the background to black

    $im = new Imagick($tempFolderPath."tmp3.png");

    $fuzz = $fuzzPercent * $im->getQuantumRange()['quantumRangeLong'];
    $im->transparentPaintImage("#ffffff", 0.0, $fuzz, true);
    $im->setImageBackgroundColor("#000000");
    $im = $im->mergeImageLayers(imagick::LAYERMETHOD_FLATTEN);

    $im->writeImage($tempFolderPath."tmp3a.png");

    // Step 6: Make a non-rotated rectangle bound to the identified (eventually skewed) image area

    $im = new Imagick($tempFolderPath."tmp3a.png");

    $im->trimImage(0);
    $im->opaquePaintImage("#000000", "#ffffff", 0, false);

    $im->writeImage($tempFolderPath."tmp3b.png");

    // Step 7: Combine two images to get a mask, showing the image area bound by a non-rotated rectangle

    $im1 = new Imagick($tempFolderPath."tmp3a.png");
    $im2 = new Imagick($tempFolderPath."tmp3b.png");

    $im1->addImage($im2);

    $result = $im1->mergeImageLayers(imagick::LAYERMETHOD_FLATTEN);

    $result->writeImage($tempFolderPath."tmp4.png");

    // Step 8: Combine the mask with the original image and mutliply it to get only the identified area as an image

    $orig = new Imagick($originalImagePath);
    $mask = new Imagick($tempFolderPath."tmp4.png");
    $mask->scaleImage($originalWidth, 0);

    $orig->compositeImage($mask, imagick::COMPOSITE_MULTIPLY, 0, 0);
    $orig->trimImage(0);
    $orig->deskewImage(0.5);

    $orig->writeImage($i."crop.jpg");
    echo '<img width="100" src="./'.$i.'crop.jpg"/>';

    // Step 9: Remove the identified area from step 5 from the image with all image areas, so that it won't be detected twice

    $im = new Imagick($tempFolderPath."tmp3.png");

    $fuzz = $fuzzPercent * $im->getQuantumRange()['quantumRangeLong'];
    $im->transparentPaintImage("#ffffff", 0.0, $fuzz, false);

    $im->writeImage($tempFolderPath."tmp2.png");
  } else {
    echo 'done';
    break;
  }
}