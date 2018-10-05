// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  $('#btnSave').on('click', doAction);
  $('#btnFilter').on('click', populateTable);
  $('#btnAuditLog').on('click', populateAudit);

  $(document).on('click', '#userList button' , function() {
    getEdit($(this).val());
  });

});


// Functions =============================================================

function populateAudit() {

  $.getJSON( '/audit/' + $('#rowid').html(), function( data ) {

  // Empty content string
    var tableContent = '';

    $.each(data, function(){
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

  $.getJSON( '/payinfo/list' + queryString, function( data ) {

  // Empty content string
    var tableContent = '';

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr id="row_' + this.id + '">';
      tableContent += '<td><button class="ui button" value="'+ this.id + '">' + this.id + '</button></td>';
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
      $('#payinfofields').find('input').attr('disabled','disabled');
      $('#payinfofields').find('select').attr('disabled','disabled');
    } else {
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
  if(errorCount === 0) {

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

          //reload the datatable and the record info in case of workflow change
          getEdit(object_id);
          populateTable();


        }
        else {
          // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.msg);
        }
      });
    }
    else if ( action === 'New' ) {
      $.ajax({
          url: '/payinfo/new',
          type: 'POST',
          data: JSON.stringify(newUser),
          contentType: 'application/json',

      }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg === '') {

          // Clear the form inputs
          //$('#payinfofields input').val('');

          // Update the table
          populateTable();
        }
        else {
          // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.msg);
        }
      });
    }
    else if ( action === 'Delete' ) {
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