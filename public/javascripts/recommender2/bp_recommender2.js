jQuery(document).ready(function() {  
  $("#recommender_button").click(getRecommendations);    
  $("#insert_text_link").click(insertSampleText);
  $("#insert_keywords_link").click(insertSampleKeywords);
  $("#show_advanced_options_link").click(showAdvancedOptions);
  $("#hide_advanced_options_link").click(hideAdvancedOptions);
  
  $('input[name=input_type]:radio').change(function () {
    enableEdition()});
  
  $('input[name=output_type]:radio').change(function () {
    enableEdition()});
  
  $('#input_wc').click(enableEdition);
  $('#input_ws').click(enableEdition);
  $('#input_wa').click(enableEdition);
  $('#input_max_ontologies').click(enableEdition);
  
  $("#advanced_options").hide();
  $("#hide_advanced_options_link").hide();
  $("#no_results").hide();
  hideValidationMessages();
  
});

function enableEdition() {
     $("#input_text").show();
     $("#recommender_results").hide();
     $('#results_header').empty();
     $('#results').empty();
     $("#edit_button").hide();
     $("#recommender_button").show();
    $('input[name=input_type]').attr("disabled",false);
  }

function insertSampleText() {
  enableEdition();
  var text = 'Primary treatment of DCIS now includes 3 options: lumpectomy without lymph node surgery plus whole breast radiation (category 1); total mastectomy with or without sentinel node biopsy with or without reconstruction (category 2A); lumpectomy without lymph node surgery without radiation (category 2B). Workup for patients with clinical stage l, llA, llB, or T3,N1,M0 disease was reorganized to distinguish optional additional studies from those recommended for all of these patients. Recommendation for locoregional treatment for patients with clinical stage l, llA, llB, or T3,N1,M0 disease with 1-3 positive axillary nodes following total mastectomy was changed from "Consider" to "Strongly consider" postmastectomy radiation therapy. For patients with hormone receptor-positive, HER2-negative tumors that are 0.6-1.0 cm and moderately/poorly differentiated or with unfavorable features, or > 1 cm, the recommendation for use of a 21-gene RT-PCR assay (category 2B) was added to the systemic adjuvant treatment decision pathway as an option for guiding chemotherapy treatment decisions. Systemic adjuvant treatment for patients with tubular or colloid tumors that are hormone receptor-positive and node-positive was changed from "adjuvant hormonal therapy + adjuvant chemotherapy" to "adjuvant hormonal therapy adjuvant chemotherapy". For hormone receptor-positive, node negative tubular/colloid tumors that are 1 cm, the recommendation for use or consideration of adjuvant chemotherapy was removed. The heading for workup for patients with locally advanced invasive cancer was modified to specify "Noninflammatory" disease and reorganized to distinguish optional additional studies from those recommended for all of these patients.';
  jQuery("#input_text").focus();
  jQuery("#input_text").val(text);
  $("#not_text_error").hide();
  $("#radio_it_text").prop("checked", true);
  
}

function insertSampleKeywords() {
  enableEdition();
  var text = "Backpain, White blood cell, Carcinoma, Cavity of stomach, Ductal Carcinoma in Situ, Adjuvant chemotherapy, Axillary lymph node staging, Mastectomy, tamoxifen, serotonin reuptake inhibitors, Invasive Breast Cancer, hormone receptor positive breast cancer, ovarian ablation, premenopausal women, surgical management, biopsy of breast tumor, Fine needle aspiration, entinel lymph node, breast preservation, adjuvant radiation therapy, prechemotherapy, Inflammatory Breast Cancer, ovarian failure, Bone scan, lumpectomy, brain metastases, pericardial effusion, aromatase inhibitor, postmenopausal, Palliative care, Guidelines, Stage IV breast cancer disease, Trastuzumab, Breast MRI examination";
  jQuery("#input_text").focus();
  jQuery("#input_text").val(text);
  $("#not_text_error").hide();
  $("#radio_it_keywords").prop("checked", true);
}

function showAdvancedOptions() {
  $("#advanced_options").show();
  $("#show_advanced_options_link").hide();
  $("#hide_advanced_options_link").show();
}

function hideAdvancedOptions() {
  $("#advanced_options").hide();
  $("#show_advanced_options_link").show();
  $("#hide_advanced_options_link").hide();
}

function getHighlightedTerms(data, rowNumber) {
  var inputText = document.getElementById("input_text").value;
  var newText = new String("");
  // Terms covered
  var terms = new String("");
  var lastPosition = 0;
  for (var j = 0; j < data.result[rowNumber].coverageResult.annotations.length; j++) {
    var from = data.result[rowNumber].coverageResult.annotations[j].from-1;
    var to = data.result[rowNumber].coverageResult.annotations[j].to;
    var link = data.result[rowNumber].coverageResult.annotations[j].conceptUri;
    var term = inputText.substring(from, to);
    
    var replacement = '<a style="background-color: #FFFF00" target="_blank" href=' + link + '>' + term + '</a>';
    
    if (from>lastPosition) {
      newText+=inputText.substring(lastPosition, from);
    }
    newText += replacement;
    lastPosition = to;
  }
  
  if (lastPosition < inputText.length) {
    newText += inputText.substring(lastPosition, inputText.length);
  }
  return newText;
}

function replaceAtPosition(start, end, text, replacement) {
  var newText = new String("");
  newText = text.substring(0, start-1) +
    replacement + text.substring(end+1, text.length);    
    return newText;  
}

function hideValidationMessages() {
  $("#sum_weights_error").hide();
  $("#range_weights_error").hide();
  $("#max_ontologies_error").hide();
  $("#not_text_error").hide();
}

function getRecommendations() {
  hideValidationMessages();
  var errors = false;
  // Check if the input text field is empty
  if ($("#input_text").val().length==0) {
    $("#not_text_error").show();
    errors = true;
  }
  // Check sum of weights
  var wc = parseFloat($("#input_wc").val());
  var ws = parseFloat($("#input_ws").val());
  var wa = parseFloat($("#input_wa").val());
  if (wc + ws + wa != 1) {
    $("#sum_weights_error").show();
    errors = true;
  }
  // Check range of weights
  if ((wc < 0)||(wc > 1)||(ws < 0)||(ws > 1)||(wa < 0)||(wa > 1)) {    
    $("#range_weights_error").show();
    errors = true;
  }
  // Check maximum number of ontologies per set
  var maxOntologies = parseFloat($('#input_max_ontologies').val());
  if ((maxOntologies < 2)||(maxOntologies > 4)) {
    $("#max_ontologies_error").show();
    errors = true;
  }
  
  if (!errors) {
    hideValidationMessages();
    $('.recommender_spinner').show();
    var params = {};
    params.text = $("#input_text").val();
    // Input type (text or keywords)
    if ($('#radio_it_text').is(':checked'))
      params.inputType = 1; //text
    else
      params.inputType = 2; //keywords
    // Output type (ontologies or ontology sets)
    if ($('#radio_ot_single').is(':checked'))
      params.outputType = 1; //ontologies
    else
      params.outputType = 2; //ontology sets
    // Weights
    params.wc = $('#input_wc').val();
    params.ws = $('#input_ws').val();
    params.wa = $('#input_wa').val();
    // Maximum number of ontologies per set (only for the "ontology sets" output)
    params.maxOntologiesInSet = $('#input_max_ontologies').val();    
    $.ajax({    
      type: "GET",
      data: params,
      url: "http://localhost:9090/recommender2",
      dataType: "jsonp",
      jsonp: "callback",
      success: function(data) {       
        $('.recommender_spinner').hide();
        if (data) {
          if (data.result.length!=0) {
            $("#no_results").hide();
            $('#results').empty();
            $('#results_header').text('Recommended ontologies');
            
            var table = $('<table id="recommendations" class="zebra" border="1" style="display: inline-block; padding:0px" ></table>'); //create table
            var header = $('<tr><th>POS.</th>'
                           + '<th>Ontology</th>'
                           + '<th>Final score</th>'
                           + '<th>Coverage <br>score</th>'
                           + '<th>Specialization <br>score</th>'
                           + '<th>Acceptance <br>score</th>'
                           //+ '<th>Terms</th>'
                           + '<th>Annotations</th>'
                           + '<th>Highlight <br>annotations</th>'
                           + '</th>');
            table.append(header);
    
            for (var i = 0; i < data.result.length; i++) {
              var position = i + 1;
    
              // Terms covered
              var terms = new String("");
              for (var j = 0; j < data.result[i].coverageResult.annotations.length; j++) {
                terms += ('<a target="_blank" href=' + data.result[i].coverageResult.annotations[j].conceptUri + '>' + data.result[i].coverageResult.annotations[j].text + '</a>, ');
              }
              // Remove last comma and white
              terms = terms.substring(0, terms.length - 2);
    
              var finalScore = data.result[i].finalScore * 100;
              var coverageScore = data.result[i].coverageResult.normalizedScore * 100;
              var specializationScore = data.result[i].specializationResult.normalizedScore * 100;
              var acceptanceScore = data.result[i].acceptanceResult.score * 100;
    
              //create row
              var row = '<tr><td>' + position + '</td><td>';
                    
              $.each(data.result[i].ontologyUrisBioPortal, function (j, item) {
                row += '<a target="_blank" href=' + data.result[i].ontologyUrisBioPortal[j] + '>'
                + data.result[i].ontologyNames[j] + '</a> (' + data.result[i].ontologyAcronyms[j] + ')<br />'});
              
              row += "</td>";
  
              row += '<td><div style="width:120px"><div style="text-align:left;width:' + finalScore.toFixed(0) + '%;background-image:url(/images/new/gradient_120px_2.png);border-style:solid;border-width:1px;border-color:#234979">' + finalScore.toFixed(1) + '</div></div>' + '</td>'
                          + '<td><div style="width:120px"><div style="text-align:left;width:' + coverageScore.toFixed(0) + '%;background-color:#8cabd6;border-style:solid;border-width:1px;border-color:#3e76b6">' + coverageScore.toFixed(1) + '</div></div>' + '</td>'
                          + '<td><div style="width:120px"><div style="text-align:left;width:' + specializationScore.toFixed(0) + '%;background-color:#8cabd6;border-style:solid;border-width:1px;border-color:#3e76b6">' + specializationScore.toFixed(1) + '</div></div>' + '</td>'
                          + '<td><div style="width:120px"><div style="text-align:left;width:' + acceptanceScore.toFixed(0) + '%;background-color:#8cabd6;border-style:solid;border-width:1px;border-color:#3e76b6">' + acceptanceScore.toFixed(1) + '</div></div>' + '</td>'
                          //+ '<td>' + terms + '</td>'
                          + '<td>' + data.result[i].coverageResult.annotations.length + '</td>'
                          + '<td>' + '<div style="text-align:center"><input style="vertical-align:middle" id="chk' + i + '" type="checkbox"/></div>'
                          + '</tr>'; 
              table.append(row); //append row to table
            }
            $('#results').append(table); //append table to your dom wherever you want
             
            // hide get recommentations button
            $("#recommender_button").hide();
            // show edit button
            $("#edit_button").show();
            // disable radio buttons
            //$('input[name=input_type]').attr("disabled",true);
        
            // check first checkbox and highlight annotations
            checkFirst(data);
        
            // checkboxes listeners   
            for (var i = 0; i < data.result.length; i++) {      
              $("#chk" + i).click( function(){           
                var $this = $(this);
                var $rowNumber = $this.attr("id").substring(3);
                if( $this.is(':checked')) {
                  // Deselect all the rest checkboxes
                  for (var j = 0; j < data.result.length; j++) {
                    if (j!=$rowNumber) {
                      $("#chk" + j).prop('checked', false);
                    }
                  }            
                  // Terms covered
                  var terms = getHighlightedTerms(data, $rowNumber);                       
                  $("#recommender_results").empty();
                  $("#recommender_results").append(terms);
                  $("#recommender_results").show();
                }            
              });
            }
        
            // edit input button - click
            $("#edit_button").click( function(){        
              enableEdition()
            });
          }
          else { //no results
            $("#no_results").show();
          }
        }
      },
      error: function(errorData) {
        $("#results").append("error!");
        $("#results").append(JSON.stringify(errorData));
        console.log('error', errorData);
      }
      
    });
  }
}

// check first checkbox and highlight annotations
  function checkFirst(data) {
     var terms = getHighlightedTerms(data, 0);
      $("#chk0").prop('checked', true);
      $("#input_text").hide();
      $("#recommender_results").empty();
      $("#recommender_results").append(terms);
      $("#recommender_results").show();
  }