var menu = document.getElementById("side-menu");
var filter = document.getElementById("side-filter");
var close = document.getElementsByClassName("close-btn")[0];

//menu
function toggleMenu() {
  if (menu.style.width === "250px") {
    menu.style.width = "0";
  } else {
    menu.style.width = "250px";
  }
}

//filter
function togglefilter() {
  if (filter.style.width === "250px") {
    filter.style.width = "0";
  } else {
    filter.style.width = "250px";
  }

  if (close.style.display === "block") {
    close.style.display = "none";
  } else {
    setTimeout(function () {
      close.style.display = "block";
      categories.style.display = "block";
    }, 100);
  }
}

// close filter
function closeMenu() {
  var menu = document.getElementById("side-filter");
  menu.style.width = "0";
  close.style.display = "none";
}
