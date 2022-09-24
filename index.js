// Variables
const express = require('express');

const { generateFile } = require('./generateFile');

const { executeCpp } = require('./executeCpp');
const { executePy } = require('./executePy');
const { executeGo } = require('./executeGo');
const { executeFortran } = require('./executeFortran');

const path = require('path');

const app = express();

const jsonParser = express.json();


// Parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Response
app.get("/", (req, res) => 
{
    return res.render('index', {output: ''});
})




app.get("/compiler", (req, res) => {
    return res.render("compiler")
})



// Basic Routing
app.post("/run", async (req, res) =>
{
    // console.log(req.body.code_ide)
    // const { language = "cpp", code } = req.body.code_ide;
    const language = req.body.language;
    const code = req.body.code_ide;

    if(code === undefined || code === "" || code === " " || code === "\t" || code === "\n")
    {
        return res.status(200).render("index", {output: "Empty Code Body!"});
    }

    try{

    const filepath = await generateFile(language, code);

    let output;
    switch (language) {
        case "cpp":
            output = await executeCpp(filepath);
            break;

        case "py":
            output = await executePy(filepath);
            break;

        case "go":
            output = await executeGo(filepath);
            break;

        case "f90":
            output = await executeFortran(filepath);
    
        default:
            break;
    }
    
    
    console.log(output)

    
        return res.status(200).render("index", {output: output})
    }
    catch(e){
        return res.status(200).render("index", {output: e.stderr})
    }
    // output = "world";
    //json({ filepath, output });

});



const port = 5000

// Port Message
app.listen(port, () =>
{
    console.log(`Port running on ${port}`);
});




