$(document).ready(function(){
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
    });
  }
});

// function detectSpecialKeys(e) { console.log(e);
//   var evtobj = window.event ? event : e;
//   if (evtobj.ctrlKey || evtobj.key === 'Control') {
//     alert("you pressed one of the 'Ctrl'")
//   }
// }

var wordCount = 1;

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
    minDisplayTime: 3000,

    // sets the initial delay before starting the animation
    // (note that depending on the in effect you may need to manually apply
    // visibility: hidden to the element before running this plugin)
    initialDelay: 0,

    // set whether or not to automatically start animating
    autoStart: true,

    // custom set of 'in' effects. This effects whether or not the
    // character is shown/hidden before or after an animation
    inEffects: [],

    // custom set of 'out' effects
    outEffects: [],

    // in animation settings
    in: {
      // set the effect name
      effect: 'fadeIn',

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
      callback: function () {}
    },

    // out animation settings.
    out: {
      effect: 'fadeOut',
      delayScale: 1.5,
      delay: 50,
      sync: false,
      shuffle: false,
      reverse: false,
      callback: wordValidation
    },

    // callback that executes once textillate has finished
    callback: function () {},

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
      //next
    } else
    if(inputWord !== currentWord.substr(0, charsWritten)) {
      $('#input-box').removeClass().addClass('wrong');
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
  }

  $('#input-box').val('');
  $('#input-box').removeClass();
  wordCount++;
}