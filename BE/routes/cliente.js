const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;





//RETORNA TODOS OS CLIENTES
router.get('/', (req, res, next) => {
 
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM cliente;',
            (error, result, fields) => {
                if(error) {return res.status(500).send({error: error}) }
                const response = {
                    quantidade: result.length,
                    cliente: result.map(clien => {
                        return {
                            cpf: clien.cpf,
                            email: clien.email,
                            senha: clien.senha,
                            fidelidade: clien.fidelidade,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os Detalhes de um cliente Específico',
                                url: 'http://localhost:3000/cliente/' + clien.cpf
                            }
                        }
                    })
                }
                return res.status(200).send({response})
            }
        )
    });
});





//INSERE UM CLIENTE
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        const cliente = req.body
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `INSERT INTO cliente (cpf, email, senha, fidelidade) VALUES (?,?,?,?)`,
           [req.body.cpf, req.body.email, req.body.senha, req.body.fidelidade],
            (error, result, field) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                const response = {
                    mensagem: 'Cliente inserido com sucesso',
                    clienteCriado: {
                        cpf: req.body.cpf,
                        email: req.body.email,
                        senha: req.body.senha,
                        fidelidade: req.body.fidelidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna Todos os clientes',
                            url: 'http://localhost:3000/cliente'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    });

});





//RETORNA OS DADOS DE UM CLIENTES
router.get('/:cpf', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM cliente WHERE cpf = ?;',
            [req.params.cpf],
            (error, result, fields) => {
                if(error) {return res.status(500).send({error: error}) }
                
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado cliente com esse CPF'
                    })
                }
                
                const response = {
                    cliente: {
                        cpf: result[0].cpf,
                        email: result[0].email,
                        senha: result[0].senha,
                        fidelidade: result[0].fidelidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna Todos os cliente',
                            url: 'http://localhost:3000/cliente'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
});





// ALTERA UM CLIENTE SOMANDO FIDELIDADE
router.patch('/:cpf', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `UPDATE cliente
                SET fidelidade   = (fidelidade + 1)
              WHERE cpf          = ?`,
            [
                req.body.cpf
            ],
            (error, result, field) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                const response = {
                    mensagem: 'Cliente atualizado com sucesso',
                    clienteAtualizado: {
                        cpf: req.body.cpf,
                        fidelidade: req.body.fidelidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os Detalhes de um cliente Específico',
                            url: 'http://localhost:3000/cliente/' + req.body.cpf
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});





// ALTERA UM CLIENTE RESETANDO FIDELIDADE
router.patch('/reset/:cpf', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `UPDATE cliente
                SET fidelidade   = 0
              WHERE cpf          = ?`,
            [
                req.body.cpf
            ],
            (error, result, field) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                const response = {
                    mensagem: 'Cliente atualizado com sucesso',
                    clienteAtualizado: {
                        cpf: req.body.cpf,
                        fidelidade: req.body.fidelidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os Detalhes de um cliente Específico',
                            url: 'http://localhost:3000/cliente/' + req.body.cpf
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});









// EXCLUI UM CLIENTE
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `DELETE FROM cliente WHERE cpf = ?`, [req.body.cpf],
            (error, result, field) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                const response = {
                    mensagem: 'Cliente removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um cliente',
                        url: 'http://localhost:3000/cliente',
                        body: {
                            cpf: 'String',
                            email: 'String',
                            senha: 'String',
                            fidelidade: 'Number'
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});

module.exports = router;
