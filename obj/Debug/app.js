var express = require( 'express' );
var app = express();

var hbs = require( 'hbs' );

app.set( 'view engine', 'html' );
app.engine( 'html', hbs.__express );

app.get( '/', function ( req, res ) {
    //res.sendfile( './views/index.html' );
    res.render( 'index' );
});

app.get( '/about', function ( req, res ) {
    //res.sendfile( './views/about.html' );
    res.render( 'about' );
});

app.get( '/article', function ( req, res ) { 
    //res.sendfile( './views/article.html' );
    res.render( 'article' );
});

app.listen( 3000 );