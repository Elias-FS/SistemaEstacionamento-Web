const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;


//RETORNA TODAS AS VAGAS
// router.get('/', (req, res, next) => {
 
//     mysql.getConnection((error, conn) => {
//         if(error) {return res.status(500).send({error: error})}
//         conn.query(
//             'SELECT * FROM vaga;',
//             (error, result, fields) => {
//                 if(error) {return res.status(500).send({error: error}) }
//                 const response = {
//                     quantidade: result.length,
//                     vagas: result.map(vag => {
//                         return {
//                             id_vaga: vag.id_vaga,
//                             id_ticket: vag.id_ticket,
//                             lotacao: vag.lotacao,
//                             andar: vag.andar,
//                             request: {
//                                 tipo: 'GET',
//                                 descricao: 'Retorna os Detalhes de uma vaga Específica',
//                                 url: 'http://localhost:3000/vaga/' + vag.id_vaga
//                             }
//                         }
//                     })
//                 }
//                 return res.status(200).send({response})
//             }
//         )
//     });
// });



//RETORNA QUANTIDADE DE VAGAS
router.get('/quant', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT COUNT(id_vaga) AS quantvaga FROM vaga;',
            (error, result, fields) => {
                if(error) {return res.status(500).send({error: error}) }
                const response = {
                    quantvaga : result[0].quantvaga,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna os Detalhes de uma vaga Específica..',
                        url: 'http://localhost:3000/vaga/'
                    }
                }
                return res.status(200).send({response})
            }
        )
    });
});




//INSERE UMA VAGA
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'INSERT INTO vaga (id_ticket, lotacao, andar) VALUES (?,?,?)',
            [req.body.id_ticket, req.body.lotacao, req.body.andar],
            (error, result, field) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                const response = {
                    mensagem: 'Vaga inserida com sucesso',
                    vagaCriado: {
                        id_ticket: req.body.id_ticket,
                        lotacao: req.body.lotacao,
                        andar: req.body.andar,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna Todas as Vagas',
                            url: 'http://localhost:3000/vaga'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    });

});


//RETORNA OS DADOS DE UMA VAGA
router.get('/:id_vaga', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM vaga WHERE id_vaga = ?;',
            [req.params.id_vaga],
            (error, result, fields) => {
                if(error) {return res.status(500).send({error: error}) }
                
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado vaga com esse ID'
                    })
                }
                
                const response = {
                    vaga: {
                        id_vaga: result[0].id_vaga,
                        id_ticket: result[0].id_ticket,
                        lotacao: result[0].lotacao,
                        andar: result[0].andar,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna Todas as Vagas',
                            url: 'http://localhost:3000/vaga'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
});


// ALTERA UMA VAGA
router.patch('/:id_vaga', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `UPDATE vaga
                SET lotacao        = ?
                    andar        = ?
              WHERE id_vaga   = ?`,
            [ 
                req.body.lotacao,
                req.body.andar,
                req.body.id_vaga
            ],
            (error, result, field) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                const response = {
                    mensagem: 'Vaga atualizado com sucesso',
                    produtoAtualizado: {
                        id_vaga: req.body.id_vaga,
                        lotacao: req.body.lotacao,
                        andar: req.body.andar,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os Detalhes de uma Vaga Específica',
                            url: 'http://localhost:3000/produtos/' + req.body.id_vaga
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});






// EXCLUI UMA VAGA
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `DELETE FROM vaga WHERE id_ticket = ?;`,
            [req.body.id_ticket],
            (error, result, field) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                const response = {
                    mensagem: 'Vaga removida com sucesso',
                    text: req.body.id_ticket,
                }

                return res.status(202).send(response);
            }
        )
    });
});



module.exports = router;