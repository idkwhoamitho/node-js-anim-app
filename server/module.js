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
        return false;
    }
    return true;
}
//save anim
const saveAnim = (title)=> {
    fs.writeFileSync('data/list.json',JSON.stringify(title));
}

const addAnim = (anim) => {
    const anims = loadAnimeList();
    anims.push(anim);
   saveAnim(anims);
}
//hapus anim
const deleteAnim = (title) => {
    const Anims = loadAnimeList();
    const filteredAnims = Anims.filter(Anim => Anim.title !== title);
    saveAnim(filteredAnims);
}


module.exports = {loadAnimeList,findAnime,checkYear,addAnim,deleteAnim}