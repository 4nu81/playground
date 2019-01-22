var _img = document.getElementById("img");
var newImg = new Image;
newImg.onload = function () {
    _img.src = this.src;
}
newImg.src = 'https://www.getdigital.de/web/getdigital/gfx/products/__generated__resized/380x380/Aufkleber_Trollface.jpg'