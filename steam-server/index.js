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

app.listen(3000, () => {
    console.log("server listening on port 3000")
});