import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hola desde GET en la API');
});

app.post ('/', (req, res) => {
    const data = req.body;
    res.json({
        mensaje: 'Datos recibidos por POST',
        data
    });

});

app.listen(3000, () => {
    console.log('API escuchando en http://localhost:3000');
});