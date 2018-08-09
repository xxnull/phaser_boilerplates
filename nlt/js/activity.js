var mainParent, container, controlPanel, activityHolder, numberlineHolder, cardHolder, cards, equationHolder,headerbar,inEquSetting,handCursor;
var numberline,numericKeyPad;
var feedback;
var messageBox, blocker;
var eventType = "click";
var storedNumericType = "decimal";

$(document).ready(function(){
    if ('ontouchstart' in document.documentElement) {
        eventType = 'touchstart';
    }
    
    mainParent = $("body");
    mainParent.bind("touchmove", function(e){ e.preventDefault(); });
    container = $("<div id=\"container\" class=\"container\"></div>");
    var instructionDivs="<div id=\"blocker\"></div><div  class=\"question\" onclick=\"instruct()\"><span style=\"text-align:left; font-family:Poppins-Regular; font-size:20px;line-height:1.4em;position:absolute;\">Instruction Text</span><div id=\"btnOK\" class=\"btn\" onclick=\"instruct()\"></div><div style=\"position:absolute; left:43%; top:75%;\" ></div></div>";
    numberlineHolder = $("<div id=\"numlineHolder\" class=\"numlineHolders\"></div>");
    cardHolder = $("<div id=\"cardHolder\" class=\"cardHolder\"></div>");
    
    cards = $("<div class=\"draggableCard\" id=\"card_1\" >0.4</div><div class=\"draggableCard\" id=\"card_2\" >0.40</div><div class=\"draggableCard\" id=\"card_3\" >0.04</div><div class=\"draggableCard\" id=\"card_4\">0.38</div>");
    
    controlPanel = $("<div id=\"controlPanel\"></div>");
    settingBtns = $("<div id=\"LockBtn\" class=\"unlocked\"></div>");
    addRemoveBtns = "<div class=\"leftBtns\" id=\"divPointBtn\"><span class=\"toolTipText\">Plot a point</span></div><div  class=\"leftBtns\"id=\"divArrowtBtn\"><span class=\"toolTipText\">Make an arrow</span></div><div class=\"leftBtns\" id=\"divSegmentBtn\"><span class=\"toolTipText\">Create a segment</span></div><div class=\"leftBtns\" id=\"divInequBtn\"><span class=\"toolTipText\">Inequality</span></div><div class=\"leftBtns\" id=\"divEraseBtn\"><span class=\"toolTipText\">Erase</span></div>";
    headerbar=$("<div id=\"header\"><div class=\"buttonContainer\"><div class=\"buttonLeftContainer\" style=\"float: left;width:63%;margin-left:2%;\">"+addRemoveBtns+"</div><div class=\"buttonRightContainer\" style=\"float: right; text-align:right; width: 33%;margin-right:2%;\"><div id=\"LockBtn\" class=\"unlocked\"></div>"+"<div id=\"divSettingBtn\" class=\"rightBtns\"><span class=\"toolTipText\">Change the settings</span></div><div class=\"number-line-zoom\"><div id=\"divZOutBtn\" class=\"rightBtns\"><span class=\"toolTipText\">Zoom out</span></div><div id=\"divZInBtn\" class=\"rightBtns\"><span class=\"toolTipText\">Zoom in</span></div></div>"+"</div></div></div>");    
    inEquSetting=$("<div id=\"inEquSetting\"><div id=\"varValue\">Variable: <input type=\"text\" id=\"var_Val\" class=\"inputDiv\" value=\"x\"/><br/><div style=\"margin-top:20px;\">Circle Type: <input checked type=\"radio\" id=\"open\" name=\"circType\" value=\"open\" /><label class=\"rightPad\" for=\"open\">open (< or >)</label> <input type=\"radio\" id=\"closed\" name=\"circType\" value=\"closed\"/><label class=\"rightPad\" for=\"closed\">closed (&#x2264; or &#x2265;)</label></div><div style=\"display:none;\">Line Type: <input type=\"radio\" id=\"typeRay\" name=\"raytype\" /><label class=\"rightPad\" for=\"typeRay\">ray</label> <input type=\"radio\" id=\"typeSeg\" name=\"raytype\" /><label class=\"rightPad\" for=\"typeSeg\">segment</label></div><br/><div id=\"inEquCondition\" style=\"display:none;\"><ul><li>Erase the first inequality and graph a new one.</li><li>Graph an inequality using another variable.</li><li>Graph the <input checked type=\"radio\" id=\"inEqInter\" name=\"InEqType\" value=\"intersection\" /><label class=\"rightPad\" for=\"inEqInter\" style=\"margin-right:0px;cursor:pointer;\">Intersection</label> or <input type=\"radio\" id=\"inEqUnion\" name=\"InEqType\" value=\"union\" /><label class=\"rightPad\" for=\"inEqUnion\" style=\"margin-right:0px;cursor:pointer;\">Union</label> of a single variable.</li></ul></div><div class=\"btnSetting\" id=\"btnCancel1\"></div><div class=\"btnSetting\" id=\"btn_ok\"></div></div>");
    cardHolder.append(cards);
    equationHolder = $("<div id=\"equationHolder\"></div>");
    activityHolder = $("<div id='activityHolder'></div>");
    
    messageBox = $("<div id=\"messageBox\"><div id=\"messageBox_blocker\"></div><div id=\"messageBox_box\"><div id=\"messageBox_message\"></div><div id=\"messageBox_btnOk\" class=\"btnDesing\">Ok</div></div></div>");
    blocker = $("<div id=\"generalBlocker\" style=\"z-index:9999;\" ></div>");
    feedback = $("<div class=contentFeedback> <div class=btReset><div class=icoReset></div> </div> <div class=\"btInfo\"><div class=\"icoInfo\" onclick='openInst()'></div></div><div class=\"score\"> </div>  </div> ");
    var btnReset=$("<div/>");

    btnReset.addClass("btn disabledState");
    btnReset.attr("id","btnReset");
    //divActivity.append(btnReset); 

    feedback.append(btnReset);
    container.append(controlPanel).append(activityHolder).append(feedback).append(messageBox).append(blocker);
    activityHolder.append(headerbar).append(numberlineHolder).append(cardHolder).append(equationHolder).append(inEquSetting);
  
    $('#btnReset').attr("disabled");
    $('#btnReset').css({'cursor':'default'});
    $('#btnReset').addClass('disabledState');
    // $("#btnReset").mouseenter(function() {
    //     $(this).removeClass("redAct").addClass('red');
    // }).mouseleave(function() {
    //     $(this).removeClass("red").addClass('redAct');
    // }).removeAttr("disabled");
    mainParent.append(container);
    container.append(instructionDivs);
    blocker.hide();
     controlPanel.append("<div id=\"settingPanel\"><div id='mode'>Mode: <input checked type=\"radio\" id=\"rad_decimal\" name=\"NumberType\" value=\"decimals\"><label for=\"rad_decimal\">decimals</label></input><input type=\"radio\" id=\"rad_fraction\" name=\"NumberType\" value=\"fractions\"><label for=\"rad_fraction\">fractions</label></input><input type=\"radio\" id=\"rad_whole\" name=\"NumberType\" value=\"wholeNumbers\" /> <label for=\"rad_whole\">whole numbers</label></div><div id=\"decimals\">Denominator:<br/><input type=\"radio\" id=\"interval_2\" name=\"denom\" value=\"2\"><label for=\"interval_2\">2</label><input type=\"radio\" id=\"interval_3\" name=\"denom\" value=\"3\"><label for=\"interval_3\">3</label><input type=\"radio\" id=\"interval_4\" name=\"denom\" value=\"4\"><label for=\"interval_4\">4</label><input type=\"radio\" id=\"interval_5\" name=\"denom\" value=\"5\"><label for=\"interval_5\">5</label><input type=\"radio\" id=\"interval_6\" name=\"denom\" value=\"6\"><label for=\"interval_6\">6</label><input type=\"radio\" id=\"interval_7\" name=\"denom\" value=\"7\"><label for=\"interval_7\">7</label><input type=\"radio\" id=\"interval_8\" name=\"denom\" value=\"8\"><label for=\"interval_8\">8</label><input type=\"radio\" id=\"interval_9\" name=\"denom\" value=\"9\"><label for=\"interval_9\">9</label><input type=\"radio\" id=\"interval_10\" name=\"denom\" value=\"10\"><label for=\"interval_10\">10</label><input type=\"radio\" id=\"interval_11\" name=\"denom\" value=\"11\"><label for=\"interval_11\">11</label><input type=\"radio\" id=\"interval_12\" name=\"denom\" value=\"12\"><label for=\"interval_12\">12</label></div><div id=\"range\">Range:<br/><input type=\"number\" id=\"input_startNumber\" class=\"inputDiv settingInput\" style=\"margin:0;\" value=\"0\"/> &#x2264; $x$ &#x2264; <input type=\"number\" id=\"input_end\" class=\"inputDiv settingInput\" style=\"margin:0;\" value=\"2\"></div><div class=\"btnSetting\" id=\"btnCancel\"></div><div class=\"btnSetting\" id=\"btn_generate\"></div></div><div id=\"decimal_interval\"><input type=\"radio\" checked id=\"dec_interval_1\" name=\"dec_interval\" /><label class=\"rightPad\" for=\"dec_interval_1\">$0.1$</label> <input type=\"radio\" id=\"dec_interval_2\" name=\"dec_interval\" /><label class=\"rightPad\" for=\"dec_interval_2\">$0.01$</label> <input type=\"radio\" id=\"dec_interval_3\" name=\"dec_interval\" /><label class=\"rightPad\" for=\"dec_interval_3\">$0.001$</label></div>");
    messageBox.hide();
    $("#messageBox_btnOk").click(function(){
    //$('#toss').one("click",tossfn);
    messageBox.hide();
    count = 0;
    })
    $("#btn_generate").click(changeNumberLine);
    $("#btnCancel").click(cancelSetting);
    $("#btnCancel1").click(cancelInEqSetting);
    $('#btn_addPoint,#divPointBtn').bind("click",addPointFn);
    $('#btn_addForward,#divArrowtBtn').bind("click",addForwardFn);
    $('#btn_addBackward').bind("click",addBackwardFn);
    $('#btn_addDifference,#divSegmentBtn').bind("click",addDifferenceFn);
    $('#btn_addInequality,#divInequBtn').bind("click",showIneqSetting);
    $('#btn_ok').bind("click",addInqualityFn);
    $('#divEraseBtn').bind("click",eraserFn);

    $('input[name=NumberType]').click(function() {
        var numberType=$(this).attr("id");
        if(numberType=="rad_fraction"){        
            $('#decimals').css('display','block');            
        }else if(numberType=="rad_decimal"){
            $('#decimals').css('display','none');            
        }else if(numberType=="rad_whole"){
            //numberline.options.numericType="whole";
        }

    });


//1.0625
    M.parseMath(document.body);
    document.fonts.load('10pt "Poppins-Regular"').then(function(){
         numberline = new Numberline(numberlineHolder, equationHolder, {widthAdjMargin:30,numericType:"decimal", defaultTicks:21,noNegative:false,curTickStart:0,forceAddArrows:["right"],xInterval:0.1, maxVisibleTicks:21,disabledArrowCol:"#808080",isForceSnap:true,isTextBoxForAll:true,isKeyValuesLinked:true,bottomSpace:0,cardsHolder:cardHolder, isOverlapAllowed:false, leverSize:{w:20,h:20}, showLabelEvery:1,pointRad:5, defaultFS:20,zoomFactor:2,defaultValues:[],applyKeyPadCallBack:function(){
    return new vKeyPad("");
    // return new vKeyPad(".settingInput");
    }});
         numberline.triggerChange();
         numberline.setNumericState=function () {        
        try {
            if (this.options.numericType == "decimal" && Math.round(this.options.xInterval) != this.options.xInterval) this.NumericKeypad.enableDecimal(true);
            else this.NumericKeypad.enableDecimal(false);
            if (this.options.numericType == "fraction") this.NumericKeypad.enableFraction(false);
            else this.NumericKeypad.enableFraction(false);
        }
        catch (e) { }
    }
         //numberline.setNumericState();
    numberline.triggerParseMath = function(){
        M.parseMath(document.body);
    }
    
    //numberline.lockRuler(false);
    numberline.triggerChange = function(){
        enableReset();
    }

    numberline.currentMode = "addCard";

    });
    /*numberline = new Numberline(numberlineHolder, equationHolder, {widthAdjMargin:30,numericType:"decimal", defaultTicks:21,noNegative:false,curTickStart:0,forceAddArrows:["right"],xInterval:0.1, maxVisibleTicks:21,disabledArrowCol:"#808080",isForceSnap:true,isTextBoxForAll:true,isKeyValuesLinked:true,bottomSpace:0,cardsHolder:cardHolder, isOverlapAllowed:false, leverSize:{w:20,h:20}, showLabelEvery:1,pointRad:5, defaultFS:20,zoomFactor:2,defaultValues:[],applyKeyPadCallBack:function(){
    return new vKeyPad(".settingInput");
    }});*/
    
    
    
    
    $("#divZOutBtn").bind(eventType,zoomOut);
    $("#divZInBtn").bind(eventType,zoomIn);
    $(".icoReset").css({"opacity":"0.5"});
    

    setTimeout(function(){
	//$('body').css({'-webkit-transform':'scale(1)'});
	$("#btnReset").bind(eventType, resetClick);
    },1000);
    
    $('#divSettingBtn').bind(eventType, function(){
         clearButtons();
        showControls();
         // $(this).find("g#icn_cog_blk path").attr("class","selected");
         // $('#icn_cog_blk path').css("fill","#fff");
         //  $('#divSettingBtn').addClass("selected").css('background-color',"#06aee9");

    });

    $('#equationHolder').attr("mathtext", "");
    $('#equationHolder').attr("actualtext", "");
    //numericKeyPad = new vKeyPad(".settingInput", "", true);
    // numericKeyPad.enableDecimal(false);
    // numericKeyPad.enableFraction(false);
    // numericKeyPad.onTextChanged(numericKeyPadTextChanged);
    $('#input_startNumber').bind('keyup mouseup',numericKeyPadTextChanged);
    $('#input_end').bind('keyup mouseup',numericKeyPadTextChanged);
    $('input[name="NumberType"]').change(function(){
        onNumericTypeChange(this);
    });
    onNumericTypeChange(null, "decimal");

    // $('#LockBtn').click(function(){
    //     if(numberline.rulerLocked) {
    //         numberline.lockRuler(false);
    //         $(this).addClass('selected');
    //     }else{
    //         numberline.lockRuler(true);
    //         $(this).removeClass('selected');
    //     }
    // });
    
     
});
function showIneqSetting(){
	blocker.show();
    var inEqCntr=0;
    for(var val=0;val<numberline.values.length;val++){
        if(numberline.values[val].type=="flatLineArrow"){
            inEqCntr++;
        }         
    }
    if(inEqCntr>0){
        $('#inEquCondition').css('display','block');
        $('#inEquSetting').css('height','290px');
    }else{
        $('#inEquCondition').css('display','none');
        $('#inEquSetting').css('height','145px');
    }
	$('#inEquSetting').show();
    
}
function cancelInEqSetting(){
    changeMode("");
	blocker.hide();
	$('#inEquSetting').hide();
    $('#divInequBtn').removeClass("selected");

}
function cancelSetting(){
    $('#settingBtn').find("g#icn_cog_blk path").removeAttr("class")
    showControls(true,false)
}
function enableReset(){
    //$(".icoReset").css({"opacity":"1"});
    $('#btnReset').removeClass("disabledState").css({'cursor':'pointer'});
}

function resetClick() {
    // if ($('.icoReset').css('opacity') == "1") {
    	$(".icoReset").removeClass('icoResetMove');
    	var to=setTimeout(function(){
    	clearInterval(to);
    	$(".icoReset").addClass('icoResetMove');
    	$('.icoReset').css({'opacity':'0.5','cursor':'default'});
    	},200);
    	numberline.reset();
    	$('.'+numberline.options.topCardClass).removeClass(numberline.options.topCardClass);
    	numberline.currentMode = "";
    	$("#btn_addForward").removeClass("selected");
    	$(".score").css({'display':'none'});
    	$(".icoFeed").removeClass("icoFeedMove");
        $('#equationHolder').html("");
        $('#btnReset').addClass("disabledState");
        document.getElementById("rad_decimal").checked=true;
        document.getElementById("interval_2").checked=true;
        $("#input_startNumber").children().eq(0).attr("alttext","0");
        $("#input_end").children().eq(0).attr("alttext","2");
        changeNumberLine();
        clearButtons();
    // }
}

function zoomOut() {
    clearButtons();
    //console.log("called zoom out")
    changeMode("");    
    $('#divZInBtn').removeClass("selected");
    $('#divZOutBtn').addClass("selected");    
    numberline.zoom("out");
    // $(this).find("g#icn_zoom_out_blk path").attr("class","selected")
    // $('.zoom-in').find("g#icn_zoom_in_blk path").removeAttr("class","selected")
   // if(numberline.zoomState==0){
   //      $(".zoom-out").find("g#icn_zoom_out_blk path").removeAttr("class")
   //  }
}

function zoomIn() {    
    //console.log("called zoom in")
    clearButtons();
    changeMode("");
    numberline.zoom("in");
    $('#divZOutBtn').removeClass("selected");
    $('#divZInBtn').addClass("selected")    
    // if(numberline.zoomState==2){
    //     $(".zoom-in").find("g#icn_zoom_in_blk path").removeAttr("class")
    // }
}
function changeMode(mode, isReset){
    $('div[id^="btn_"]').removeClass('selected');
    numberline.currentMode = mode;
    if (!isReset) enableReset();
    //console.log(numberline.currentMode);
}
function changeNumberLine(){
    $('#settingBtn').find("g#icn_cog_blk path").removeAttr("class")
    if(document.getElementById("rad_decimal").checked) storedNumericType = "decimal";
    else if(document.getElementById("rad_fraction").checked)storedNumericType = "fraction";
    //numberline.options.numericType=storedNumericType;
    var interval = 1;
    var denominator = 1;
    var start = 0;
    var end = 11;
    var success = true;
    var errorMessage = "Error in parsing Data. Please ensure your input.";
    numberline.options.isMinLimit = false;
    numberline.options.isMaxLimit = false;
    try{
        // start = $("#input_startNumber").children().eq(0).attr("alttext");
        // end = $("#input_end").children().eq(0).attr("alttext");        
        start = $("#input_startNumber").val();
        end = $("#input_end").val();
        //console.log("NumberRange: "+start,end);
        if (storedNumericType == "fraction") {
            interval = 1;
            if(document.getElementById("interval_2").checked) denominator = 2;
            else if(document.getElementById("interval_3").checked) denominator = 3;
            else if(document.getElementById("interval_4").checked) denominator = 4;
            else if(document.getElementById("interval_5").checked) denominator = 5;
            else if(document.getElementById("interval_6").checked) denominator = 6;
            else if(document.getElementById("interval_7").checked) denominator = 7;
            else if(document.getElementById("interval_8").checked) denominator = 8;
            else if(document.getElementById("interval_10").checked) denominator = 10;
            else if(document.getElementById("interval_11").checked) denominator = 11;
            else if(document.getElementById("interval_12").checked) denominator = 12;            
        }
        else if (storedNumericType == "decimal") {
            denominator = 1;
            if(document.getElementById("dec_interval_1").checked) interval = 0.1;
            else if(document.getElementById("dec_interval_2").checked) interval = 0.01;
            else if(document.getElementById("dec_interval_3").checked) interval = 0.001;
          
        }
        else {
            denominator = 1;
            interval = parseFloat($("#input_interval").text().toString());
            $('#decimals').css('display','none');
            $('#settingPanel').css('height','165px');
        }
        if (!start) start = $("#input_startNumber").val();
        if (!end) end = $("#input_end").val();
        denominator = denominator ? denominator : 1;
        interval = interval ? interval : 1;
        start = start.replace("\u2212", "-").replace("\u2013", "-");

    var result = numberline.changeSetting(storedNumericType.toString(), start.toString(), interval.toString(), end.toString(), denominator);
    //console.log(result);
    numberline.options.isMinLimit = false;
    numberline.options.isMaxLimit = false;
    var mul = 1;
    if (numberline.options.numericType == "fraction") mul = 1;
    else mul = numberline.options.xInterval;
    numberline.options.minimumStart = numberline.options.curTickStart*mul;
    numberline.options.maximumEnd = (numberline.options.curTickStart+numberline.options.curTicks-1)*mul;
    //console.log(numberline.options.maximumEnd);
    numberline.setMinMaxTicks();
    //numberline.currentMode = "createPoint";
    numberline.removeAllValues(numberline.values);        
    numberline.drawRuler(true);    
    success = result.value;
        //$("#input_startNumber").html(result.start ? "$" + result.start + "$" : 0);
        //$("#input_interval")[0].value = result.interval;
        //$("#input_end")[0].value = result.count;
        M.parseMath(document.body);
        errorMessage = result.errorMessage;
    }
    catch(e){ success = false; errorMessage = e; }
    numberline.options.isMinLimit = false;
    numberline.options.isMaxLimit = false;
    if (!success){
        if (errorMessage != "") {
            $("#messageBox_message").html(errorMessage);
            //messageBox.show();
            messageBox.hide();
        }
    }
    else showControls(true, false);	 
}
function Qinst() {
    $("#QBlocker").show();
    $("#block").show();
}
function Qclose() {
    $("#QBlocker").hide();
    $("#block").hide();
}
function instruct(){
	$('.question,#blocker').hide();
	$('.icoInfo').css({'opacity':'1'});
	try {
		$('#instructions-button-container').unbind('click',openInst);
	} catch(e){}
		$('#instructions-button-container').bind('click',openInst);
}

function openInst(){
    $('#blocker').show();
	$('.question,#blocker').show();
	$('.icoInfo').css({'opacity':'0.5'});
}
function eraserFn() { 
clearButtons();   
     var thisMode = "remove"
    // if (numberline.currentMode != thisMode && numberline.values.length != 0) {
    if (numberline.currentMode != thisMode) {
        changeMode(thisMode);            
        $('#divEraseBtn').addClass("selected");          

    }
    else if(numberline.currentMode == thisMode){
        changeMode("");
        $('#divEraseBtn').removeClass("selected");        
    }

}

function addDifferenceFn() {    
   clearButtons();
    var thisMode = "createDifference"
        if (numberline.currentMode != thisMode) {
            changeMode(thisMode);            
             $('#divSegmentBtn').addClass("selected");             
        }
        else{
            changeMode("");
            $('#divSegmentBtn').removeClass("selected");            
        }
}

function addInqualityFn() {   
    clearButtons();
	blocker.hide();
	$('#inEquSetting').hide();
    var thisMode = "createInequality";
    changeMode(thisMode);
    $(this).addClass('selected');       
    $('#divInequBtn').addClass("selected");

}

function addForwardFn() {
    clearButtons();
    var thisMode = "createForward"
        if (numberline.currentMode != thisMode) {
            changeMode(thisMode);            
            $('#divArrowtBtn').addClass("selected");          
        }
        else{
            changeMode("");
            $('#divArrowtBtn').removeClass("selected");
        }
}

function addBackwardFn() {
    var thisMode = "createBackward"
        if (numberline.currentMode != thisMode) {
            changeMode(thisMode);
            $(this).addClass('selected');
        }
        else{
            changeMode("");
            $(this).removeClass('selected');
        }
}

function clearButtons(){
    $('#divPointBtn,#divArrowtBtn,#divSegmentBtn,#divInequBtn,#divEraseBtn,#divZOutBtn,#divZInBtn,#divSettingBtn').removeClass("selected").css('background-color','unset');
    // $('#btn_addPoint').find("g#icn_point_blk").find("#Oval").removeAttr("class");    
    
    // $("#btn_addDifference").find('rect').removeAttr("fill");
    // $("#btn_addDifference").find('rect').removeAttr("class");
    // $("#btn_addDifference").find('rect').attr("fill","#001727");
    
    // $("#btn_eraser").find("g#icn_erase_blk path").removeAttr("class");
    // $("#btn_addForward").find("g#Group-6 path").removeAttr('class');
    // $("#btn_addInequality").find('#inEqRect').attr("fill","#001727");
    // $("#btn_addInequality").find('circle').css("stroke","#001727");
    //  $('#Oval').css("fill","#001727");
    //  $('#Group-6 path').css("fill","#001727");
    
    //  $('#btn_addDifference').find('rect').attr("fill","#001727");
    //  $('#btn_addInequality').find('circle').css("stroke","#001727");
    //  $('#erase').css("fill","#001727");
    //  $('#icn_cog_blk path').css("fill","#001727");
    //   $('#icn_zoom_out_blk path').css("fill","#001727");
    //  $('#icn_zoom_in_blk path').css("fill","#001727");
    
    
}
function addPointFn() {    
    clearButtons();
    var thisMode = "createPoint"
        if (numberline.currentMode != thisMode) {
            changeMode(thisMode);
            $('#divPointBtn').addClass("selected");
        }
        else{
            changeMode("");
            $('#divPointBtn').removeClass("selected");
        }
}
function toggleClassButton(element,className){
	var currentButton=element;
	if(!currentButton.hasClass(className)){
		currentButton.addClass(className);
	}else{
		currentButton.removeClass(className);	
	}
}

function numericKeyPadTextChanged(){
    //console.log($(this).val())
    if ($(this).attr("id") == "input_startNumber") {     
        //var txtBox = $(numericKeyPad.CurrentFocus);
        var txtBox=$(this);
        if(txtBox.text().trim() == ""){
        txtBox.text("\u2212");
        M.parseMath(txtBox[0]);
        }
        //$("#input_end").val($("#input_startNumber").val());
        $("#input_end").find(".fm-prefix-tight").remove();
        try{
        $("#input_end").children().eq(0).attr("alttext", $("#input_startNumber").children().eq(0).attr("alttext").replace("\u2212", "").replace("-", ""));
        if($("#input_startNumber").children().eq(0).attr("alttext").replace("-","").replace("\u2212","").replace(" ", "") == "") $("#input_end").val("");
        }
        catch(e) {  }
        if($("#input_end").children().length <= 0) $("#input_end").val("");
        try{
        $("#input_end").attr("mathtext", $("#input_startNumber").attr("mathtext").replace("\u2212", "").replace("-", ""));
        $("#input_end").attr("actualtext", $("#input_startNumber").attr("actualtext").replace("\u2212", "").replace("-", ""));
        }
        catch(e){}
    }
    
    if ($(this).attr("id") == "input_end") {
        //var txtBox = $(numericKeyPad.CurrentFocus);
        var txtBox=$(this);
        //$("#input_startNumber").val($("#input_end").val());
        try{
        $("#input_startNumber").children().eq(0).attr("alttext", "\u2212"+$("#input_end").children().eq(0).attr("alttext"));
        if($("#input_end").children().eq(0).replace(" ", "") == "") $("#input_startNumber").val("\u2212");
        }
        catch(e) {  }
        if($("#input_end").children().length <= 0)
        $("#input_startNumber").val("\u2212");
        else $("#input_startNumber").children().eq(0).prepend("<mo class=\"fm-prefix-tight\">\u2212</mo>");
        try{
        $("#input_startNumber").attr("mathtext", "\u2212"+$("#input_end").attr("mathtext"));
        $("#input_startNumber").attr("actualtext", "\u2212"+$("#input_end").attr("actualtext"));
        }
        catch(e){ }
    }
    
    }
function onNumericTypeChange(selectedType, numericType, dontLoadDefaults){
    if (selectedType) numericType = selectedType.value.replace("Numbers","");
    numericType = numericType ? numericType : "whole";
    storedNumericType = numericType;
    $('input[value^="'+storedNumericType+'"]').prop('checked', true);
    if (!dontLoadDefaults) {
        $('#input_startNumber').text("$0$");
        $('#input_end').text("$2$");
        $('#input_interval').text("1");
        document.getElementById("interval_2").checked = true;
       // document.getElementById("dec_interval_1").checked = true;
    }
    if (numericType == "fraction") {
        $('#decimal_interval').hide();
        $('#input_interval').hide();
        $('#decimal_intervalLabel').hide();
        $('#fraction_interval').show();
        $('#fraction_intervalLabel').show();
        // numericKeyPad.enableFraction(true);
        // numericKeyPad.enableDecimal(false);

    }
    else {
        //$('#decimal_intervalLabel').show();
        $('#fraction_interval').hide();
        $('#fraction_intervalLabel').hide();
        //numericKeyPad.enableFraction(false);
        if (numericType == "decimal"){
            $('#input_interval').hide();
           // $('#decimal_interval').show();
            //numericKeyPad.enableDecimal(true);
        }
        else {
            $('#input_interval').show();
            $('#decimal_interval').hide();
            //numericKeyPad.enableDecimal(false);

        }
    }
    $("#input_startNumber").removeAttr("mathtext");
    $("#input_startNumber").removeAttr("actualtext");
    $("#input_end").removeAttr("mathtext");
    $("#input_end").removeAttr("actualtext");
    M.parseMath(document.body);
}
function showControls(isForce, isShow) {
    var show = !$('#controlPanel').is(':visible');
    if (isForce) show = isShow;
    if (!show) {
        $('#controlPanel').css({display:'none'});
    blocker.css({display:'none'});
        $('#settingBtn').css({"opacity":"1"});
    }else{
    if($('#settingBtn').hasClass("disable")) return;
        //$('#settingBtn').css({"opacity":"0.5"});
        $('#controlPanel').css({display:'block'});
    blocker.css({display:'block'});
        $('input[value^="'+storedNumericType+'"]').prop('checked', true);
        onNumericTypeChange(null, storedNumericType, true);
    }
}

function onWindowResize(){
    var values = numberline.values.slice();
    numberline.reset();
    numberline.contextDraw.clearRect(0, 0, numberline.drawCanvas.width(), numberline.drawCanvas.height());
    numberline.contextRuler.clearRect(0, 0, numberline.rulerLine.width(), numberline.rulerLine.height());
    numberline.cardsData = [];
    numberline.options.defaultValues=values;
    $('.keypadHolder').remove();
    numberline.unBindListeners();
    numberline.init();
    // var btnResetWidth=$('#btnReset').width()*($('body').width()/1024);
    // //console.log($('#btnReset').width(),btnResetWidth);
    // $('#btnReset').css('width',btnResetWidth+"px");
}