const express = require('express')
const app = express()
const expressLayouts = require('express-layout');
const {body,validationResult,check} = require('express-validator');
const utils = require('./server/module');
const mv = require('mv');
const morgan = require('morgan');
const formidable = require('formidable');
const { urlencoded } = require('body-parser');
const port = 3000

app.use(express.static('public')) ;
app.set('view engine','ejs');
app.use(morgan('dev'));
app.use(expressLayouts());
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => {
  res.render('index',{
    layout: 'layouts/main-layouts',
    title: 'halaman home'
  });
})

app.get('/anime',(req,res,next) => {
  const loadAnim = utils.loadAnimeList();
  return res.render('list-anime',{
    title: 'list anime',
    layout: 'layouts/main-layouts',
    loadAnim
  })
})

app.get('/Anime/Ubah/:nama',(req,res) => {
  const Anim = utils.findAnime(req.params.nama);
  res.render('ubah-list-anim',{
    title: 'form ubah data ',
    layout: 'layouts/main-layouts',
    Anim
  })
})

app.post('/Anime/Ubah',[
  check('realese').custom((value,{ req }) => {
    const tahun = utils.checkYear(value);
    if (tahun && value !== req.body.oldYear){
      throw new Error('tahun tidak valid');
    } 
    return true;
  })
],(req,res) => {  
    const form = new formidable.IncomingForm();

    const errors = validationResult(req);
   
    return form.parse(req,(error,fields,files) => {
      const oldPath = files.sampulAnim.path;
      const newPath = '/public/uploads/' + files.sampulAnim.name;
      if(!errors.isEmpty()){
         res.render('ubah-list-anim',{
          title: 'form tambah',
          layout: 'layouts/main-layouts',
          errors: errors.array(),
          Anim : fields
        })
        
      }
      else{
        // res.send({fields,files});
        mv(oldPath ,'./public' + newPath,(Err) => {
          if(Err) throw Err;
          utils.editAnim(fields,newPath);  
          res.redirect('/anime')
        })
      }
    })
})




app.post('/Anime',[
  check('realese').custom(value => {
    const tahun = utils.checkYear(value);
    if (tahun){
      throw new Error('tahun tidak valid');
    } 
    return true;
  })
],(req,res) => {  
    const form = new formidable.IncomingForm();

    const errors = validationResult(req);
   
    return form.parse(req,(error,fields,files) => {
      const oldPath = files.sampulAnim.path;
      const newPath = '/public/uploads/' + files.sampulAnim.name;
      if(!errors.isEmpty()){
         res.render('add-list-anim',{
          title: 'form tambah',
          layout: 'layouts/main-layouts',
          errors: errors.array(),
        })
        
      }
      else{
        mv(oldPath ,'./public' + newPath,(Err) => {
          if(Err) throw Err;
          utils.addAnim(fields,newPath);  
          res.redirect('/anime')
        })
      }
    })
})



app.get('/anime/detail/:nama',(req,res) => {
  const Anim = utils.findAnime(req.params.nama);
  return res.render('detail',{
    title: 'list anime',
    layout: 'layouts/main-layouts',
    Anim
  })
})

app.get('/Anime/Delete/:nama',(req,res) => {
  const Anim = utils.deleteAnim(req.params.nama);
  res.redirect('/anime');
})

app.get('/Anime/update',(req,res) => {
  res.render('add-list-anim',{
    title: 'form tambah',
    layout: 'layouts/main-layouts',
  })
})


app.use('/',(req,res) => {
  res.sendStatus(404);
  res.send('<h1>404</h1>');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})