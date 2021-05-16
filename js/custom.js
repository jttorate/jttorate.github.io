/* your script go here */

/* Menu Toggle */
$("#navbarcollapse ul li .nav-link").click(function () {
    if ($(window).width() <= 991) {
        $("#navbar-toggler").click();
    }
});