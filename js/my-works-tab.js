$("#references-professional").click(function () {

    $("#references-personal").removeClass("active");
    $("#references-professional").addClass("active");

    $("#filter .active").removeClass("active"); /* Remove class active to an any filter */
    $("#filter .all").addClass("active"); /* Add class active to All filter */
    $("#filter .all a").trigger("click"); /* Trigger click in All filter */

    /* Show Filters */
    $("#filter .references-professional").each(function (i, obj) {
        $(obj).removeClass("hide");
        $(obj).closest("li").removeClass("no-margin");
    });

    /* Hide Filters */
    $("#filter .references-personal").each(function (i, obj) {
        if (!$(obj).hasClass("hide")) {
            $(obj).addClass("hide");
        }

        if (!$(obj).closest("li").addClass("no-margin")) {
            $(obj).closest("li").addClass("no-margin");
        }
    });

    /* Hide Thumbnails */
    $("#references-masonry .references-personal").each(function (i, obj) {
        if (!$(obj).hasClass("hide")) {
            $(obj).addClass("hide");
        }
    });

    /* Show Thumbnails */
    $("#references-masonry .references-professional").each(function (i, obj) {
        $(obj).removeClass("hide");
    });
});

$("#references-personal").click(function () {

    $("#references-professional").removeClass("active");
    $("#references-personal").addClass("active");

    $("#filter .active").removeClass("active"); /* Remove class active to an any filter */
    $("#filter .all").addClass("active"); /* Add class active to All filter */
    $("#filter .all a").trigger("click"); /* Trigger click in All filter */

    /* Show Filters */
    $("#filter .references-personal").each(function (i, obj) {
        $(obj).removeClass("hide");
        $(obj).closest("li").removeClass("no-margin");
    });

    /* Hide Filters */
    $("#filter .references-professional").each(function (i, obj) {
        if (!$(obj).hasClass("hide")) {
            $(obj).addClass("hide");
        }

        if (!$(obj).closest("li").addClass("no-margin")) {
            $(obj).closest("li").addClass("no-margin");
        }
    });

    /* Show Thumbnails */
    $("#references-masonry .references-personal").each(function (i, obj) {
        $(obj).removeClass("hide");
        $(obj).closest("li").removeClass("no-margin");
    });

    /* Hide Thumbnails */
    $("#references-masonry .references-professional").each(function (i, obj) {
        if (!$(obj).hasClass("hide")) {
            $(obj).addClass("hide");
        }
    });
});