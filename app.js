const express = require('express')
const app = express()
const expressLayouts = require('express-layout');
const {body,validationResult,check} = require('express-validator');
const utils = require('./server/module');
const mv = require('mv');

const formidable = require('formidable');
const { urlencoded } = require('body-parser');
const fs = require('fs');
const port = 3000

app.set('view engine','ejs');
app.use(expressLayouts());
app.use(express.urlencoded({extended:true,limit:"20mb"}));

app.get('/', (req, res) => {
  res.render('index',{
    layout: 'layouts/main-layouts',
    title: 'halaman home'
  });
})

app.get('/anime',(req,res) => {
  const loadAnim = utils.loadAnimeList();
  res.render('list-anime',{
    title: 'list anime',
    layout: 'layouts/main-layouts',
    loadAnim
  })
})

app.get('/anime/detail/:nama',(req,res) => {
  const Anim = utils.findAnime(req.params.nama);
  console.log(Anim.title);
  res.render('detail',{
    title: 'list anime',
    layout: 'layouts/main-layouts',
    Anim
  })
})

app.get('/Anime/update',(req,res) => {
  res.render('add-list-anim',{
    title: 'form tambah',
    layout: 'layouts/main-layouts',
  })
})

app.post('/Anime',[
  check('realese').custom(value => {
    const tahun = utils.checkYear(value);
    if (!tahun){
      throw new Error('tahun tidak valid');
    } 
    return true;
  })
],(req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.render('add-list-anim',{
      title: 'form tambah',
      layout: 'layouts/main-layouts',
      errors: errors.array(),
    })
  }
  else{
    // utils.addAnim(req.body);
    // res.redirect('/anime');
  }
})

app.post('/Anime',(req,res) => {
  
})




app.use('/',(req,res) => {
  res.sendStatus(404);
  res.send('<h1>404</h1>');
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})