	var draggableTexts = ["0.5","0.05","0.86","0.21","0.34"];
    var game = new Phaser.Game(1024, 660, Phaser.CANVAS, 'number-line', { preload: preload, create: create, update:update, resolution:window.devicePixelRatio });
	var header,headerText;
	var newText1,newText2,newText3,newText4,newText5;
	var resetBtn,checkBtn,showBtn,insBtn,closeBtn,blocker;
	
	function mdown(e){
		console.log(e);
	}
	function preload() {
	    //game.load.image('background','assets/BG_2.jpg')
	    game.load.spritesheet('resetbutton', 'assets/buttons/Reset.png', 124.25, 41);
	    game.load.spritesheet('checkbutton', 'assets/buttons/Check_Ans.png', 199, 41);
	    game.load.spritesheet('showbutton', 'assets/buttons/Show_Ans.png', 199, 41);
	    
	    
	    game.load.spritesheet('closeButton', 'assets/buttons/Ok_Btn_Vr.png',124.25,53);
	    game.load.image('bgblocker', 'assets/BG_blocker.png');
	    game.load.image('boxBack', 'assets/Pop_up.png');
	    game.load.image('tickIcon', 'assets/icn_checkmark.svg');
	    game.load.image('crossIcon', 'assets/icn_close.svg');
	    game.load.image('shadow', 'assets/buttons/shadow.png');
	    game.load.image('shadowReset', 'assets/buttons/shadow_reset.png');
	    game.load.image('ruler', 'assets/Ruler.png');

	    // game.load.image('background','assets/BG_2.jpg');
		game.add.text(0, 0, "hack", {font:"1px Poppins-Bold", fill:"#FFFFFF"});
		game.add.text(0, 0, "hack", {font:"1px Poppins-SemiBold", fill:"#FFFFFF"});
		game.add.text(0, 0, "hack", {font:"1px Poppins-Regular", fill:"#FFFFFF"});
		game.add.text(0, 0, "hack", {font:"1px Roboto-Thin", fill:"#FFFFFF"});
	}
	function create() {
		game.isShowMsg=false;
		//game.add.tween(game.stage).to( { alpha:1 }, 100, "Linear", true);		
		draggableTexts=(actual_JSON.decimals).slice();
		var chkCntr=0;
		for(var itm=0;itm<draggableTexts.length;itm++){
			if(draggableTexts[itm]>1||draggableTexts[itm]<0){
				chkCntr++;
				//return;
			}
		}
		if(chkCntr>0){game.isShowMsg=true;showMessageBox("","Data present in config file seems invalid.\nDecimals should be between 0 and 1.", w = 472, h = 190);};
		setTimeout(function(){
			document.body.style.opacity=1;
		},100);

		var origWidth = 1024;
        var origHeight = 660;
		var widthScale = window.innerWidth / origWidth;
        var heightScale = window.innerHeight / origHeight;
        var lowerScale = Math.min(widthScale, heightScale);

	if(lowerScale<1)
	{


		// game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.refresh();
	}
		game.scale.pageAlignHorizontally = true;
    	game.scale.pageAlignVertically = true;
		game.scale.windowConstraints.bottom = "visual";
    	game.stage.backgroundColor="#fff";
    	game.stage.boxShadow="10px 10px #888888";

		game.add.sprite(game.world.centerX-298,498,"shadowReset");
    	resetBtn = game.add.button(game.world.centerX-298, 500, 'resetbutton', reset, this, 1, 0, 3,3);
    	
    	game.add.sprite(game.world.centerX-133,500,"shadow");
    	checkBtn = game.add.button(game.world.centerX-133, 500, 'checkbutton', validate, this, 1, 0, 3,0);
    	
    	game.add.sprite(game.world.centerX+101,500,"shadow");
    	showBtn = game.add.button(game.world.centerX+101, 500, 'showbutton', showAnswers, this, 1, 0, 3,0);
    	
    	
    	var rulerImg=game.add.sprite(44,322,"ruler");
    	//rulerImg.scale.setTo(0.5,0.5);

    	resetBtn.frame = 2;
    	checkBtn.frame = 2;
    	showBtn.frame = 2;
    	
    	resetBtn.inputEnabled=false;
    	checkBtn.inputEnabled=false;
    	showBtn.inputEnabled=false;
    	game.selectedText=null;
    	game.placedItems = [];
    	var longTick = 30;
    	var midTick = 20;
    	var smallTick = 15;
    	var tooSmallTick = 10;
    	game.isAllPlaced=false;
    	game.isAllValidated=false;
    	game.canDrawBox=false;
    	game.InsShown=false;
    	game.isDragOver=false;
    	game.isDragging=false;
    	game.isShowAnswer=false;
		

    	var lineBreak = new Phaser.Line(0, 85, 1024, 85);
    	var line1=game.add.graphics(0,0);
    	// line1.beginFill("#02b2e6");
    	line1.lineStyle(3, 0x02b2e6, 0);
  		line1.moveTo(lineBreak.start.x,lineBreak.start.y);
  		line1.lineTo(lineBreak.end.x,lineBreak.end.y);
  		game.tickGap = 9;

    	    	
  		for(var txt=0; txt<draggableTexts.length;txt++)
    	{
			var decVal=draggableTexts[txt].toString().split(".")[1].length;						
    		
    		var origX = (300+(txt*100));
    		var origY = 40;//200+(txt*50)

    		var rect= game.add.graphics(0, 0);

			var rect=game.add.bitmapData(1024,768, true);
			rect.context.strokeStyle = "#02b2e6"; //#b3e8f8
			rect.context.fillStyle = "rgba(255, 255, 255, 0)";
			rect.ctx.fillText("test",origX, origY)
			roundRect(rect.context, origX-35, origY-25, 70, 40, 10, true, true);
		    game.add.sprite(0, 0, rect);

			var curText=addText(origX, origY, draggableTexts[txt],"txt"+txt);
			var curText='<svg id="txt0"	xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><text x="0" y="2" fill="#000000" font-size="24">0.05</text></svg>';
    		rect.text = game.add.text(origX, origY, draggableTexts[txt]);

    		rect.text.anchor.setTo(0.5);
    		//rect.text.font = 'Poppins-SemiBold';
    		rect.text.font = 'Poppins-Regular';
    		rect.text.fontSize = 24;
    		rect.text.fontWeight='normal';
    		rect.text.fill="#000000";
    		rect.text.align = 'center';
		    rect.text.inputEnabled = true;
		    rect.text.input.enableDrag();
		    rect.text.originalPosition = {x:origX, y:origY};
		    rect.text.events.onDragStart.add(onDragStart, this);
    		rect.text.events.onDragStop.add(onDragStop, this);
    		
    		rect.text.itemIndex = txt;
    		rect.text.parentRect = rect;
    		rect.text.input.useHandCursor=true;

    		//adding line
    		rect.text.line=game.add.bitmapData(1024, 768);
    		game.add.sprite(0, 0, rect.text.line);
			
			//adding correct tick icon
			rect.text.tick=game.add.sprite(0,0,"tickIcon");
    		rect.text.tick.visible=false;
    		
    		//adding correct cross icon
			rect.text.cross=game.add.sprite(0,0,"crossIcon");
			rect.text.cross.visible=false;


			game.placedItems[txt] = {
    			'index':txt,
    			'target':rect.text,
    			'isPlaced':false,
    			'isValid':false,
    			'parentRect':rect
    		}

    	}

    		
	}
	function onRulerDragStart(target){
		console.log(target);
	}
	function onRulerDragStop(target){
		console.log(target);

	}

	function onDragStart(target){
		game.isDragging=true;
		target.cross.visible=false;
		target.tick.visible=false;
		game.selectedText = target;
		game.isDragOver=false;
		
	}

	function onDragStop(target){
		game.isDragging = false;
		game.selectedText = target;
		

		if(target.position.x<45 || target.position.x > 950 || target.position.y<100 || target.position.y>330)
		{
		
			game.add.tween(target).to( { x: target.originalPosition.x, y: target.originalPosition.y }, 300, Phaser.Easing.Linear.None, true);
			game.canDrawLine = false;
			
				// target.parentRect.context.strokeStyle = "#02b2e6";
				// target.parentRect.context.stroke();		
			target.line.clear();
			game.placedItems[target.itemIndex].isPlaced=false;
			var cntr=0;	cntr1=0; cntr2=0; cntr3=0;
			for(var txt=0; txt<draggableTexts.length;txt++){
				var tar=game.placedItems[txt].target;
				if(!game.placedItems[txt].isPlaced||tar.tick.visible==true||tar.cross.visible==true){
					cntr++;					
				}
				if(tar.tick.visible==true||tar.cross.visible==true){
					cntr1++;					
				}
				if(game.placedItems[txt].isPlaced){
					cntr2++;						
				}
				if((tar.tick.visible==false && tar.cross.visible==false)&& game.placedItems[txt].isPlaced){
					cntr3++;
		 			checkBtn.frame=0;
					checkBtn.inputEnabled=true;
					checkBtn.input.useHandCursor=true;						
	 		    }

			}
		 	if(cntr==draggableTexts.length){	
		 		checkBtn.frame=2;
				checkBtn.inputEnabled=false;
				checkBtn.input.useHandCursor=false;		
				showBtn.frame=2;
				showBtn.inputEnabled=false;
				showBtn.input.useHandCursor=false;	
						
	 		}
	 		if(cntr1>0&&cntr1<=draggableTexts.length){
	 			resetBtn.frame=0;
				resetBtn.inputEnabled=true;
				resetBtn.input.useHandCursor=true;	

				checkBtn.frame=2;
				checkBtn.inputEnabled=false;
				checkBtn.input.useHandCursor=false;						
	 		}else{
	 			resetBtn.frame=2;
				resetBtn.inputEnabled=false;
				resetBtn.input.useHandCursor=false;					
	 		}
	 		if(cntr2>=1){
	 			resetBtn.frame=0;
				resetBtn.inputEnabled=true;
				resetBtn.input.useHandCursor=true;	

	 		}

	 		if(cntr3>=1){
	 			checkBtn.frame=0;
				checkBtn.inputEnabled=true;
				checkBtn.input.useHandCursor=true;

	 		}
	 		if(game.isAllValidated){
				checkBtn.frame=2;
				checkBtn.inputEnabled=false;
				checkBtn.input.useHandCursor=false;

	 		}
	 		if(game.isShowAnswer){

				showBtn.frame = 2;
		 		showBtn.inputEnabled=false;
				showBtn.input.useHandCursor=false;
	 		}
	 		

		}
		else {
			//console.log(target,target.parentRect);
			
			// target.parentRect.context.strokeStyle = "#d9f3fb";
			// target.parentRect.context.stroke();
			game.canDrawLine = true;

			var targetX = target.position.x;
			var targetY = target.position.y;
			targetX = 50+Math.round((targetX-50)/game.tickGap)*game.tickGap;	
			target.position.x=targetX;	

			for(var item=0;item<draggableTexts.length;item++){
				if(game.placedItems[item].isPlaced){
					var curTarget = game.placedItems[item].target;
					if(target._text != curTarget._text){
						if(hittest(target,curTarget)){
							if(curTarget.position.y>=230){
								target.position.y=curTarget.position.y-50;																
							}else{
								target.position.y=curTarget.position.y+50;
							}						
							break;
						}	
					}
				}				
			}

			game.placedItems[target.itemIndex].isPlaced=true;
			
			target.line.clear();
			target.line.ctx.beginPath();
			target.line.ctx.strokeStyle = '#00bcd4';
			target.line.ctx.lineWidth = 3;
			target.line.ctx.fillStyle = '#00bcd4';
			target.line.ctx.moveTo(targetX, target.position.y+10);
			target.line.ctx.lineTo(targetX, 320);
			target.line.ctx.stroke();
			target.line.ctx.lineWidth = 2;
			target.line.ctx.moveTo(targetX, 315);			
			target.line.ctx.lineTo(targetX+8, 315);			
			target.line.ctx.moveTo(targetX, 315);			
			target.line.ctx.lineTo(targetX-7, 315);
			target.line.ctx.lineTo(targetX, 327);
			target.line.ctx.lineTo(targetX+7, 315);
		  	target.line.ctx.stroke();
		  	target.line.ctx.fill();

		  	target.tick.position.x=target.position.x-10;
		  	target.tick.position.y=target.position.y-40;

		  	target.cross.position.x=target.position.x-8;
		  	target.cross.position.y=target.position.y-40;


			targetX = Math.round((targetX-50)/game.tickGap);
			if(targetX==parseFloat(target._text)/0.01)
			{
				game.placedItems[target.itemIndex].isValid=true;
			}
			else {		
				game.placedItems[target.itemIndex].isValid=false;	
			}
			checkBtn.frame=0;
			checkBtn.inputEnabled=true;
			checkBtn.input.useHandCursor=true;
			resetBtn.inputEnabled=true;
			resetBtn.input.useHandCursor=true;
			resetBtn.frame = 0;
		}

		checkAllPlaced();
		game.selectedText = null;
	}
	function update(){
		
		// console.log(game.isShowAnswer,game.isAllValidated);
		var target = game.selectedText;
		if(game.isShowAnswer||!game.isAllPlaced){
			showBtn.inputEnabled=false;
			setTimeout(showBtn.input.useHandCursor=false,10);
			showBtn.frame = 2;

		}	
		
		if(game.isAllValidated){			
			checkBtn.inputEnabled=false;
			setTimeout(checkBtn.input.useHandCursor=false,10);
			checkBtn.frame=2;
		}
		
	
		if(game.isDragging)
		{			
			target.line.clear();
			var decVal=target._text.toString().split(".")[1].length;
			
			game.isAllValidated=false;				
			
			

			if(target.position.x>=45 && target.position.x<=950 && target.position.y>=80 && target.position.y<330)
			{			
				if(target.position.y<150){
				  target.position.y=150;	
			    }
				if(target.position.y>280){
					target.position.y=280;	
				}
				
				
				var targetX = target.position.x;
				var targetY = target.position.y;
				//targetX = 50+Math.round((targetX-50)/game.tickGap)*game.tickGap;
				target.line.ctx.beginPath();
				target.line.ctx.strokeStyle = '#00bcd4';
				target.line.ctx.lineWidth = 3;
				target.line.ctx.fillStyle = '#00bcd4';
				target.line.ctx.moveTo(targetX, target.position.y+10);
				target.line.ctx.lineTo(targetX, 320);
				target.line.ctx.stroke();
				target.line.ctx.lineWidth = 2;
				target.line.ctx.moveTo(targetX, 315);			
				target.line.ctx.lineTo(targetX+8, 315);			
				target.line.ctx.moveTo(targetX, 315);			
				target.line.ctx.lineTo(targetX-7, 315);
				target.line.ctx.lineTo(targetX, 327);
				target.line.ctx.lineTo(targetX+7, 315);
			  	target.line.ctx.stroke();
			  	target.line.ctx.fill();
			}
			target.line.render();
			
			
		}
		else if(game.isShowMsg){
			for(var txt=0; txt<draggableTexts.length;txt++){
				var target = game.placedItems[txt].target;				
				target.inputEnabled=false;
			}
		}
		else if(!game.canDrawLine){
			if(game.selectedText)
			{		
				target.line.clear();
				target.line.render();	
				game.placedItems[target.itemIndex].isPlaced=false;
				game.placedItems[target.itemIndex].isValid=false;
			
			}			
		}		
		else if(game.isAllPlaced && !game.isShowAnswer){
			showBtn.inputEnabled=true;
			showBtn.input.useHandCursor=true;
			showBtn.frame = 0;
			

		}else if(game.isAllValidated){			
			checkBtn.frame=2;
			checkBtn.inputEnabled=false;
			checkBtn.input.useHandCursor=false;
			

		}else if(game.isDragOver){
			checkBtn.frame=2;
			checkBtn.inputEnabled=false;
			checkBtn.input.useHandCursor=false;			
		}else if(game.isShowAnswer){
			
			for(var txt=0; txt<draggableTexts.length;txt++){
				var target = game.placedItems[txt].target;
				target.inputEnabled=false;
				target.input.useHandCursor=false;				
			}
			showBtn.frame = 2;
			showBtn.inputEnabled=false;
			showBtn.input.useHandCursor=false;
		}else if(!game.isAllValidated){
			showBtn.frame = 2;
			showBtn.inputEnabled=false;
			showBtn.input.useHandCursor=false;

		}
	}


	function checkAllPlaced(){
		var cntr=0;
		for(var txt=0; txt<draggableTexts.length;txt++){
			if(game.placedItems[txt].isPlaced){
				cntr++;					
			}
		}
	 	if(cntr==draggableTexts.length)
	 	{
	 		game.isAllPlaced=true;


	 	}else{
	 		game.isAllPlaced=false;
 		}
	}
	function validate1(crctAnsCnt){	
		var msg="";
		if(correctAns>1){
			msg="You have placed "+placedItem+" out of 5 numbers on the line in which "+correctAns+" of them are placed correct."
		}else{
			msg="You have placed "+placedItem+" out of 5 numbers on the line in which "+correctAns+" of them is placed correct."
		}
		
	}
	var correctAns=0;
	var placedItem=0;
	function validate(){		
		correctAns=0;
		placedItem=0;
		for(var txt=0; txt<draggableTexts.length;txt++){
			var target = game.placedItems[txt].target;
			//game.selectedText = target;
			if(game.placedItems[txt].isPlaced){
				placedItem++;
				if(game.placedItems[txt].isValid){
					var targetX = target.position.x;
					var targetY = target.position.y;
					targetX = 50+Math.round((targetX-50)/game.tickGap)*game.tickGap;
					target.line.clear();
					target.line.ctx.beginPath();
					target.line.ctx.strokeStyle = '#6ab04c';
					target.line.ctx.lineWidth = 3;
					target.line.ctx.fillStyle = '#6ab04c';
					target.line.ctx.moveTo(targetX, target.position.y+10);
					target.line.ctx.lineTo(targetX, 320);
					target.line.ctx.stroke();
					target.line.ctx.lineWidth = 2;
					target.line.ctx.moveTo(targetX, 315);			
					target.line.ctx.lineTo(targetX+8, 315);			
					target.line.ctx.moveTo(targetX, 315);			
					target.line.ctx.lineTo(targetX-7, 315);
					target.line.ctx.lineTo(targetX, 327);
					target.line.ctx.lineTo(targetX+7, 315);		
				  	target.line.ctx.stroke();				

				
				  	target.line.ctx.fill();

				  	target.tick.visible=true;
					correctAns++;
				}else{					
					var targetX = target.position.x;
					var targetY = target.position.y;
					targetX = 50+Math.round((targetX-50)/game.tickGap)*game.tickGap;	
					target.line.clear();
					target.line.ctx.beginPath();
					target.line.ctx.strokeStyle = '#c0392b';
					target.line.ctx.lineWidth = 3;
					target.line.ctx.fillStyle = '#c0392b';
					target.line.ctx.moveTo(targetX, target.position.y+10);
					target.line.ctx.lineTo(targetX, 320);
					target.line.ctx.stroke();
					target.line.ctx.lineWidth = 2;
					target.line.ctx.moveTo(targetX, 315);			
					target.line.ctx.lineTo(targetX+8, 315);			
					target.line.ctx.moveTo(targetX, 315);			
					target.line.ctx.lineTo(targetX-7, 315);
					target.line.ctx.lineTo(targetX, 327);
					target.line.ctx.lineTo(targetX+7, 315);
				  	target.line.ctx.stroke();			
				  	target.line.ctx.fill();				

				  	target.cross.visible=true;
				}				
				
			}
		}
		if(placedItem==draggableTexts.length){
			game.isAllValidated=true;
			showBtn.frame = 0;
    		showBtn.inputEnabled=true;
			showBtn.input.useHandCursor=true;	
		}
		validate1(correctAns);
		checkBtn.frame = 2;
    	checkBtn.inputEnabled=false;
		checkBtn.input.useHandCursor=false;
		game.isDragOver=true;
		
	}
	function showAnswers(){
		game.isDragOver=false;
		
		for(var txt=0; txt<draggableTexts.length;txt++){
			var target = game.placedItems[txt].target;
			game.selectedText = target;

			target.inputEnabled=false;
			target.input.useHandCursor=false;
				//add wrong answer arrow & text on the bottom of the number line.
				if(window["newText"+(txt+1)]){
					window["newText"+(txt+1)].destroy();
						window["newText"+(txt+1)].line.clear();
				}
	    		var txtX=50+((target._text*100)*game.tickGap);
	    		window["newText"+(txt+1)] = game.add.text(txtX, 423, target._text);
	    		window["newText"+(txt+1)].anchor.setTo(0.5);
	    		window["newText"+(txt+1)].font = 'Poppins-Regular';
	    		window["newText"+(txt+1)].fontWeight='normal';
	    		window["newText"+(txt+1)].fontSize = 24;
	    		window["newText"+(txt+1)].fill="#504e4e";
	    		window["newText"+(txt+1)].align = 'center';

	    		window["newText"+(txt+1)].line=game.add.bitmapData(1024, 768);
    			game.add.sprite(0, 0, window["newText"+(txt+1)].line);
    			window["newText"+(txt+1)].line.ctx.beginPath();
				window["newText"+(txt+1)].line.ctx.strokeStyle = 'rgb(80, 78, 78,.5)';
				window["newText"+(txt+1)].line.ctx.lineWidth = 3;
				window["newText"+(txt+1)].line.ctx.fillStyle = 'rgb(80, 78, 78,.5)';
				window["newText"+(txt+1)].line.ctx.moveTo(txtX, 329);				
				window["newText"+(txt+1)].line.ctx.lineTo(txtX, 405);
			    window["newText"+(txt+1)].line.ctx.stroke();
			   	window["newText"+(txt+1)].line.ctx.fill();
				window["newText"+(txt+1)].line.ctx.lineWidth = 1;
				window["newText"+(txt+1)].line.ctx.moveTo(txtX, 328);
				window["newText"+(txt+1)].line.ctx.lineTo(txtX-7, 341);
				window["newText"+(txt+1)].line.ctx.lineTo(txtX, 341);
				window["newText"+(txt+1)].line.ctx.lineTo(txtX+7, 341);
			  	window["newText"+(txt+1)].line.ctx.stroke();
			  	window["newText"+(txt+1)].line.ctx.fill();
			
		}
		game.isAllValidated=false;		
		showBtn.inputEnabled=false;
		showBtn.input.useHandCursor=false;
		showBtn.frame = 2;		
		game.isShowAnswer=true;
		 game.time.events.remove(update);
	}
	function reset () {

	    game.state.restart();
	}

	function showMessageBox(hdText,text, w = 472, h = 190) {
    	//blocker.destroy();
    	
		blocker=game.add.sprite(0, 0, 'bgblocker');		

    	//just in case the message box already exists
    	//destroy it

        if (this.msgBox) {
            this.msgBox.destroy();
        }
        
        //make a group to hold all the elements
        var msgBox = game.add.group();
       	
        //var overlay=game.add.sprite(0,0,"bgblocker");
        //make the back of the message box
        //overlay.anchor.setTo(0);
        var back = game.add.sprite(0, 0, "boxBack");
        //back.anchor.setTo(0);
        //make the close button
		closeBtn = game.add.button(0,0, 'closeButton', hideBox, this, 1, 0, 1);
        closeBtn.frame = 0;
        //closeBtn.anchor.set(0);
        //instruction head text

        var hdTxt = game.add.text(0, 0, hdText);
        hdTxt.font = 'Roboto-Thin';
		hdTxt.fontSize = 20;
		hdTxt.stroke = '#000000';
		hdTxt.strokeThickness = 0.8;

        //make a text field
        var text1 = game.add.text(0, 0, text);
        //text1.anchor.set(0.5);
		text1.font = 'Roboto-Thin';
		text1.fontSize = 18;
		text1.align = "center";
		//text1.fill="#000000";
		text1.stroke = '#000000';
		text1.strokeThickness = 0.5;

		//text1.backgroundColor='#4ECDC4';
        //set the textfeild to wrap if the text is too long
        text1.wordWrap = true;
        //make the width of the wrap 90% of the width 
        //of the message box
        text1.wordWrapWidth = w * .9;
        //
        //
        //set the width and height passed
        //in the parameters
        back.width = w;
        back.height = h;
        //
        //
        //
        //add the elements to the group
        //msgBox.add(overlay);
        
        msgBox.add(back);
        msgBox.add(closeBtn);
        msgBox.add(hdTxt);
        msgBox.add(text1);

        // msgBox.width=556*2;
        // msgBox.height=243*2;



        //
        //set the close button
        //in the center horizontally
        //and near the bottom of the box vertically
        closeBtn.x = back.width / 2 - closeBtn.width / 2;
        closeBtn.y = (back.height - closeBtn.height)-20;
       // enable the button for input
        closeBtn.inputEnabled = true;
        //add a listener to destroy the box when the button is pressed
        closeBtn.events.onInputDown.add(this.hideBox, this);
        //
        //
        //set the message box in the center of the screen
        console.log(msgBox.width);
        msgBox.x = game.width / 2 - msgBox.width / 2;
        msgBox.y = game.height / 2 - msgBox.height / 2;
        //back.anchor.set(1);
        //
        //set the head text in the middle of the message box
        hdTxt.x = (back.width / 2 - text1.width / 2)-20;
        hdTxt.y = (back.height / 2 - text1.height / 2)-45;

        //set the text in the middle of the message box
        text1.x = (back.width / 2 - text1.width / 2);
        text1.y = (back.height / 2 - text1.height / 2)-30;
        //make a state reference to the messsage box
        this.msgBox = msgBox;
        blocker.visible=true;
    }
    function hideBox() {
    	//destroy the box when the button is pressed
    	console.log("called");
        this.msgBox.destroy();
        blocker.visible=false;
    	game.isShowMsg=false;
    	game.InsShown=false;
    	for(var txt=0; txt<draggableTexts.length;txt++){
			var target = game.placedItems[txt].target;				
			target.inputEnabled=true;
			target.input.useHandCursor=true;
		}
    }

	function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
		if (typeof stroke == 'undefined') {
		    stroke = true;
		  }
		  if (typeof radius === 'undefined') {
		    radius = 5;
		  }
		  if (typeof radius === 'number') {
		    radius = {tl: radius, tr: radius, br: radius, bl: radius};
		  } else {
		    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
		    for (var side in defaultRadius) {
		      radius[side] = radius[side] || defaultRadius[side];
		    }
		  }
		  ctx.lineWidth=2;
		  ctx.beginPath();		  
		  ctx.moveTo(x + radius.tl, y);
		  ctx.lineTo(x + width - radius.tr, y);
		  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
		  ctx.lineTo(x + width, y + height - radius.br);
		  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
		  ctx.lineTo(x + radius.bl, y + height);
		  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
		  ctx.lineTo(x, y + radius.tl);
		  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
		  ctx.closePath();
		  if (fill) {
		    ctx.fill();
		  }
		  if (stroke) {
		    ctx.stroke();
		  }
	}
	function hittest(target,curTarget){
		
		var tx=target.position.x,
			ty=target.position.y,
			tw=target.width,
			th=target.height,
			cx=curTarget.position.x,
			cy=curTarget.position.y,
			cw=curTarget.width,
			ch=curTarget.height;
		if(((tx+tw)<cx)||((ty+th)<cy)||(tx>(cx+cw))||(ty>(cy+ch))){
			return false;
		}
		return true

	}

	function drawArrow  (ctx, xPos, yPos, arrowLength, arrowWidth, angle, pointCurveDist, arrowDepth) {
        var radian = 0.0174532925;
        console.log("drawArrow");
        var arrowBx = xPos - arrowLength * Math.cos(angle * radian);
        var arrowBy = yPos - pointCurveDist - arrowLength * Math.sin(angle * radian);
        if (!arrowDepth) arrowDepth = 0;
        var _arrowBx = xPos - (arrowLength - arrowDepth) * Math.cos(angle * radian);
        var _arrowBy = yPos - pointCurveDist - (arrowLength - arrowDepth) * Math.sin(angle * radian);
        var tDeg = angle + 90;
        var arrowLx = (arrowWidth / 2) * Math.cos(tDeg * radian);
        var arrowLy = (arrowWidth / 2) * Math.sin(tDeg * radian);
        ctx.beginPath();
        ctx.moveTo(xPos, yPos - pointCurveDist);
        ctx.lineTo(arrowBx - arrowLx, arrowBy - arrowLy);
        ctx.lineTo(_arrowBx, _arrowBy);
        ctx.lineTo(arrowBx + arrowLx, arrowBy + arrowLy);
        ctx.closePath();
        ctx.fill();
        console.log( _arrowBx, _arrowBy)
        // return { x: _arrowBx, y: _arrowBy };

    }

function loadJSON(file, callback) {   

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
}


function addText(x,y,text,svgID){
	var svgNS="http://www.w3.org/2000/svg";
	var newTextSVG = document.createElementNS(svgNS,"svg");
	newTextSVG.setAttributeNS(null,"id",svgID);     
	//document.body.appendChild(newTextSVG);
	var newText = document.createElementNS(svgNS,"text");
	newText.setAttributeNS(null,"x",x);     
	newText.setAttributeNS(null,"y",y); 
	newText.setAttributeNS(null,"fill","#000000"); 
	newText.setAttributeNS(null,"font-size","24");
	var textNode = document.createTextNode(text);
	newText.appendChild(textNode);
	console.log(svgID);
	newTextSVG.appendChild(newText);
	return newTextSVG;
}


function createText(bmd) {    
	bmd.ctx.beginPath();    
	bmd.ctx.fillStyle = '#000000';    
	bmd.ctx.font = '24px Poppins-Regular';    
	bmd.ctx.fillText('0.086',40,40);    
	spr = game.add.sprite(100,100,bmd);    
	spr.inputEnabled = true;    
	spr.input.enableDrag();
	return spr;
}