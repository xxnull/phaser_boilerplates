var deckCnt=2;
var cardCnt=6;
var cardColor=["#62c5e8","#e55c69"];
var workarea=document.getElementById("workarea");
var card1Num=[1,2,3,4,5,6];
var card2Num=[1,2,3,4,5,6];
var deck1NumImg=[];
var deck2NumImg=[];
var deck1Arr=[0,0,0,0,0,0];
var deck2Arr=[0,0,0,0,0,0];
var dataArr=[];
var cardwidth=120;
var cardheight=120;
var preloadImgs=["assets/images/btInfoOff.png","assets/images/btInfoOn.png","assets/images/BG_1.jpg","assets/images/card_1.png","assets/images/card_2.png","assets/images/card_3.png","assets/images/cardback_1.png","assets/images/cardback_2.png"];
var isFirstTime=true;
var frontCardImg=[];
function init(){
	
		loadJSON("scripts/data.json", function(response) {  		
        var actual_JSON = JSON.parse(response);        
        card1Num=[]
        card2Num=[]
        frontCardImg=actual_JSON.frontCardImage;
         $(actual_JSON.deck1).each(function(i){         	
         	card1Num.push(actual_JSON.deck1[i].number)
         	deck1NumImg.push(actual_JSON.deck1[i]);
         });
         $(actual_JSON.deck2).each(function(i){         	
         	card2Num.push(actual_JSON.deck2[i].number)
         	deck2NumImg.push(actual_JSON.deck2[i]);
         });    
         isFirstTime=false;
    
	preload(preloadImgs);		
	$('#cardContainer,#divReport').empty();	 //empty the cards and datas
	deck1Arr=[0,0,0,0,0,0]; //initializing deck 1 array
	deck2Arr=[0,0,0,0,0,0]; //initializing deck 2 array
	tmpDeckArr=[0,0];	//initializing temporary array for storing currenet deck details
	createDeck(); //method to create deck on the stage
	createCards(); //method to create cards on the deck
//	addNumberToCard(); //adding number on back of cards

	$('#cardOverlay').css('display','none');
	$('#divMsg').html("");
	$('#btnReset').css({'cursor':'default'})
	$('#btnReset').unbind("click").attr('disabled',true).removeClass('enabled');
	$('#cardOverlay1,#cardOverlay2').css({'display':'none','cursor':'pointer'});
	$(".card").each(function(){
		$(this).data({
			origX:$(this).offset().left-$(this).parent().offset().left+5,
			origY:$(this).offset().top-$(this).parent().offset().top
		})
	})
	//jQuery flip plugin built in function to flip the cards
	$(".card").flip({
	  trigger: 'click', //hover, manual
	  speed: 500 
	});

	//bind click events to the cards

	$('.card').bind('click',cardClick);
	
	$('.overlay').click(function(){
		
		if(deck1Arr.indexOf(1)>=0&&deck2Arr.indexOf(1)>=0){
			 showMsg("<div style='padding:10px 30px 30px 30px;'>Click Shuffle to start again.</div>");
			 $('.overlay').css('cursor','default');
		}else{
			if(deck1Arr.indexOf(1)>=0){
				showMsg("<div style='padding:10px 30px 30px 30px;'>Pick a yellow card.</div>");
				
			}
			if(deck2Arr.indexOf(1)>=0){

				showMsg("<div style='padding:10px 30px 30px 30px;'>Pick a blue card.</div>");
				
			}

		}
	})
	
	//Bind click event to the data button. Currently we have removed this from stage as it is not required for this activity.
	$('#btnData').click(function(){
		var tmpData="";
		for(var k=0;k<dataArr.length;k++){
			tmpData+="<span class='spnRep'>Trial " + (k+1) + ":</span> "+dataArr[k].toString() + "</br>";
		}
		$('#divReport').html(tmpData).css('display','block');
	});
   });
}
function createDeck(){

	for(var i=0;i<deckCnt;i++){
		var deckDiv=$("<div></div>");
		deckDiv.addClass("deck"+(i+1));
		$('#cardContainer').append(deckDiv);	
	}
	
	deck1num=card1Num.slice(); //adding array value from tmp array
	deck2num=card2Num.slice(); //adding array value from tmp array
	shuffle(deck1num); //shuffling array
	shuffle(deck2num); //shuffling array
}

function createCards(){
	var deck=1;
	var cntr=1;
	var cardval=1;
	var left=0;cardtop=0;
	var cardFrontImg;
	for(var i=0;i<cardCnt*deckCnt;i++){
		var cardDiv=$("<div></div>");
		cardDiv.addClass("card").addClass("decknum"+deck);		
		cardDiv.attr("id","card"+deck+cntr);					
		$('.deck'+deck).append(cardDiv);
		var cardBackNum=eval('deck'+deck+'num')[cntr-1];

		var backCardImg=deck==1?findCardBackImg(cardBackNum,deck1NumImg):findCardBackImg(cardBackNum,deck2NumImg);
		cardFrontImgNo=deck;
		if(deck==1){
			cardFrontImg=frontCardImg[0].deck1;
		}else if(deck==2){
			cardFrontImg=frontCardImg[0].deck2;
		}
		
		$("#card"+deck+cntr).html("<div class='front'><img class='frontimg' src='assets/images/"+cardFrontImg+"' height='100%'/></div><div class='back'><img src='assets/images/"+backCardImg+"' height='100%'/></div>");

		if(cntr<=3){
			cardtop=0;
			if(cntr==1){
				left=0;
			}
			if(cntr>=2 && cntr<=4){
				left=left+44;	
			}
			$("#card"+deck+cntr).css({'top':cardtop+'px','left':left+'px'});
			left+=cardwidth;

		}

		else if(cntr>3){
			cardtop=cardheight;
			if(cntr==4){
				left=0;
				cardtop=cardheight+42;
				$("#card"+deck+cntr).css({'top':cardtop+'px','left':+left+'px'});
			}
			if(cntr>4){
				cardtop=cardheight+42;
				left+=cardwidth+44;
				$("#card"+deck+cntr).css({'top':cardtop+'px','left':+left+'px'});			
			}
		}

		cntr++;
		cardval++;
		if(i+1==cardCnt){
			deck++;
			cntr=1;
		}
	}
}

function addNumberToCard(){
	for(var i=1;i<=deckCnt;i++){
		for(var j=1;j<=cardCnt;j++){			
			$("#card"+i+j).find('.back').html('<div class="backtxt">'+eval("deck"+i+"num")[j-1]);			
		}
	}
}
var tmpDeckArr=[0,0];
function cardClick(){
	//allowing flip if no card open on the deck
	
	if(tmpDeckArr[0]==0||tmpDeckArr[1]==0){
		//taking deck no and card number based on card clicked
		var deckVal=$(this).attr('id').match(/\d/g)[0];
		var cardVal=$(this).attr('id').match(/\d/g)[1];	
		//check if opened card is clicked again to unflip
		if(eval("deck"+deckVal+"Arr")[cardVal-1]==1){							
			eval("deck"+deckVal+"Arr")[cardVal-1]=0;			
			tmpDeckArr[deckVal-1]=0;			
			return;	
		}	
		//check if card is selected in same deck, popup msg and unflip
		if(eval("deck"+deckVal+"Arr").indexOf(1)>=0){	
			console.log(deckVal);		
			showMsg("<div style='padding:10px 20px;'>Pick a card from the other deck.</div>");
			$(this).flip(false);
		}else{		 //add clicked card number to array and mark 1 in the card poistion of deck<num>arr 
			
			tmpDeckArr[deckVal-1]=$(this).find('.back').html();
			eval("deck"+deckVal+"Arr")[cardVal-1]=1;			
			$('#cardOverlay'+deckVal).css('display','block');
		}

		//check if both deck cards are open and show reset and data button
		if(deck1Arr.indexOf(1)>=0&&deck2Arr.indexOf(1)>=0){
			dataArr.push(tmpDeckArr.slice());
			//$('#btnReset').css('display','table');								
			//$('#cardOverlay').css('display','block');
				$('#cardOverlay1,#cardOverlay2').css('cursor','default');
				$('.overlay').css('cursor','pointer');
			setTimeout(function(){
				$('#btnReset').css({'cursor':'pointer'}).removeClass('red').addClass('redAct').addClass('enabled');
				//$('#divMsg').html("Click the Reset to start again.");
				// showMsg("<p>Click the Shuffle to start again</p>")
				$('#btnReset').click(function(){
					//init();			
					setTimeout($('.card').flip(false),200);
					$('#btnReset').addClass('selected');
					var carddeck= new TimelineMax({repeat:0, repeatDelay:0});					
					carddeck.add( TweenLite.to(".card", .5, {visibility:"visible",ease: Power1.easeOut,top:"180",left:"155"}));			
					setTimeout(function(){
							 carddeck.duration(.5).progress(1).reverse();
							 $('#cardOverlay1,#cardOverlay2').css('display','block');
							 setTimeout(function(){
							 	$('#cardOverlay1,#cardOverlay2').css('display','none');
							 	$('#btnReset').removeClass('selected').removeClass	('redAct');							 	
							  	init();
							 },600)
					  },500);					
				}).removeAttr('disabled');		
			},500)
		}


	}else{ //Check if card is clicked after selecting two cards and making card not to open
		$(this).flip(false);
		$('#cardOverlay1,#cardOverlay2').css('cursor','default');
		showMsg1("<div style='padding:10px 30px 30px 30px;'>Click shuffle to see the next trial.</div>");
	}
}

//getting random number from given range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

//For displaying messages in a popup
function showMsg(message){
	$('#overlay').css('display','block');
	$('#popupAlert').css('display','table');
	$('#msg').html(message);
}

//message popup ok button
function msgOK(){
	$('#overlay,#popupAlert').css('display','none');
}
function showIns(){
	showMsg("<p style='text-align:left;font-weight:bold; margin-bottom:10px;'>Instructions:</p><p style='text-align:left;-webkit-font-smoothing: antialiased;'>Set-up a table to record results in your notebook.</p><ol style='margin-left: 7px;text-align:left; padding:10px 20px;-webkit-font-smoothing: antialiased;'><li>Pick one card from each color set. Copy the numbers revealed into your table.</li><li>Add or multiply the numbers together.</li><li> Record whether the answer is even or odd. Determine if Player 1 or Player 2 wins.</li></ol><p style='margin-left:-21px;margin-bottom: 30px;'>Repeat steps 1 - 3 until you can determine if the game is fair.</p>");
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


function findCardBackImg(num,arr){
	var imgName="";
	$(arr).each(function(i){
		if(arr[i].number==num){
			imgName=arr[i].image;
			return imgName;
		}
	})
	return imgName;
}