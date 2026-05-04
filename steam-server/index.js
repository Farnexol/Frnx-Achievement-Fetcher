import path from "path"
import express from "express"
import helmet from "helmet"
import cors from "cors"
import { parse } from "node-html-parser" 
import axios from "axios";

const app = express()

app.use(helmet())
app.use(express.urlencoded({extended: true}))
app.use(cors())

const url = `https://store.steampowered.com/app/367520`;

const res = await axios.get(url, { headers: 
    { 
      'Cookie': "birthtime=662716801; wants_mature_content=1; path=/; domain=store.steampowered.com", //Bypass age check and mature filter
      "Accept-Language" : "en-US;q=1.0" //force result to english
    }} )
const html = res.data
const parsed = parse(html)

let result = {
    name: parsed.querySelector('.apphub_AppName').innerHTML,
    icon: parsed.querySelector('.game_header_image_full').attributes.src.match(/([^\\\/\:\*\?\"\<\>\|])+$/)[0].replace(".jpg","")
};

console.log(result)

app.listen(3000, () => {
    console.log("server listening on port 3000")
});