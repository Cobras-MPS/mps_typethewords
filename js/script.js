$(document).ready(function(){
  //Init list of words
  populateGameBox();
  //Generate hearts for lives
  generateHearts();
  // Init Animation
  initTextAnimation();
  // Init Listener
  initListeners();
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

// GAME SETTINGS
var LVL_STAGES = 3; // numarul de propozitii/nivel
var MAX_LIVES = 5;
var lvl_time = [1500, 1300, 1000, 800, 600, 420, 330, 270, 230]; // index = numarul propozitiei/lvl_stages

// text effects
var effects_in_types  = ["flash", "bounce", "shake", "tada", "swing", "wobble", "pulse", "flip", "flipInX", "flipInY", "fadeIn", "fadeInUp", "fadeInDown", "fadeInLeft", "fadeInRight", "fadeInUpBig", "fadeInDownBig", "fadeInLeftBig", "fadeInRightBig", "bounceIn", "bounceInDown", "bounceInUp", "bounceInLeft", "bounceInRight", "rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rollIn", "rotateInUpRight"];
var effects_out_types = ["flash", "bounce", "shake", "tada", "swing", "wobble", "pulse", "flip", "flipOutX", "flipOutY", "fadeOut", "fadeOutUp", "fadeOutDown", "fadeOutLeft", "fadeOutRight", "fadeOutUpBig", "fadeOutDownBig", "fadeOutLeftBig", "fadeOutRightBig", "bounceOut", "bounceOutDown", "bounceOutUp", "bounceOutLeft", "bounceOutRight", "rotateOut", "rotateOutDownLeft", "rotateOutDownRight", "rotateOutUpLeft", "rotateOutUpRight", "hinge", "rollOut"];

// Init text
var texts = [
  // lvl 1
  'Ana are mere.',
  'De când te caut!',
  'Tu esti lupul!',

  // lvl 2
  'Dar nu primi nici un raspuns.',
  'Rochii frumoase, raspunse una.',
  'Nici asta nu-i cea adevarata!',

  // lvl 3
  'Buna ziua, batrânico, spuse domnita, ce faci aici?',
  'La ziua ei bunica-sa ii darui o scufita rosie.',
  'Capra behai a multumire si o porni linistita la drum.',

  // yea, yea,... ik... same level... CHANGE THIS
  'Dragi copilasi, deschideti usa, ca sunt eu, mama voastra.',
  'Si crenguta crescu mare si se facu o mândrete de copac.',
  'Fata îsi reteza degetul si cu chiu cu vai încalta condurul.',

  // bla bla bla
  "Îl trimise pe prâslea fuguta acasa, sa aduca foarfeca, ac si ata.",
  "Fetita se ducea în fiecare zi la cimitir si plângea amar la mormântul maica-sii.",
  "Seara, fata cadea frânta de oboseala, ca muncea de se spetea toata ziulica.",
  "Cât de goala ne e casa si ce fericiti am fi de-am avea si noi un copil.",
  "Pasamite, venise sa se razbune pentru ca nu fusese poftita si ea la serbare.",
  "Dar sa nu fie moarta, ci sa cada într-un somn adânc, care sa tina o suta de ani!",
  "Dar, de drept, el dorea sa afle cât mai degraba a cui era mândretea asta de fata.",
  "Pentru fata cea vitrega începura a curge, de-aci înainte, zile pline de amaraciune.",
  "A fost odata o fetita zglobie si dragalasa, pe care o iubea oricine de cum o vedea.",
  "Si când ajunse la fântâna si se pleca sa bea apa, bolovanii cei grei îl trasera la fund.",
  "Pasamite, împaratul gândea ca-n chipul asta fecioru-sau o sa aiba de unde sa-si aleaga mireasa.",
  "De cum o zari pe fata, feciorul împaratului îi iesi înainte, o prinse de brat si-o pofti la joc.",
  "La iarmaroc, omul avu grija sa cumpere pentru fetele vitrege rochii frumoase, margaritare si nestemate.",
  "Fata facu precum i se poruncise, dar plânse cu lacrimi amare pentru ca ar fi dorit si ea sa mearga la petrecere.",
  "N-apuca sa sfârseasca bine vorbele astea si numai ce sosira-n zbor doua porumbite albe si intrara pe fereastra în bucatarie.",
  "Mama a facut ieri cozonac si-i duc nitelus si bunicii, care-i bolnava si slabita, sa manânce si ea, ca sa-si mai vina în puteri.",
  "Când se trezi, lupul voi s-o ia la sanatoasa, dar pietroaiele atârnau atât de greu, ca dihania se prabusi la pamânt si dadu ortul popii.",
  "Dupa ce strigara vorbele astea îsi luara amândoua zborul si, rotindu-se, se asezara usurel pe umerii fetei, una la dreapta si alta la stânga.",
  "Hotomanul de lup ridica laba pâna la fereastra si când vazura iezii ca-i alba, nu se mai îndoi nici unul si, tranc, trasera ivarul de la usa.",
  "Apoi se praznui cu mare stralucire si alai nunta feciorului de împarat cu frumoasa adormita si amândoi traira fericiti pâna la sfârsitul zilelor.",
  "Când parintii si surorile vitrege se reîntoarsera acasa si intrara în bucatarie, o gasira pe Cenusareasa lânga vatra, stând în cenusa, ca întotdeauna.",
  "Pasarea cea alba, care se afla în alun, numai ce-i zvârli de sus o rochie tesuta toata în aur si argint si-o pereche de conduri cu alesaturi de matase si argint.",
  "De data asta, pasarica îi arunca o rochie atât de frumoasa si de stralucitoare, cum nu s-a mai vazut alta pe lume, iar condurii erau cu totul si cu totul din fir de aur."
];

// Init counters
var livesCount = MAX_LIVES;
var stageCount = 0;
var heartsLeft = 4;

var game = $('#game-box');

function initTextAnimation() {
  // Detect Ctrl key
  // window.onkeypress = detectSpecialKeys;
  // window.onkeyup = detectSpecialKeys;

  // Disable Selection on older browsers
  game.disableSelection();
  // Disable Paste
  $('#input-box').bind("paste", function(e) {
    e.preventDefault();
  });

  // Init Plugin
  game.textillate({
    // the default selector to use when detecting multiple texts to animate
    selector: '.texts',

    // enable looping
    loop: false,

    // sets the initial delay before starting the animation
    // (note that depending on the in effect you may need to manually apply
    // visibility: hidden to the element before running this plugin)
    initialDelay: 0,

    // set whether or not to automatically start animating
    autoStart: false,

    type: 'char'
  });
}

function initListeners() {
  game.on('inAnimationBegin.tlt', function () {
    $('#input-box').removeClass();
  });

  game.on('inAnimationEnd.tlt', function () {
    startTimeout();
  });

  game.on('outAnimationEnd.tlt', function () {
    abortTimeout();
    textValidation();
  });

  game.textillate('start');
}

function textValidation() {
  var aCurrentText = $( "ul li:nth-child(" + (stageCount + 1) + ")" ).html().trim().split(/\s+/);
  var aInputStr = ($('#input-box').val() || '').trim().split(/\s+/);
  var bonus = true;

  $('#input-box').val('');
  stageCount++;

  aCurrentText.forEach(function(word, index){
    if(word === aInputStr[index]) {
      var correctWords = 1*$('#correct-words').html();
      $('#correct-words').html(correctWords+1);
    } else

    if(bonus) {
      bonus = false;
      livesCount--;
      error();
    }
  });

  if(bonus) {
    var correctSentences = 1*$('#correct-sentences').html();
    $('#correct-sentences').html(correctSentences+1);
    success();
  }

  // SCORE HERE !!! <~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ^.^
  $('#current-score').html((1*$('#correct-words').html()) + (10*$('#correct-sentences').html()));

  // if(livesCount <= 0 && !alert("GAME OVER!")){window.location.reload();}
}

function populateGameBox(){
  var ulVal = $(".texts");
  var len = texts.length;
  for(var i = 0; i < len; i++){
    var inIndex = Math.min(effects_in_types.length-1, i%LVL_STAGES);
    var outIndex = Math.min(effects_out_types.length-1, i%LVL_STAGES);

    var liVal = "<li data-in-effect='" + effects_in_types[inIndex] + "' data-out-effect='" + effects_out_types[outIndex] + "'>" + texts[i] + "</li>";
    ulVal.append(liVal);
  }
}

function success() {
  $('#input-box').addClass('correct');
}

function error() {
  $('#input-box').addClass('wrong');
  breakHeart();
}

function startTimeout() {
  var currentLvL = Math.min(Math.floor(stageCount / LVL_STAGES), lvl_time.length-1);
  var timeout = lvl_time[currentLvL] * texts[stageCount].length;

  game.textillate({minDisplayTime: timeout});

  $(".timer-value").stop();
  $(".timer-value").animate({width:'0%'}, timeout, "linear");
}

function abortTimeout() {
  $(".timer-value").stop();
  $(".timer-value").css({width: "100%"});
}

function generateHearts() {
  $('.hearts').html("");
  for (var i = 1; i <= MAX_LIVES; i++) {
    $('.hearts').append("<i class='fa fa-heart'></i>");
  };
}

function breakHeart() {
  var h = $('.hearts' + " :not(.broken).fa-heart"); // Select non-broken hearts
  $(h.get(h.length-1)).addClass("broken");
  heartsLeft--;
}