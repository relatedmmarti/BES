function vendorForm_validateForm(){event.preventDefault(),$(".is-danger.is-info,.is-danger.is-primary").removeClass("is-danger"),$("#agreeementLbl").css("border","none");var e="";$("[name='addressLine1']").each(function(){e+=$(this).val()+"`"});var t="";$("[name='city']").each(function(){t+=$(this).val()+"`"});var o="";$("[name='state']").each(function(){o+=$(this).val()+"`"});var i="";$("[name='zipcode']").each(function(){i+=$(this).val()+"`"});var n={legalname:$("#legalname").val(),dba:$("#dba").val(),contactname:$("#contactname").val(),contacttitle:$("#contacttitle").val(),contactemail:$("#contactemail").val(),contactphone:$("#contactphone").val(),fieldname:$("#fieldname").val(),fieldtitle:$("#fieldtitle").val(),fieldemail:$("#fieldemail").val(),fieldphone:$("#fieldphone").val(),project_legal_entity:$("#project_legal_entity").val(),project_code:$("#project_code").val(),project_name:$("#project_name").val(),po:$("#po").val(),accountingname:$("#accountingname").val(),accountingtitle:$("#accountingtitle").val(),accountingemail:$("#accountingemail").val(),accountingphone:$("#accountingphone").val(),email1099:$("#email1099").val(),taxid:$("#taxid").val(),remitAddress_Yes:$("#remitAddress_Yes").prop("checked")?"yes":"no",remitAddress_No:$("#remitAddress_No").prop("checked")?"yes":"no",addressLine1s:e,cities:t,states:o,zipcodes:i,personalRelation_Yes:$("#personalRelation_Yes").prop("checked")?"yes":"no",personalRelation_No:$("#personalRelation_No").prop("checked")?"yes":"no",employee_relation_explanation:$("#employee_relation_explanation").val(),w9Attachment:$("#w9Attachment")[0].files.length,no_w9_expl:$("#no_w9_expl").val(),coiAttachment:$("#coiAttachment")[0].files.length,no_coi_expl:$("#no_coi_expl").val(),workCompAttachment:$("#workCompAttachment")[0].files.length,workCompExempt:$("#workCompExempt")[0].files.length,otherAttachment:$("#otherAttachAttachment")[0].files.length,agreementChk:$("#agreementChk").prop("checked")?"yes":"no"};$.ajax({url:"/vendor_external/new",type:"POST",data:JSON.stringify(n),contentType:"application/json"}).done(function(e){if(e.validationErrors){var t="<div>";e.validationErrors.forEach(e=>{$("#"+e.container).addClass("is-danger"),t+="Field: "+e.field+"<ul><li> Error: "+e.msg+"</li></ul>","agreement"===e.field&&$("#agreeementLbl").css("border","3px solid red")}),t+="</div>",$("#notificationDiv .header").html("Input Validation Errors"),$("#notificationDiv .content").html(t),$("#notificationDiv").modal("show")}else""===e.msg||($("#notificationDiv .header").html("Error"),$("#notificationDiv .content").html("<p>Error while submitting form: "+e.msg+"</p>"),$("#notificationDiv").modal("show"))})}function setFileNamesExternal(e){if(!(e.length<1)){var t=e.toString().replace("Div","FileName"),o=e.toString().replace("Div","Attachment");$("#"+t).html("");var i=$("#"+o)[0].files;if(i.length>0)for(var n=0;n<i.length;n++)-1!="pdf,jpg,jpeg,bmp,xls,doc,tiff,tif,gif,docx,xlsx,txt,msg,xlsm,xlsb,zip,ppt,pptx,png".indexOf(i[n].name.substring(i[n].name.lastIndexOf(".")+1))?$("#"+t).html($("#"+t).html()+" "+i[n].name):(alert("Invalid file extension found: "+i[n].name.substring(i[n].name.lastIndexOf(".")+1)),$("#"+o)[0].value="",$("#"+t).html(""));else $("#"+t).html("")}}function addAddress(){$("#addressActionsTR").before('<tr class="addressTR"><td colspan="5"><hr style="margin:0"/></td></tr><tr name="addressTR" class="addressTR">        <td><label class="label">Address Line:</label>        </td>        <td colspan="4">          <input class="input is-info" type="text" name="addressLine1" placeholder="Address 1"/>        </td>      </tr>      <tr class="addressTR">        <td>          <label class="label">City</label>        </td>        <td>          <input type="text" class="input is-info" name="city" placeholder="City"/>        </td>        <td colspan="3">          <label class="label inlineLbl">State</label>            <div class="select">              <select name="state">                <option value="">Select state</option>                <option value="AL">Alabama</option>\t              <option value="AK">Alaska</option>\t              <option value="AZ">Arizona</option>\t              <option value="AR">Arkansas</option>\t              <option value="CA">California</option>\t              <option value="CO">Colorado</option>\t              <option value="CT">Connecticut</option>\t              <option value="DE">Delaware</option>\t              <option value="DC">District Of Columbia</option>\t              <option value="FL">Florida</option>\t              <option value="GA">Georgia</option>\t              <option value="HI">Hawaii</option>\t              <option value="ID">Idaho</option>\t              <option value="IL">Illinois</option>\t              <option value="IN">Indiana</option>\t              <option value="IA">Iowa</option>\t              <option value="KS">Kansas</option>\t              <option value="KY">Kentucky</option>\t              <option value="LA">Louisiana</option>\t              <option value="ME">Maine</option>\t              <option value="MD">Maryland</option>\t              <option value="MA">Massachusetts</option>\t              <option value="MI">Michigan</option>\t              <option value="MN">Minnesota</option>\t              <option value="MS">Mississippi</option>\t              <option value="MO">Missouri</option>\t              <option value="MT">Montana</option>\t              <option value="NE">Nebraska</option>\t              <option value="NV">Nevada</option>\t              <option value="NH">New Hampshire</option>\t              <option value="NJ">New Jersey</option>\t              <option value="NM">New Mexico</option>\t              <option value="NY">New York</option>\t              <option value="NC">North Carolina</option>\t              <option value="ND">North Dakota</option>\t              <option value="OH">Ohio</option>\t              <option value="OK">Oklahoma</option>\t              <option value="OR">Oregon</option>\t              <option value="PA">Pennsylvania</option>\t              <option value="RI">Rhode Island</option>\t              <option value="SC">South Carolina</option>\t              <option value="SD">South Dakota</option>\t              <option value="TN">Tennessee</option>\t              <option value="TX">Texas</option>\t              <option value="UT">Utah</option>\t              <option value="VT">Vermont</option>\t              <option value="VA">Virginia</option>\t              <option value="WA">Washington</option>\t              <option value="WV">West Virginia</option>\t              <option value="WI">Wisconsin</option>\t              <option value="WY">Wyoming</option>              </select>            </div>            <label class="label inlineLbl">Zip Code</label>            <input class="input is-info" type="text" name="zipcode" placeholder="Zip Code"/>        </td>      </tr>;')}function removeAddress(){$("[name='addressTR']").length<=1||($("[name='addressTR']").last().prev().remove(),$("[name='addressTR']").last().next().remove(),$("[name='addressTR']").last().remove())}function clearForm(){confirm("This action will delete all information you may have entered into the form, continue?")&&location.reload()}function showInstructions(){$("#notificationDiv .header").html("How to Complete form"),$("#notificationDiv .content").html("<p>Please see below description of all fields in the form</p><ul><li><u><b>New Vendor</b>:</u> Select if this is the first time you are submitting this form</li><li><u><b>Modify Vendor Information</b>:</u> Select if you have already submitted this form and would like to update your information</li><hr/><li><u><b>I. Project, Division and/or Corporate Office - Main Contact/Owners Rep.</b>:</u><ul><li><u><b>Project Legal Entity</b>:</u> Project in which the Vendor will be working on</li><li><u><b>Project Name</b>:</u> Project Name in which the Vendor will be working on</li><li><u><b>Name</b>:</u> Name of Owners Rep from PRH Investments and/or TRG Management Company of Florida that hired the vendor</li><li><u><b>Title</b>:</u> Business Title of Owners Rep from PRH Investments and/or TRG Management Company of Florida that hired the vendor</li><li><u><b>Email</b>:</u> Email of Owners Rep from PRH Investments and/or TRG Management Company of Florida that hired the vendor</li><li><u><b>Phone</b>:</u> Phone of Owners Rep from PRH Investments and/or TRG Management Company of Florida that hired the vendor</li><li><u><b>Project Code</b>:</u> Project Code in which the Vendor will be working on</li><li><u><b>PO #</b>:</u> PO# provided to Vendor</li></ul></li><hr/><li><u><b>II. Vendor Information - Main Contact</b>:</u><ul><li><u><b>Legal Entity Name</b>:</u> Vendor Legal Name</li><li><u><b>DBA</b>:</u> Vendor's \"Doing Business As\" information</li><li><u><b>Name</b>:</u> Name of employee that will serve as main contact on Vendor's side</li><li><u><b>Title</b>:</u> Business Title of employee that will serve as main contact on Vendor's side</li><li><u><b>Email</b>:</u> Email of employee that will serve as main contact on Vendor's side</li><li><u><b>Phone</b>:</u> Phone of employee that will serve as main contact on Vendor's side</li></ul></li><hr/><li><u><b>III. Vendor Accounting Contact</b>:</u><ul><li><u><b>Name</b>:</u> Name of Main Contact on Vendor's Accounting Department</li><li><u><b>Title</b>:</u> Business Title of Main Contact on Vendor's Accounting Department</li><li><u><b>Email</b>:</u> Email of Main Contact on Vendor's Accounting Department</li><li><u><b>Phone</b>:</u> Phone of Main Contact on Vendor's Accounting Department</li><li><u><b>Email for 1099 purposes</b>:</u> Email address to use when emailing 1099s to Vendor</li><li><u><b>Tax ID or SSN</b>:</u> Vendor's Tax ID/SSN</li></ul></li><hr/><li><u><b>Remittance address same as W-9 address</b>:</u><ul><li><u><b>Yes/No</b>:</u> Whether the Vendor's remittance address is the same as the address listed on its W9. Add Remittance Address is different.</li></ul></li><hr/><li><u><b>Types of service you are providing along with any other projects you will be working on</b>:</u><ul><li>Detailed Description of all services you will provide.</li></ul></li><hr/><li><u><b>Does vendor have any business, financial or personal relationship with any employee or relative of any employee of PRH Investments and/or TRG Management Company of Florida or any of its affiliates?</b>:</u><ul><li><u><b>Yes/No</b>:</u> Whether the vendor have any business, financial or personal relationship with any employee or relative of any employee of PRH Investments and/or TRG Management Company of Florida or any of its affiliates. If the answer is <i>Yes</i> then an explanation is required</li></ul></li><hr/><li><u><b>Attachments</b>:</u><ul><li><u><b>W9/W8</b>:</u> Attach most recent signed W9/W8. If not attached then provide explanation</li><li><u><b>Certificates of Insurance (COI) (Commercial and Automobile Liabilities)</b>:</u> Attach most recent Certificates of Insurance (COI) (Commercial and Automobile Liabilities). If not attached then provide explanation</li><li><u><b>Certificate of Insurance - Worker's Compensation</b>:</u> Attach most recent Certificate of Insurance - Worker's Compensation. If not attached then attach exemption document for Worker's Compensation. You can apply for an exemption here: <a href=\"https://apps.fldfs.com/bocexempt/\" target=\"_blank\">https://apps.fldfs.com/bocexempt/</a></li><li><u><b>Contract/Quote/PO/Invoice</b>:</u> Attach Contract/Quote/PO/Invoice</li></ul></li><hr/><li>Click in the <i>ACH and Wire Instructions form</i> link on the Notes section to provide ACH/Wire information</li><li>You must agree we may add you as additional insured with a waiver of subgregation on all applicable policies</li></ul>"),$("#notificationDiv").modal("show")}function addServiceRow(e){$("#servicesTbl tbody").append('<tr>                <td>                  <input type="text" class="input is-info" name="project" placeholder="Project Name">                </td>                 <td>                  <input type="text" class="input is-info" name="services" placeholder="Services Provided">                </td>                <td>                  <button class="button is-info" onclick="addServiceRow(this)">+</button>                  <button class="button is-danger" onclick="removeServiceRow(this)">-</button>                </td>              </tr>')}function removeServiceRow(e){$("#servicesTbl tbody tr").length>1&&e.parentElement.parentElement.remove()}function validateVendorUrlExternal(){$.getJSON("/validateUrl/"+$("#token").val(),function(e){if(""===e.msg)return!0;$("body").html("Invalid URL")})}$(document).ready(function(){$("#eftURL").prop("href","https://treasurynode-test-innersphere.c9users.io/vendorform?token="+$("#efttoken").val()),validateVendorUrlExternal()});