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
    'services': $("#services").text(),
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
  $("#notificationDiv .header").html("How to Complete form");
  $("#notificationDiv .content").html("<p>In progress...</p>");
  $("#notificationDiv").modal("show");
}
