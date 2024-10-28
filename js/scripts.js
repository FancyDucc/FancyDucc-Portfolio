/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {
    // Add the "scroll to top" button functionality
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    // Function to toggle the button visibility based on scroll position
    const toggleScrollToTopBtn = () => {
        if (window.scrollY > 50) {
            if (!scrollToTopBtn.classList.contains('show')) {
                scrollToTopBtn.classList.remove('hide');
                scrollToTopBtn.classList.add('show');
            }
        } else {
            if (scrollToTopBtn.classList.contains('show')) {
                scrollToTopBtn.classList.remove('show');
                scrollToTopBtn.classList.add('hide');
            }
        }
    };

    // Function to scroll to the top of the page
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Smooth scroll effect
        });
    };

    // Add an event listener for scrolling
    window.addEventListener("scroll", toggleScrollToTopBtn);

    // Add an event listener for the button click
    scrollToTopBtn.addEventListener("click", scrollToTop);

    // Initialize the button visibility on load
    toggleScrollToTopBtn();

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    // document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});
