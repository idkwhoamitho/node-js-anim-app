const fs = require('fs');
const { title } = require('process');

//check data folder
const check = fs.existsSync('./data');
if(!check){
    fs.mkdirSync("./data");
}

//check data json
const data = fs.existsSync('./data/list.json');
if(!data){
    fs.writeFileSync('./data/list.json','[]');
}
//load json 
const loadAnimeList = () => {
    const fileBuffer = fs.readFileSync('data/list.json','utf-8');
    const listAnime = JSON.parse(fileBuffer);
    return listAnime;
}

//find anime
const findAnime = (titleAnime) => {
    const anime = loadAnimeList();
    const anim = anime.find(title => title.title === titleAnime);
    return anim;
}
//check tahun
const checkYear = (year) => {
    if(year < 1000){
        return true;
    }
    return false;
}
//save anim
const saveAnim = (title)=> {
    fs.writeFileSync('data/list.json',JSON.stringify(title));
}

const addAnim = (anim,picPath) => {
    const anims = loadAnimeList();
    anim.picture = picPath
    anims.push(anim);
   saveAnim(anims);
}
//hapus anim
const deleteAnim = (title) => {
    const Anims = loadAnimeList();
    const hapusFoto = Anims.find(Anim => Anim.title === title);
    fs.rmSync('./public/' + hapusFoto.picture);
    const filteredAnims = Anims.filter(Anim => Anim.title !== title);
    saveAnim(filteredAnims);
}
//edit anim data 
const editAnim = (dataAnim,fotoPath) => {
    const Anims = loadAnimeList();
    const filteredAnims = Anims.filter(anim => dataAnim.title !== anim.title);
    if(dataAnim.picture === undefined){
        fs.rmSync('./public/' + dataAnim.picture);
    }
    dataAnim.picture = fotoPath;
    delete dataAnim.oldNama;
    delete dataAnim.oldYear;
    filteredAnims.push(dataAnim);
    saveAnim(filteredAnims);
}




module.exports = {loadAnimeList,findAnime,checkYear,addAnim,deleteAnim,editAnim}