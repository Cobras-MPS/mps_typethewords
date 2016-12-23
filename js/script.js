$(document).ready(function(){
  //Init list of words
  populateGameBox();
  //Generate hearts for lives
  generateHearts();
  // Init Animation
  initTextAnimation();
  // Init Listener
  initInputListener();
});

$.fn.extend({
  disableSelection: function() {
    this.each(function() {
      if (typeof this.onselectstart != 'undefined') {
        this.onselectstart = function() { return false; };
      } else if (typeof this.style.MozUserSelect != 'undefined') {
        this.style.MozUserSelect = 'none';
      } else {
        this.onmousedown = function() { return false; };
      }
	  //startTimeout();
    });
  }
});

// function detectSpecialKeys(e) { console.log(e);
//   var evtobj = window.event ? event : e;
//   if (evtobj.ctrlKey || evtobj.key === 'Control') {
//     alert("you pressed one of the 'Ctrl'")
//   }
// }

var LVL_NUM = 3;
var LVL_WORDS = 3;
var MAX_LIVES = 4;

var effects_types = ['fadeIn', 'flash', 'fadeIn', 'tada', 'fadeInLeftBig', 'fadeInRightBig', 'rollIn', 'tada', 'tada'];
var lvl_time = [1500, 2000, 2500];
var lvl_texts = [];
lvl_texts.push(['ana', 'are', 'mere']);
lvl_texts.push(['extraterestru', 'hipopotam', 'claustrofobie']);
lvl_texts.push(['ana are mere', 'ana are mere si pere', 'la multi ani']);


var livesCount = MAX_LIVES;
var wordCount = 1;
var lvlAt = 0;
var wordAt = 0;
var curentScore = 0;
var nextWord = 0;
var heartsLeft = 4;
var cache = {
	"result": null,
	"timer": setTimeout(function(){}, 1),
	"timeout": 1500,
}

function initTextAnimation() {
  // Detect Ctrl key
  // window.onkeypress = detectSpecialKeys;
  // window.onkeyup = detectSpecialKeys;

  // Disable Selection on older browsers
  $('#game-box').disableSelection();
  // Disable Paste
  $('#input-box').bind("paste", function(e) {
    e.preventDefault();
  });
  // Init Plugin
  $('#game-box').textillate({
    // the default selector to use when detecting multiple texts to animate
    selector: '.texts',

    // enable looping
    loop: false,

    // sets the minimum display time for each text before it is replaced
    //MUST CHANGE - now is GLOBAL
    minDisplayTime: lvl_time[0],

    // sets the initial delay before starting the animation
    // (note that depending on the in effect you may need to manually apply
    // visibility: hidden to the element before running this plugin)
    initialDelay: 0,

    // set whether or not to automatically start animating
    autoStart: true,

    // custom set of 'in' effects. This effects whether or not the
    // character is shown/hidden before or after an animation
    inEffects: effects_types,

    // custom set of 'out' effects
    outEffects: [],

    // in animation settings
    in: {
      // set the effect name

      // set the delay factor applied to each consecutive character
      delayScale: 1.5,

      // set the delay between each character
      delay: 50,

      // set to true to animate all the characters at the same time
      sync: false,

      // randomize the character sequence
      // (note that shuffle doesn't make sense with sync = true)
      shuffle: false,

      // reverse the character sequence
      // (note that reverse doesn't make sense with sync = true)
      reverse: false,

      // callback that executes once the animation has finished
      callback: startTimeout
    },

    // out animation settings.
    out: {
      effect: 'fadeOut',
      delayScale: 1.5,
      delay: 50,
      sync: false,
      shuffle: false,
      reverse: false,
      callback: abortTimeout
    },

    // callback that executes once textillate has finished
    callback: function(){},

    // set the type of token to animate (available types: 'char' and 'word')
    type: 'char'
  });
}

function initInputListener() {
  $('#input-box').keyup(function(event) {
    var currentWord = $( "ul li:nth-child(" + wordCount + ")" ).html();
    var inputWord = $('#input-box').val();
    var charsWritten = inputWord.length;

    if(inputWord === currentWord) {

      $('#input-box').removeClass().addClass('correct');
      if(wordCount >= LVL_NUM * LVL_WORDS){
        if(!alert("GAME HAS ENDED!\n\nYour score is: " + curentScore)){window.location.reload();}
      }

    } else
    if(inputWord !== currentWord.substr(0, charsWritten)) {

      $('#input-box').removeClass().addClass('wrong');
      livesCount--;
      $('#current-lives').html(livesCount);
      error();
      if(livesCount <= 0){       
        $('#current-lives').html(livesCount);
        if(!alert("GAME OVER!")){window.location.reload();}
      }

    } else {
      $('#input-box').removeClass();
    }
  });
}

function wordValidation() {
  var currentWord = $( "ul li:nth-child(" + wordCount + ")" ).html();
  var inputWord = $('#input-box').val();

  if(currentWord === inputWord) {
    var correctWords = 1*$('#correct-words').html();
    $('#correct-words').html(correctWords+1);
    curentScore += 1*(Math.floor(nextWord/LVL_NUM) + 1);
    $('#current-score').html(curentScore);

  }

  if( currentWord.length > 0 && inputWord == ''){
    livesCount--;
    $('#current-lives').html(livesCount);
    error();
  }

  $('#input-box').val('');
  $('#input-box').removeClass();
  wordCount++;
  nextWord++;

  if(livesCount <= 0){

    $('#current-lives').html(livesCount);
    if(!alert("GAME OVER!")){window.location.reload();}
    
  }

}


function populateGameBox(){
  var ulVal = $(".texts");
  for(var i = 0; i < LVL_NUM; i++){
    for(var j = 0; j < LVL_WORDS; j++){
      var liVal = "<li data-in-effect=" + effects_types[i*LVL_WORDS + j] +">"+ lvl_texts[i][j] + "</li>";
      ulVal.append(liVal);
    }
  }

}

function success() {
	var correctWords = 1*$('#correct-words').html();
    $('#correct-words').html(correctWords+1);	
}

function error() {
	cache.timeout = 1500;
	breakHeart();
}

function startTimeout() {
  abortTimeout();
  $(".timer-value").animate({width:'0%'}, cache.timeout, "linear");
  cache.timer = setTimeout(wordValidation, cache.timeout);
}

function abortTimeout() {
  clearTimeout(cache.timer);
  $(".timer-value").stop();
  $(".timer-value").css({width: "100%"});
}

function generateHearts() {
	$('.hearts').html("");
	for (var i = 1; i <= 4; i++) {
		$('.hearts').append("<i class='fa fa-heart'></i>");
	};
}

function breakHeart() {
  var h = $('.hearts' + " :not(.broken).fa-heart"); // Select non-broken hearts
  $(h.get(h.length-1)).addClass("broken");
  heartsLeft--;
}