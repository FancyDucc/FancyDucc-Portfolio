document.addEventListener("DOMContentLoaded", function() {
    var bannerEnabled = true;
    var defaultBannerContent = '<div class="container text-center" style="color: rgb(255, 255, 255);">' +
      '<span id="warningBannerText">This entire website is under a full redesign and because it is all frontend coded I need do everything manually; So expect things to not work. Go here for temporary navigation if the navigation bar is not working: ' +
      '<a href="temporarynavigation.html" class="hover-link-white" style="text-decoration:underline;">Temporary Navigation</a>' +
      '</span>' +
      '</div>';
    var bannerBgColor = "rgb(80, 0, 230)";






    if (!bannerEnabled) return;
    console.log("banner is enabled")
    var banner = document.createElement("div");
    banner.id = "warningBanner";
    banner.style.position = "fixed";
    banner.style.top = "0";
    banner.style.left = "0";
    banner.style.width = "100%";
    banner.style.backgroundColor = bannerBgColor;
    banner.style.color = "#ffffff";
    banner.style.padding = "10px 0";
    banner.style.zIndex = "1100";
    console.log("created bannerr")
    banner.innerHTML = defaultBannerContent;
    console.log("created banner inner html content")
    document.body.insertBefore(banner, document.body.firstChild);
  
    var mainNav = document.getElementById("mainNav");
    if (mainNav) {
      console.log("positioned")
      mainNav.style.top = banner.offsetHeight + "px";
    }
  });


  function updateWarningBannerContent(newContent) {
    var bannerTextElem = document.getElementById("warningBannerText");
    if (bannerTextElem) {
      console.log("updated")
      bannerTextElem.innerHTML = newContent;
    }
  }
  
  function toggleWarningBanner(show) {
    var banner = document.getElementById("warningBanner");
    if (banner) {
      banner.style.display = show ? "block" : "none";
      var mainNav = document.getElementById("mainNav");
      if (mainNav) {
        console.log("toggled")
        mainNav.style.top = show ? banner.offsetHeight + "px" : "0px";
      }
    }
  }