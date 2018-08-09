var preloadImgs=[];
var userSelRange=0;
var userHighlightedCells=[];
var defaultProbPercentage=30;
var systemGeneratedProb=[];
var doorsTried=0;
var totalWakes=0;
var isFixedRange=true;
var fixedRanges = ['12 (4x3)','20 (5x4)','36 (9x4)', '50 (10x5)','72 (12x6)','100 (10x10)'];
function init(){
	preload(preloadImgs);	
	loadJSON("scripts/data.json", function(response) {  		
        var actual_JSON = JSON.parse(response);
        if(actual_JSON.isFixedRange==true)
        {
        	isFixedRange = true;
        	fixedRanges=actual_JSON.fixedRanges;
        }
    	
    	var isValid = false;
    	if(isFixedRange)
		{
			isValid = validateRanges();
		}
		if(isValid)
		{
			enableButton(null,'#generateTableBtn',true);
			for(var range=0; range<fixedRanges.length;range++)
			{
				$('#fixedRange').append('<option value="'+fixedRanges[range]+'">'+fixedRanges[range].split(' ')[0]+'</option>');
			}
			$('#fixedRange').show();
			$('#rangeTxt').hide();
		}
		else {
			isFixedRange = false;
			$('#fixedRange').hide();
			$('#rangeTxt').show();
		}
		$('#dragonAwakesAudio')[0].volume=0.5;
		$('#dragonAwakesAudio').on('timeupdate',function(){
			if($('#dragonAwakesAudio')[0].currentTime>1.6)
			{
				$('#dragonAwakesAudio')[0].currentTime=0.18;
			}
		});

		$('#scene1').show();
		$('#dragonOpening').show();
		$('#dragonOpening')[0].play();
	});
	$('#beginBtn').click(function(){
		$(this).fadeOut();
		$('#activityTitle').fadeOut();
		$('video').hide();
		stopAllVideo();
		stopAllAudio();
		$('#panOut').show();
		$('#panOut')[0].play();

		$('#panOut').on('ended',function(){
			$('#panelBlocker').hide();
			$('#scene1').hide();
			$('#scene2').show();
			$('#scene2 .tableContainer').show();
			$('#panOut').off('ended');
		});
		
	});
	$('#panelBlocker').click(function(){
		$('#panOut')[0].pause();
		$('#panOut')[0].currentTime=2.5
		$('#panOut').off('timeupdate');
		
		$('#panelBlocker').hide();
		$('#scene2 .tableContainer').show();
		
	});
	$('#generateTableBtn').click(function(){
		$('#scene2').fadeOut();
		$('#scene3').fadeIn();
		if(isFixedRange)
		{
			var getRange = $('#fixedRange').val();
			getRange = getRange.split(' ')[0]
			userSelRange=getRange;	
		}
		else {
			userSelRange=$('#rangeTxt').val();
		}
		
		generateGrid();
	});

	$('#resetBtn').click(function(){
		$('.tableCol').removeClass('highlighted');
		updateHighlightedValues();
	});
	$('#doneBtn').click(function(){
		stopAllVideo();
		$('video').hide();
		$('#panOutPanel').show();
		$('#panOutPanel')[0].play();
		$('#scene3').hide();
		$('#panOutPanel').on('ended',function(){
			$('#scene4').fadeIn();
			$('#tableHolder').html($('#gridHolder').html());
			$('#panOutPanel').off('ended');
		});

	});
	$('#do1TrialBtn').click(function(){
		$('#do1TrialBtn').attr('disabled','');
		$('#do100TrialsBtn').attr('disabled','');
		$('#trialsDoneBtn').attr('disabled','');
		$('#knobBtn').attr('disabled','');
		cellSelection();
		var selectionInterval = setInterval(cellSelection, 150);
		setTimeout(function(){
			clearInterval(selectionInterval);
			$('#tableHolder .tableCol.selectionBG').addClass('selectedCell');
			
			setTimeout(function(){
				checkProbability();
				$('#knobBtn').hide();
				$('#knobBtn').removeAttr('disabled');
				$('#trialsDoneBtn').removeAttr('disabled');
				$('#do1TrialBtn').removeAttr('disabled');
				$('#do100TrialsBtn').removeAttr('disabled');
			},1000);
		},3000);
	});

	$('#knobBtn').click(function(){
		$('#knobBtn').attr('disabled','');
		checkProbability();
	});

	$('#trialsDoneBtn').click(function(){
		$('#scene4').fadeOut();
		$('#scene5').fadeIn();

		$('#scene5 .createdProbability').text(" "+userHighlightedCells.length+"/"+userSelRange+" = "+((userHighlightedCells.length*100)/userSelRange).toFixed(2)+"%");
		$('#scene5 .doorsTriedValue').text(doorsTried);
		$('#scene5 .dragonsWakeValue').text(totalWakes);
		$('#scene5 .expProbValue').text(((totalWakes*100)/doorsTried).toFixed(2)+"%");
	});
	$('#doMoreTrialsBtn').click(function(){
		$('#scene5').fadeOut();
		$('#scene4').fadeIn();
		$('#do100TrialsBtn').removeAttr('disabled');
	});
	
	$('#do100TrialsBtn').click(function(){
		$('#do1TrialBtn').attr('disabled','');
		$('#do100TrialsBtn').attr('disabled','');
		$('#trialsDoneBtn').attr('disabled','');
		$('#knobBtn').attr('disabled','');
		var timesCounter = 0;
		setTimeoutX(function () {
			var selectionInterval = setInterval(cellSelection, 1);
			setTimeout(function(){
				clearInterval(selectionInterval);
				doorsTried++;
				timesCounter++;
				$('#do100TrialsBtn').text(timesCounter+" Times");
				$('#tableHolder .tableCol.selectionBG').addClass('selectedCell');
				var generatedIndex = $('#tableHolder .tableCol.selectedCell').attr('index');
				$('.zoomedText').remove();
				$('#tableHolder .tableCol').removeClass('selectionBG').removeClass('selectedCell');
				var isMatched = false;
				for(var cellIndex=0; cellIndex<userHighlightedCells.length;cellIndex++)
				{
					if(userHighlightedCells[cellIndex]==generatedIndex)
					{
						isMatched = true;
						break;
					}
					else {
						isMatched = false;
					}
				}

				if(isMatched)
				{
					totalWakes++;
				}


			},2);


		}, 12, 100, doMore100TrialsCompleted);
	});
}
function doMore100TrialsCompleted(){
	setTimeout(function(){
		$('#do1TrialBtn').removeAttr('disabled');
		$('#do100TrialsBtn').removeAttr('disabled');
		$('#trialsDoneBtn').removeAttr('disabled');
		$('#knobBtn').removeAttr('disabled');
		$('#do100TrialsBtn').text("Try 100 Times");
	},500);
}
function checkProbability(){
	var generatedIndex = $('#tableHolder .tableCol.selectedCell').attr('index');
	systemGeneratedProb.push(generatedIndex);
	$('#trialsDoneBtn').removeAttr('disabled');

	doorsTried++;
	$('#popUpContainer').hide();
	$('#knobBtn').hide();
	var isMatched = false;
	for(var cellIndex=0; cellIndex<userHighlightedCells.length;cellIndex++)
	{
		if(userHighlightedCells[cellIndex]==generatedIndex)
		{
			isMatched = true;
			break;
		}
		else {
			isMatched = false;
		}
	}

	var videoToPlay = null;
	if(isMatched)
	{
		$('video').hide();
		stopAllVideo();
		$('#dragonWakes').show();
		videoToPlay = $('#dragonWakes')[0];
		totalWakes++;
		$('#dragonAwakesAudio')[0].play();
	}
	else {
		$('video').hide();
		stopAllVideo();
		$('#dragonSleeps').show();
		videoToPlay = $('#dragonSleeps')[0];
	}

	videoToPlay.currentTime = 0;
	videoToPlay.play();
	$(videoToPlay).on("timeupdate", function (e) {
		if(videoToPlay.currentTime>5)
		{
			$(videoToPlay).off("timeupdate");
			$('video').hide();
			$('#panOut').show();
			stopAllVideo();
			setTimeout(function(){
				$('#panOut')[0].play();
				$('#panOut')[0].currentTime = 0;
				$('#panOut').on('timeupdate',function(){
					if($('#panOut')[0].currentTime>=2.4)
					{
						$('#panOut').off('timeupdate');
						$('#panOut')[0].pause();
						$('#panOut')[0].currentTime=2.5;

						$('.zoomedText').remove();
			
						$('#tableHolder .tableCol').removeClass('selectionBG').removeClass('selectedCell');
						$('#popUpContainer').show();
						$('#knobBtn').hide();
						$('#do1TrialBtn').removeAttr('disabled');
						$('#do100TrialsBtn').removeAttr('disabled');

					}
				});
				stopAllAudio();
			},30);
		}	
	});
}
function cellSelection() {
    var $divs = $('#tableHolder .tableCol:not(".disabled")').removeClass('selectionBG').removeClass('selectedCell');
    var random = Math.floor(Math.random() * $divs.length);
    var selectedDiv = $divs.eq(random).addClass('selectionBG');

    $('.zoomedText').remove();
    var zoomText = $('<div/>');
    zoomText.addClass('zoomedText');
    zoomText.html('<div style="display:table-cell; text-align:center; vertical-align:middle;">'+selectedDiv.find('.cellNum').text()+'</div>');


    var zoomLeft = (selectedDiv.index()*selectedDiv.width())-(selectedDiv.width()*0.5);
    var zoomTop = (selectedDiv.parent().index()*selectedDiv.height())-(selectedDiv.height()*0.5);

    zoomText.css({
    	'position':'absolute',
    	'display':'table',
    	'left':zoomLeft+'px',
    	'top':zoomTop+'px',
    	'width':(selectedDiv.width()*2)+'px',
    	'height':(selectedDiv.height()*2)+'px',
    	'border':'4px solid #ff6a00',
    	'font-size':(parseFloat(selectedDiv.css('font-size'))*3)+'px',
    	'font-weight':'bold',
    	'color': 'rgb(62, 35, 23)',
    	'border-radius': (selectedDiv.width()*2)+'px',
    	'z-index':100
    })
    $('#tableHolder').prepend(zoomText);
}
function generateGrid(){
	var colCount = getBestDivisor(userSelRange);
	var rowCount = Math.ceil(userSelRange/colCount);

	if(isFixedRange)
	{
		var getRange = $('#fixedRange').val();
		getRange = getRange.split(' ')[1]
		getRange = getRange.split('x');
		colCount=getRange[0].replace('(','');
		rowCount=getRange[1].replace(')','');
	}

	var tblWidth=$('.gridRightContainer').width()-20;
 	var tblHeight=$('.gridRightContainer').height()-20;

	var cellWidth=(tblWidth/colCount)-4;
	var cellHeight=(tblHeight/rowCount)-4;

	 if(cellWidth>80)
	 	cellWidth=80;

	 if(cellHeight>80)
	 	cellHeight=80;

	 if(cellHeight<cellWidth)
	 {
	 	cellWidth = cellHeight
	 }
	 if(cellWidth<cellHeight)
	 {
	 	cellHeight = cellWidth
	 }


	var tableHolder = $('#gridHolder');
	var fontSize = 22;
	var cellCount = 0;
	for(var row=1;row<=rowCount;row++)
	{
		var rowElement = $('<div class="tableRow" />');
		for(var col=1; col<= colCount; col++)
		{
			var colElement = $('<div index="cellIndex'+cellCount+'" class="tableCol" />');
			colElement.css({'width':cellWidth+'px','height':cellHeight+'px'});
			cellCount++;

			if(cellCount>userSelRange)
			{
				colElement.addClass('disabled');
			}
			else {
				fontSize = (cellWidth<25?(cellWidth-7):22);
				colElement.html('<div class="cellNum" style="padding-top:'+((cellHeight-fontSize)/2)+'px; line-height:'+fontSize+'px; font-size:'+fontSize+'px">'+cellCount+'</div>');
			}
			rowElement.append(colElement);
			
		}
		tableHolder.append(rowElement);
	}

	tableHolder.css({
	  	left:(((tblWidth+20)-(cellWidth*colCount))/2)+'px',
	  	top:(((tblHeight+20)-tableHolder.height())/2)+'px'
 	});
	updateHighlightedValues();
	addHighlightListener('.tableCol');

	$('.legendContainer').css({
		'top':(parseFloat(tableHolder.css('top'))+tableHolder.height()+20)+"px",
		'left':(parseFloat(tableHolder.css('left')))+"px"
	});

	var containerActualHeight = parseFloat($('.legendContainer').css('top'))+$('.legendContainer').height();
	if(containerActualHeight>$('.gridRightContainer').height())
	{
		$('.gridRightContainer').height(containerActualHeight);
	}
}
function addHighlightListener(cellSelector){
	var isMouseDown = false,
    isHighlighted;
	$(cellSelector)
		.mousedown(function () {
	    	isMouseDown = true;
	      	$(this).toggleClass("highlighted");
	      	isHighlighted = $(this).hasClass("highlighted");
	      	updateHighlightedValues();
	      	return false; 
	    })
	    .mouseover(function () {
	      if (isMouseDown) {
	        $(this).toggleClass("highlighted", isHighlighted);
	        updateHighlightedValues();
	      }
	    })
	    .bind("selectstart", function () {
	      return false;
	    })

	$(document)
		.mouseup(function () {
			updateHighlightedValues();
	    isMouseDown = false;
	});
}
function updateHighlightedValues(){
	$('#displayUserInput').text(userSelRange);
	$('#displayUserOutput').text($('.tableCol.highlighted').length);
	userHighlightedCells=[];
	$('#scene3 .tableCol.highlighted').each(function(){
		userHighlightedCells.push($(this).attr('index'));
	});
	if($('.tableCol.highlighted').length>0)
	{
		$('#doneBtn').removeAttr('disabled');
		$('#resetBtn').removeAttr('disabled');
	}
	else {
		$('#doneBtn').attr('disabled','');
		$('#resetBtn').attr('disabled','');
	}
}
function getBestDivisor(num){
	if(num>50)
	{
		if(num%5==0)
		{
			num = num;	
		}
		else {
			num = Math.ceil(num/3)*3;	
		}
	}
	else if(num>10)
	{
		if(num%5==0)
		{
			num = num;	
		}
		else if(num%2==0)
		{
			num = Math.ceil(num/2)*2;	
		}
		else {
			num = Math.ceil(num/3)*3;	
		}
	}
	
	var bestDivisor = num;
	var divisors=[];
	for (i = 2; i <= num/2; i++) {
	    if (num % i == 0) {
	        divisors.push(i);
	    }
	}
	if(divisors.length>0)
	{
		if(num<10)
		{
			bestDivisor = divisors[divisors.length - 1];
		}
		else {
			bestDivisor = divisors[Math.round((divisors.length - 1) / 2)];		
		}
		
	}
	
	return bestDivisor;
}
function enableButton(currentTarget, targetid, isForce){
	if($(currentTarget).val()>0 || isForce)
	{
		$(targetid).removeAttr('disabled');
	}
	else {
		$(targetid).attr('disabled','');
	}
}
//getting random number from given range
function getRandomInts(min, max, numbersReq) {
    var random = [];
    for(var i = min;i<=max ; i++){
        var temp = Math.floor(Math.random() * (max - min + 1)) + min;
        if(random.indexOf(temp) == -1){
            random.push(temp);
        }
        else
         i--;
    }
    return random.splice(0,numbersReq);
}
//convert number range to array
function rangeToArray(min, max, shouldShuffle) {
    var numberArray = [];
    for(var i = min;i<=max ; i++){
        numberArray.push(i);
    }
    if(shouldShuffle)
    {
    	return shuffle(numberArray);
    }
    else {
    	return numberArray;
    }
    
}
//shuffling an one-dimensional array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
function stopAllAudio(){
	for(var ind=0; ind<$('audio').length;ind++)
	{
		$('audio').eq(ind)[0].currentTime=0;
		$('audio').eq(ind)[0].pause();
	}
}
function stopAllVideo(){
	for(var ind=0; ind<$('video').length;ind++)
	{
		$('video').eq(ind)[0].currentTime=0;
		$('video').eq(ind)[0].pause();
	}
}
function validateRanges(){
	for(var range=0; range<fixedRanges.length;range++)
	{
		try{
			var ranges = fixedRanges[range].split(' ')
			var lhs = ranges[0];
			if(ranges[1].indexOf('x')==-1)
			{
				fixedRanges.splice(range,1);	
			}
			else {
				var rhs = eval(ranges[1].replace('x','*'));
				if(lhs!=rhs)
				{
					fixedRanges.splice(range,1);
					range=-1;
				}		
			}
			
		}
		catch(e){
			fixedRanges.splice(range,1);			
			range=-1;
		}
		
	}
	if(fixedRanges.length>0)
	{
		return true;
	}
	else {
		return false;
	}
	
}
function setTimeoutX(callback, milliseconds, times, onComplete) {
	var occurance=0;
    var interval = setInterval(function(){
    	occurance++;
	    (function(n) {
        	callback();
            if(n==times)
            {
            	clearInterval(interval);
            	setTimeout(onComplete,10);
            }
	    }(occurance));
	},milliseconds);
}
Array.prototype.unique = function() {
    var a = [];
    for ( i = 0; i < this.length; i++ ) {
        var current = this[i];
        if (a.indexOf(current) < 0) a.push(current);
    }

    this.length = 0;
    for ( i = 0; i < a.length; i++ ) {
        this.push( a[i] );
    }

    return this;
}
function loadJSON(file, callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); 
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
}