const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const mysql = require('mysql');
const pool = require('./dbConnection');
const { json } = require('body-parser');
const verifikasiToken = require('./authMiddleware');
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json());

// const pool = mysql.createPool({
//     connectionLimit: 10,
//     host: 'localhost',
//     user : 'root',
//     password : '',
//     database: 'db_pos_malama'
// });



router.post('/item_type', verifikasiToken, (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const params = req.body
        connection.query('insert into tbtype set ?', params, (err, rows)=>{
            connection.release()

        if(!err){
            res.send({
                message: `Item Type with the name ${params.name} successfully saved...`
            })
        }else{
            console.log('gagal', err)
        }
        })
        
    })
})


//mengambil data dari tbtype
router.get('/item_type',(req, res) =>{
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ${connection.threadId}')
        connection.query('select * from tbtype', (err, rows)=>{
            connection.release()
            if(!err){
                res.send(rows)
            }else{
                console.log(err)
            }
        })
    })
})

//GET data tbtype by id
router.get('/item_type/:id', (req, res) => {
    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * FROM tbtype where id = ?', [req.params.id], (err,rows) =>{
            connection.release()

            if(!err){
                res.send(rows)
            }else{
                console.log(err)
            }
        })
    })
})

router.put('/item_type/:id', verifikasiToken, (req, res) => {
    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const params = req.body
        connection.query('UPDATE tbtype set ? where id = ?', [params, req.params.id], (err,rows) =>{
            connection.release()

            if(!err){
                res.end(JSON.stringify({message : 'Item Type Successfully updated...'}))
            }else{
                res.end(JSON.stringify({message : 'Item Type Unsuccessfully updated...'}))
                console.log(err)
            }
        })
    })
})

//DELETE data tbtype by id
router.delete('/item_type/:id', verifikasiToken, (req, res) => {
    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('DELETE from tbtype where id = ?', [req.params.id], (err,rows) =>{
            connection.release()

            if(!err){
                res.end(JSON.stringify({message : 'Item Type Successfully deleted...'}))
            }else{
                res.end(JSON.stringify({message : 'Item Type Unsuccessfully deleted...'}))
                console.log(err)
            }
        })
    })
})


// app.listen(port, () => {
//     console.log(`listen on port ${port}`)
// });

module.exports = router;