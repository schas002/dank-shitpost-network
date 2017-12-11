var express = require('express'),
    mastodon = require('./mastodon.js'),
    corpora = require('corpora-project');

function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

var nouns = corpora.getFile('words', 'nouns')['nouns'],
    verbs = corpora.getFile('words', 'verbs')['verbs'],
    adjs = corpora.getFile('words', 'adjs')['adjs'];

var DISCLAIMER = `We aren't an affiliate, nor in any other way related with, @NASA's Deep Space Network, and neither is @\u200Bzyabin101 nor @\u200Bdjsundog@toot-lab.reclaim.technology. However, we all love the Deep Space Network. :)`;

var app = express();

app.use(express.static('public')); // serve static files like index.html http://expressjs.com/en/starter/static-files.html

function nounOrVerb() {
  var noun = sample(nouns);
  var verb = sample(verbs)['present'];
  return sample([noun, verb]);
}

function chooseFromTypes() {
  return sample(['', sample(adjs) + ' ']) + nounOrVerb();
}

function generateStatus() {
  var text = '';
  var a = chooseFromTypes();
  var b = chooseFromTypes();
  var text = text + 'in ' + a + ' in ' + a + ' ' + sample(['1', 'one']) + ' ' + b;
  if (Math.random() < 0.5) {
    text = text.toUpperCase();
  }
  if (Math.random() < 0.01) {
    text = sample(['Disclaimer: ', 'And now a disclaimer: ',
                   'Periodical disclaimer: ', 'Yet another disclaimer: ']) + DISCLAIMER +
           sample(['\n\n', '\nNow, on to your regular programming...\n\n']) + text;
  }
  return text;
}

app.all("/toot", function (request, response) { // send a GET or POST to /toot to trigger a toot http://expressjs.com/en/starter/basic-routing.html
  var newStatus = generateStatus();

  console.log("Got a hit!");
  var result = mastodon.tryToToot(newStatus);
  response.status(result.status).send(result.error);
  
});

console.log('Here is an example status:');
console.log(generateStatus());
console.log("✨🔮✨")

var thePort = process.env.PORT || 3000;
app.listen(thePort, function () {
  console.log('😎 Your app is listening on port ' + thePort);
});
