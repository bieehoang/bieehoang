const menuIcon = document.querySelector('#menu-icon');
const menu = document.querySelector('#menu');

let isopen = false;
menuIcon.addEventListener('click', function (e) {
  if (isopen == false) {
    menu.classList.remove('hidden');
    isopen = true;
  } else {
    menu.classList.add('hidden');
    isopen = false;
  }
});

var arrimg = [];
arrimg[0] = './assets/image/banner-7.png';
arrimg[2] = './assets/image/linux.png';
arrimg[1] = './assets/image/typescript.png';
arrimg[6] = './assets/image/banner-3.png';
arrimg[3] = './assets/image/djangoproject.png';
arrimg[4] = './assets/image/banner-5.png';
arrimg[5] = './assets/image/banner-1.png';

var i = 0;
var imgauto;

function auto() {
  i++;
  document.getElementById('img-slider').src = arrimg[i];

  if (i == arrimg.length - 1) {
    i = -1;
  }
  imgauto = setTimeout(auto, 2000);
}

window.onload = function () {
  imgauto = setTimeout(auto, 1000);
};
