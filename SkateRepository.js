
const pg = require('pg');
let index = 2;
let bd = [{
    id: 1,
    email: "juanito@skt.cl",
    nombre: "juan de picas",
    password: "1234",
    anosExperiencia: 20,
    especialidad: "Jugador de Poker",
    foto: "juanito-skt-cl.png",
    estado: false
},
{
    id: 2,
    email: "juanita@skt.cl",
    nombre: "juanita de corazones",
    password: "1234",
    anosExperiencia: 20,
    especialidad: "Jugadora de Poker",
    foto: "juanito-skt-cl.png",
    estado: true
},
{
    id: 0,
    email: "admin@admin.a",
    nombre: "admin",
    password: "1234",
    anosExperiencia: -99,
    especialidad: "46m1n157r4d0r",
    foto: "juanito-skt-cl.png",
    estado: true
}
];

const getall = () => {
    return bd.map((u) => {
        u.password='****';
        return u
    });
}
const save = (user) => {
    bd.push({
        id: ++index,
        email: user.email,
        nombre: user.nombre,
        password: user.password,
        anosExperiencia: user.anosExperiencia,
        especialidad: user.especialidad,
        foto: user.foto,
        estado: false
    });
    return user;
}
const existe = (email, password) => {
    const user = bd.find((u) => u.email = email && u.password == password);
    
    return (user) ? user : null;
}
const setState = (id) => {
    bd = bd.map((u) => { if (u.id == id) { u.estado = !u.estado } return u });
    return getState(id);
}
const getState = (id) => {
    return getall().find((u) => u.id == id).estado;
}



module.exports = { getall, existe, save, setState, getState };
