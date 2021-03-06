// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function () {

    $('#btnSave').on('click', doAction);
    $('#btnSubmitVendor').on('click', doVendorAction);
    $('#btnFilter').on('click', populateTable);
    $('#btnVendorFilter').on('click', populateVendorTable);
    $('#btnAuditLog').on('click', populateAudit);
    $('#btnUploadFile').on('click', uploadFiles).prop("disabled", true);
    $('#btnAttachAuditLog').on('click', populateFilesAudit);
    $('#btnClear').on('click', clearInputs);
    $('#btnClearForm').on('click', clearAllInputs);
    $('#btnBESCreate').on('click', newEntryFromVendor);

    $(".bes_collapsed").hide() //JM 02282019 -> Allow to expand collapse fields

    //if BES id sent on URL then auto filter
    if ($("#filter_id").val()) {
        $("#btnFilter").click();
        setTimeout(function () {
            if ($('#userList button').length > 0) {
                $('#userList button').first().click();
            }
        }, 1000)
    }

    $(document).on('click', '#userList button', function () {
        getEdit($(this).val());
    });


    $(document).on('click', '#vendorList button', function () {
        getVendorEdit($(this).val());
    });
    /*
    Setup files drag and drop
    */

    if ($("#vendorFormHdr").html() && $("#vendorFormHdr").html().indexOf("Vendor") != -1) { // in vendor form
        $("body").css("overflow", "auto");
        validateVendorUrl();
    }
    if ($("#vendorExternalHdr").html() && $("#vendorExternalHdr").html().indexOf("Vendor") != -1) { // in vendor form
        $("body").css("overflow", "auto");
    }
    document.getElementById("filesDiv").ondragover = document.getElementById("filesDiv").ondragenter = function (evt) {
        evt.preventDefault();
    };

    document.getElementById("filesDiv").ondrop = function (evt) {
        // pretty simple -- but not for IE :(
        document.getElementById("attachment").files = evt.dataTransfer.files;
        evt.preventDefault();
        setFileName();

    };



});


// Functions =============================================================
function populateFilesAudit() {
    if ($('#rowid').html() == "**New**") {
        alert("No logs yet ");
        return;
    }
    $.getJSON('/auditFiles/' + $('#rowid').html(), function (data) {

        // Empty content string
        var tableContent = '';

        $.each(data, function () {
            tableContent += '<tr>';
            tableContent += '<td>' + this.fk_id + '</td>';
            tableContent += '<td>' + this.action + '</td>';
            tableContent += '<td>' + this.modified + '</td>';
            tableContent += '<td>' + this.username + '</td>';
            tableContent += '<td><pre>' + JSON.stringify(this.payload, null, 4) + '</pre></td>';
            tableContent += '</tr>';
        });

        $('#auditlog tbody').html(tableContent);
    });

    $('#logDiv.ui.longer.modal').modal('show');

}

function populateAudit() {
    if ($('#rowid').html() == "**New**") {
        alert("No logs yet ");
        return;
    }
    $.getJSON('/audit/' + $('#rowid').html(), function (data) {

        // Empty content string
        var tableContent = '';

        $.each(data, function () {
            tableContent += '<tr>';
            tableContent += '<td>' + this.fk_id + '</td>';
            tableContent += '<td>' + this.action + '</td>';
            tableContent += '<td>' + this.modified + '</td>';
            tableContent += '<td>' + this.username + '</td>';
            tableContent += '<td><pre>' + JSON.stringify(this.payload, null, 4) + '</pre></td>';
            tableContent += '</tr>';
        });

        $('#auditlog tbody').html(tableContent);
    });

    $('#logDiv.ui.longer.modal').modal('show');

}

// Fill table with data
function populateTable() {

    //build a list of filter values
    var filters = {
        'id': $('#filter_id').val(),
        'workflow': $('#filter_step').find(":selected").val(),
        'type': $('#filter_type').find(":selected").val(),
        'source': $('#filter_source').val(),
        'vendor': $('#filter_vendor').val(),
        'bank': $('#filter_bank').val()
    }

    //drop any filters that are blank
    Object.keys(filters).forEach(key => filters[key] === '' && delete filters[key]);

    console.log(JSON.stringify(filters));

    var queryString = Object.keys(filters).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(filters[key]);
    }).join('&');

    if (queryString !== '') {
        queryString = '?' + queryString;
    };

    console.log('queryString:' + queryString);

    $.getJSON('/payinfo/list' + queryString, function (data) {

        // Empty content string
        var tableContent = '';

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function () {
            tableContent += '<tr id="row_' + this.id + '">'
            tableContent += '<td><button class="button is-primary" value="' + this.id + '">' + this.id + '</button></td>';
            tableContent += '<td>' + this.wfstep_name + '</td>';
            tableContent += '<td>' + this.paytype + '</td>';
            tableContent += '<td class="bes_collapsed">' + this.achsec + '</td>';
            tableContent += '<td>' + ((this.je_eligible) ? this.je_eligible : 'no') + '</td>';
            tableContent += '<td class="bes_collapsed">' + this.sourcesystem + '</td>';
            tableContent += '<td>' + this.vendorid + '</td>';
            tableContent += '<td>' + this.payeename + '</td>';
            tableContent += '<td>' + this.payeeaddress + '</td>';
            tableContent += '<td>' + this.payeecity + '</td>';
            tableContent += '<td>' + this.payeestate + '</td>';
            tableContent += '<td>' + this.payeezip + '</td>';
            tableContent += '<td>' + this.payeecountry + '</td>';
            tableContent += '<td class="bes_collapsed">' + this.forfurthercredit + '</td>';
            tableContent += '<td>' + this.bankname + '</td>';
            tableContent += '<td>' + this.bankaddress + '</td>';
            tableContent += '<td>' + this.bankcity + '</td>';
            tableContent += '<td>' + this.bankstate + '</td>';
            tableContent += '<td>' + this.bankzip + '</td>';
            tableContent += '<td>' + this.bankcountry + '</td>';
            tableContent += '<td>' + this.routing + '</td>';
            tableContent += '<td>' + this.account + '</td>';
            tableContent += '<td>' + this.swift + '</td>';
            tableContent += '<td class="bes_collapsed">' + this.interbankname + '</td>';
            tableContent += '<td class="bes_collapsed">' + this.interbankaddress + '</td>';
            tableContent += '<td class="bes_collapsed">' + this.interbankcity + '</td>';
            tableContent += '<td class="bes_collapsed">' + this.interbankstate + '</td>';
            tableContent += '<td class="bes_collapsed">' + this.interbankzip + '</td>';
            tableContent += '<td class="bes_collapsed">' + this.interbankcountry + '</td>';
            tableContent += '<td class="bes_collapsed">' + this.interrouting + '</td>';
            tableContent += '<td class="bes_collapsed">' + this.interswift + '</td>';
            tableContent += '<td>' + this.notes + '</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList tbody').html(tableContent);
        if ($("#expand_collapse_lbl").attr("bes_state") === 'collapsed') {
            $(".bes_collapsed").hide();
        }
    });

};


/**
 * JM 02282019 Added expand/collapsed tool
 * */

function expand_collapse() {
    if ($("#expand_collapse_lbl").attr("bes_state") === 'collapsed') {
        //expand
        $("#expand_collapse_i").removeClass('fa-expand').addClass('fa-compress');
        $("#expand_collapse_lbl").text("Collapse").attr('bstate', 'expanded');
        $(".bes_collapsed").show();
    }
    else {
        //collapse
        $("#expand_collapse_i").removeClass('fa-compress').addClass('fa-expand');
        $("#expand_collapse_lbl").text("Expand").attr('bstate', 'collapsed');
        $(".bes_collapsed").hide();
    }
}



// Get record to edit
function getEdit(id) {
    //clear pending attachments
    $("#attachment")[0].value = "";
    $("#btnClear").hide();
    //$("#userList button").removeClass('is-danger').addClass('is-primary');
    $(".is-danger").removeClass('is-danger');
    $("#row_" + id + " button") /*.removeClass('is-primary')*/ .addClass('is-danger');
    setFileName();
    $.getJSON('/payinfo/' + id, function (data) {

        $('#rowid').html(data.obj.id);
        $('#wfstatus').html(data.obj.wfstatus);
        $('#paytype').val(data.obj.paytype);
        $('#achsec').val(data.obj.achsec);
        $("#je_eligible").val(data.obj.je_eligible);
        $('#sourcesystem').val(data.obj.sourcesystem);
        $('#vendorid').val(data.obj.vendorid);
        $('#payeename').val(data.obj.payeename);
        $('#payeeaddress').val(data.obj.payeeaddress);
        $('#payeecity').val(data.obj.payeecity);
        $('#payeestate').val(data.obj.payeestate);
        $('#payeezip').val(data.obj.payeezip);
        $('#payeecountry').val(data.obj.payeecountry);
        $('#forfurthercredit').val(data.obj.forfurthercredit);
        $('#bankname').val(data.obj.bankname);
        $('#bankaddress').val(data.obj.bankaddress);
        $('#bankcity').val(data.obj.bankcity);
        $('#bankstate').val(data.obj.bankstate);
        $('#bankzip').val(data.obj.bankzip);
        $('#bankcountry').val(data.obj.bankcountry);
        $('#routing').val(data.obj.routing);
        $('#account').val(data.obj.account);
        $('#swift').val(data.obj.swift);
        $('#interbankname').val(data.obj.interbankname);
        $('#interbankaddress').val(data.obj.interbankaddress);
        $('#interbankcity').val(data.obj.interbankcity);
        $('#interbankstate').val(data.obj.interbankstate);
        $('#interbankzip').val(data.obj.interbankzip);
        $('#interbankcountry').val(data.obj.interbankcountry);
        $('#interrouting').val(data.obj.interrouting);
        $('#interswift').val(data.obj.interswift);
        $('#notes').val(data.obj.notes);

        $("#rightbar").show(); //Allow users to show/hide details panel

        //build a list of available valid steps and output to the dropdown
        var steps = '';
        data.nextsteps.forEach(item => {
            steps += '<option value="' + item.id + '">' + item.name + '</li>';
        });
        $('#wf_stepnext').html(steps);
        $('#wf_name').html(data.currentstep.wfname);
        $('#wf_currentstep').html(data.currentstep.name);

        //visually disable the fields when input will not be saved
        if ($('#wf_currentstep').html() !== 'Entry') {
            $('#payinfofields').find('input').attr('readonly', true).css("background-color", "#f5f5f5"); //mimic disabled style while allowing dom events
            $('#payinfofields').find('select').attr('disabled', true);
        }
        else {
            $('#payinfofields').find('input').removeAttr('readonly').css("background-color", "white"); //mimic disabled style while allowing dom events
            $('#payinfofields').find('select').removeAttr('disabled');
        }

        //set available actions for the record
        $('#action').html(`
      <option value="New">New</option>
      <option value="Edit" selected>Edit</option>
      <option value="Delete">Delete</option>
    `);

        //clear any data entry in the workflow notes field
        $('#wf_notes').val('');

        var stephistory = '';
        data.stephistory.forEach(item => {
            stephistory += '<tr>';
            stephistory += '<td>' + item.name + '</td>';
            stephistory += '<td>' + item.username + '</td>';
            stephistory += '<td>' + item.modified + '</td>';
            stephistory += '<td>' + item.notes + '</td>';
            stephistory += '</tr>';
        });

        $('#wf_history tbody').html(stephistory);

        //load attachments
        var attachmentsHTML = '';
        data.attachments.forEach(item => {
            attachmentsHTML += '<tr>';
            attachmentsHTML += '<td>' + item.filename.substring(item.filename.indexOf('_', 5) + 1) + '</td>';
            attachmentsHTML += '<td>' + item.dateadded + '</td>';
            attachmentsHTML += '<td><a href="/file/' + item.filename + '" target="_blank"><button class="button is-info is-rounded" type="button">View</button></a>';
            attachmentsHTML += '<td><button class="button is-info is-rounded" type="button" onclick="removeAttachment(\'' + data.obj.id + '\',\'' + item.filename + '\')">Remove</button></td>';
            attachmentsHTML += '</tr>';
        });
        $('#attachmentsTable tbody').html(attachmentsHTML);

    });

};


/***
 * JM 02/13/2019 Call delete attachment API
 * */

function removeAttachment(id, filename) {
    if (!confirm("Are you sure you want to delete the file?")) {
        return; //do nothing
    }
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/attach/" + id + "/" + filename,
        "method": "DELETE",
        "contentType": 'application/json',
        "headers": {
            "Cache-Control": "no-cache",
        }
    }

    $.ajax(settings).done(function (response) {
        $("#btnUploadFile, #attachment").prop("disabled", false);
        $("#overlay").hide();
        console.log(response);
        console.log(response.msg);
        //response = JSON.parse(response);
        if (response.msg === '') {
            alert('File was removed');
            getEdit(id);
        }
        else {
            alert('Attachment Error: ' + response.msg);
        }
    }).fail(function (err) {
        alert('Unable to delete files: ' + ((err.responseJSON.msg) ? err.responseJSON.msg : 'Unauthorized'));
    })
}

// Write
function doAction(event) {
    event.preventDefault();


    //$('.is-danger') /*.addClass('is-info')*/ .removeClass('is-danger'); //clear error warnings
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    /*
    $('#payinfofields input').each(function(index, val) {
      if($(this).val() === '') { errorCount++; }
    });
    */

    // Check and make sure errorCount's still at zero
    if (errorCount === 0) {

        // Assemble object to save
        var newUser = {
            'paytype': $('#paytype').find(":selected").val(),
            'achsec': $('#achsec').find(":selected").val(),
            'sourcesystem': $('#sourcesystem').val(),
            'vendorid': $('#vendorid').val(),
            'payeename': $('#payeename').val(),
            'payeeaddress': $('#payeeaddress').val(),
            'payeecity': $('#payeecity').val(),
            'payeestate': $('#payeestate').val(),
            'payeezip': $('#payeezip').val(),
            'payeecountry': $('#payeecountry').val(),
            'forfurthercredit': $('#forfurthercredit').val(),
            'bankname': $('#bankname').val(),
            'bankaddress': $('#bankaddress').val(),
            'bankcity': $('#bankcity').val(),
            'bankstate': $('#bankstate').val(),
            'bankzip': $('#bankzip').val(),
            'bankcountry': $('#bankcountry').val(),
            'routing': $('#routing').val(),
            'account': $('#account').val(),
            'swift': $('#swift').val(),
            'interbankname': $('#interbankname').val(),
            'interbankaddress': $('#interbankaddress').val(),
            'interbankcity': $('#interbankcity').val(),
            'interbankstate': $('#interbankstate').val(),
            'interbankzip': $('#interbankzip').val(),
            'interbankcountry': $('#interbankcountry').val(),
            'interrouting': $('#interrouting').val(),
            'interswift': $('#interswift').val(),
            'notes': $('#notes').val(),
            'wf_stepnext': $('#wf_stepnext').val(),
            'wf_notes': $('#wf_notes').val(),
            'vendor_id': ($("#vendorId") ? $("#vendorId").val() : ''),
            'je_eligible': $('#je_eligible').val()
        }

        //alert(JSON.stringify(newUser));
        //alert($('#paytype').find(":selected").val());

        let action = $('#action').find(":selected").val();

        if (action === 'Edit') {
            var object_id = $('#rowid').html();
            $.ajax({
                url: '/payinfo/' + object_id,
                type: 'PUT',
                data: JSON.stringify(newUser),
                contentType: 'application/json',
            }).done(function (response) {

                //check for payload validation errors
                if (response.validationErrors) {
                    var errorHTML = "<div>";
                    response.validationErrors.forEach((field) => {
                        $("#" + field.field) /*.removeClass('is-info')*/ .addClass('is-danger');
                        errorHTML += 'Field: ' + field.field + '<ul><li> Error: ' + field.msg + '</li></ul>';
                    })
                    errorHTML += "</div>";
                    $("#notificationDiv .header").html("Input Validation Errors");
                    $("#notificationDiv .content").html(errorHTML);
                    $("#notificationDiv").modal("show");
                }
                // Check for successful (blank) response
                else if (response.msg === '') {
                    if ($("#attachment")[0].files.length > 0) {
                        attachFiles($('#rowid').html(), 'edit');
                        $('input .is-danger') /*.addClass('is-info')*/ .removeClass('is-danger'); //clear error warnings
                        //populateTable();
                    }
                    else {
                        //reload the datatable and the record info in case of workflow change
                        $('input .is-danger') /*.addClass('is-info')*/ .removeClass('is-danger'); //clear error warnings
                        getEdit(object_id);
                        populateTable();
                    }

                }
                else {
                    // If something goes wrong, alert the error message that our service returned
                    alert('Error: ' + response.msg);
                }
            });
        }
        else if (action === 'New') {
            $.ajax({
                url: '/payinfo/new',
                type: 'POST',
                data: JSON.stringify(newUser),
                contentType: 'application/json',

            }).done(function (response) {

                //check for validation errors
                if (response.validationErrors) {
                    var errorHTML = "<div>";
                    response.validationErrors.forEach((field) => {
                        $("#" + field.field).removeClass('is-info').addClass('is-danger');
                        errorHTML += 'Field: ' + field.field + '<ul><li> Error: ' + field.msg + '</li></ul>';
                    })
                    errorHTML += "</div>";
                    $("#notificationDiv .header").html("Input Validation Errors");
                    $("#notificationDiv .content").html(errorHTML);
                    $("#notificationDiv").modal("show");
                }
                // Check for successful (blank) response
                else if (response.msg === '') {

                    // Clear the form inputs
                    //$('#payinfofields input').val('');

                    //fields saved, save attachments if any
                    if ($("#attachment")[0].files.length > 0) {
                        attachFiles(response.id, 'new');
                        //populateTable();
                    }
                    else {
                        //no files attached
                        if ($("#vendorId").val() === undefined) {
                            populateTable();
                        }
                        else {
                            alert('BES ' + response.id + ' was created');
                        }
                    }
                    // Update the table

                }
                else {
                    // If something goes wrong, alert the error message that our service returned
                    alert('Error: ' + response.msg);
                }
            });
        }
        else if (action === 'Delete') {
            $.ajax({
                url: '/payinfo/' + $('#rowid').html(),
                type: 'DELETE',
                contentType: 'application/json',
            }).done(function (response) {
                // Check for successful (blank) response
                if (response.msg === '') {

                    // Clear the form inputs
                    $('#payinfofields input').val('');
                    $('#rowid').html('');
                    $('#action').html(`<option value="New">New</option>`);

                    //clear the workflow history
                    $('#wf_history tbody').html('');

                    // Update the table
                    populateTable();
                }
                else {
                    // If something goes wrong, alert the error message that our service returned
                    alert('Error: ' + response.msg);
                }
            });
        };
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};


/*
Export to CSV option  - Jorge Medina 12/2/2018
*/
function saveCSV(tableId) {
    if (tableId.indexOf('Hdn') != -1)
        $("#" + tableId).show();
    var csv = $("#" + tableId).table2CSV({
        delivery: 'value'
    });
    if (tableId.indexOf('Hdn') != -1)
        $("#" + tableId).hide();

    var filename = "BES.csv";
    var type = "text/csv";
    var file = new Blob([csv], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = 'data:text/csv;charset=UTF-8,' +
            encodeURIComponent(csv);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
};

/**
 * Jorge Medina : 12/03/2018 - Helper function to save attachment by ID
 *
 */
function attachFiles(id, action) {
    if ($("#attachment")[0].files.length < 1) {
        alert('no files to upload');
        return;
    }
    $("#btnUploadFile, #attachment").prop("disabled", true);
    $("#overlay").click(function () {
        // do nothing
    });
    $("#overlay").show();
    var data = new FormData();
    for (var i = 0; i < $("#attachment")[0].files.length; i++) {
        data.append("file_" + i, $("#attachment")[0].files[i]);
    }
    data.append("id", id);
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/attach/",
        "method": "POST",
        "headers": {
            "Cache-Control": "no-cache",
        },
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": data
    }

    $.ajax(settings).done(function (response) {
        $("#btnUploadFile, #attachment").prop("disabled", false);
        $("#overlay").hide();
        response = JSON.parse(response);
        if (response.msg === '') {
            $("#btnUploadFile").prop("disabled", true);
            if (action === "edit")
                getEdit(id);
            else if (action !== "none") {
                populateTable();
                //alert("BES " + id + " was created");
            }
            $("#attachment")[0].value = "";
            setFileName();
        }
        else {
            alert('Attachment Error: ' + response.msg);
        }
    }).fail(function (err) {
        alert('Unable to attach files ' + err);
        $("#btnUploadFile, #attachment").prop("disabled", false);
        $("#overlay").hide();
    })
}

/*
Export to CSV end
*/

/**
 *  Jorge Medina (12/03/2018) -> Added method to hide divs on demand in order to improve UI user customizations
 *
 */

function hideDiv(divId) {
    $("#userList button").removeClass('is-danger').addClass('is-primary');
    $("#" + divId).hide();
}

/**
 *  Jorge Medina (12/03/2018) -> Added method to show div full screen in order to improve UI user customizations
 *
 */


function showFullDiv(divId) {
    $("#" + divId).css("width", "100%").show();
    $("#rightMaxim").hide();
    $("#rightMin").show();
}

/**
 *  Jorge Medina (12/03/2018) -> Added method to show div full in right paner in order to improve UI user customizations
 *
 */

function showMinDiv(divId) {
    $("#" + divId).css("width", "30%").show();
    $("#rightMaxim").show();
    $("#rightMin").hide();
}


/**
 * Jorge Medina - 12/03/2018 - Set File Upload descriptor
 */

function setFileName() {
    var validextensions = "pdf,jpg,jpeg,bmp,xls,doc,tiff,tif,gif,docx,xlsx,txt,msg,xlsm,xlsb,zip,ppt,pptx,png";
    $("#uploadFileName").html("");
    var filesToUpload = $("#attachment")[0].files;
    if (filesToUpload.length > 0) {
        for (var i = 0; i < filesToUpload.length; i++) {
            if (validextensions.indexOf(filesToUpload[i].name.substring(filesToUpload[i].name.lastIndexOf(".") + 1)) != -1) {
                $("#uploadFileName").html($("#uploadFileName").html() + " " + filesToUpload[i].name);
                if ($('#rowid').html() !== "**New**")
                    $("#btnUploadFile").prop("disabled", false);
            }
            else {
                alert("Invalid file extension found: " + filesToUpload[i].name.substring(filesToUpload[i].name.lastIndexOf(".") + 1));
                $("#attachment")[0].value = ""; //remove all files
                $("#uploadFileName").html("");

            }
        }
    }
    else
        $("#uploadFileName").html("");
}


/**
 * Jorge Medina 12/06/2018 Separate method to directly upload files
 *
 * */

function uploadFiles() {
    if ($('#rowid').html() == "**New**") {
        alert("Files will be uploaded when you save.");
        return;
    }
    //EFT already submitted, upload using BES ID.
    attachFiles($('#rowid').html(), 'edit');


}

function newEntry() {
    $("#rightbar").html('<h3 id="recordInfoHdr">Record Info</h3>   <button class="delete is-danger" id="rightClose" aria-label="close" onclick="hideDiv(\'rightbar\')"></button>     <span class="icon" id="rightMaxim" onclick="showFullDiv(\'rightbar\');">  <i class="fa fa-arrows-alt" aria-hidden="true"></i></span> <span class="icon" id="rightMin" onclick="showMinDiv(\'rightbar\');">  <i class="fa fa-window-minimize" aria-hidden="true"></i></span>  <table class="ui table compact" id="payinfofields">    <thead>      <tr>        <th>Setting</th>        <th>Value</th>      </tr>    </thead>    <tbody>      <tr>        <td>BES ID</td>        <td id="rowid">**New**</td>      </tr>      <tr>        <td>Workflow Status</td>        <td id="wfstatus"></td>      </tr>      <tr>        <td>Pay Type</td>        <td>             <div class="select is-info">            <select name="paytype" id="paytype" onclick="inputShow(this)">              <option value="ACH">ACH</option>              <option value="Wire">Wire</option>            </select>            </div>        </td>      </tr>      <tr>        <td>ACH SEC</td>        <td>             <div class="select is-info">            <select name="achsec" id="achsec" onclick="inputShow(this)">              <option value="CCD">CCD</option>              <option value="PPD">PPD</option>            </select>            </div>        </td>      </tr><tr> <td>JE eligible?</td>    <td><div class="select is-info"><select name="je_eligible" id="je_eligible" onclick="inputShow(this)"><option value=""></option><option value="yes">Yes</option><option value="no">No</option></select></div></td></tr>      <tr>        <td>Source System</td>        <td><input type="text" value="EXAMPLE" id="sourcesystem" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>System Payee ID</td>        <td><input type="text" value="V000000" id="vendorid" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary Name</td>        <td><input type="text" value="VENDOR NAME HERE" id="payeename" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary Address</td>        <td><input type="text" value="123 MAIN STREET" id="payeeaddress" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary City</td>        <td><input type="text" value="ANYWHERE" id="payeecity" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary State/Province</td>        <td><input type="text" value="CA" id="payeestate" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary ZIP/Postal</td>        <td><input type="text" value="92000" id="payeezip" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary Country</td>        <td><input type="text" value="US" id="payeecountry" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>For Further Credit To</td>        <td><input type="text" value="SOMEONE ELSE" id="forfurthercredit" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank Name</td>        <td><input type="text" value="INSTITUTION NAME HERE" id="bankname" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank Address</td>        <td><input type="text" value="9000 WALL STREET" id="bankaddress" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank City</td>        <td><input type="text" value="SOMEWHERESVILLE" id="bankcity" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank State/Province</td>        <td><input type="text" value="NY" id="bankstate" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank ZIP/Postal</td>        <td><input type="text" value="10101" id="bankzip" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank Country</td>        <td><input type="text" value="US" id="bankcountry" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Routing Number</td>        <td><input type="text" value="123456789" id="routing" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Account Number</td>        <td><input type="text" value="1000200030004000" id="account" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Swift</td>        <td><input type="text" value="ABCDEFGHIJK" id="swift" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank Name</td>        <td><input type="text" value="INTERMED BANK" id="interbankname" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank Address</td>        <td><input type="text" value="5YJ INTERNATIONAL ST" id="interbankaddress" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank City</td>        <td><input type="text" value="SOMEWHERE" id="interbankcity" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank State/Province</td>        <td><input type="text" value="NS" id="interbankstate" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank ZIP/Postal</td>        <td><input type="text" value="XJY5YA" id="interbankzip" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank Country</td>        <td><input type="text" value="CA" id="interbankcountry" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank Routing</td>        <td><input type="text" value="ABC123456XYZ" id="interrouting" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank Swift</td>        <td><input type="text" value="ABABABABABA" id="interswift" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Validation Notes</td>        <td><input type="text" value="Some notes here" id="notes" class="input is-info" onclick="inputShow(this)"/></td>      </tr>    </tbody>  </table> <div><button type="button" id="btnClear" class="button is-info">Clear Text</button></div> <table class="ui table compact collapsing" id="payinfoactions">    <tbody>        <tr>          <td>            Action          </td>          <td>            <div class="select is-info">                <select name="action" id="action">                  <option value="New">New</option>                </select>            </div>          </td>          <td><button type="button" id="btnAuditLog" class="button is-info">Show Audit Log</button></td>        </tr>    </tbody>  </table><table class="ui table compact collapsing" id="attachmentsTable">    <thead>      <tr>        <th>Filename</th>        <th>Date</th>        <th>View</th> <th>Delete</th>     </tr>    </thead>    <tbody></tbody>    </table> <div class="file is-boxed is-primary" id="filesDiv">  <label class="file-label">    <input class="file-input" type="file" name="attachment" id="attachment" onchange="setFileName();" multiple>    <span class="file-cta">      <span class="file-icon">        <i class="fas fa-upload"></i>      </span>      <span class="file-label">Select File to Upload      </span>    </span>      <span class="file-name" id="uploadFileName">    </span>  </label></div><button type="button" id="btnUploadFile" class="button is-info">Upload File</button> <button type="button" id="btnAttachAuditLog" class="button is-info">Show File Log</button> <table class="ui table compact collapsing" id="workflow">    <tbody>      <tr>        <td>Workflow</td>        <td id="wf_name"></td>      </tr>      <tr>        <td>Current Step</td>        <td id="wf_currentstep"></td>      </tr>      <tr>        <td>          Next Step        </td>        <td>          <div class="select is-info">           <select name="wf_stepnext" id="wf_stepnext">           </select>         </div>        </td>      </tr>      <tr>        <td>WF Notes</td>        <td><input type="text" value="" id="wf_notes" class="input is-info "/></td>      </tr>      <tr>        <td>          <button type="button" id="btnSave" class="button is-info">Save</button>        </td>      </tr>    </tbody>  <table class="ui table compact collapsing" id="wf_history">    <thead>      <tr>        <th>Step</th>        <th>User</th>        <th>Date</th>        <th>Notes</th>      </tr>    </thead>    <tbody></tbody>  </table>').show();
    $('#btnSave').on('click', doAction);
    $('#btnFilter').on('click', populateTable);
    $('#btnAuditLog').on('click', populateAudit);
    $('#btnAttachAuditLog').on('click', populateFilesAudit);
    $('#btnUploadFile').on('click', uploadFiles).prop("disabled", true);
    $('#btnClear').on('click', clearInputs);
    $("#userList button").removeClass('is-danger').addClass('is-primary');


    $("#btnClear").show();
    $(document).on('click', '#userList button', function () {
        getEdit($(this).val());
    });

    /*
    Setup files drag and drop
    */

    document.getElementById("filesDiv").ondragover = document.getElementById("filesDiv").ondragenter = function (evt) {
        evt.preventDefault();
    };

    document.getElementById("filesDiv").ondrop = function (evt) {
        // pretty simple -- but not for IE :(
        document.getElementById("attachment").files = evt.dataTransfer.files;
        evt.preventDefault();
        setFileName();

    };
}

/**
 * Jorge Medina 12/06/2018 Fix rendering issues on Chrome.
 * Semantic UI CSS seem to have a bug in Chrome after a modal window is invoked. It causes input elements to hide on click.
 * Workaround is to re-draw parent elemement to fix style.
 * */
function inputShow(elem) {
    if (elem.tagName === 'INPUT') {
        $('#rightbar').hide().show(0);
    }
}


function hideModal(divId) {
    $("#" + divId).removeClass('is-active');

}

function clearInputs() {
    $("#rightbar .input").val("");
}

function clearAllInputs() {
    $(".input").val("");
}


/**
 * Jorge Medina 12/12/2018 Vendor Forms Helper functions
 * */
function generateVendorEFTUrl() {
    var str = "https://treasurynode-test-innersphere.c9users.io/vendorform";

    $.getJSON('/vendorEFTURL', function (data) {

        if (data.msg !== '') {
            alert('Unable to generate vendor url');
            return;
        }
        $("#clipboard").val(data.url.toString());

        $("#clipboard")[0].select();
        document.execCommand('copy');
        alert('URL: ' + $("#clipboard").val());

    })

}

/**
 * Jorge Medina 12/12/2018 Vendor Forms Helper functions
 * */
function generateVendorUrl() {
    var str = "https://treasurynode-test-innersphere.c9users.io/vendorexternal";

    $.getJSON('/vendorURL', function (data) {

        if (data.msg !== '') {
            alert('Unable to generate vendor url');
            return;
        }
        $("#clipboard").val(data.url.toString());

        $("#clipboard")[0].select();
        document.execCommand('copy');
        alert('URL: ' + $("#clipboard").val());

    })

}



/**
 * ------------------------------
 * Vendor Form JS
 * */

function doVendorAction(event) {
    event.preventDefault();


    $('.is-danger').addClass('is-info').removeClass('is-danger'); //clear error warnings

    // Assemble object to save
    var newVendor = {
        'legalentityname': $('#legalentityname').val(),
        'address1': $('#address1').val(),
        'address2': $('#address2').val(),
        'city': $('#city').val(),
        'state': $('#state').val(),
        'zip': $('#zip').val(),
        'country': $('#country').val(),
        'bankname': $('#bankname').val(),
        'bankaddress': $('#bankaddress').val(),
        'bankname': $('#bankname').val(),
        'bankcity': $('#bankcity').val(),
        'bankstate': $('#bankstate').val(),
        'bankzip': $('#bankzip').val(),
        'bankcountry': $('#bankcountry').val(),
        'routing': $('#routing').val(),
        'account': $('#account').val(),
        'swift': $('#swift').val(),
        'interbankname': $('#bankname').val(),
        'interbankaddress': $('#interbankaddress').val(),
        'interbankname': $('#interbankname').val(),
        'interbankcity': $('#interbankcity').val(),
        'interbankstate': $('#interbankstate').val(),
        'interbankzip': $('#interbankzip').val(),
        'interbankcountry': $('#interbankcountry').val(),
        'interrouting': $('#interbankcountry').val(),
        'interswift': $('#interswift').val(),
        'token': $('#token').val()
    };

    $.ajax({
        url: '/vendor/new',
        type: 'POST',
        data: JSON.stringify(newVendor),
        contentType: 'application/json',

    }).done(function (response) {

        //check for validation errors
        if (response.validationErrors) {
            var errorHTML = "<div>";
            response.validationErrors.forEach((field) => {
                $("#" + field.field).removeClass('is-info').addClass('is-danger');
                errorHTML += 'Field: ' + field.field + '<ul><li> Error: ' + field.msg + '</li></ul>';
            })
            errorHTML += "</div>";
            $("#notificationDiv .header").html("Input Validation Errors");
            $("#notificationDiv .content").html(errorHTML);
            $("#notificationDiv").modal("show");
        }
        // Check for successful (blank) response
        else if (response.msg === '') {
            attachVendorFiles(response.id);

        }
        else {
            // If something goes wrong, alert the error message that our service returned
            $("#notificationDiv .header").html("Error");
            $("#notificationDiv .content").html("<p>Error while submitting form: " + response.msg + "</p>");
            $("#notificationDiv").modal("show");
        }
    });
};


/**
 * Populate Vendor data
 * */
function populateVendorTable() {

    //build a list of filter values
    var filters = {
        'id': $('#vendor_id').val(),
        'legalentityname': $('#legal_entity_name').val()
    }

    //drop any filters that are blank
    Object.keys(filters).forEach(key => filters[key] === '' && delete filters[key]);

    console.log(JSON.stringify(filters));

    var queryString = Object.keys(filters).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(filters[key]);
    }).join('&');

    if (queryString !== '') {
        queryString = '?' + queryString;
    };

    console.log('queryString:' + queryString);

    $.getJSON('/vendor/list' + queryString, function (data) {

        // Empty content string
        var tableContent = '';

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function () {
            tableContent += '<tr id="vendor_' + this.id + '">'
            tableContent += '<td><button class="button is-primary" value="' + this.id + '">' + this.id + '</button></td>';
            tableContent += '<td>' + this.legalentityname + '</td>';
            tableContent += '<td>' + this.address1 + '</td>';
            tableContent += '<td>' + this.address2 + '</td>';
            tableContent += '<td>' + this.city + '</td>';
            tableContent += '<td>' + this.state + '</td>';
            tableContent += '<td>' + this.zip + '</td>';
            tableContent += '<td>' + this.country + '</td>';
            tableContent += '<td>' + this.bankname + '</td>';
            tableContent += '<td>' + this.bankaddress + '</td>';
            tableContent += '<td>' + this.bankcity + '</td>';
            tableContent += '<td>' + this.bankstate + '</td>';
            tableContent += '<td>' + this.bankzip + '</td>';
            tableContent += '<td>' + this.bankcountry + '</td>';
            tableContent += '<td>' + this.routing + '</td>';
            tableContent += '<td>' + this.account + '</td>';
            tableContent += '<td>' + this.swift + '</td>';
            tableContent += '<td>' + this.interbankname + '</td>';
            tableContent += '<td>' + this.interbankaddress + '</td>';
            tableContent += '<td>' + this.interbankcity + '</td>';
            tableContent += '<td>' + this.interbankstate + '</td>';
            tableContent += '<td>' + this.interbankzip + '</td>';
            tableContent += '<td>' + this.interbankcountry + '</td>';
            tableContent += '<td>' + this.interrouting + '</td>';
            tableContent += '<td>' + this.interswift + '</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#vendorList tbody').html(tableContent);
    });

};


// Get record to edit
function getVendorEdit(id) {
    $("#rightbar").html('<h3 id="recordInfoHdr">Vendor Info</h3>  <button class="delete is-danger" id="rightClose" aria-label="close" onclick="hideDiv(\"rightbar\")"></button>  <span class="icon" id="rightMaxim" onclick="showFullDiv(\"rightbar\");">   <i class="fa fa-arrows-alt" aria-hidden="true"></i> </span>  <span class="icon" id="rightMin" onclick="showMinDiv(\"rightbar\");">   <i class="fa fa-window-minimize" aria-hidden="true"></i> </span>   <table class="ui table compact" id="payinfofields">     <thead>  <tr>    <th>Setting</th>    <th>Value</th>  </tr>     </thead>     <tbody>  <tr>    <td>Vendor ID</td>    <td id="vendorid"></td>  </tr>  <tr>    <td>Legal Entity Name</td>    <td id="legalentityname"></td>  </tr>  <tr>    <td>Address Line 1</td>    <td id="address1"></td>  </tr>  <tr>    <td>Address Line 2</td>    <td id="address2"></td>  </tr>  <tr>    <td>City</td>    <td id="city"></td>  </tr>  <tr>    <td>State</td>    <td id="state"></td>  </tr>  <tr>    <td>Zip Code</td>    <td id="zip"></td>  </tr>  <tr>    <td>Country</td>    <td id="country"></td>  </tr>  <tr>    <td>Bank Name</td>    <td id="bankname"></td>  </tr>  <tr>    <td>Bank Address</td>    <td id="bankaddress"></td>  </tr>  <tr>    <td>Bank City</td>    <td id="bankcity"></td>  </tr>  <tr>    <td>Bank State/Province</td>    <td id="bankstate"></td>  </tr>  <tr>    <td>Bank ZIP/Postal</td>    <td id="bankzip"></td>  </tr>  <tr>    <td>Bank Country</td>    <td id="bankcountry"></td>  </tr>  <tr>    <td>Routing Number</td>    <td id="routing"></td>  </tr>  <tr>    <td>Account Number</td>    <td id="account"></td>  </tr>  <tr>    <td>Swift</td>    <td id="swift"></td>  </tr>  <tr>      <td>Intermediary Bank Name</td>      <td id="interbankname"></td>    </tr>    <tr>      <td>Intermediary Bank Address</td>      <td id="interbankaddress"></td>    </tr>    <tr>      <td>Intermediary Bank City</td>      <td id="interbankcity"></td>    </tr>    <tr>      <td>Intermediary Bank State/Province</td>      <td id="interbankstate"></td>    </tr>    <tr>      <td>Intermediary Bank ZIP/Postal</td>      <td id="interbankzip"></td>    </tr>    <tr>      <td>Intermediary Bank Country</td>      <td id="interbankcountry"></td>    </tr>    <tr>      <td>Intermediary Routing Number</td>      <td id="interrouting"></td>    </tr>    <tr>      <td>Intermediary Swift</td>      <td id="interswift"></td>    </tr>  <tr>    <td>Date Created:</td>    <td id="datecreated"></td>  </tr>      </tbody>   </table>  <table class="ui table compact collapsing" id="attachmentsTable"><thead><tr><th>Filename</th><th>Date</th><th>View</th><th>Delete</th></tr></thead><tbody></tbody></table> <div>  <button type="button" id="btnBESCreate" class="button is-info">Create BES</button> </div>');
    $('#btnBESCreate').on('click', newEntryFromVendor);
    $.getJSON('/vendor/' + id, function (data) {

        $('#vendorid').html(data.obj.id);
        $('#legalentityname').html(data.obj.legalentityname);
        $('#address1').html(data.obj.address1);
        $('#address2').html(data.obj.address2);
        $('#city').html(data.obj.city);
        $('#state').html(data.obj.state);
        $('#zip').html(data.obj.zip);
        $('#country').html(data.obj.country);
        $('#bankname').html(data.obj.bankname);
        $('#bankaddress').html(data.obj.bankaddress);
        $('#bankcity').html(data.obj.bankcity);
        $('#bankstate').html(data.obj.bankstate);
        $('#bankzip').html(data.obj.bankzip);
        $('#bankcountry').html(data.obj.bankcountry);
        $('#routing').html(data.obj.routing);
        $('#account').html(data.obj.account);
        $('#swift').html(data.obj.swift);
        $('#interbankname').html(data.obj.interbankname);
        $('#interbankaddress').html(data.obj.inter);
        $('#interbankcity').html(data.obj.interbankcity);
        $('#interbankstate').html(data.obj.interbankstate);
        $('#interbankzip').html(data.obj.interbankzip);
        $('#interbankcountry').html(data.obj.interbankcountry);
        $('#interrouting').html(data.obj.interrouting);
        $('#interswift').html(data.obj.interswift);
        $('#datecreated').html(data.obj.datecreated);

        $("#rightbar").show(); //Allow users to show/hide details panel

        //load attachments
        var attachmentsHTML = '';
        data.attachments.forEach(item => {
            attachmentsHTML += '<tr>';
            attachmentsHTML += '<td>' + item.filename.substring(item.filename.indexOf('_', 5) + 1) + '</td>';
            attachmentsHTML += '<td>' + item.dateadded + '</td>';
            attachmentsHTML += '<td><a href="/file/' + item.filename + '" target="_blank">View</a></td>';
            attachmentsHTML += '</tr>';
        });
        $('#attachmentsTable tbody').html(attachmentsHTML);


    });

};



function newEntryFromVendor() {
    var payload = {
        legalentityname: $("#legalentityname").html(),
        address1: $("#address1").html(),
        address2: $("#address2").html(),
        city: $("#city").html(),
        state: $("#state").html(),
        zip: $("#zip").html(),
        country: $("#country").html(),
        bankname: $("#bankname").html(),
        bankaddress: $("#bankaddress").html(),
        bankcity: $("#bankcity").html(),
        bankstate: $("#bankstate").html(),
        bankzip: $("#bankzip").html(),
        bankcountry: $("#bankcountry").html(),
        routing: $("#routing").html(),
        account: $("#account").html(),
        swift: $("#swift").html(),
        interbankname: $("#interbankname").html(),
        interbankaddress: $("#interbankaddress").html(),
        interbankcity: $("#interbankcity").html(),
        interbankstate: $("#interbankstate").html(),
        interbankzip: $("#interbankzip").html(),
        interbankcountry: $("#interbankcountry").html(),
        interrouting: $("#interrouting").html(),
        interswift: $("#interswift").html(),
        vendorId: $("#vendorid").html()
    };
    var attachmentHTMLTemp = $('#attachmentsTable tbody').html();
    $("#rightbar").html('<h3 id="recordInfoHdr">Record Info</h3>  <input type=\"hidden\" id=\"vendorId\" /> <button class="delete is-danger" id="rightClose" aria-label="close" onclick="hideDiv(\'rightbar\')"></button>     <span class="icon" id="rightMaxim" onclick="showFullDiv(\'rightbar\');">  <i class="fa fa-arrows-alt" aria-hidden="true"></i></span> <span class="icon" id="rightMin" onclick="showMinDiv(\'rightbar\');">  <i class="fa fa-window-minimize" aria-hidden="true"></i></span>  <table class="ui table compact" id="payinfofields">    <thead>      <tr>        <th>Setting</th>        <th>Value</th>      </tr>    </thead>    <tbody>      <tr>        <td>BES ID</td>        <td id="rowid">**New**</td>      </tr>      <tr>        <td>Workflow Status</td>        <td id="wfstatus"></td>      </tr>      <tr>        <td>Pay Type</td>        <td>             <div class="select is-info">            <select name="paytype" id="paytype" onclick="inputShow(this)">              <option value="ACH">ACH</option>              <option value="Wire">Wire</option>            </select>            </div>        </td>      </tr>      <tr>        <td>ACH SEC</td>        <td>             <div class="select is-info">            <select name="achsec" id="achsec" onclick="inputShow(this)">              <option value="CCD">CCD</option>              <option value="PPD">PPD</option>            </select>            </div>        </td>      </tr>      <tr>        <td>Source System</td>        <td><input type="text" value="EXAMPLE" id="sourcesystem" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>System Payee ID</td>        <td><input type="text" value="V000000" id="vendorid" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary Name</td>        <td><input type="text" value="VENDOR NAME HERE" id="payeename" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary Address</td>        <td><input type="text" value="123 MAIN STREET" id="payeeaddress" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary City</td>        <td><input type="text" value="ANYWHERE" id="payeecity" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary State/Province</td>        <td><input type="text" value="CA" id="payeestate" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary ZIP/Postal</td>        <td><input type="text" value="92000" id="payeezip" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary Country</td>        <td><input type="text" value="US" id="payeecountry" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>For Further Credit To</td>        <td><input type="text" value="SOMEONE ELSE" id="forfurthercredit" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank Name</td>        <td><input type="text" value="INSTITUTION NAME HERE" id="bankname" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank Address</td>        <td><input type="text" value="9000 WALL STREET" id="bankaddress" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank City</td>        <td><input type="text" value="SOMEWHERESVILLE" id="bankcity" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank State/Province</td>        <td><input type="text" value="NY" id="bankstate" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank ZIP/Postal</td>        <td><input type="text" value="10101" id="bankzip" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank Country</td>        <td><input type="text" value="US" id="bankcountry" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Routing Number</td>        <td><input type="text" value="123456789" id="routing" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Account Number</td>        <td><input type="text" value="1000200030004000" id="account" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Swift</td>        <td><input type="text" value="ABCDEFGHIJK" id="swift" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank Name</td>        <td><input type="text" value="INTERMED BANK" id="interbankname" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank Address</td>        <td><input type="text" value="5YJ INTERNATIONAL ST" id="interbankaddress" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank City</td>        <td><input type="text" value="SOMEWHERE" id="interbankcity" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank State/Province</td>        <td><input type="text" value="NS" id="interbankstate" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank ZIP/Postal</td>        <td><input type="text" value="XJY5YA" id="interbankzip" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank Country</td>        <td><input type="text" value="CA" id="interbankcountry" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank Routing</td>        <td><input type="text" value="ABC123456XYZ" id="interrouting" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank Swift</td>        <td><input type="text" value="ABABABABABA" id="interswift" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Validation Notes</td>        <td><input type="text" value="Some notes here" id="notes" class="input is-info" onclick="inputShow(this)"/></td>      </tr>    </tbody>  </table> <div><button type="button" id="btnClear" class="button is-info">Clear Text</button></div> <table class="ui table compact collapsing" id="payinfoactions">    <tbody>        <tr>          <td>            Action          </td>          <td>            <div class="select is-info">                <select name="action" id="action">                  <option value="New">New</option>                </select>            </div>          </td>          <td><button type="button" id="btnAuditLog" class="button is-info">Show Audit Log</button></td>        </tr>    </tbody>  </table><table class="ui table compact collapsing" id="attachmentsTable">    <thead>      <tr>        <th>Filename</th>        <th>Date</th>        <th>View</th>      </tr>    </thead>    <tbody></tbody>    </table> <div class="file is-boxed is-primary" id="filesDiv">  <label class="file-label">    <input class="file-input" type="file" name="attachment" id="attachment" onchange="setFileName();" multiple>    <span class="file-cta">      <span class="file-icon">        <i class="fas fa-upload"></i>      </span>      <span class="file-label">Select File to Upload      </span>    </span>      <span class="file-name" id="uploadFileName">    </span>  </label></div><button type="button" id="btnUploadFile" class="button is-info">Upload File</button> <button type="button" id="btnAttachAuditLog" class="button is-info">Show File Log</button> <table class="ui table compact collapsing" id="workflow">    <tbody>      <tr>        <td>Workflow</td>        <td id="wf_name"></td>      </tr>      <tr>        <td>Current Step</td>        <td id="wf_currentstep"></td>      </tr>      <tr>        <td>          Next Step        </td>        <td>          <div class="select is-info">           <select name="wf_stepnext" id="wf_stepnext">           </select>         </div>        </td>      </tr>      <tr>        <td>WF Notes</td>        <td><input type="text" value="" id="wf_notes" class="input is-info "/></td>      </tr>      <tr>        <td>          <button type="button" id="btnSave" class="button is-info">Save</button>        </td>      </tr>    </tbody>  <table class="ui table compact collapsing" id="wf_history">    <thead>      <tr>        <th>Step</th>        <th>User</th>        <th>Date</th>        <th>Notes</th>      </tr>    </thead>    <tbody></tbody>  </table>');
    $('#btnSave').on('click', doAction);
    $('#btnSave').on('click', (e) => {
        e.preventDefault();
        $("#rightbar").hide();
    });

    //set data
    $("#payeename").val(payload.legalentityname);
    $("#payeeaddress").val(payload.address1 + " " + payload.address2);
    $("#payeecity").val(payload.city);
    $("#payeestate").val(payload.state);
    $("#payeezip").val(payload.zip);
    $("#payeecountry").val(payload.country);
    $("#bankname").val(payload.bankname);
    $("#bankaddress").val(payload.bankaddress);
    $("#bankcity").val(payload.bankcity);
    $("#bankstate").val(payload.bankstate);
    $("#bankzip").val(payload.bankzip);
    $("#bankcountry").val(payload.bankcountry);
    $("#routing").val(payload.routing);
    $("#account").val(payload.account);
    $("#swift").val(payload.swift);
    $("#interbankname").val(payload.interbankname);
    $("#interbankaddress").val(payload.interbankaddress);
    $("#interbankcity").val(payload.interbankcity);
    $("#interbankstate").val(payload.interbankstate);
    $("#interbankzip").val(payload.interbankzip);
    $("#interbankcountry").val(payload.interbankcountry);
    $("#interrouting").val(payload.interrouting);
    $("#interswift").val(payload.interswift);
    $("#vendorId").val(payload.vendorId);

    $('#attachmentsTable tbody').html(attachmentHTMLTemp);

    $("#rightbar").show();
    $('#btnUploadFile').on('click', uploadFiles).prop("disabled", true);

    document.getElementById("filesDiv").ondragover = document.getElementById("filesDiv").ondragenter = function (evt) {
        evt.preventDefault();
    };

    document.getElementById("filesDiv").ondrop = function (evt) {
        // pretty simple -- but not for IE :(
        document.getElementById("attachment").files = evt.dataTransfer.files;
        evt.preventDefault();
        setFileName();

    };
}






/**
 * Jorge Medina : 12/17/2018 - Helper function to save attachment by Vendor ID
 *
 */
function attachVendorFiles(vendorId) {
    var data = new FormData();
    for (var i = 0; i < $("#wiringInstructionsAttachment")[0].files.length; i++) {
        data.append("file_" + i, $("#wiringInstructionsAttachment")[0].files[i]);
    }
    data.append("id", vendorId);
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/attachVendor/",
        "method": "POST",
        "headers": {
            "Cache-Control": "no-cache",
        },
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": data
    }

    $.ajax(settings).done(function (response) {
        response = JSON.parse(response);
        if (response.msg === '') {
            //attachments
            $("#notificationDiv .header").html("Confirmation");
            $("#notificationDiv .content").html("<p>Form was succesfully submitted</p>");
            $("#notificationDiv").modal("show");
            $("#vendorform").html("<p>Form was succesfully submitted</p>");
        }
        else {
            alert('Attachment Error: ' + response.msg);
        }
    })
};

/***
 * Jorge Medina 12/17/2018 Validate Valid Vendor URL before allowing access to form
 * */
function validateVendorUrl() {

    $.getJSON('/validateUrl/' + $("#token").val(), function (data) {
        if (data.msg === '') {
            return true;
        }
        else {
            $("body").html("Invalid URL");
        }

    });
};
