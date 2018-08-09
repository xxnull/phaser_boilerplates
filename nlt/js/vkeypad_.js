/* This is Virtual KeyPad (vKeyPad)
 * ----vKeyPad 1.0
 * developed by Lapiz
 * Modified version (Use for numberline only)
 */

window.vKeyPad = function(TextBox, multiInputClass, noHyphen){
    this.selector = TextBox;
    this.multiInputClass = multiInputClass ? multiInputClass : "";
    this.TextBox = [];
    this.noHyphen = noHyphen;
    this.Keys = ["1","2","3","4","5","6","7","8","9","0","."];
    this.additionalMultiKeys = ["&ndash;", "+", "=", "(", ")"];
    this.notCnsdrAsAdd = ["&ndash;"];
    this.AllowedKeys = [8,46,37,39];
    this.AutoClear = false;
    this.KeyPad;
    this.Width = 150;
    this.Height = 150;
    this.MaximumDig = 8;
    this.CurrentFocus = null;
    this.isFraction = false;
    this.isDecimal = true;
    this.isAdditional = true;
    this.isCurrentTargetMulti = false;
    this.loadControls();
    this.init();
};

vKeyPad.prototype = {
    loadControls:function(){
	this.TextBox = $(this.selector);
	for (var t=0; t<this.TextBox.length; t++) {
	    var txtBox = $(this.TextBox[t]);
	    if (txtBox[0]) {
		try{
		    txtBox.unbind('click');
		    txtBox.unbind('focus');
		    txtBox.unbind('blur');
		}
		catch(e){ }
		var vKey = this;
		txtBox.bind('click',function(e){vKey.onFocus(e, vKey)});
		txtBox.bind('focus',function(e){vKey.onFocus(e, vKey)});
		txtBox.bind('blur',function(e){vKey.onBlur(e, vKey)});
		txtBox.blur();
	    }
	}
    },
    enableFraction:function(enable){
	this.isFraction = enable;
	if (!this.isFraction){
	    this.KeyPad.find("#key_slash").css({"background":"url(./images/03.png) no-repeat","text-align":"right"});
	    this.KeyPad.find("#key_triFrac").css({"color":"#fff","background":"url(./images/01.png) no-repeat"});
	}
	else {
	    this.KeyPad.find("#key_slash").css({"background":"url(./images/03.png) no-repeat","text-align":"right"});
	    this.KeyPad.find("#key_triFrac").css({"color":"#fff","background":"url(./images/01.png) no-repeat"});
	}
    },
    enableDecimal:function(enable){
	this.isDecimal = enable;
	if (!this.isDecimal) this.KeyPad.find("#key_10").css({"color":"#ccc"});
	else this.KeyPad.find("#key_10").css({"color":""});
    },
    enableAdditional:function(enable){
	this.isAdditional = enable;
	if (!this.isAdditional) this.KeyPad.find(".vkBtnAdditional").css({"color":"#ccc"});
	else this.KeyPad.find(".vkBtnAdditional").css({"color":""});this.KeyPad.find("#key_slash").css({"background":"url(./images/03.png) no-repeat","text-align":"right"});
	    this.KeyPad.find("#key_triFrac").css({"background":"url(./images/01.png) no-repeat"});
    },
    init:function(){
	if(this.multiInputClass) for (k=0; k < this.additionalMultiKeys.length; k++) this.Keys.push(this.additionalMultiKeys[k]);
        for (var k=0; k < this.Keys.length; k++) this.AllowedKeys.push(this.Keys[k].charCodeAt(0));
	
        this.KeyPad = $("<div class=\"keypadHolder\" style=\"z-index:1000002;position:absolute;width:180px; height:215px;display:table;\" />");
        var cols = 3;
        var rows = Math.ceil(this.Keys.length/cols);
        var num = 0;
        var header = $("<div class=\"numPadHeader\" style=\"position:absolute;right:-13px; top:-9px;\" />");
        this.KeyPad.append(header);
	var vKey = this;
	
        var key = $("<div id=\"numPadClose\" class=\"vkBtnCls\" />");
	var key1 = $("<div id=\"numPadQicon\" class=\"vkBtnQ\" />");
        header.append(key).append(key1);
        //header.append(key);
        key.bind('click', function(){vKey.hidePad()});
	key1.bind('click',Qinst);
	
        var row = $("<div style=\"display:table-row;\" />")
        this.KeyPad.append(row);
	
	if(!this.multiInputClass && !this.noHyphen){
	    var key = $("<div id=\"key_minus\" class=\"vkBtn\" />");
	    key.html("&ndash;");
	    row.append(key);
	    key.bind('click', function(e){vKey.onNumClick(e, vKey);});
	}
	else{
	    var key = $("<div id=\"key_minus\" class=\"vkBtnEmp\" />");
	    key.html("&nbsp;");
	    row.append(key);
	}
	var key = $("<div id=\"key_triFrac\" class=\"vkBtn key_triFrac\" ></div>");
	key.html("");
	row.append(key);
	key.bind('click', function(e){vKey.onNumClick(e, vKey);});
	
        var key = $("<div id=\"key_slash\" class=\"vkBtn key_slash\" ></div>");
	key.html("/");
	row.append(key);
	key.bind('click', function(e){vKey.onNumClick(e, vKey);});
	
	
        
        for (var r=0; r<rows; r++) {
            var row = $("<div style=\"display:table-row; background:none;\" />")
            this.KeyPad.append(row);
            for (var c=0; c<cols; c++) {
		var isExtra = false;
		if (r==3 && c==cols-1) {
		var key = $("<div id=\"key_bs\" class=\"vkBtnBS vkBtn\" />");
        key.html("<svg class=\"delete\" width=\"35\" height=\"25\" viewBox=\"0 0 1024 1024\"><g><path d=\"M921.6 153.6h-489.165c-22.528 0-54.835 12.134-71.782 26.982l-347.955 304.435c-16.947 14.848-16.947 39.117 0 53.965l347.955 304.486c16.947 14.797 49.254 26.931 71.782 26.931h489.165c56.371 0 102.4-46.080 102.4-102.4v-512c0-56.32-46.029-102.4-102.4-102.4zM777.779 716.8l-130.918-130.918-130.816 130.918-73.933-73.882 130.867-130.918-130.867-130.867 73.933-73.933 130.867 130.867 130.867-130.867 73.882 73.933-130.816 130.867 130.867 130.867-73.933 73.933z\"></path></g></svg>");
	
	row.append(key);
	key.bind('click', function(e){vKey.onNumClick(e, vKey);});
		}else{
		if (this.multiInputClass && this.additionalMultiKeys.indexOf(this.Keys[num]) >= 0 && this.notCnsdrAsAdd.indexOf(this.Keys[num]) < 0) isExtra = true;
                if (this.Keys[num]) {
                    var key = $("<div id=\"key_"+num+"\" class=\"vkBtn"+(isExtra ?" vkBtnAdditional":"")+"\" />");
		    key.html(this.Keys[num]);
                    row.append(key);
                    key.bind('click', function(e){vKey.onNumClick(e, vKey);});
                    num++;
                }
            }
	    }
        }
	
//	var key = $("<div id=\"key_bs\" class=\"vkBtnBS vkBtn\" />");
//        key.html("<svg class=\"delete\" width=\"23\" height=\"18\" viewBox=\"0 0 1024 1024\"><g><path d=\"M921.6 153.6h-489.165c-22.528 0-54.835 12.134-71.782 26.982l-347.955 304.435c-16.947 14.848-16.947 39.117 0 53.965l347.955 304.486c16.947 14.797 49.254 26.931 71.782 26.931h489.165c56.371 0 102.4-46.080 102.4-102.4v-512c0-56.32-46.029-102.4-102.4-102.4zM777.779 716.8l-130.918-130.918-130.816 130.918-73.933-73.882 130.867-130.918-130.867-130.867 73.933-73.933 130.867 130.867 130.867-130.867 73.882 73.933-130.816 130.867 130.867 130.867-73.933 73.933z\"></path></g></svg>");
//	
//	row.append(key);
//	key.bind('click', function(e){vKey.onNumClick(e, vKey);});
	
        $('#activityHolder').append(this.KeyPad);
        $(".keypadHolder").draggable({containment: "#activityHolder"});
        this.KeyPad.css({"visibility":"hidden"});
        $('#navigation-container').css({'visibility':'hidden'});
	$(window).bind("touchstart mousedown", function(e){vKey.onWindowClick(e,vKey)});
    },
    onWindowClick:function(event, vKey){
	var vK = vKey.getSelf();
	var isTextBox = vK.getCurrentFocus(event.target);
	var isKeyPad = $(event.target).hasClass("keypadHolder");
	if (!isKeyPad){
	    isKeyPad = $(event.target).parents(".keypadHolder");
	    isKeyPad = isKeyPad.length != 0;
	}
	var keypadstate = $("#QBlocker").is(":visible");
	if (!isTextBox && !isKeyPad && !keypadstate) vK.hidePad();
    },
    onNumClick:function(event, vKey) {
	var vK = vKey.getSelf();
        if (!event) event = window.event;
        var isBackSpace = $(event.target);
        if (isBackSpace.attr('id') != "key_bs") isBackSpace = isBackSpace.parents("#key_bs");
	var isDiv = vK.CurrentFocus.tagName.toLowerCase() == "div";
	var existingText = isDiv ? $(vK.CurrentFocus).html() : vK.CurrentFocus.value;
	if (existingText.indexOf("<") >= 0) existingText = $(vK.CurrentFocus).children().eq(0).attr("alttext");
	if ($(vK.CurrentFocus).attr("mathtext")) existingText = $(vK.CurrentFocus).attr("mathtext");
	if (!existingText) existingText = "";
	else if (existingText.trim() == "")existingText = "";
	var maxDig = vK.MaximumDig;
	if (vK.CurrentFocus.id == "input_interval") {
	    maxDig += 2;
	}
	if(isBackSpace.length > 0 && existingText.length > 0){
	    var newText = existingText.substr(0, existingText.length-1);
	    if (isDiv) {
		$(vK.CurrentFocus).text((newText ? "$"+newText+"$" : ""));
		vK.parseMath();
	    }
	    else vK.CurrentFocus.value = newText ? newText : "";
	}
        else if (isBackSpace.length <= 0 && event.target && (existingText.length < maxDig || (vK.multiInputClass ? $(vK.CurrentFocus).hasClass(vK.multiInputClass) : false))) {
	    var e = $.Event('keypress');
	    var isAdditionalKey = $(event.target).hasClass("vkBtnAdditional");
	    var keyedText = $(event.target).text();
	    if (event.target.id == "key_triFrac") keyedText = " ";
	    else if (event.target.id == "key_minus") keyedText = "-";
	    if (keyedText.trim() == "\u2013") keyedText = "-";
	    var pass = true;
	    if(!vK.isDecimal && keyedText == ".") pass = false;
	    if((!vK.isFraction || !isDiv) && (keyedText == " " || keyedText == "/")) pass = false;
	    if (isAdditionalKey && !vK.isAdditional) pass = false;
	    if (pass) {
		var lastChar = "", lastBtOne = "", lastSet = "";
		if (existingText.length > 0) lastChar = existingText.substr(existingText.length-1);
		if (existingText.length > 1) lastBtOne = existingText.substr(existingText.length-2, 1);
		var spaceLI = existingText.lastIndexOf(" ");
		var slashLI = existingText.lastIndexOf("/");
		//Common Check >>
		if (keyedText == " ") {
		    if (existingText.length <= 0) pass = false;
		    else if (slashLI >= 0) {
			var afterSlashVal = existingText.substr(slashLI);
			if (!afterSlashVal.match(/[+|\-|=|\(|\)|\A]\d+/g)) pass = false;
		    }
		    if (spaceLI >= 0) {
			var afterSpaceVal = existingText.substr(spaceLI);
			if (!afterSpaceVal.match(/\d+\/\d+/g)) pass = false;
		    }
		}
		else if (keyedText == "/") {
		    if (existingText.length <= 0) pass = false;
		    else if (existingText.length >= 0){
			if (lastChar == "." || lastChar == " ") pass = false;
		    }
		}
		else if (keyedText == "+" || keyedText == "-" || keyedText == "=" || keyedText == "(" || keyedText == ")") {
		    if (spaceLI >= 0) {
			var afterSpaceVal = existingText.substr(spaceLI);
			if (!afterSpaceVal.match(/\d+\/\d+/g)) pass = false;
		    }
		}
		//.replace("(","\\(").replace(")","\\)")
		
		//Common Check <<
		//Single Check >>
		if (!vK.isCurrentTargetMulti && pass) {
		    if (keyedText == " "){
			if (existingText.indexOf(".") >= 0 || existingText.indexOf("/") >= 0) pass = false;
		    }
		    else if (keyedText == "."){
			if (existingText.indexOf(".") >= 0 || existingText.indexOf("/") >= 0) pass = false;
		    }
		    else if (keyedText == "/") {
			if (existingText.indexOf("/") >= 0 || existingText.indexOf(".") >= 0) pass = false;
		    }
		    else if (keyedText == "-") {
			if (existingText != "") pass = false;
		    }
		}
		//Single Check <<
		//MultiTarget Check >>
		else if(vK.isCurrentTargetMulti && pass) {
		    lastSet = existingText;
		    if (existingText.length > 0){
			var plsIndx = existingText.lastIndexOf("+");
			var minIndx = existingText.lastIndexOf("-");
			var eqIndx = existingText.lastIndexOf("=");
			var oPIndx = existingText.lastIndexOf("(");
			var cPIndx = existingText.lastIndexOf(")");
			var lastIndx = Math.max(plsIndx, minIndx, eqIndx,oPIndx, cPIndx);
			if (lastIndx >= 0) lastSet = existingText.substr(lastIndx+1);
		    }
		    if (keyedText == " "){
			if(lastChar == "" || lastChar == " " || lastChar == "/" || lastChar == ".") pass = false;
		    }
		    else if (keyedText == "."){
			if(lastChar == "." || lastChar == "." || lastSet.indexOf(".") >= 0) pass = false;
		    }
		    else if (keyedText == "/") {
			if (lastChar == "." || lastChar == "-" || lastChar == " " || lastChar == "+" || lastSet.indexOf("/") >= 0) pass = false;
		    }
		    else if (keyedText == "-") {
			if (lastChar == "." || lastChar == "/" || lastChar == "-" || lastChar == " ") pass = false;
		    }
		    else if (keyedText == "+") {
			if (lastChar == "." || lastChar == "/" || lastChar == "-" || lastChar == "+" || lastChar == " ") pass = false;
		    }
		    else if (keyedText == "=") {
			if (lastChar == "." || lastChar == "/" || lastChar == "-" || lastChar == "+" || lastChar == "=") pass = false;
			else if (lastChar == " " && (lastBtOne == "-" || lastBtOne == "+" || lastBtOne == "." || lastBtOne == "/" || lastBtOne == "=")) pass = false;
		    }
		}
		//MultiTarget Check <<
		//FinalCheck >>
		if (keyedText == "."){
		    if (existingText.length <= 0 || lastChar == "+" || lastChar == "-" || lastChar == "=" || lastChar == " " || lastChar == "/"){
			keyedText = "0"+keyedText;
			//if (lastBtOne == " " && lastBtOne != "" && (lastChar != "+" && lastChar !="-" && lastChar != "=")) keyedText = "+"+keyedText;
		    }
		}
		if (!isNaN(keyedText) && lastBtOne != "") {
		    //if (lastChar == " " && !isNaN(lastBtOne) && lastSet.indexOf("/") >= 0) keyedText = "+"+keyedText;
		}
		//FinalCheck <<
		if (pass) {
		    var newText = existingText + keyedText;
		    if (isDiv) {
			$(vK.CurrentFocus).text("$"+newText+"$");
			vK.parseMath();
			if (vK.isCurrentTargetMulti && $(vK.CurrentFocus).children().length > 0) {
			    var _innerWidth = $(vK.CurrentFocus).children().eq(0).width();
			    var _outterWidth = $(vK.CurrentFocus).width();
			    if (_outterWidth - _innerWidth < 20) {
				$(vK.CurrentFocus).text("$"+existingText+"$");
				vK.parseMath();
			    }
			}
		    }
		    else{
			vK.CurrentFocus.value = newText;
		    }
		}
	    }
	}
	vK.onTextChanged(event);
	$(".icoReset").css({"opacity":"1"});
	try{
	$(".icoReset").unbind(eventType, resetClick);
	}catch(e){}
	$(".icoReset").bind(eventType, resetClick);
    },
    parseMath:function(target){
	try{
	    var isExt = target ? true : false;
	    if (!target) target = $(this.CurrentFocus);
	    var space = "&emsp;"
	    var existingValue = "", newValue = "";
	    try{
		if (isExt) existingValue = target.attr("actualText");
		else existingValue = target.children().eq(0).attr("alttext");
	    }
	    catch(e){}
	    if (!existingValue) existingValue = target.text().replace(/\$/g, "");
	    target.attr("mathtext", existingValue);
	    newValue = existingValue;
	    var spaceLI = newValue.lastIndexOf(" ");
	    var slashLI = newValue.lastIndexOf("/");
	    var hideNumerator = false, hideDenominator = false;
	    if (spaceLI > 0 && spaceLI > slashLI) {
		var afterSpaceVal = newValue.substr(spaceLI);
		var checkFurter = true;
		if (checkFurter) {
		    if (!afterSpaceVal.match(/\d+/g)){
			newValue += "0/0";
			hideNumerator = true;
			hideDenominator = true;
		    }
		    else if (!afterSpaceVal.match(/\d+\//g)){
			newValue += "/0";
			hideDenominator = true;
		    }
		    else if (!afterSpaceVal.match(/\d+\/\d+/g)){
			newValue += "0";
			hideDenominator = true;
		    }
		}
	    }
	    else if (slashLI > 0 && slashLI > spaceLI) {
		var afterSlashVal = newValue.substr(slashLI);
		if (!afterSlashVal.match(/\d+/g)){
		    newValue += "0";
		    hideDenominator = true;
		}
	    }
	    
	    if (newValue != "")
		target.text("$"+newValue+"$");
	    else target.text("");
	    
	    M.parseMath(target[0]);
	    
	    $(this.CurrentFocus).children().eq(0).attr("alttext", existingValue);
	    
	    $(this.CurrentFocus).attr("actualText", $(this.CurrentFocus).children().eq(0).attr("alttext"));
	    
	    if (hideNumerator) {
		var numerators = target.find(".fm-num-frac");
		if(numerators.length > 0) numerators.eq(numerators.length-1).html("<mn>"+space+"</mn>");
	    }
	    if (hideDenominator) {
		var denominators = target.find(".fm-den-frac");
		if(denominators.length > 0) denominators.eq(denominators.length-1).html("<mn>"+space+"</mn>");
	    }
	    
	    var fractions = target.find(".fm-frac");
	    for(var i=0; i<fractions.length; i++){
		var isMixed = false;
		var prev = fractions.eq(i).parent().prev();
		if (prev.length) {
		    var mixedNum = parseInt(prev.text());
		    if (!isNaN(mixedNum)) isMixed = true;
		}
		if (!isMixed) fractions.eq(i).find("mn").css({"font-size":"22px"});
	    }
	}
	catch(e){ }
    },
    onFocus:function(event, vKey){
	var vK = vKey.getSelf();
	$(vK.selector).css({"background": ""});
        if (vK.KeyPad) vK.KeyPad.css({"visibility":"visible"});
	if(vK.AutoClear) {
	    event.target.innerText = "";
	    vK.ActualText = "";
	}
	if (vK.CurrentFocus) vK.triggerChange(vK.CurrentFocus);
	vK.CurrentFocus = vK.getCurrentFocus(event.target);
	vK.isCurrentTargetMulti = false;
	if (vK.multiInputClass && $(vK.CurrentFocus).hasClass(vK.multiInputClass)){
	    vK.enableAdditional(true);
	    vK.isCurrentTargetMulti = true;
	}
	else if (vK.multiInputClass) vK.enableAdditional(false);
	$(vK.CurrentFocus).css({"background": "#faecc9"});
    },
    getCurrentFocus:function(target){
	var focusElement = null;
	if (this.selector.indexOf("#") == 0) {
	    if ($(target).attr("id") == this.selector.substr(1)) focusElement = $(target)[0];
	    else focusElement = $(target).parents(this.selector)[0];
	}
	else if (this.selector.indexOf(".") == 0){
	    if ($(event.target).hasClass(this.selector.substr(1))) focusElement = $(target)[0];
	    else focusElement = $(target).parents(this.selector)[0];
	}
	return focusElement;
    },
    hidePad:function(){
        var vK = this.getSelf();
        if(vK.KeyPad) vK.KeyPad.css({"visibility":"hidden"});
	$(vK.selector).css({"background": ""});
	$(vK.selector).blur();
	if (vK.CurrentFocus) vK.triggerChange(vK.CurrentFocus);
	vK.CurrentFocus = null;
    },
    triggerChange:function(){},
    onBlur:function(event, vKey){ },
    getSelf:function(){
        return this;
    },
    onTextChanged:function(){
	
    }
};