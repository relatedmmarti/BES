// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the user table on initial page load
  populateTable();

  $('#btnSave').on('click', doAction);
  $('#btnFilter').on('click', doFilter);

  $(document).on('click', '#userList button' , function() {
    getEdit($(this).val());
  });

});


// Functions =============================================================

function doFilter(event) {

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

  console.log('queryString:' + queryString);

  if (queryString !== '') {
    queryString = '?' + queryString;
  };

  $.getJSON( '/payinfo/list' + queryString, function( data ) {

  // Empty content string
    var tableContent = '';

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr id="row_' + this.id + '">';
      tableContent += '<td><button class="ui button" value="'+ this.id + '">' + this.id + '</button></td>';
      tableContent += '<td>' + this.wfstep_name + '</td>';
      tableContent += '<td>' + this.paytype + '</td>';
      tableContent += '<td>' + this.sourcesystem + '</td>';
      tableContent += '<td>' + this.vendorid + '</td>';
      tableContent += '<td>' + this.payeename + '</td>';
      tableContent += '<td>' + this.payeeaddress + '</td>';
      tableContent += '<td>' + this.bankname + '</td>';
      tableContent += '<td>' + this.bankaddress + '</td>';
      tableContent += '<td>' + this.routing + '</td>';
      tableContent += '<td>' + this.account + '</td>';
      tableContent += '<td>' + this.swift + '</td>';
      tableContent += '<td>' + this.interbankname + '</td>';
      tableContent += '<td>' + this.interbankaddress + '</td>';
      tableContent += '<td>' + this.interrouting + '</td>';
      tableContent += '<td>' + this.interswift + '</td>';
      tableContent += '<td>' + this.notes + '</td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#userList tbody').html(tableContent);
  });

}











// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  $.getJSON( '/payinfo/list', function( data ) {

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr id="row_' + this.id + '">';
      tableContent += '<td><button class="ui button" value="'+ this.id + '">' + this.id + '</button></td>';
      tableContent += '<td>' + this.wfstep_name + '</td>';
      tableContent += '<td>' + this.paytype + '</td>';
      tableContent += '<td>' + this.sourcesystem + '</td>';
      tableContent += '<td>' + this.vendorid + '</td>';
      tableContent += '<td>' + this.payeename + '</td>';
      tableContent += '<td>' + this.payeeaddress + '</td>';
      tableContent += '<td>' + this.bankname + '</td>';
      tableContent += '<td>' + this.bankaddress + '</td>';
      tableContent += '<td>' + this.routing + '</td>';
      tableContent += '<td>' + this.account + '</td>';
      tableContent += '<td>' + this.swift + '</td>';
      tableContent += '<td>' + this.interbankname + '</td>';
      tableContent += '<td>' + this.interbankaddress + '</td>';
      tableContent += '<td>' + this.interrouting + '</td>';
      tableContent += '<td>' + this.interswift + '</td>';
      tableContent += '<td>' + this.notes + '</td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#userList tbody').html(tableContent);
  });

/*
    $.ajax({
        url: '/helloworld/data',
        type: 'GET',
        dataType: 'json',
        success: function (result) {
            var insert = '';
            $.each(result, function (index, item) {

                  insert += '<tr>';
                  insert += '<td>' + item.id + '</td>';
                  insert += '<td>' + item.name + '</td>';
                  insert += '</tr>'
            });
            $('#userList table tbody').html(tableContent);
        }
    });
*/

};





// Get record to edit
function getEdit(id) {

  $.getJSON('/payinfo/' + id, function (data) {

    $('#rowid').html(data.obj.id);
    $('#wfstatus').html(data.obj.wfstatus);
    $('#paytype').val(data.obj.paytype);
    $('#sourcesystem').val(data.obj.sourcesystem);
    $('#vendorid').val(data.obj.vendorid);
    $('#payeename').val(data.obj.payeename);
    $('#payeeaddress').val(data.obj.payeeaddress);
    $('#bankname').val(data.obj.bankname);
    $('#bankaddress').val(data.obj.bankaddress);
    $('#routing').val(data.obj.routing);
    $('#account').val(data.obj.account);
    $('#swift').val(data.obj.swift);
    $('#interbankname').val(data.obj.interbankname);
    $('#interbankaddress').val(data.obj.interbankaddress);
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
  $('#payinfofields input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // Assemble object to save
    var newUser = {
      'paytype': $('#paytype').find(":selected").val(),
      'sourcesystem': $('#sourcesystem').val(),
      'vendorid': $('#vendorid').val(),
      'payeename': $('#payeename').val(),
      'payeeaddress': $('#payeeaddress').val(),
      'bankname': $('#bankname').val(),
      'bankaddress': $('#bankaddress').val(),
      'routing': $('#routing').val(),
      'account': $('#account').val(),
      'swift': $('#swift').val(),
      'interbankname': $('#interbankname').val(),
      'interbankaddress': $('#interbankaddress').val(),
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