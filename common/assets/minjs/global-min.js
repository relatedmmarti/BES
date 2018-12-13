var userListData = [];

function populateFilesAudit() { "**New**" != $("#rowid").html() ? ($.getJSON("/auditFiles/" + $("#rowid").html(), function (t) { var e = "";
    $.each(t, function () { e += "<tr>", e += "<td>" + this.fk_id + "</td>", e += "<td>" + this.action + "</td>", e += "<td>" + this.modified + "</td>", e += "<td>" + this.username + "</td>", e += "<td><pre>" + JSON.stringify(this.payload, null, 4) + "</pre></td>", e += "</tr>" }), $("#auditlog tbody").html(e) }), $("#logDiv.ui.longer.modal").modal("show")) : alert("No logs yet ") }

function populateAudit() { "**New**" != $("#rowid").html() ? ($.getJSON("/audit/" + $("#rowid").html(), function (t) { var e = "";
    $.each(t, function () { e += "<tr>", e += "<td>" + this.fk_id + "</td>", e += "<td>" + this.action + "</td>", e += "<td>" + this.modified + "</td>", e += "<td>" + this.username + "</td>", e += "<td><pre>" + JSON.stringify(this.payload, null, 4) + "</pre></td>", e += "</tr>" }), $("#auditlog tbody").html(e) }), $("#logDiv.ui.longer.modal").modal("show")) : alert("No logs yet ") }

function populateTable() { var t = { id: $("#filter_id").val(), workflow: $("#filter_step").find(":selected").val(), type: $("#filter_type").find(":selected").val(), source: $("#filter_source").val(), vendor: $("#filter_vendor").val(), bank: $("#filter_bank").val() };
  Object.keys(t).forEach(e => "" === t[e] && delete t[e]), console.log(JSON.stringify(t)); var e = Object.keys(t).map(e => encodeURIComponent(e) + "=" + encodeURIComponent(t[e])).join("&"); "" !== e && (e = "?" + e), console.log("queryString:" + e), $.getJSON("/payinfo/list" + e, function (t) { var e = "";
    $.each(t, function () { e += '<tr id="row_' + this.id + '">', e += '<td><button class="button is-primary" value="' + this.id + '">' + this.id + "</button></td>", e += "<td>" + this.wfstep_name + "</td>", e += "<td>" + this.paytype + "</td>", e += "<td>" + this.achsec + "</td>", e += "<td>" + this.sourcesystem + "</td>", e += "<td>" + this.vendorid + "</td>", e += "<td>" + this.payeename + "</td>", e += "<td>" + this.payeeaddress + "</td>", e += "<td>" + this.payeecity + "</td>", e += "<td>" + this.payeestate + "</td>", e += "<td>" + this.payeezip + "</td>", e += "<td>" + this.payeecountry + "</td>", e += "<td>" + this.forfurthercredit + "</td>", e += "<td>" + this.bankname + "</td>", e += "<td>" + this.bankaddress + "</td>", e += "<td>" + this.bankcity + "</td>", e += "<td>" + this.bankstate + "</td>", e += "<td>" + this.bankzip + "</td>", e += "<td>" + this.bankcountry + "</td>", e += "<td>" + this.routing + "</td>", e += "<td>" + this.account + "</td>", e += "<td>" + this.swift + "</td>", e += "<td>" + this.interbankname + "</td>", e += "<td>" + this.interbankaddress + "</td>", e += "<td>" + this.interbankcity + "</td>", e += "<td>" + this.interbankstate + "</td>", e += "<td>" + this.interbankzip + "</td>", e += "<td>" + this.interbankcountry + "</td>", e += "<td>" + this.interrouting + "</td>", e += "<td>" + this.interswift + "</td>", e += "<td>" + this.notes + "</td>", e += "</tr>" }), $("#userList tbody").html(e) }) }

function getEdit(t) { $("#attachment")[0].value = "", $("#btnClear").hide(), setFileName(), $.getJSON("/payinfo/" + t, function (t) { $("#rowid").html(t.obj.id), $("#wfstatus").html(t.obj.wfstatus), $("#paytype").val(t.obj.paytype), $("#achsec").val(t.obj.achsec), $("#sourcesystem").val(t.obj.sourcesystem), $("#vendorid").val(t.obj.vendorid), $("#payeename").val(t.obj.payeename), $("#payeeaddress").val(t.obj.payeeaddress), $("#payeecity").val(t.obj.payeecity), $("#payeestate").val(t.obj.payeestate), $("#payeezip").val(t.obj.payeezip), $("#payeecountry").val(t.obj.payeecountry), $("#forfurthercredit").val(t.obj.forfurthercredit), $("#bankname").val(t.obj.bankname), $("#bankaddress").val(t.obj.bankaddress), $("#bankcity").val(t.obj.bankcity), $("#bankstate").val(t.obj.bankstate), $("#bankzip").val(t.obj.bankzip), $("#bankcountry").val(t.obj.bankcountry), $("#routing").val(t.obj.routing), $("#account").val(t.obj.account), $("#swift").val(t.obj.swift), $("#interbankname").val(t.obj.interbankname), $("#interbankaddress").val(t.obj.interbankaddress), $("#interbankcity").val(t.obj.interbankcity), $("#interbankstate").val(t.obj.interbankstate), $("#interbankzip").val(t.obj.interbankzip), $("#interbankcountry").val(t.obj.interbankcountry), $("#interrouting").val(t.obj.interrouting), $("#interswift").val(t.obj.interswift), $("#notes").val(t.obj.notes), $("#rightbar").show(); var e = "";
    t.nextsteps.forEach(t => { e += '<option value="' + t.id + '">' + t.name + "</li>" }), $("#wf_stepnext").html(e), $("#wf_name").html(t.currentstep.wfname), $("#wf_currentstep").html(t.currentstep.name), "Entry" !== $("#wf_currentstep").html() ? ($("#payinfofields").find("input").attr("readonly", !0).css("background-color", "#f5f5f5"), $("#payinfofields").find("select").attr("disabled", !0)) : ($("#payinfofields").find("input").removeAttr("readonly").css("background-color", "white"), $("#payinfofields").find("select").removeAttr("disabled")), $("#action").html('\n      <option value="New">New</option>\n      <option value="Edit" selected>Edit</option>\n      <option value="Delete">Delete</option>\n    '), $("#wf_notes").val(""); var i = "";
    t.stephistory.forEach(t => { i += "<tr>", i += "<td>" + t.name + "</td>", i += "<td>" + t.username + "</td>", i += "<td>" + t.modified + "</td>", i += "<td>" + t.notes + "</td>", i += "</tr>" }), $("#wf_history tbody").html(i); var n = "";
    t.attachments.forEach(t => { n += "<tr>", n += "<td>" + t.filename.substring(t.filename.indexOf("_", 5) + 1) + "</td>", n += "<td>" + t.dateadded + "</td>", n += '<td><a href="/file/' + t.filename + '" target="_blank">View</a>', n += "</tr>" }), $("#attachmentsTable tbody").html(n) }) }

function doAction(t) { t.preventDefault(), $(".is-danger").addClass("is-info").removeClass("is-danger"); { var e = { paytype: $("#paytype").find(":selected").val(), achsec: $("#achsec").find(":selected").val(), sourcesystem: $("#sourcesystem").val(), vendorid: $("#vendorid").val(), payeename: $("#payeename").val(), payeeaddress: $("#payeeaddress").val(), payeecity: $("#payeecity").val(), payeestate: $("#payeestate").val(), payeezip: $("#payeezip").val(), payeecountry: $("#payeecountry").val(), forfurthercredit: $("#forfurthercredit").val(), bankname: $("#bankname").val(), bankaddress: $("#bankaddress").val(), bankcity: $("#bankcity").val(), bankstate: $("#bankstate").val(), bankzip: $("#bankzip").val(), bankcountry: $("#bankcountry").val(), routing: $("#routing").val(), account: $("#account").val(), swift: $("#swift").val(), interbankname: $("#interbankname").val(), interbankaddress: $("#interbankaddress").val(), interbankcity: $("#interbankcity").val(), interbankstate: $("#interbankstate").val(), interbankzip: $("#interbankzip").val(), interbankcountry: $("#interbankcountry").val(), interrouting: $("#interrouting").val(), interswift: $("#interswift").val(), notes: $("#notes").val(), wf_stepnext: $("#wf_stepnext").val(), wf_notes: $("#wf_notes").val() }; let t = $("#action").find(":selected").val(); if ("Edit" === t) { var i = $("#rowid").html();
      $.ajax({ url: "/payinfo/" + i, type: "PUT", data: JSON.stringify(e), contentType: "application/json" }).done(function (t) { if (t.validationErrors) { var e = "<div>";
          t.validationErrors.forEach(t => { $("#" + t.field).removeClass("is-info").addClass("is-danger"), e += "Field: " + t.field + "<ul><li> Error: " + t.msg + "</li></ul>" }), e += "</div>", $("#notificationDiv .header").html("Input Validation Errors"), $("#notificationDiv .content").html(e), $("#notificationDiv").modal("show") } else "" === t.msg ? $("#attachment")[0].files.length > 0 ? attachFiles($("#rowid").html(), "edit") : (getEdit(i), populateTable()) : alert("Error: " + t.msg) }) } else "New" === t ? $.ajax({ url: "/payinfo/new", type: "POST", data: JSON.stringify(e), contentType: "application/json" }).done(function (t) { if (t.validationErrors) { var e = "<div>";
        t.validationErrors.forEach(t => { $("#" + t.field).removeClass("is-info").addClass("is-danger"), e += "Field: " + t.field + "<ul><li> Error: " + t.msg + "</li></ul>" }), e += "</div>", $("#notificationDiv .header").html("Input Validation Errors"), $("#notificationDiv .content").html(e), $("#notificationDiv").modal("show") } else "" === t.msg ? $("#attachment")[0].files.length > 0 ? attachFiles(t.id, "new") : populateTable() : alert("Error: " + t.msg) }) : "Delete" === t && $.ajax({ url: "/payinfo/" + $("#rowid").html(), type: "DELETE", contentType: "application/json" }).done(function (t) { "" === t.msg ? ($("#payinfofields input").val(""), $("#rowid").html(""), $("#action").html('<option value="New">New</option>'), $("#wf_history tbody").html(""), populateTable()) : alert("Error: " + t.msg) }) } }

function saveCSV(t) {-1 != t.indexOf("Hdn") && $("#" + t).show(); var e = $("#" + t).table2CSV({ delivery: "value" }); - 1 != t.indexOf("Hdn") && $("#" + t).hide(); var i = new Blob([e], { type: "text/csv" }); if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(i, "BES.csv");
  else { var n = document.createElement("a"),
      a = "data:text/csv;charset=UTF-8," + encodeURIComponent(e);
    n.href = a, n.download = "BES.csv", document.body.appendChild(n), n.click(), setTimeout(function () { document.body.removeChild(n), window.URL.revokeObjectURL(a) }, 0) } }

function attachFiles(t, e) { for (var i = new FormData, n = 0; n < $("#attachment")[0].files.length; n++) i.append("file_" + n, $("#attachment")[0].files[n]);
  i.append("id", t); var a = { async: !0, crossDomain: !0, url: "/attach/", method: "POST", headers: { "Cache-Control": "no-cache" }, processData: !1, contentType: !1, mimeType: "multipart/form-data", data: i };
  $.ajax(a).done(function (i) { "" === (i = JSON.parse(i)).msg ? ("edit" === e ? getEdit(t) : "none" !== e && populateTable(), $("#attachment")[0].value = "", setFileName()) : alert("Attachment Error: " + i.msg) }) }

function hideDiv(t) { $("#" + t).hide() }

function showFullDiv(t) { $("#" + t).css("width", "100%").show(), $("#rightMaxim").hide(), $("#rightMin").show() }

function showMinDiv(t) { $("#" + t).css("width", "30%").show(), $("#rightMaxim").show(), $("#rightMin").hide() }

function setFileName() { $("#uploadFileName").html(""); var t = $("#attachment")[0].files; if (t.length > 0)
    for (var e = 0; e < t.length; e++) - 1 != "pdf,jpg,jpeg,bmp,xls,doc,tiff,tif,gif,docx,xlsx,txt,msg,xlsm,xlsb,zip,ppt,pptx,png".indexOf(t[e].name.substring(t[e].name.lastIndexOf(".") + 1)) ? ($("#uploadFileName").html($("#uploadFileName").html() + " " + t[e].name), "**New**" !== $("#rowid").html() && $("#btnUploadFile").prop("disabled", !1)) : (alert("Invalid file extension found: " + t[e].name.substring(t[e].name.lastIndexOf(".") + 1)), $("#attachment")[0].value = "");
  else $("#uploadFileName").html("") }

function uploadFiles() { "**New**" != $("#rowid").html() ? attachFiles($("#rowid").html(), "edit") : alert("Files will be uploaded when you save.") }

function newEntry() { $("#rightbar").html('<h3 id="recordInfoHdr">Record Info</h3>   <button class="delete is-danger" id="rightClose" aria-label="close" onclick="hideDiv(\'rightbar\')"></button>     <span class="icon" id="rightMaxim" onclick="showFullDiv(\'rightbar\');">  <i class="fa fa-arrows-alt" aria-hidden="true"></i></span> <span class="icon" id="rightMin" onclick="showMinDiv(\'rightbar\');">  <i class="fa fa-window-minimize" aria-hidden="true"></i></span>  <table class="ui table compact" id="payinfofields">    <thead>      <tr>        <th>Setting</th>        <th>Value</th>      </tr>    </thead>    <tbody>      <tr>        <td>BES ID</td>        <td id="rowid">**New**</td>      </tr>      <tr>        <td>Workflow Status</td>        <td id="wfstatus"></td>      </tr>      <tr>        <td>Pay Type</td>        <td>             <div class="select is-info">            <select name="paytype" id="paytype" onclick="inputShow(this)">              <option value="ACH">ACH</option>              <option value="Wire">Wire</option>            </select>            </div>        </td>      </tr>      <tr>        <td>ACH SEC</td>        <td>             <div class="select is-info">            <select name="achsec" id="achsec" onclick="inputShow(this)">              <option value="CCD">CCD</option>              <option value="PPD">PPD</option>            </select>            </div>        </td>      </tr>      <tr>        <td>Source System</td>        <td><input type="text" value="EXAMPLE" id="sourcesystem" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>System Payee ID</td>        <td><input type="text" value="V000000" id="vendorid" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary Name</td>        <td><input type="text" value="VENDOR NAME HERE" id="payeename" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary Address</td>        <td><input type="text" value="123 MAIN STREET" id="payeeaddress" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary City</td>        <td><input type="text" value="ANYWHERE" id="payeecity" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary State/Province</td>        <td><input type="text" value="CA" id="payeestate" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary ZIP/Postal</td>        <td><input type="text" value="92000" id="payeezip" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Beneficiary Country</td>        <td><input type="text" value="US" id="payeecountry" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>For Further Credit To</td>        <td><input type="text" value="SOMEONE ELSE" id="forfurthercredit" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank Name</td>        <td><input type="text" value="INSTITUTION NAME HERE" id="bankname" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank Address</td>        <td><input type="text" value="9000 WALL STREET" id="bankaddress" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank City</td>        <td><input type="text" value="SOMEWHERESVILLE" id="bankcity" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank State/Province</td>        <td><input type="text" value="NY" id="bankstate" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank ZIP/Postal</td>        <td><input type="text" value="10101" id="bankzip" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Bank Country</td>        <td><input type="text" value="US" id="bankcountry" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Routing Number</td>        <td><input type="text" value="123456789" id="routing" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Account Number</td>        <td><input type="text" value="1000200030004000" id="account" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Swift</td>        <td><input type="text" value="ABCDEFGHIJK" id="swift" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank Name</td>        <td><input type="text" value="INTERMED BANK" id="interbankname" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank Address</td>        <td><input type="text" value="5YJ INTERNATIONAL ST" id="interbankaddress" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank City</td>        <td><input type="text" value="SOMEWHERE" id="interbankcity" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank State/Province</td>        <td><input type="text" value="NS" id="interbankstate" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank ZIP/Postal</td>        <td><input type="text" value="XJY5YA" id="interbankzip" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank Country</td>        <td><input type="text" value="CA" id="interbankcountry" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank Routing</td>        <td><input type="text" value="ABC123456XYZ" id="interrouting" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Intermediary Bank Swift</td>        <td><input type="text" value="ABABABABABA" id="interswift" class="input is-info" onclick="inputShow(this)"/></td>      </tr>      <tr>        <td>Validation Notes</td>        <td><input type="text" value="Some notes here" id="notes" class="input is-info" onclick="inputShow(this)"/></td>      </tr>    </tbody>  </table> <div><button type="button" id="btnClear" class="button is-info">Clear Text</button></div> <table class="ui table compact collapsing" id="payinfoactions">    <tbody>        <tr>          <td>            Action          </td>          <td>            <div class="select is-info">                <select name="action" id="action">                  <option value="New">New</option>                </select>            </div>          </td>          <td><button type="button" id="btnAuditLog" class="button is-info">Show Audit Log</button></td>        </tr>    </tbody>  </table><table class="ui table compact collapsing" id="attachmentsTable">    <thead>      <tr>        <th>Filename</th>        <th>Date</th>        <th>View</th>      </tr>    </thead>    <tbody></tbody>    </table> <div class="file is-boxed is-primary" id="filesDiv">  <label class="file-label">    <input class="file-input" type="file" name="attachment" id="attachment" onchange="setFileName();" multiple>    <span class="file-cta">      <span class="file-icon">        <i class="fas fa-upload"></i>      </span>      <span class="file-label">Select File to Upload      </span>    </span>      <span class="file-name" id="uploadFileName">    </span>  </label></div><button type="button" id="btnUploadFile" class="button is-info">Upload File</button> <button type="button" id="btnAttachAuditLog" class="button is-info">Show File Log</button> <table class="ui table compact collapsing" id="workflow">    <tbody>      <tr>        <td>Workflow</td>        <td id="wf_name"></td>      </tr>      <tr>        <td>Current Step</td>        <td id="wf_currentstep"></td>      </tr>      <tr>        <td>          Next Step        </td>        <td>          <div class="select is-info">           <select name="wf_stepnext" id="wf_stepnext">           </select>         </div>        </td>      </tr>      <tr>        <td>WF Notes</td>        <td><input type="text" value="" id="wf_notes" class="input is-info "/></td>      </tr>      <tr>        <td>          <button type="button" id="btnSave" class="button is-info">Save</button>        </td>      </tr>    </tbody>  <table class="ui table compact collapsing" id="wf_history">    <thead>      <tr>        <th>Step</th>        <th>User</th>        <th>Date</th>        <th>Notes</th>      </tr>    </thead>    <tbody></tbody>  </table>').show(), $("#btnSave").on("click", doAction), $("#btnFilter").on("click", populateTable), $("#btnAuditLog").on("click", populateAudit), $("#btnAttachAuditLog").on("click", populateFilesAudit), $("#btnUploadFile").on("click", uploadFiles).prop("disabled", !0), $("#btnClear").on("click", clearInputs), $("#btnClear").show(), $(document).on("click", "#userList button", function () { getEdit($(this).val()) }), document.getElementById("filesDiv").ondragover = document.getElementById("filesDiv").ondragenter = function (t) { t.preventDefault() }, document.getElementById("filesDiv").ondrop = function (t) { document.getElementById("attachment").files = t.dataTransfer.files, t.preventDefault(), setFileName() } }

function inputShow(t) { "INPUT" === t.tagName && $("#rightbar").hide().show(0) }

function hideModal(t) { $("#" + t).removeClass("is-active") }

function clearInputs() { $("#rightbar .input").val("") }

function clearAllInputs() { $(".input").val("") }

function generateVendorUrl() { const t = document.createElement("textarea");
  t.value = "https://treasurynode-test-innersphere.c9users.io/vendorform", document.body.appendChild(t), t.select(), document.execCommand("copy"), document.body.removeChild(t), alert("Link copied to clipboard") }

function doVendorAction(t) { t.preventDefault(), $(".is-danger").addClass("is-info").removeClass("is-danger"); var e = { legalentityname: $("#legalentityname").val(), dba: $("#dba").val(), taxid: $("#taxid").val(), email1099: $("#email1099").val(), vendorname: $("#vendorname").val(), title: $("#title").val(), address1: $("#address1").val(), address2: $("#address2").val(), city: $("#city").val(), state: $("#state").val(), zip: $("#zip").val() };
  $.ajax({ url: "/vendor/new", type: "POST", data: JSON.stringify(e), contentType: "application/json" }).done(function (t) { if (t.validationErrors) { var e = "<div>";
      t.validationErrors.forEach(t => { $("#" + t.field).removeClass("is-info").addClass("is-danger"), e += "Field: " + t.field + "<ul><li> Error: " + t.msg + "</li></ul>" }), e += "</div>", $("#notificationDiv .header").html("Input Validation Errors"), $("#notificationDiv .content").html(e), $("#notificationDiv").modal("show") } else "" === t.msg ? ($("#notificationDiv .header").html("Confirmation"), $("#notificationDiv .content").html("<p>Form was succesfully submitted</p>"), $("#notificationDiv").modal("show"), $("#vendorform").html("<p>Form was succesfully submitted</p>")) : ($("#notificationDiv .header").html("Error"), $("#notificationDiv .content").html("<p>Error while submitting form: " + t.msg + "</p>"), $("#notificationDiv").modal("show")) }) }

function populateVendorTable() { var t = { id: $("#vendor_id").val(), legalentityname: $("#legal_entity_name").val(), taxid: $("#tax_id").val() };
  Object.keys(t).forEach(e => "" === t[e] && delete t[e]), console.log(JSON.stringify(t)); var e = Object.keys(t).map(e => encodeURIComponent(e) + "=" + encodeURIComponent(t[e])).join("&"); "" !== e && (e = "?" + e), console.log("queryString:" + e), $.getJSON("/vendor/list" + e, function (t) { var e = "";
    $.each(t, function () { e += '<tr id="vendor_' + this.id + '">', e += '<td><button class="button is-primary" value="' + this.id + '">' + this.id + "</button></td>", e += "<td>" + this.legalentityname + "</td>", e += "<td>" + this.dba + "</td>", e += "<td>" + this.taxid + "</td>", e += "<td>" + this.email1099 + "</td>", e += "<td>" + this.vendorname + "</td>", e += "<td>" + this.title + "</td>", e += "<td>" + this.address1 + "</td>", e += "<td>" + this.address2 + "</td>", e += "<td>" + this.city + "</td>", e += "<td>" + this.state + "</td>", e += "<td>" + this.zip + "</td>", e += "</tr>" }), $("#vendorList tbody").html(e) }) }

function getVendorEdit(t) { $.getJSON("/vendor/" + t, function (t) { $("#vendorid").html(t.obj.id), $("#legalentityname").html(t.obj.legalentityname), $("#dba").html(t.obj.dba), $("#taxid").html(t.obj.taxid), $("#email1099").html(t.obj.email1099), $("#vendorname").html(t.obj.vendorname), $("#title").html(t.obj.title), $("#address1").html(t.obj.address1), $("#address2").html(t.obj.address2), $("#city").html(t.obj.city), $("#state").html(t.obj.state), $("#zip").html(t.obj.zip), $("#rightbar").show() }) } $(document).ready(function () { $("#btnSave").on("click", doAction), $("#btnSubmitVendor").on("click", doVendorAction), $("#btnFilter").on("click", populateTable), $("#btnVendorFilter").on("click", populateVendorTable), $("#btnAuditLog").on("click", populateAudit), $("#btnUploadFile").on("click", uploadFiles).prop("disabled", !0), $("#btnAttachAuditLog").on("click", populateFilesAudit), $("#btnClear").on("click", clearInputs), $("#btnClearForm").on("click", clearAllInputs), $(document).on("click", "#userList button", function () { getEdit($(this).val()) }), $(document).on("click", "#vendorList button", function () { getVendorEdit($(this).val()) }), document.getElementById("filesDiv").ondragover = document.getElementById("filesDiv").ondragenter = function (t) { t.preventDefault() }, document.getElementById("filesDiv").ondrop = function (t) { document.getElementById("attachment").files = t.dataTransfer.files, t.preventDefault(), setFileName() }, $("#filter_id").val() && ($("#btnFilter").click(), setTimeout(function () { $("#userList button").length > 0 && $("#userList button").first().click() }, 1e3)) });