const { get } = require("http");

// function redirecionarpagina (){
//     let url = href="index.html"
//     alert("Cliente cadastrado com sucesso!")
//     document.getElementById("btn").onclick = function () {
//         location.href = "http://127.0.0.1:5501/FE/index.html";
//     };
// }

//pagamento
function buscarCodigo(){

    var dt = new Date()
    var hora = dt.getHours()
    var minuto = dt.getMinutes();

    const codigo = document.getElementById("codigoTicket").value;
    let url = `http://localhost:3000/ticket/${codigo}`
    if (codigo){
        axios.get(url)
        .then(response => {
            //alert(response.data.ticket.registro)
            document.getElementById("registro").innerHTML = new Date(response.data.ticket.registro).getHours(registro)
            document.getElementById("registroMin").innerHTML = new Date(response.data.ticket.registro).getMinutes(registro)
            document.getElementById("registroAc").innerHTML = hora - new Date(response.data.ticket.registro).getHours(registro)
            // document.getElementById("registroAcM").innerHTML = minuto - new Date(response.data.ticket.registro).getMinutes(registro)
            document.getElementById("pagoReal").innerHTML = (hora - new Date(response.data.ticket.registro).getHours(registro)) * 10
        })
        .catch(error  =>  {
            if (error.response) {
                const msg = new Comunicado (error.response.data.codigo, 
                                            error.response.data.mensagem, 
                                            error.response.data.descricao);
            alert(msg.get());
        }
        })

        event.preventDefault()
    }
    else{
        alert("Codigo inexistente!")
    }

}

//entrada
function emitirTicket(){

    const quantVagas1 = 50;
    const quantVagas2 = 100;
    const quantVagas3 = 150;
    var lotacao = 0;
    var dt = new Date();
    var dia = '' +  dt.getDate();
    var mes = '' +  (dt.getMonth()+1);
    var ano = '' +  dt.getFullYear();
    var hora = '' +  dt.getHours();
    var minuto = '' +  dt.getMinutes();
    var segundo = '' +  dt.getSeconds();
    const dataTotal = ano + "/" + mes + "/" + dia + ' ' + hora + ":" + minuto + ":" + segundo;

        let url = `http://localhost:3000/ticket`;
        const dadosTicket = {
            registro: dataTotal,
            pago: 0
        }
        axios.post(url, dadosTicket)
        .then(response => {
////////////////////////////////Pega ultimo ticket inserido////////////////////////////////////////////////////////////////////////
                let urlMaxvalue = `http://localhost:3000/ticket/id_ticket/maximo`;
                console.log(response)
                axios.get(urlMaxvalue)
                .then(response => {

                    var ultimoTicket = (response.data.ticket.id_ticket)
                    document.getElementById("mostraCodigo").innerHTML = ultimoTicket
/////////////////////////////////Cria vaga//////////////////////////////////////////////////////////////////////////
                        
                        let urlVaga = `http://localhost:3000/vaga`;
                        const dadosVaga = {
                            id_ticket: ultimoTicket,
                            lotacao: 1,
                            andar: 1
                        }
                        console.log(response)
                        axios.post(urlVaga, dadosVaga)
                        .then(response => {
                            console.log(response)
////////////////////////////////////////PEGA QUANTIDADE DEVAGAS/////////////////////////////////////////////////////
//guardar quantidade de vaga retornada pelo length.vaga

                                // const quantidadeTotal = 100;
                                // console.log(response)
                                // axios.get(urlVaga)
                                // .then(response => {
                                //     document.getElementById("andar1Ocupado1").innerHTML = ultimoTicket;
                                //     document.getElementById("andar1Livre1").innerHTML = quantidadeTotal - ultimoTicket;
                                // })
                                // .catch(error  =>  {
                                //     if (error.response) {
                                //         const msg = new Comunicado (error.response.data.codigo, 
                                //                                     error.response.data.mensagem, 
                                //                                     error.response.data.descricao);
                                //     alert(msg.get());
                                // }
                                // })
                        })
                        .catch(error  =>  {
                            if (error.response) {
                                const msg = new Comunicado (error.response.data.codigo, 
                                                            error.response.data.mensagem, 
                                                            error.response.data.descricao);
                            alert(msg.get());
                        }
                        })

                })
                .catch(error  =>  {
                    if (error.response) {
                        const msg = new Comunicado (error.response.data.codigo, 
                                                    error.response.data.mensagem, 
                                                    error.response.data.descricao);
                    alert(msg.get());
                }
                })
            alert("Retire seu ticket Cod:")
        })
        .catch(error  =>  {
            if (error.response) {
                const msg = new Comunicado (error.response.data.codigo, 
                                            error.response.data.mensagem, 
                                            error.response.data.descricao);
            alert(msg.get());
            }
        })
    }




    

//atualizando lotacao
function atualizarLotacao(){

    let urlVaga = `http://localhost:3000/vaga/quant`;
    const quantidadeTotal = 50;
    axios.get(urlVaga)
    .then(response => {
        console.log(response)
        const vagaOcupada = (response.data.response.quantvaga)
        document.getElementById("andar1Ocupado1").innerHTML = vagaOcupada
        document.getElementById("andar1Livre1").innerHTML = quantidadeTotal - vagaOcupada;
    })
    .catch(error  =>  {
        if (error.response) {
            const msg = new Comunicado (error.response.data.codigo, 
                                        error.response.data.mensagem, 
                                        error.response.data.descricao);
        alert(msg.get());
        }
    })
}








//pagamento
function pagarTicket(){

    var dt = new Date()
    var dia = '' +  dt.getDate();
    var mes = '' +  (dt.getMonth()+1);
    var ano = '' +  dt.getFullYear();
    var hora = '' +  dt.getHours()
    var minuto = '' +  dt.getMinutes();
    var segundo = '' +  dt.getSeconds();
    const dataTotal = ano + "/" + mes + "/" + dia + ' ' + hora + ":" + minuto + ":" + segundo;
    
    const codigoCpf = document.getElementById("cpf").value;
    const codigo = document.getElementById("codigoTicket").value;
    let url = `http://localhost:3000/ticket/${codigo}`
    let urlCpf = `http://localhost:3000/cliente/${codigoCpf}`
    const dadosTicket = {
        id_ticket: codigo,
        cpf: null,
        registro: dataTotal,
        pago: 1
    }
    

    if (codigo){
        axios.patch(url, dadosTicket)
        .then(response => { 

            if(codigoCpf){
                const dadosCliente = {
                    cpf: codigoCpf
                }
                console.log(response)
                axios.patch(urlCpf, dadosCliente)
                .then(response => {
                    alert("Histórico de vagas da conta atualizada!")
                })
                .catch(error  =>  {
                    if (error.response) {
                        const msg = new Comunicado (error.response.data.codigo, 
                                                    error.response.data.mensagem, 
                                                    error.response.data.descricao);
                    alert(msg.get());
                }
                })
            }
        
            alert("Ticket pago, dirija-se até a saída")
        })
        .catch(error  =>  {
            if (error.response) {
                const msg = new Comunicado (error.response.data.codigo, 
                                            error.response.data.mensagem, 
                                            error.response.data.descricao);
            alert(msg.get());
        }
        })

        event.preventDefault()
    }
    else{
        alert("Codigo inexistente!")
    }
}






    

//saida
function liberarTicket(){

    const codigo = document.getElementById("codigoTicketLibera").value;
    let url = `http://localhost:3000/ticket/${codigo}`
    if (codigo){
        axios.get(url)
        .then(response => {
            var pago = response.data.ticket.pago
            if(pago==0){
                alert('Seu ticket não foi pago! Vá até o Guichê ou Totem de Pagamento para realização do mesmo.')
            }
            else{
                    console.log(codigo)
                    let urlVaga = `http://localhost:3000/vaga`
                    // const dadosVaga = {
                    //     id_ticket : codigo
                    // }
                    console.log(response)
                    axios.delete(urlVaga, { data: { id_ticket: codigo } })
                    .then(response => {
                        
                        console.log(response)
                        alert("Cancela Liberada! IPS4M Agradece Sua Preferência!")
                        
                        
                    })
                    .catch(error  =>  {
                        if (error.response) {
                            const msg = new Comunicado (error.response.data.codigo, 
                                                        error.response.data.mensagem, 
                                                        error.response.data.descricao);
                        alert(msg.get());
                    }
                    })
                
            }
            
        })
        .catch(error  =>  {
            if (error.response) {
                const msg = new Comunicado (error.response.data.codigo, 
                                            error.response.data.mensagem, 
                                            error.response.data.descricao);
            alert(msg.get());
        }
        })
        event.preventDefault()
    }
    else{
        alert("Codigo inexistente!")
    }








    // const codigo = document.getElementById("codigoTicketLibera").value;
    // let url = `http://localhost:3000/vaga/${codigo}`
    // if (codigo){
    //     axios.delete(url)
    //     .then(response => {

    //         alert("Cancela Liberada! IPS4M Agradece Sua Preferência!")
            
    //     })
    //     .catch(error  =>  {
    //         if (error.response) {
    //             const msg = new Comunicado (error.response.data.codigo, 
    //                                         error.response.data.mensagem, 
    //                                         error.response.data.descricao);
    //         alert(msg.get());
    //     }
    //     })
    //     event.preventDefault()
    // }
    // else{
    //     alert("Codigo inexistente!")
    // }







}



//premium
function cadastrarUsuario(){

    const email = document.getElementById("email").value;
    const emailConf = document.getElementById("emailConf").value;
    const senha = document.getElementById("senha").value;
    const senhaConf = document.getElementById("senhaConf").value;
    const cpf = document.getElementById("cpfCliente").value;

    if (!email || !senha || !cpf || !emailConf || !senhaConf){
        alert('Digite em todos os campos')
    } else if (email !== emailConf){
        alert('Email de confirmação nao confere com o digitado')
    } else if (senha !== senhaConf){
        alert('Senha de confirmação nao confere com o digitado')
    } else {
        let url = `http://localhost:3000/cliente`;
        const dadosCliente = {
            cpf: cpf,
            email: email,
            senha: senha
        }
        
        axios.post(url, dadosCliente)
        .then(response => {
            alert("Usuario cadastrado com sucesso")
        })
        .catch(error  =>  {
            if (error.response) {
                const msg = new Comunicado (error.response.data.codigo, 
                                            error.response.data.mensagem, 
                                            error.response.data.descricao);
            alert(msg.get());
        }
        })
    
        event.preventDefault()
    }
}
