var express = require( 'express' );
var path = require( 'path' );
var fs = require( 'fs' );
var app = express();

var hbs = require( 'hbs' );
var blogEngine = require( './blog' );

app.set( 'view engine', 'html' );
app.engine( 'html', hbs.__express );
app.use( express.bodyParser() );
app.use( express.static('public') );


app.get( '/', function ( req, res ) {
    res.render( 'index');
});

app.get( '/editor', function ( req, res ) {
    res.render( 'index' );
});

/*
app.get( '/about', function ( req, res ) {
    //res.sendfile( './views/about.html' );
    res.render( 'about', {title: 'About Me'} );
});

app.get( '/article/:id', function ( req, res ) { 
    //res.sendfile( './views/article.html' );
    var entry = blogEngine.getBlogEntry( req.params.id );
    res.render( 'article', { title: entry.title, blog: entry });
});*/

app.post( '/parseimg', function ( req, res ) {

    fs.readFile( req.files.file0.path, function ( err, data ) {
        var database64 = '';
        database64 = "data:image/png;base64," + data.toString( 'base64' );
        fs.unlink( req.files.file0.path, function ( err ) {
            if ( !err ) {
                res.end( database64 );
            }
        });
    });

});

app.post('/send_xml_data', function (req, res) {
    var a = 0;
    
    var current_file = 'untitled_' + new Date().getTime() + '.rptx';

    fs.writeFile(current_file, '<?xml version="1.0" encoding="utf-8" ?>\n' + req.body.xml, function (err) {

        if (!err)
        {
            res.end('1');
        }
        else
        {
            res.end(err.message);
        }
        
    });
});

app.listen( 3000 );