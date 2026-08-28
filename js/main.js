// Bab Nazareth Barbershop — site interactions
function initSite() {
  // Mobile Nav Drawer Controller
  var navToggle = document.querySelector(".nav-toggle");
  var mobileDrawer = document.getElementById("mobileNavDrawer");
  var mobileClose = document.getElementById("mobileNavClose");
  var mobileDropdownBtn = document.querySelector(".mobile-dropdown-btn");

  function openMobileNav() {
    if (mobileDrawer) {
      mobileDrawer.classList.add("is-open");
      mobileDrawer.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }

  function closeMobileNav() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove("is-open");
      mobileDrawer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  if (navToggle) {
    navToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      openMobileNav();
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener("click", function (e) {
      e.stopPropagation();
      closeMobileNav();
    });
  }

  if (mobileDrawer) {
    mobileDrawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMobileNav();
      });
    });
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".mobile-dropdown-btn");
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      var parent = btn.closest(".has-mobile-dropdown");
      if (parent) {
        parent.classList.toggle("is-collapsed");
        var isExpanded = !parent.classList.contains("is-collapsed");
        btn.setAttribute("aria-expanded", isExpanded ? "true" : "false");
      }
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileDrawer && mobileDrawer.classList.contains("is-open")) {
      closeMobileNav();
    }
  });

  // Close only one FAQ item open at a time (accordion behavior)
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // Universal Carousel Controller (Services & Gallery)
  function initCarousel(wrapper) {
    var carousel = wrapper.querySelector(".services-carousel, .gallery-carousel");
    var prevBtn = wrapper.querySelector(".carousel-btn--prev");
    var nextBtn = wrapper.querySelector(".carousel-btn--next");
    var dotsContainer = wrapper.querySelector(".carousel-dots");

    if (!carousel) return;
    var cards = carousel.children;
    if (!cards || cards.length === 0) return;

    var currentIndex = 0;

    function getCardStep() {
      if (cards.length > 0) {
        return cards[0].offsetWidth + 20;
      }
      return 300;
    }

    function scrollToIndex(idx) {
      if (cards.length === 0) return;
      if (idx < 0) idx = 0;
      if (idx >= cards.length) idx = cards.length - 1;
      currentIndex = idx;

      cards[currentIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start"
      });
      updateDots();
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (currentIndex > 0) {
          scrollToIndex(currentIndex - 1);
        } else {
          carousel.scrollBy({ left: -getCardStep(), behavior: "smooth" });
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (currentIndex < cards.length - 1) {
          scrollToIndex(currentIndex + 1);
        } else {
          carousel.scrollBy({ left: getCardStep(), behavior: "smooth" });
        }
      });
    }

    function updateDots() {
      if (!dotsContainer) return;
      var dots = dotsContainer.querySelectorAll(".carousel-dot");
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === currentIndex);
      });
    }

    if (dotsContainer && cards.length > 0) {
      dotsContainer.innerHTML = "";
      for (var i = 0; i < cards.length; i++) {
        (function (idx) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.className = "carousel-dot" + (idx === 0 ? " is-active" : "");
          dot.setAttribute("aria-label", "Go to slide " + (idx + 1));
          dot.addEventListener("click", function (e) {
            e.preventDefault();
            scrollToIndex(idx);
          });
          dotsContainer.appendChild(dot);
        })(i);
      }

      carousel.addEventListener("scroll", function () {
        var scrollLeft = carousel.scrollLeft;
        var step = getCardStep();
        var activeIndex = Math.min(cards.length - 1, Math.max(0, Math.round(scrollLeft / step)));
        if (activeIndex !== currentIndex) {
          currentIndex = activeIndex;
          updateDots();
        }
      }, { passive: true });
    }
  }

  document.querySelectorAll(".services-carousel-wrapper, .gallery-carousel-wrapper").forEach(initCarousel);
}

// Ensure execution whether DOM is already parsed or still loading
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSite);
} else {
  initSite();
}
