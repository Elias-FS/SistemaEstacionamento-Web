const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;


//RETORNA TODOS OS TICKET
router.get('/', (req, res, next) => {
 
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM ticket;',
            (error, result, fields) => {
                if(error) {return res.status(500).send({error: error}) }
                const response = {
                    quantidade: result.length,
                    ticket: result.map(tick => {
                        return {
                            id_ticket: tick.id_ticket,
                            cpf: tick.cpf,
                            registro: tick.registro,
                            pago: tick.pago,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os Detalhes de um ticket Específico',
                                url: 'http://localhost:3000/ticket/' + tick.id_ticket
                            }
                        }
                    })
                }
                return res.status(200).send({response})
            }
        )
    });
});


//INSERE UM TICKET
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'INSERT INTO ticket (cpf, registro, pago) VALUES (?,?,?)',
            [req.body.cpf, req.body.registro, req.body.pago],
            (error, result, field) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                const response = {
                    mensagem: 'Ticket emitido com sucesso',
                    ticketCriado: {
                        id_ticket: result.id_ticket,
                        cpf: req.body.cpf,
                        registro: req.body.registro,
                        pago: req.body.pago,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna Todos os tickets',
                            url: 'http://localhost:3000/ticket'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    });

});


//RETORNA OS DADOS DE UM TICKET
router.get('/:id_ticket', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM ticket WHERE id_ticket = ?;',
            [req.params.id_ticket],
            (error, result, fields) => {
                if(error) {return res.status(500).send({error: error}) }
                
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado ticket com este ID'
                    })
                }
                
                const response = {
                    ticket: {
                        id_ticket: result[0].id_ticket,
                        cpf: result[0].cpf,
                        registro: result[0].registro,
                        pago: result[0].pago,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna Todos os Tickets',
                            url: 'http://localhost:3000/ticket'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
});


// ALTERA UM TICKET
router.patch('/:id_ticket', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `UPDATE ticket
                SET cpf          = ?,
                    registro     = ?,
                    pago         = ?
              WHERE id_ticket    = ?`,
            [
                req.body.cpf, 
                req.body.registro, 
                req.body.pago, 
                req.body.id_ticket
            ],
            (error, result, field) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                const response = {
                    mensagem: 'Ticket atualizado com sucesso',
                    ticketAtualizado: {
                        id_ticket: req.body.id_ticket,
                        cpf: req.body.cpf,
                        registro: req.body.registro,
                        pago: req.body.pago,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os Detalhes de um Ticket Específico',
                            url: 'http://localhost:3000/ticket/' + req.body.id_ticket
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});






// EXCLUI UM TICKET
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `DELETE FROM ticket WHERE id_ticket = ?`, [req.body.id_ticket],
            (error, result, field) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                const response = {
                    mensagem: 'Ticket removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um ticket',
                        url: 'http://localhost:3000/ticket',
                        body: {
                            cpf: 'Number',
                            registro: 'DateTime',
                            pago: 'Number'

                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});





//RETORNA ULTIMO TICKET INSERIDO
router.get('/id_ticket/maximo', (req, res, next) => {
 
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `SELECT * FROM ticket WHERE id_ticket=(SELECT MAX(id_ticket) FROM ticket);`,
            (error, result, fields) => {
                if(error) {return res.status(500).send({error: error}) }
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Ticket nao encontrado'
                    })
                }
                const response = {
                    ticket: {
                        id_ticket: result[0].id_ticket,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna Todos os Tickets..',
                            url: 'http://localhost:3000/ticket'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
});

module.exports = router;