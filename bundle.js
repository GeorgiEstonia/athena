var Timer = require("./node_modules/easytimer.js").Timer;
var timerInstance = new Timer();
window.showAnswer = function(lang, answer) {
  console.log("TRIGGERED");
  if (lang === 1) {
    window.document.getElementById("lang_one_action").innerHTML = "";
    window.document.getElementById("lang_one_paragraph").innerHTML = answer;
    window.document.getElementById("lang_one_answ_btn").innerHTML = "";
  } else {
    window.document.getElementById("lang_two_action").innerHTML = "";
    window.document.getElementById("lang_two_paragraph").innerHTML = answer;
    window.document.getElementById("lang_two_answ_btn").innerHTML = "";
  }
}
window.createCard =function() {





  //Timer
  timerFunction();

  //params from url
  const queryString = window.location.search;
  console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  const subject = urlParams.get('subject')
  const lang_one = urlParams.get('lang_one')
  const lang_two = urlParams.get('lang_two')
  const deck = urlParams.get('deck')
  const team_string = urlParams.get('team')  
  const nicknames = team_string.split("_")
  show_roles(nicknames)
  console.log(deck)


  // Google sheets stuff
  var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRXAUqgnOmVy8s5EL6SrLs9Q0olse49ZkGOSsygoEjvGtR_v7g6iFsAA__cZINiUQOC7DSoQ6IG9StY/pub?gid=0&single=true&output=csv';

  const reader = require("./node_modules/g-sheets-api");
  const readerOptions = {
    sheetId: "1O2RAmqAw38ALQfCkuBAvbCgKE8bah6Nvt_q-PLtra6w",
    returnAllResults: false,
    filter: {
      "subject": deck
    }
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


        //window.document.getElementById("lang_two_answ_btn").innerHTML = "<button class='control_button'>Reveal answer</button>"



      } catch (err) {
        console.log("ERROR " + err)
      }
        // Answers
        window.document.getElementById("lang_one_answ_btn").innerHTML = "<button class='control_button'>Reveal answer</button>"

        langOneAnsw = results[cardNum][lang_one+"_solutions"];
        langTwoAnsw = results[cardNum][lang_two+"_solutions"];
        console.log("ANSW " + langOneAnsw + langTwoAnsw)
        if (langOneAnsw !== undefined) {
          window.document.getElementById("lang_one_answ_btn").innerHTML = "<button class='control_button' onclick='showAnswer(1,\""+String(langOneAnsw)+"\")'>Reveal answer</button>"
        } else {
          window.document.getElementById("lang_one_answ_btn").innerHTML = "";
        }
        if (langTwoAnsw !== undefined) {
          window.document.getElementById("lang_two_answ_btn").innerHTML = "<button class='control_button' onclick='showAnswer(2,\""+String(langTwoAnsw)+"\")'>Reveal answer</button>"
        } else {
          window.document.getElementById("lang_two_answ_btn").innerHTML = "";
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

window.show_roles = function(nicknames) {

  console.log(nicknames)
  nicknames = shuffle(nicknames); // shuffle

  let roles = document.getElementsByClassName("roles_card")[0];
  roles.innerHTML = "<h4>Play according to these roles:</h4><br>";
  let role_descriptions = [
      "Speaker🎙: reads the cards to the group",
      "Solver💡: performs the task unless it's a group exercise",
      "Note-taker📝: writes down the takeaways of each round ",
      "Facilitator🤝: tracks turn order and encourages team cooperation",
      "Time-keeper⏱: limits the turns to 2 minutes",
    ]
  if (nicknames.length>1) {
    for (var i = 0; i < Math.min(nicknames.length, role_descriptions.length); i++) {
      roles.innerHTML += "<h4>"+nicknames[i]+"</h4> <p>"+role_descriptions[i]+"</p><br>";
    }
  } else {
    for (var i = 0; i < role_descriptions.length; i++) {
      roles.innerHTML += "<br>"+"<p>"+role_descriptions[i]+"</p><br>";
    }
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