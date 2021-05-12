module.exports = function(app, Book, Character, Actor, Movie)
{
    app.get('/', function(req, res) {
        Book.find(function(err,booklist) {
            if (err) return res.status(500).send({error: 'database failure'});
            Actor.find(function(err,actorlist) {
                if (err) return res.status(500).send({error: 'database failure'});
                res.render('index',{booklist:booklist,actorlist:actorlist});
            })
        });
    });

    app.get('/books/search', function(req, res) {
        Book.find({ title: req.query.title },function(err,booklist) {
            if (err) {
                console.log(err);
                return res.status(500).send({error: 'database failure'});
            }
           res.render('search',{booklist:booklist});
        });
    });

    app.get('/books/detail/:id', function(req, res) {
        Book.findOne({_id : req.params.id}, function(err, book) {
            if (err) return res.status(500).send({error: 'database failure'});
            Character.find({bookid:book._id}, function(err, character) {
                if (err) return res.status(500).send({error: 'database failure'});
                res.render('bookdetail',{book:book,character:character});
            })
        });
    });

    app.get('/books/create', function(req, res) {
        res.render('createbook');
    });


    app.post('/books/create', function(req, res) {
        var book = new Book();
        book.title = req.body.title;
        book.author = req.body.author;

        book.save(function(err){
            if (err) {
                console.error(err);
                res.redirect('/');
            }
            chnum = req.body.chnumber;
            i = 1;
            while (i <= chnum) {
                let char = new Character;
                char.bookid = book._id;
                char.name = req.body['name'+i];
                char.gender = req.body['gender'+i];
                char.age = req.body['age'+i];
                char.persontype = req.body['persontype'+i];

                char.save(function(err){
                    if (err) {
                        console.error(err);
                        res.redirect('/');
                    }
                });
                i++;
            }
            res.redirect('/');
        });
    });

    app.get('/books/delete/:id', function(req, res) {
        Book.findOne({_id : req.params.id}, function(err, book) {
            if (err) return res.status(500).send({error: 'database failure'});
            Character.remove({bookid:book._id}, function(err, output) {
                if (err) return res.status(500).send({error: 'database failure'});
                Book.remove({_id : req.params.id}, function(err, output) {
                    if (err) return res.status(500).send({error: 'database failure'});
                    res.redirect('/');
                });
            });
        });
        
    });


    app.get('/actors/detail/:id', function(req, res) {
        Actor.findOne({_id : req.params.id}, function(err, actor) {
            if (err) return res.status(500).send({error: 'database failure'});
            res.render('actordetail',{actor: actor});
        });
    });


    app.get('/actors/create', function(req, res) {
        res.render('createactor');
    });

    app.post('/actors/create', function(req, res) {
        var actor = new Actor();
        actor.name = req.body.name;
        actor.gender = req.body.gender;
        actor.age = req.body.age;
        actor.persontype = req.body.persontype;
        actor.save(function(err){
            if (err) {
                console.error(err);
                res.redirect('/');
                return;
            }

            res.redirect('/');
        });
    });

    app.get('/actors/delete/:id', function(req, res) {
        Actor.remove({_id: req.params.id}, function(err, output){
            if(err) return res.status(500).json({ error: "database failure" });
            res.redirect('/');
        });
    });

    app.get('/movies/:id', function(req, res) {
        Movie.remove({bookid: req.params.id}, function(err){
            Book.findOne({_id : req.params.id}, function(err, book) {
                if (err) return res.status(500).send({error: 'database failure'});
                Character.find({bookid:book._id}, function(err, character) {
                    if (err) return res.status(500).send({error: 'database failure'});
                    character.map(function(char){
                        var movie = new Movie;
                        movie.bookid = book._id;
                        movie.title = book.title;
                        movie.author = book.author;
                        movie.character = char.name;
                        Actor.findOne({gender:char.gender,age:char.age,persontype:character.persontype}, function(err, actor) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                if (actor === null) {
                                    movie.actor = '해당하는 배우가 데이터베이스에 존재하지 않습니다';
                                }
                                else {
                                    movie.actor = actor.name;
                                }
                            }
                            movie.save(function(err){
                                if (err) {
                                    console.error(err);
                                    rescls.redirect('/');
                                } 
                            });
                        });
                    });

                    setTimeout(function() {
                        Movie.find({bookid:book._id}, function(err,movie){
                            if (err) {
                                console.error(err);
                                return res.status(500).send({error: 'database failure'});
                            }
                            res.render('movie',{book:book,movie:movie});
                        });   
                    }, 2000);
                });
            });
        });
    });
}