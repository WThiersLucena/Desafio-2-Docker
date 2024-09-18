const express = require('express');
const pool = require('./database');

const app = express();

app.use(express.json());

const getPeople = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM people', (error, results) => {
          if (error) {
            return reject(error.stack);
          }
          resolve(results);
        });
    });
};

app.get('/', async (req, res) => {
    console.log(`Uma nova requisição para app.js. Url: ${req.get('host')} ${req.originalUrl}`);

    try {
        const peoples = await getPeople();
        
        let html = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #2c3e50; text-align: center; }
                        table { width: 60%; margin: 20px auto; border-collapse: collapse; }
                        th, td { padding: 12px; border: 1px solid #ccc; text-align: left; }
                        th { background-color: #3498db; color: white; }
                        tr:nth-child(even) { background-color: #f2f2f2; }
                        tr:hover { background-color: #ddd; }
                        .message { text-align: center; font-size: 1.2em; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <h1>Full Cycle Rocks!!</h1>
        `;

        if (peoples.length > 0) {
            html += `
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            peoples.forEach(person => {
                html += `
                    <tr>
                        <td>${person.id}</td>
                        <td>${person.name}</td>
                    </tr>
                `;
            });

            html += `
                    </tbody>
                </table>
            `;
        } else {
            html += `<div class="message">Nenhuma pessoa cadastrada na base!</div>`;
        }

        html += `
                </body>
            </html>
        `;

        res.send(html);
    } catch (error) {
        console.error('Erro ao buscar pessoas:', error.stack);
        res.status(500).send('Erro ao buscar pessoas.');
    }
});


app.get('/create', (req, res) => {

    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Erro de conexão:', error.stack);
            if (!res.headersSent) {
                res.status(500).send('Erro de conexão');
            }
            return;
        }

        const name = req.query.name;
        console.log(`Name: ${name}`)

        const query = `INSERT INTO people(name) VALUES('${name}');`;
        console.log(`Vai inserir na tabela people - query: ${query}`);

        connection.query(query, (error, results, fields) => {
            
            connection.release();

            if (error) {
                console.error('Erro ao executar insert query:', error.stack);
                if (!res.headersSent) {
                    res.status(500).send('Erro ao executar insert query');
                }
                return;
            }
            
            return res.status(201).send('Name salvo com success!');
        });    

    });

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});