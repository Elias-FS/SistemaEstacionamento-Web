const { get } = require("http");


function verificarCpf(){
    const codigo = document.getElementById("verificarCpf").value;
    let url = `http://localhost:3000/cliente/${codigo}`
    let urlCpf = `http://localhost:3000/cliente/reset/${codigo}`
    if (codigo){
        axios.get(url)
        .then(response => {

            alert("Seu Histórico foi encontrado!")
            if(response.data.cliente.fidelidade == 1){
                document.getElementById("reserva1").src = "images/reservaok.png"
            }
            else if(response.data.cliente.fidelidade == 2){
                document.getElementById("reserva1").src = "images/reservaok.png"
                document.getElementById("reserva2").src = "images/reservaok.png"
            }
            else if(response.data.cliente.fidelidade == 3){
                document.getElementById("reserva1").src = "images/reservaok.png"
                document.getElementById("reserva2").src = "images/reservaok.png"
                document.getElementById("reserva3").src = "images/reservaok.png"
            }
            else if(response.data.cliente.fidelidade == 4){
                document.getElementById("reserva1").src = "images/reservaok.png"
                document.getElementById("reserva2").src = "images/reservaok.png"
                document.getElementById("reserva3").src = "images/reservaok.png"
                document.getElementById("reserva4").src = "images/reservaok.png"
            }
            else if(response.data.cliente.fidelidade == 5){
                document.getElementById("reserva1").src = "images/reservaok.png"
                document.getElementById("reserva2").src = "images/reservaok.png"
                document.getElementById("reserva3").src = "images/reservaok.png"
                document.getElementById("reserva4").src = "images/reservaok.png"
                document.getElementById("reserva5").src = "images/reservaok.png"
                alert("Seu histórico ja chegou a acumular 5 vagas! Sua próxima vaga será totalmente GRÁTIS!")
            }
            else if(response.data.cliente.fidelidade == 6){
                alert("6ª vaga adquiria gratuitamente, obrigado! Continue utilizando nosso serviço de fidelidade para mais vagas como essa.")
                document.getElementById("reserva1").src = "images/reservanok.png"
                document.getElementById("reserva2").src = "images/reservanok.png"
                document.getElementById("reserva3").src = "images/reservanok.png"
                document.getElementById("reserva4").src = "images/reservanok.png"
                document.getElementById("reserva5").src = "images/reservanok.png"
                // Realizar path aqui que reseta a fidelidade para zero novamente
                    const dadosCliente = {
                        cpf: codigo
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