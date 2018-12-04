// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function () {

  $('#btnSave').on('click', doAction);
  $('#btnFilter').on('click', populateTable);
  $('#btnAuditLog').on('click', populateAudit);
  $('#btnAttachAuditLog').on('click', populateFilesAudit);

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

  $('.ui.longer.modal').modal('show');

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

  $('.ui.longer.modal').modal('show');

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
      tableContent += '<td>' + this.achsec + '</td>';
      tableContent += '<td>' + this.sourcesystem + '</td>';
      tableContent += '<td>' + this.vendorid + '</td>';
      tableContent += '<td>' + this.payeename + '</td>';
      tableContent += '<td>' + this.payeeaddress + '</td>';
      tableContent += '<td>' + this.payeecity + '</td>';
      tableContent += '<td>' + this.payeestate + '</td>';
      tableContent += '<td>' + this.payeezip + '</td>';
      tableContent += '<td>' + this.payeecountry + '</td>';
      tableContent += '<td>' + this.forfurthercredit + '</td>';
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
      tableContent += '<td>' + this.notes + '</td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#userList tbody').html(tableContent);
  });

};






// Get record to edit
function getEdit(id) {

  $.getJSON('/payinfo/' + id, function (data) {

    $('#rowid').html(data.obj.id);
    $('#wfstatus').html(data.obj.wfstatus);
    $('#paytype').val(data.obj.paytype);
    $('#achsec').val(data.obj.achsec);
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
      $('#payinfofields').find('input').attr('disabled', 'disabled');
      $('#payinfofields').find('select').attr('disabled', 'disabled');
    }
    else {
      $('#payinfofields').find('input').removeAttr('disabled');
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
      attachmentsHTML += '<td><a href="/file/' + item.filename + '" target="_blank">View</a>';
      attachmentsHTML += '</tr>';
    });
    $('#attachmentsTable tbody').html(attachmentsHTML);

  });

};


// Write
function doAction(event) {
  event.preventDefault();

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
      'wf_notes': $('#wf_notes').val()
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
        // Check for successful (blank) response
        if (response.msg === '') {
          if ($("#attachment")[0].files.length > 0) {
            attachFiles($('#rowid').html(), 'edit');
            //populateTable();
          }
          else {
            //reload the datatable and the record info in case of workflow change
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

        // Check for successful (blank) response
        if (response.msg === '') {

          // Clear the form inputs
          //$('#payinfofields input').val('');

          //fields saved, save attachments if any
          if ($("#attachment")[0].files.length > 0) {
            attachFiles(response.id, 'new');
            //populateTable();
          }
          else {
            //no files attached
            populateTable();
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
    response = JSON.parse(response);
    if (response.msg === '') {
      if (action == "edit")
        getEdit(id);
      populateTable();
      $("#attachment")[0].value = "";
      setFileName();
    }
    else {
      alert('Attachment Error: ' + response.msg);
    }
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
      if (validextensions.indexOf(filesToUpload[i].name.substring(filesToUpload[i].name.lastIndexOf(".") + 1)) != -1)
        $("#uploadFileName").html($("#uploadFileName").html() + " " + filesToUpload[i].name);
      else {
        alert("Invalid file extension found: " + filesToUpload[i].name.substring(filesToUpload[i].name.lastIndexOf(".") + 1));
        $("#attachment")[0].value = ""; //remove all files
      }
    }

  }
  else
    $("#uploadFileName").html("");
}


function newEntry() {
  $("#rightbar").html('<h3 id="recordInfoHdr">Record Info</h3>   <button class="delete is-danger" id="rightClose" aria-label="close" onclick="hideDiv(\'rightbar\')"></button>     <span class="icon" id="rightMaxim" onclick="showFullDiv(\'rightbar\');">  <i class="fa fa-arrows-alt" aria-hidden="true"></i></span> <span class="icon" id="rightMin" onclick="showMinDiv(\'rightbar\');">  <i class="fa fa-window-minimize" aria-hidden="true"></i></span>  <table class="ui table compact" id="payinfofields">    <thead>      <tr>        <th>Setting</th>        <th>Value</th>      </tr>    </thead>    <tbody>      <tr>        <td>BES ID</td>        <td id="rowid">**New**</td>      </tr>      <tr>        <td>Workflow Status</td>        <td id="wfstatus"></td>      </tr>      <tr>        <td>Pay Type</td>        <td>             <div class="select is-info">            <select name="paytype" id="paytype">              <option value="ACH">ACH</option>              <option value="Wire">Wire</option>            </select>            </div>        </td>      </tr>      <tr>        <td>ACH SEC</td>        <td>             <div class="select is-info">            <select name="achsec" id="achsec">              <option value="CCD">CCD</option>              <option value="PPD">PPD</option>            </select>            </div>        </td>      </tr>      <tr>        <td>Source System</td>        <td><input type="text" value="EXAMPLE" id="sourcesystem" class="input is-info "/></td>      </tr>      <tr>        <td>System Payee ID</td>        <td><input type="text" value="V000000" id="vendorid" class="input is-info "/></td>      </tr>      <tr>        <td>Beneficiary Name</td>        <td><input type="text" value="VENDOR NAME HERE" id="payeename" class="input is-info "/></td>      </tr>      <tr>        <td>Beneficiary Address</td>        <td><input type="text" value="123 MAIN STREET" id="payeeaddress" class="input is-info "/></td>      </tr>      <tr>        <td>Beneficiary City</td>        <td><input type="text" value="ANYWHERE" id="payeecity" class="input is-info "/></td>      </tr>      <tr>        <td>Beneficiary State/Province</td>        <td><input type="text" value="CA" id="payeestate" class="input is-info "/></td>      </tr>      <tr>        <td>Beneficiary ZIP/Postal</td>        <td><input type="text" value="92000" id="payeezip" class="input is-info "/></td>      </tr>      <tr>        <td>Beneficiary Country</td>        <td><input type="text" value="US" id="payeecountry" class="input is-info "/></td>      </tr>      <tr>        <td>For Further Credit To</td>        <td><input type="text" value="SOMEONE ELSE" id="forfurthercredit" class="input is-info "/></td>      </tr>      <tr>        <td>Bank Name</td>        <td><input type="text" value="INSTITUTION NAME HERE" id="bankname" class="input is-info "/></td>      </tr>      <tr>        <td>Bank Address</td>        <td><input type="text" value="9000 WALL STREET" id="bankaddress" class="input is-info "/></td>      </tr>      <tr>        <td>Bank City</td>        <td><input type="text" value="SOMEWHERESVILLE" id="bankcity" class="input is-info "/></td>      </tr>      <tr>        <td>Bank State/Province</td>        <td><input type="text" value="NY" id="bankstate" class="input is-info "/></td>      </tr>      <tr>        <td>Bank ZIP/Postal</td>        <td><input type="text" value="10101" id="bankzip" class="input is-info "/></td>      </tr>      <tr>        <td>Bank Country</td>        <td><input type="text" value="US" id="bankcountry" class="input is-info "/></td>      </tr>      <tr>        <td>Routing Number</td>        <td><input type="text" value="123456789" id="routing" class="input is-info "/></td>      </tr>      <tr>        <td>Account Number</td>        <td><input type="text" value="1000200030004000" id="account" class="input is-info "/></td>      </tr>      <tr>        <td>Swift</td>        <td><input type="text" value="ABCDEFGHIJK" id="swift" class="input is-info "/></td>      </tr>      <tr>        <td>Intermediary Bank Name</td>        <td><input type="text" value="INTERMED BANK" id="interbankname" class="input is-info "/></td>      </tr>      <tr>        <td>Intermediary Bank Address</td>        <td><input type="text" value="5YJ INTERNATIONAL ST" id="interbankaddress" class="input is-info "/></td>      </tr>      <tr>        <td>Intermediary Bank City</td>        <td><input type="text" value="SOMEWHERE" id="interbankcity" class="input is-info "/></td>      </tr>      <tr>        <td>Intermediary Bank State/Province</td>        <td><input type="text" value="NS" id="interbankstate" class="input is-info "/></td>      </tr>      <tr>        <td>Intermediary Bank ZIP/Postal</td>        <td><input type="text" value="XJY5YA" id="interbankzip" class="input is-info "/></td>      </tr>      <tr>        <td>Intermediary Bank Country</td>        <td><input type="text" value="CANADA" id="interbankcountry" class="input is-info "/></td>      </tr>      <tr>        <td>Intermediary Bank Routing</td>        <td><input type="text" value="ABC123456XYZ" id="interrouting" class="input is-info "/></td>      </tr>      <tr>        <td>Intermediary Bank Swift</td>        <td><input type="text" value="ABABABABABA" id="interswift" class="input is-info "/></td>      </tr>      <tr>        <td>Validation Notes</td>        <td><input type="text" value="Some notes here" id="notes" class="input is-info "/></td>      </tr>    </tbody>  </table>  <table class="ui table compact collapsing" id="payinfoactions">    <tbody>        <tr>          <td>            Action          </td>          <td>            <div class="select is-info">                <select name="action" id="action">                  <option value="New">New</option>                </select>            </div>          </td>          <td><button type="button" id="btnAuditLog" class="button is-info">Show Audit Log</button></td>        </tr>    </tbody>  </table><table class="ui table compact collapsing" id="attachmentsTable">    <thead>      <tr>        <th>Filename</th>        <th>Date</th>        <th>View</th>      </tr>    </thead>    <tbody></tbody>    </table> <div class="file is-boxed is-primary" id="filesDiv">  <label class="file-label">    <input class="file-input" type="file" name="attachment" id="attachment" onchange="setFileName();" multiple>    <span class="file-cta">      <span class="file-icon">        <i class="fas fa-upload"></i>      </span>      <span class="file-label">        Upload File      </span>    </span>      <span class="file-name" id="uploadFileName">    </span>  </label></div> <button type="button" id="btnAttachAuditLog" class="button is-info">Show File Log</button> <table class="ui table compact collapsing" id="workflow">    <tbody>      <tr>        <td>Workflow</td>        <td id="wf_name"></td>      </tr>      <tr>        <td>Current Step</td>        <td id="wf_currentstep"></td>      </tr>      <tr>        <td>          Next Step        </td>        <td>          <div class="select is-info">           <select name="wf_stepnext" id="wf_stepnext">           </select>         </div>        </td>      </tr>      <tr>        <td>WF Notes</td>        <td><input type="text" value="" id="wf_notes" class="input is-info "/></td>      </tr>      <tr>        <td>          <button type="button" id="btnSave" class="button is-info">Save</button>        </td>      </tr>    </tbody>  <table class="ui table compact collapsing" id="wf_history">    <thead>      <tr>        <th>Step</th>        <th>User</th>        <th>Date</th>        <th>Notes</th>      </tr>    </thead>    <tbody></tbody>  </table>').show();
  $('#btnSave').on('click', doAction);
  $('#btnFilter').on('click', populateTable);
  $('#btnAuditLog').on('click', populateAudit);
  $('#btnAttachAuditLog').on('click', populateFilesAudit);

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
