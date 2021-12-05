const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const { getall, existe , save, setState, getState } = require('./SkateRepository');
const { getToken, verifyToken} = require('./tokenService');
const { stat } = require('fs');


app.listen(3000, () => { console.log('listening on port 3000') });
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));

// app.use('/axios', express.static(__dirname + '/node_modules/axios/dist'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use(fileUpload());
// {
//     limits: { fileSize: 5 * 1024 * 1024 },
//     abortOnLimit: true,
//     responseOnLimit: "Limite de archivo superado"
// }
app.set("view engine", "handlebars");
app.engine("handlebars",
    engine({
        layoutsDir: __dirname + "/views",
        partialsDir: __dirname + "/views/partials",
    },
    ));



app.get('/', (req, res) => {
    res.render('listado', {
        layout: 'listado'
    });
});
app.get('/login', (req, res) => {
    const {error} = req.query;
    res.render('login', { layout: 'login',error:error});
});

app.get('/admin', (req, res) => {

    res.render('listado', { layout: 'listado', admin:true}
    );
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    let user = await existe(email, password)
    console.log(user);
    if (user != null) {
        const token = getToken(user);
        console.log(token);
        res.send(`<script>
        sessionStorage.setItem('token', JSON.stringify('${token}'))
        window.location.replace("/");
        </script>
        `);
    }
    else 
    {
        res.redirect('/login?error=Credenciales Incorrectas');

    }

});
app.get('/register', (req, res) => {
    res.render('register', { layout: 'register' });
});
app.get('/update', (req, res) => {
    res.render('register', { layout: 'register',update:true });
});

app.post('/register', (req, res) => {
    const { email, nombre, password, anosExperiencia, especialidad, estado } = req.body;
    const { foto } = req.files;
    let emaill =email;
    emaill=emaill.replace(".", '-').replace("@", '-');
    console.log(email)
    const user ={ email:email,
        nombre:nombre,
        password:password,
        anosExperiencia:anosExperiencia,
        especialidad:especialidad,
        estado:estado,
        foto:emaill+'.jpg' }
    save(user);
    
    foto.mv(`${__dirname}/assets/users/${emaill}.jpg`, (err) => {
        
    });
    res.redirect('/');
});

//********** A P I **********

app.use('/api/:a', (req, res, next) => {
    let token = req.headers.token;
    try {
        if (token != undefined && token != null) {
            token = token.replace(/['"]+/g, '');

            const user = verifyToken(token);
            next();

        } else {

            throw { name: 'JsonWebTokenError', message: 'jwt vacio' }
        }
    } catch (e) {
        res.status(401).send(e);
    }

});
app.get('/api/validateToken', (req, res) => {
res.status(200).send({ name: 'JsonWebTokenAlert', message: 'JWT validad' });
});
app.get('/api/inscripciones', async(req, res) => {
    const all = await getall();
    res.status(200).send(all);
});

app.get("/api/state/:id", async (req,res)=>{
    const id = req.params.id;
    await setState(id);
    const state= await getState(id);
    res.status(200).send(state);
});
