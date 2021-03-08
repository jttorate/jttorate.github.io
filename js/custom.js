/* your script go here */

$(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });
    /* Scroll body to 0px on click */
    $('#back-to-top').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 400);
        return false;
    });
});

//var logger_url = "http://localhost/heroku/jttorate-portfolio-logger/index.php?r=api/webservice&ws=1";
var logger_url = "https://jttorate-portfolio-logger.herokuapp.com/?r=api/webservice&ws=1";

var visitor_id;

fetch('https://ipapi.co/json/')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {

        /* Get source app URL params if exist */
        var query_string = window.location.search.substring(1);
        var parsed_qs = parse_query_string(query_string);

        var source_app = typeof parsed_qs.app !== "undefined" ? parsed_qs.app : "global";

        /* Send visitor details */
        var visitorSoapMessage = '<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ApiControllerwsdl">\
                                        <soapenv:Header/>\
                                        <soapenv:Body>\
                                            <urn:saveVisitorByCriteria soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
                                                <VisitorCriteria xsi:type="urn:VisitorCriteria">\
                                                    <source_app_code xsi:type="xsd:string">' + source_app + '</source_app_code>\
                                                    <name xsi:type="xsd:string"></name>\
                                                    <ip_address xsi:type="xsd:string">' + data.ip + '</ip_address>\
                                                    <city xsi:type="xsd:string">' + data.city + '</city>\
                                                    <region xsi:type="xsd:string">' + data.region + '</region>\
                                                    <country xsi:type="xsd:string">' + data.country + '</country>\
                                                    <country_name xsi:type="xsd:string">' + data.country_name + '</country_name>\
                                                    <continent_code xsi:type="xsd:string">' + data.continent_code + '</continent_code>\
                                                    <latitude xsi:type="xsd:string">' + data.latitude + '</latitude>\
                                                    <longitude xsi:type="xsd:string">' + data.longitude + '</longitude>\
                                                    <timezone xsi:type="xsd:string">' + data.timezone + '</timezone>\
                                                    <network xsi:type="xsd:string">' + data.org + '</network>\
                                                </VisitorCriteria>\
                                            </urn:saveVisitorByCriteria>\
                                        </soapenv:Body>\
                                        </soapenv:Envelope>';

        /* CORS Anywhere */
        $.ajaxPrefilter(function (options) {
            if (options.crossDomain && jQuery.support.cors) {
                var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
                options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
            }
        });

        $.ajax(logger_url, {
            contentType: "application/soap+xml; charset=utf-8",
            type: "POST",
            dataType: "xml",
            data: visitorSoapMessage,
            success: function (data) {

                visitor_id = JSON.parse($(data).children().find('id').text());

                console.log(visitor_id);
            }
        });
    });

function parse_query_string(query) {

    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        /* If first entry with this name */
        if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
            /* If second entry with this name */
        } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
            /* If third or later entry with this name */
        } else {
            query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string;
}

function xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}

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

$("#contact-me-btn").click(function (e) {

    var validated = true;

    $("#contact-me-form [required=required]").each(function () {
        if ($(this).val() === "") {
            validated = false;
        }
    });

    if (validated) {

        e.preventDefault();

        /* Send contact_us details */
        var contactUsSoapMessage = '<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ApiControllerwsdl">\
                                    <soapenv:Header/>\
                                    <soapenv:Body>\
                                        <urn:saveContactUsByCriteria soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
                                            <ContactUsCriteria xsi:type="urn:ContactUsCriteria">\
                                               <visitor_id xsi:type="xsd:integer">' + visitor_id + '</visitor_id>\
                                               <first_name xsi:type="xsd:string">' + $("#contact-me-form [name=first_name]").val() + '</first_name>\
                                               <last_name xsi:type="xsd:string">' + $("#contact-me-form [name=last_name]").val() + '</last_name>\
                                               <email xsi:type="xsd:string">' + $("#contact-me-form [name=email]").val() + '</email>\
                                               <contact_no xsi:type="xsd:string">' + $("#contact-me-form [name=contact_no]").val() + '</contact_no>\
                                               <message xsi:type="xsd:string">' + $("#contact-me-form [name=message]").val() + '</message>\
                                            </ContactUsCriteria>\
                                         </urn:saveContactUsByCriteria>\
                                    </soapenv:Body>\
                                    </soapenv:Envelope>';

        $.ajax(logger_url, {
            contentType: "application/soap+xml; charset=utf-8",
            type: "POST",
            dataType: "xml",
            data: contactUsSoapMessage,
            beforeSend: function () {
                $("#contact-me-form :input").prop("disabled", true);
            },
            success: function (data) {
                $("#contact-me-form")[0].reset();
            },
            complete: function () {
                $("#contact-me-form :input").prop("disabled", false);
            }
        });
    }
});

window.addEventListener("load", function () {
    window.wpcc.init({
        "border": "thin",
        "colors": {
            "popup": {
                "background": "#f6f6f6",
                "text": "#000000",
                "border": "#555555"
            },
            "button": {
                "background": "#555555",
                "text": "#ffffff"
            }
        },
        "padding": "small",
        "margin": "small",
        "transparency": "5",
        "fontsize": "tiny",
        "content": {
            "href": "https://jttorate.info/cookie-policy"
        },
        "position": "bottom-right",
        "corners": "normal"
    })
});