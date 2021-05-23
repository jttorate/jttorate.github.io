/** Check if browser supported*/
if (!navigator.geolocation) {
	alert('Geolocation is not supported by your browser.');
}

//var logger_url = "http://localhost/heroku/jttorate-portfolio-logger/index.php?r=api/webservice&ws=1";
var logger_url = "https://jttorate-portfolio-logger.herokuapp.com/?r=api/webservice&ws=1";
var visitor_id;

/* CORS Anywhere */
$.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
        var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
        options.url = http + '//jt-cors-anywhere.herokuapp.com/' + options.url;
    }
});

fetch('https://ipapi.co/json/')
    .then(function (response) {
        return response.json();
    })
    .then(function ({ ip, city, region, country, country_name, continent_code, timezone, org }) {    
        /* Get current position by browser geolocation */
		navigator.geolocation.getCurrentPosition((position) => {
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
                                                    <ip_address xsi:type="xsd:string">' + ip + '</ip_address>\
                                                    <city xsi:type="xsd:string">' + city + '</city>\
                                                    <region xsi:type="xsd:string">' + region + '</region>\
                                                    <country xsi:type="xsd:string">' + country + '</country>\
                                                    <country_name xsi:type="xsd:string">' + country_name + '</country_name>\
                                                    <continent_code xsi:type="xsd:string">' + continent_code + '</continent_code>\
                                                    <latitude xsi:type="xsd:string">' + position.coords.latitude + '</latitude>\
                                                    <longitude xsi:type="xsd:string">' + position.coords.longitude + '</longitude>\
                                                    <timezone xsi:type="xsd:string">' + timezone + '</timezone>\
                                                    <network xsi:type="xsd:string">' + org + '</network>\
                                                </VisitorCriteria>\
                                            </urn:saveVisitorByCriteria>\
                                        </soapenv:Body>\
                                        </soapenv:Envelope>';
            
            $.ajax(logger_url, {
                contentType: "application/soap+xml; charset=utf-8",
                type: "POST",
                dataType: "xml",
                data: visitorSoapMessage,
                success: function (data) {
                    visitor_id = JSON.parse($(data).children().find('id').text());
                }
            });
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
