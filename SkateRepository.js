const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "admin",
    port: 5432,
    database: "skatepark"
});



const getall = async () => {

    try {
        const response = await pool.query('SELECT * FROM skaters');
        return response.rows;
    } catch (error) {
        throw error;
    }
}
const save = async (user) => {
    try {
        console.log(user);
        const response = await pool.query('INSERT INTO public.skaters(email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ($1, $2, $3, $4, $5, $6, false);', [user.email, user.nombre, user.password, user.anosExperiencia, user.especialidad, user.foto]);
        return response.rows[0];
    } catch (error) {
        throw error
    }
}
const existe = async(email, password) => {
    const all= await getall();
    const user =  all.find((u) => u.email = email && u.password == password);
    return (user) ? user : null;
}
const setState = async (id) => {
    try {
        const state=await getState(id);
        const response = await pool.query('update skaters set estado= $1 where id = $2', [!state, id]);
        return response.rows;
    } catch (error) {
        throw error;
    }
}
const getState =async (id) => {
    try {
        const response = await pool.query('SELECT estado FROM skaters where id = $1', [id]);
        return response.rows[0].estado;
    } catch (error) {
        throw error;
    }
    
}



module.exports = { getall, existe, save, setState, getState };
