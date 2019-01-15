$(document).ready(function () {
  $("#eftURL").prop("href", "https://treasurynode-test-innersphere.c9users.io/vendorform?token=" + $("#efttoken").val());
  validateVendorUrlExternal();
});

function vendorForm_validateForm() {
  event.preventDefault();


  $('.is-danger.is-info,.is-danger.is-primary').removeClass('is-danger'); //clear error warnings
  $("#agreeementLbl").css("border", "none");
  // Assemble object to save
  var addressLine1s = '';
  $("[name='addressLine1']").each(function () {
    addressLine1s += ($(this).val() + '`');
  });
  var cities = '';
  $("[name='city']").each(function () {
    cities += ($(this).val() + '`');
  });
  var states = '';
  $("[name='state']").each(function () {
    states += ($(this).val() + '`');
  });
  var zipcodes = '';
  $("[name='zipcode']").each(function () {
    zipcodes += ($(this).val() + '`');
  });
  var newVendor = {
    'legalname': $('#legalname').val(),
    'dba': $('#dba').val(),
    'contactname': $('#contactname').val(),
    'contacttitle': $('#contacttitle').val(),
    'contactemail': $('#contactemail').val(),
    'contactphone': $('#contactphone').val(),
    'fieldname': $('#fieldname').val(),
    'fieldtitle': $('#fieldtitle').val(),
    'fieldemail': $('#fieldemail').val(),
    'fieldphone': $('#fieldphone').val(),
    'project_legal_entity': $('#project_legal_entity').val(),
    'project_code': $('#project_code').val(),
    'project_name': $('#project_name').val(),
    'po': $('#po').val(),
    'accountingname': $('#accountingname').val(),
    'accountingtitle': $('#accountingtitle').val(),
    'accountingemail': $('#accountingemail').val(),
    'accountingphone': $('#accountingphone').val(),
    'email1099': $('#email1099').val(),
    'taxid': $('#taxid').val(),
    'remitAddress_Yes': ($('#remitAddress_Yes').prop("checked")) ? "yes" : "no",
    'remitAddress_No': ($('#remitAddress_No').prop("checked")) ? "yes" : "no",
    'addressLine1s': addressLine1s,
    'cities': cities,
    'states': states,
    'zipcodes': zipcodes,
    //'services': $("#services").text(),
    'personalRelation_Yes': ($('#personalRelation_Yes').prop("checked")) ? "yes" : "no",
    'personalRelation_No': ($('#personalRelation_No').prop("checked")) ? "yes" : "no",
    'employee_relation_explanation': $("#employee_relation_explanation").val(),
    'w9Attachment': $("#w9Attachment")[0].files.length,
    'no_w9_expl': $("#no_w9_expl").val(),
    'coiAttachment': $("#coiAttachment")[0].files.length,
    'no_coi_expl': $("#no_coi_expl").val(),
    'workCompAttachment': $("#workCompAttachment")[0].files.length,
    'workCompExempt': $("#workCompExempt")[0].files.length,
    'otherAttachment': $("#otherAttachAttachment")[0].files.length,
    'agreementChk': ($('#agreementChk').prop("checked")) ? "yes" : "no",
  };

  $.ajax({
    url: '/vendor_external/new',
    type: 'POST',
    data: JSON.stringify(newVendor),
    contentType: 'application/json',

  }).done(function (response) {

    //check for validation errors
    if (response.validationErrors) {
      var errorHTML = "<div>";
      response.validationErrors.forEach((field) => {
        $("#" + field.container).addClass('is-danger');
        errorHTML += 'Field: ' + field.field + '<ul><li> Error: ' + field.msg + '</li></ul>';
        if (field.field === 'agreement') {
          $("#agreeementLbl").css("border", "3px solid red");
        }
      })
      errorHTML += "</div>";
      $("#notificationDiv .header").html("Input Validation Errors");
      $("#notificationDiv .content").html(errorHTML);
      $("#notificationDiv").modal("show");
    }
    // Check for successful (blank) response
    else if (response.msg === '') {
      //attachVendorFiles(response.id);

    }
    else {
      // If something goes wrong, alert the error message that our service returned
      $("#notificationDiv .header").html("Error");
      $("#notificationDiv .content").html("<p>Error while submitting form: " + response.msg + "</p>");
      $("#notificationDiv").modal("show");
    }
  });
}

/**
 * Jorge Medina - 12/03/2018 - Set File Upload descriptor
 */

function setFileNamesExternal(fileDiv) {
  if (fileDiv.length < 1)
    return;

  var validextensions = "pdf,jpg,jpeg,bmp,xls,doc,tiff,tif,gif,docx,xlsx,txt,msg,xlsm,xlsb,zip,ppt,pptx,png";
  var fileNameSpan = fileDiv.toString().replace("Div", "FileName");
  var fileInput = fileDiv.toString().replace("Div", "Attachment");

  $("#" + fileNameSpan).html("");


  var filesToUpload = $("#" + fileInput)[0].files;
  if (filesToUpload.length > 0) {
    for (var i = 0; i < filesToUpload.length; i++) {
      if (validextensions.indexOf(filesToUpload[i].name.substring(filesToUpload[i].name.lastIndexOf(".") + 1)) != -1) {
        $("#" + fileNameSpan).html($("#" + fileNameSpan).html() + " " + filesToUpload[i].name);
      }
      else {
        alert("Invalid file extension found: " + filesToUpload[i].name.substring(filesToUpload[i].name.lastIndexOf(".") + 1));
        $("#" + fileInput)[0].value = ""; //remove all files
        $("#" + fileNameSpan).html("");
      }
    }
  }
  else
    $("#" + fileNameSpan).html("");
}


function addAddress() {
  var addressHTML = "<tr class=\"addressTR\"><td colspan=\"5\"><hr style=\"margin:0\"/></td></tr><tr name=\"addressTR\" class=\"addressTR\">        <td><label class=\"label\">Address Line:</label>        </td>        <td colspan=\"4\">          <input class=\"input is-info\" type=\"text\" name=\"addressLine1\" placeholder=\"Address 1\"/>        </td>      </tr>      <tr class=\"addressTR\">        <td>          <label class=\"label\">City</label>        </td>        <td>          <input type=\"text\" class=\"input is-info\" name=\"city\" placeholder=\"City\"/>        </td>        <td colspan=\"3\">          <label class=\"label inlineLbl\">State</label>            <div class=\"select\">              <select name=\"state\">                <option value=\"\">Select state</option>                <option value=\"AL\">Alabama</option>	              <option value=\"AK\">Alaska</option>	              <option value=\"AZ\">Arizona</option>	              <option value=\"AR\">Arkansas</option>	              <option value=\"CA\">California</option>	              <option value=\"CO\">Colorado</option>	              <option value=\"CT\">Connecticut</option>	              <option value=\"DE\">Delaware</option>	              <option value=\"DC\">District Of Columbia</option>	              <option value=\"FL\">Florida</option>	              <option value=\"GA\">Georgia</option>	              <option value=\"HI\">Hawaii</option>	              <option value=\"ID\">Idaho</option>	              <option value=\"IL\">Illinois</option>	              <option value=\"IN\">Indiana</option>	              <option value=\"IA\">Iowa</option>	              <option value=\"KS\">Kansas</option>	              <option value=\"KY\">Kentucky</option>	              <option value=\"LA\">Louisiana</option>	              <option value=\"ME\">Maine</option>	              <option value=\"MD\">Maryland</option>	              <option value=\"MA\">Massachusetts</option>	              <option value=\"MI\">Michigan</option>	              <option value=\"MN\">Minnesota</option>	              <option value=\"MS\">Mississippi</option>	              <option value=\"MO\">Missouri</option>	              <option value=\"MT\">Montana</option>	              <option value=\"NE\">Nebraska</option>	              <option value=\"NV\">Nevada</option>	              <option value=\"NH\">New Hampshire</option>	              <option value=\"NJ\">New Jersey</option>	              <option value=\"NM\">New Mexico</option>	              <option value=\"NY\">New York</option>	              <option value=\"NC\">North Carolina</option>	              <option value=\"ND\">North Dakota</option>	              <option value=\"OH\">Ohio</option>	              <option value=\"OK\">Oklahoma</option>	              <option value=\"OR\">Oregon</option>	              <option value=\"PA\">Pennsylvania</option>	              <option value=\"RI\">Rhode Island</option>	              <option value=\"SC\">South Carolina</option>	              <option value=\"SD\">South Dakota</option>	              <option value=\"TN\">Tennessee</option>	              <option value=\"TX\">Texas</option>	              <option value=\"UT\">Utah</option>	              <option value=\"VT\">Vermont</option>	              <option value=\"VA\">Virginia</option>	              <option value=\"WA\">Washington</option>	              <option value=\"WV\">West Virginia</option>	              <option value=\"WI\">Wisconsin</option>	              <option value=\"WY\">Wyoming</option>              </select>            </div>            <label class=\"label inlineLbl\">Zip Code</label>            <input class=\"input is-info\" type=\"text\" name=\"zipcode\" placeholder=\"Zip Code\"/>        </td>      </tr>;"
  $("#addressActionsTR").before(addressHTML);
}

function removeAddress() {
  if ($("[name='addressTR']").length <= 1)
    return;
  $("[name='addressTR']").last().prev().remove();
  $("[name='addressTR']").last().next().remove();
  $("[name='addressTR']").last().remove();
}


function clearForm() {
  if (confirm('This action will delete all information you may have entered into the form, continue?'))
    location.reload();
}

function showInstructions() {
  var instructionsHtml = "<p>Please see below description of all fields in the form</p>";
  instructionsHtml += "<ul>";
  instructionsHtml += "<li><u><b>New Vendor</b>:</u> Select if this is the first time you are submitting this form</li>";
  instructionsHtml += "<li><u><b>Modify Vendor Information</b>:</u> Select if you have already submitted this form and would like to update your information</li>";
  instructionsHtml += "<hr/>";
  instructionsHtml += "<li><u><b>I. Project, Division and/or Corporate Office - Main Contact/Owners Rep.</b>:</u>";
  instructionsHtml += "<ul>";
  instructionsHtml += "<li><u><b>Project Legal Entity</b>:</u> Project in which the Vendor will be working on</li>";
  instructionsHtml += "<li><u><b>Project Name</b>:</u> Project Name in which the Vendor will be working on</li>";
  instructionsHtml += "<li><u><b>Name</b>:</u> Name of Owners Rep from PRH Investments and/or TRG Management Company of Florida that hired the vendor</li>";
  instructionsHtml += "<li><u><b>Title</b>:</u> Business Title of Owners Rep from PRH Investments and/or TRG Management Company of Florida that hired the vendor</li>";
  instructionsHtml += "<li><u><b>Email</b>:</u> Email of Owners Rep from PRH Investments and/or TRG Management Company of Florida that hired the vendor</li>";
  instructionsHtml += "<li><u><b>Phone</b>:</u> Phone of Owners Rep from PRH Investments and/or TRG Management Company of Florida that hired the vendor</li>";
  instructionsHtml += "<li><u><b>Project Code</b>:</u> Project Code in which the Vendor will be working on</li>";
  instructionsHtml += "<li><u><b>PO #</b>:</u> PO# provided to Vendor</li>";
  instructionsHtml += "</ul>";
  instructionsHtml += "</li>";
  instructionsHtml += "<hr/>";
  instructionsHtml += "<li><u><b>II. Vendor Information - Main Contact</b>:</u>";
  instructionsHtml += "<ul>";
  instructionsHtml += "<li><u><b>Legal Entity Name</b>:</u> Vendor Legal Name</li>";
  instructionsHtml += "<li><u><b>DBA</b>:</u> Vendor's \"Doing Business As\" information</li>";
  instructionsHtml += "<li><u><b>Name</b>:</u> Name of employee that will serve as main contact on Vendor's side</li>";
  instructionsHtml += "<li><u><b>Title</b>:</u> Business Title of employee that will serve as main contact on Vendor's side</li>";
  instructionsHtml += "<li><u><b>Email</b>:</u> Email of employee that will serve as main contact on Vendor's side</li>";
  instructionsHtml += "<li><u><b>Phone</b>:</u> Phone of employee that will serve as main contact on Vendor's side</li>";
  instructionsHtml += "</ul>";
  instructionsHtml += "</li>";
  instructionsHtml += "<hr/>";
  instructionsHtml += "<li><u><b>III. Vendor Accounting Contact</b>:</u>";
  instructionsHtml += "<ul>";
  instructionsHtml += "<li><u><b>Name</b>:</u> Name of Main Contact on Vendor's Accounting Department</li>";
  instructionsHtml += "<li><u><b>Title</b>:</u> Business Title of Main Contact on Vendor's Accounting Department</li>";
  instructionsHtml += "<li><u><b>Email</b>:</u> Email of Main Contact on Vendor's Accounting Department</li>";
  instructionsHtml += "<li><u><b>Phone</b>:</u> Phone of Main Contact on Vendor's Accounting Department</li>";
  instructionsHtml += "<li><u><b>Email for 1099 purposes</b>:</u> Email address to use when emailing 1099s to Vendor</li>";
  instructionsHtml += "<li><u><b>Tax ID or SSN</b>:</u> Vendor's Tax ID/SSN</li>";
  instructionsHtml += "</ul>";
  instructionsHtml += "</li>";
  instructionsHtml += "<hr/>";
  instructionsHtml += "<li><u><b>Remittance address same as W-9 address</b>:</u>";
  instructionsHtml += "<ul>";
  instructionsHtml += "<li><u><b>Yes/No</b>:</u> Whether the Vendor's remittance address is the same as the address listed on its W9. Add Remittance Address is different.</li>";
  instructionsHtml += "</ul>";
  instructionsHtml += "</li>";
  instructionsHtml += "<hr/>";
  instructionsHtml += "<li><u><b>Types of service you are providing along with any other projects you will be working on</b>:</u>";
  instructionsHtml += "<ul>";
  instructionsHtml += "<li>Detailed Description of all services you will provide.</li>";
  instructionsHtml += "</ul>";
  instructionsHtml += "</li>";
  instructionsHtml += "<hr/>";
  instructionsHtml += "<li><u><b>Does vendor have any business, financial or personal relationship with any employee or relative of any employee of PRH Investments and/or TRG Management Company of Florida or any of its affiliates?</b>:</u>";
  instructionsHtml += "<ul>";
  instructionsHtml += "<li><u><b>Yes/No</b>:</u> Whether the vendor have any business, financial or personal relationship with any employee or relative of any employee of PRH Investments and/or TRG Management Company of Florida or any of its affiliates. If the answer is <i>Yes</i> then an explanation is required</li>";
  instructionsHtml += "</ul>";
  instructionsHtml += "</li>";
  instructionsHtml += "<hr/>";
  instructionsHtml += "<li><u><b>Attachments</b>:</u>";
  instructionsHtml += "<ul>";
  instructionsHtml += "<li><u><b>W9/W8</b>:</u> Attach most recent signed W9/W8. If not attached then provide explanation</li>";
  instructionsHtml += "<li><u><b>Certificates of Insurance (COI) (Commercial and Automobile Liabilities)</b>:</u> Attach most recent Certificates of Insurance (COI) (Commercial and Automobile Liabilities). If not attached then provide explanation</li>";
  instructionsHtml += "<li><u><b>Certificate of Insurance - Worker's Compensation</b>:</u> Attach most recent Certificate of Insurance - Worker's Compensation. If not attached then attach exemption document for Worker's Compensation. You can apply for an exemption here: <a href=\"https://apps.fldfs.com/bocexempt/\" target=\"_blank\">https://apps.fldfs.com/bocexempt/</a></li>";
  instructionsHtml += "<li><u><b>Contract/Quote/PO/Invoice</b>:</u> Attach Contract/Quote/PO/Invoice</li>";
  instructionsHtml += "</ul>";
  instructionsHtml += "</li>";
  instructionsHtml += "<hr/>";
  instructionsHtml += "<li>Click in the <i>ACH and Wire Instructions form</i> link on the Notes section to provide ACH/Wire information</li>";
  instructionsHtml += "<li>You must agree we may add you as additional insured with a waiver of subgregation on all applicable policies</li>";
  instructionsHtml += "</ul>";
  $("#notificationDiv .header").html("How to Complete form");
  $("#notificationDiv .content").html(instructionsHtml);
  $("#notificationDiv").modal("show");
}


function addServiceRow(elem) {
  var servicesHTML = "<tr>                <td>                  <input type=\"text\" class=\"input is-info\" name=\"project\" placeholder=\"Project Name\">                </td>                 <td>                  <input type=\"text\" class=\"input is-info\" name=\"services\" placeholder=\"Services Provided\">                </td>                <td>                  <button class=\"button is-info\" onclick=\"addServiceRow(this)\">+</button>                  <button class=\"button is-danger\" onclick=\"removeServiceRow(this)\">-</button>                </td>              </tr>";
  $("#servicesTbl tbody").append(servicesHTML);
}

function removeServiceRow(elem) {
  if ($("#servicesTbl tbody tr").length > 1)
    elem.parentElement.parentElement.remove();
}



/***
 * Jorge Medina 12/17/2018 Validate Valid Vendor URL before allowing access to form
 * */
function validateVendorUrlExternal() {

  $.getJSON('/validateUrl/' + $("#token").val(), function (data) {
    if (data.msg === '') {
      return true;
    }
    else {
      $("body").html("Invalid URL");
    }

  });
};
