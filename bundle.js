var Timer = require("./node_modules/easytimer.js").Timer;
var timerInstance = new Timer();
window.createCard =function() {


  // JQUERRY create tags from nicknames
  $(function(){ // DOM ready

    // ::: TAGS BOX
  
    $("#tags textarea").on({
      focusout : function() {
        var txt = this.value.replace(/[^a-z0-9\+\-\.\#]/ig,''); // allowed characters
        if(txt) $("<span/>", {text:txt, insertBefore:this}); // adds span elements
        this.value = "";
      },
      keyup : function(ev) {
        // if: comma|enter (delimit more keyCodes with | pipe)
        if(/(188|13|32)/.test(ev.which)) $(this).focusout(); 
      }
    });
    $('#tags').on('click', 'span', function() {
      if(confirm("Remove "+ $(this).text() +"?")) $(this).remove();  // alert to confirm removal
    });
  
  });


  //Timer
  timerFunction();
  // Google sheets stuff
  const queryString = window.location.search;
  console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  const subject = urlParams.get('subject')
  const lang_one = urlParams.get('lang_one')
  const lang_two = urlParams.get('lang_two')  
  console.log(subject);

  var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRXAUqgnOmVy8s5EL6SrLs9Q0olse49ZkGOSsygoEjvGtR_v7g6iFsAA__cZINiUQOC7DSoQ6IG9StY/pub?gid=0&single=true&output=csv';

  const reader = require("./node_modules/g-sheets-api");
  const readerOptions = {
    sheetId: "1O2RAmqAw38ALQfCkuBAvbCgKE8bah6Nvt_q-PLtra6w",
    returnAllResults: true
  };
  
  reader(readerOptions, (results) => {
      console.log("results " + results)
      cardNum = Math.floor(Math.random() * (results.length));
      console.log(results[cardNum]["en_title"])
      try {
        // lang one
        window.document.getElementById("lang_one_title").innerHTML = results[cardNum][lang_one+"_title"].replace("$blahblahblah$", subject);
        window.document.getElementById("lang_one_action").innerHTML = results[cardNum][lang_one+"_action"].replace("$blahblahblah$", subject);
        window.document.getElementById("lang_one_paragraph").innerHTML = results[cardNum][lang_one+"_paragraph"].replace("$blahblahblah$", subject);
        console.log(results[cardNum]["image_link"])
        window.document.getElementsByClassName("illustration")[0].src = results[cardNum]["image_link"];
        window.document.getElementsByClassName("illustration")[1].src = results[cardNum]["image_link"];

        
        // lang two
        window.document.getElementById("lang_two_title").innerHTML = results[cardNum][lang_two+"_title"].replace("$blahblahblah$", subject);
        window.document.getElementById("lang_two_action").innerHTML = results[cardNum][lang_two+"_action"].replace("$blahblahblah$", subject);
        window.document.getElementById("lang_two_paragraph").innerHTML = results[cardNum][lang_two+"_paragraph"].replace("$blahblahblah$", subject);
      } catch (err) {
        console.log("ERROR " + err)
      }
    /* Do something amazing with the results */
  });


}
window.timerFunction = function() {
  // Timer
  if (window.document.getElementById("timer").textContent != "00:00") {
    timerInstance.reset()
  } else {
    timerInstance.start()
  }  
  timerInstance.addEventListener('secondsUpdated', function (e) {
    window.document.getElementById("timer").innerHTML = timerInstance.getTimeValues().toString().substring(3);
});

}

window.fireworks = function() {
  // confetti
  const confetti = require('canvas-confetti'); // require - npm module
  var count = 400;
  var defaults = {
    origin: { y: 0.7 }
  };
  
  function fire(particleRatio, opts) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  }
  
  fire(0.25, {
    spread: 100,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 150,
  });
  fire(0.35, {
    spread: 200,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 220,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 250,
    startVelocity: 45,
  });
}

window.show_roles = function() {
  let input_children = document.getElementById("tags").querySelectorAll("span"); // get all spans
  var nicknames = [];
  for(var value of input_children) { // loop thru each span and get its value
    console.log(value);
    console.log(typeof(value));
    nicknames.push(value.textContent);
  }
  console.log(nicknames)
  localStorage.setItem('nicknames', nicknames); // store nicnames locally
  nicknames = shuffle(nicknames); // shuffle

  let roles = document.getElementsByClassName("roles")[0];
  roles.innerHTML = "";
  let role_descriptions = ["take notes on how your game goes and who wins each round","keep track of whoever needs to respond, make sure everyone is participating","reads the cards out loud", "pushes to get the group to do 1-2 minutes/card", "reports insights to larger groups + number of cards covered"]

  for (var i = 0; i < Math.min(nicknames.length, role_descriptions.length); i++) {
    roles.innerHTML += "<h4>"+nicknames[i]+"</h4> <p>"+role_descriptions[i]+"</p><br>";
  }

}

// shuffling alg
window.shuffle = function (a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}