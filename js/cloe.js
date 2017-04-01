// Cloe.js
// Copyright (c) 2017 by Jin Yeom

$.fn.extend({
  animateCss: function (animName) {
    var animEnd = 'webkitAnimationEnd mozAnimationEnd ' +
      'MSAnimationEnd oanimationend animationend';

    this.addClass('animated ' + animName).one(animEnd, function() {
      $(this).removeClass('animated ' + animName);
    });
  }
});

var respond = function(response) {
  $('#response').animateCss('fadeIn');
  $('#response').html(response);
  $('#title-response').html(response);
};

if (annyang) {
  var listening = false;

  // start listening responses
  var startListeningResponses = [
    'What\'s up? 😊',
    'Yes? 😃',
    'Yeah? 😊',
    'Mmhmm? 😊',
    'What do you need? 😊',
    'Heeeyyyyyy, What\'s up? 😜'
  ];

  // stop listening responses
  var stopListeningResponses = [
    'Alright! 😄',
    'Okay! 😛',
    'Alrighty. 😗',
    'That\'s cool. 😌',
    'Let me know if you need anything! 😉'
  ];

  // list of supported websites
  var supportedWebsites = [
    'google',
    'facebook',
    'reddit',
    'twitter',
    'netflix',
    'tumblr',
    'github',
    'youtube',
    'hulu',
    'amazon'
  ];

  // random selection helper function
  var randSelect = function(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }

  // scroll to a specified section of the page
  var scrollTo = function(identifier) {
    $('html, body').animate({
        scrollTop: $(identifier).offset().top
    }, 1000);
  }

  var cloesFavorite = function(topic) {
    switch (topic) {
      case 'food': respond('🍣'); break;
      case 'drink': respond('🍺'); break;
      case 'fruit': respond('🍑'); break;
      case 'animal': respond('🐳');
    }
  }

  var sendNudes = function() {
    window.location.href = 'https://github.com/jinyeom/cloe';
  }

  // Start listening.
  var startListening = function() {
    respond(randSelect(startListeningResponses));
    listening = true;
  };

  // Stops listening.
  var stopListening = function() {
    if (listening) {
      respond(randSelect(stopListeningResponses));
      listening = false;
    }
  };

  Date.prototype.timeNow = function () {
    return ((this.getHours() < 10) ? '0' : '') + this.getHours() + ':' +
      ((this.getMinutes() < 10) ? '0' : '') + this.getMinutes();
  }

  // Show current time.
  var showTime = function() {
    if (listening) {
      var time = new Date();
      respond('It\'s ' + time.timeNow() + '.');
      listening = false;
    }
  };

  // Search a topic on Wikipedia; search google if it's not found.
  var wikiSearch = function(topic) {
    if (listening) {
      var processed = topic.replace(/ /g, '%20');
      var url = 'https://en.wikipedia.org/w/api.php?action=query&' +
      'prop=extracts&format=json&exintro=&titles=' + processed

      $.ajax({
        type: "GET",
        url: url,
        async: false,
        dataType: "jsonp",
        contentType: "application/json",
        success: function(data) {
          var page = Object.values(data.query.pages)[0];
          if (page.extract.length > 0) {
            modalOpened = true;
            respond('Searching \'' + topic + '\' on Wikipedia...');

            $('#modal-title').html(page.title);
            $('#modal-content').html(page.extract);

            $('html').addClass('is-clipped');
						$('#modal-ter').animateCss('fadeIn');
            $('#modal-ter').addClass('is-active');
          } else {
            respond('I couldn\'t find \'' + topic + '\' on Wikipedia. 😅' +
              'Searching on Google...');
            window.open('https://www.google.com/#q=' + processed);
          }
        },
        error: function() {
          googleSearch(processed);
        }
      });

      listening = false;
    }
  };

  // Google search given a search topic.
  var googleSearch = function(topic) {
    if (listening) {
      respond('Searching \'' + topic + '\' on Google...');
      var processed = topic.replace(/ /g, '%20');
      window.open('https://www.google.com/#q=' + processed);
      listening = false;
    }
  };

  // Bing search given a search topic.
  var bingSearch = function(topic) {
    if (listening) {
      respond('Searching \'' + topic + '\' on Bing...');
      var processed = topic.replace(/ /g, '%20');
      window.open('https://www.bing.com/search?q=' + processed);
      listening = false;
    }
  };

  // Search for videos on YouTube.
  var youtubeSearch = function(topic) {
    if (listening) {
      respond('Searching \'' + topic + '\' on YouTube...');
      var processed = topic.replace(/ /g, '%20');
      window.open('https://www.youtube.com/results?search_query=' + processed);
      listening = false;
    }
  };

  // Open a website given a website name; Google search if not in the list.
  var openWebsite = function(website) {
    if (listening) {
      website = website.toLowerCase();
      if (supportedWebsites.includes(website)) {
        respond('Opening \'' + website + '\' on a new tab...');
        window.open('https://www.' + website + '.com');
      } else {
        respond('Searching \'' + website + '\' on a new tab...');
        window.open('https://www.google.com/#q=' + website);
      }
      listening = false;
    }
  };

  var commands = {
    'Chloe what\'s your favorite :topic': cloesFavorite,
    'send nudes': sendNudes,

    // start listening
    'hey Chloe': startListening,

    // stop listening
    'nevermind': stopListening,
    'nothing': stopListening,
    'stop listening': stopListening,

    // current time
    'show me time': showTime,
    'what time is it': showTime,

    // wikipedia search
    'what\'s *topic': wikiSearch,
    'what is *topic': wikiSearch,
    'who\'s *topic': wikiSearch,
    'who is *topic': wikiSearch,

    // general search
    'google *topic': googleSearch,
    'bing *topic': bingSearch,
    'search *topic': googleSearch,
    'video search *topic': youtubeSearch,

    // open web page
    'open *website': openWebsite,
    'go to *website': openWebsite,
  };

  annyang.addCommands(commands);
  annyang.start();
}
