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