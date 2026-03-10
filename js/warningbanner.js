document.addEventListener("DOMContentLoaded", function() {
    var bannerEnabled = true;
    var defaultBannerContent = '<div class="container text-center" style="color: rgb(255, 255, 255);">' +
      '<span id="warningBannerText">My commissions are not currently open, check back later to see when they are open again.</span>' +
      '</div>';
    var bannerBgColor = "rgb(0, 0, 0)";






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

    function applyBannerOffset() {
      if (banner.style.display === "none") {
        document.body.style.paddingTop = "0px";
        var mainNavHidden = document.getElementById("mainNav");
        if (mainNavHidden) {
          mainNavHidden.style.top = "0px";
        }
        return;
      }

      var height = banner.offsetHeight;
      document.body.style.paddingTop = height + "px";
      var mainNav = document.getElementById("mainNav");
      if (mainNav) {
        console.log("positioned")
        mainNav.style.top = height + "px";
      }
    }

    applyBannerOffset();
    window.addEventListener("resize", applyBannerOffset);

    var navbarOverlay = document.getElementById("navbar-overlay");
    if (navbarOverlay && window.MutationObserver) {
      var observer = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i += 1) {
          if (mutations[i].addedNodes && mutations[i].addedNodes.length > 0) {
            applyBannerOffset();
            break;
          }
        }
      });
      observer.observe(navbarOverlay, { childList: true, subtree: true });
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
      document.body.style.paddingTop = show ? banner.offsetHeight + "px" : "0px";
      var mainNav = document.getElementById("mainNav");
      if (mainNav) {
        console.log("toggled")
        mainNav.style.top = show ? banner.offsetHeight + "px" : "0px";
      }
    }
  }
