
var entries = [

    { "id": 1, "title": "Hellow World", "body": "this is the body of the first blog, hellow world", "published": "04/30/2014" },
    { "id": 2, "title": "Title Blog Number 2", "body": "this is the body of the second blog.. lets check", "published": "05/30/2014" },
    { "id": 3, "title": "Title Blog Number 3", "body": "this is the body of the third blog.. lets check", "published": "05/30/2014" },
    { "id": 4, "title": "Mean People Suck", "body": "People who are mean aren't nice or fun to hang around.", "published": "6/5/2013" },
    { "id": 5, "title": "I'm Leaving Technology X and You Care", "body": "Let me write some link bait about why I'm not using a particular technology anymore.", "published": "6/10/2013" },
    { "id": 6, "title": "Help My Kickstarter", "body": "I want a new XBox One. Please fund my Kickstarter.", "published": "6/12/2013" }
];


exports.getBlogEntries = function () {
    return entries;
}

exports.getBlogEntry = function (id) {
    var entry = entries.filter( function ( e ) {
        return e.id == id;
    });

    return entry[0];
}