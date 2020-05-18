import { NegociacaoController } from "./controllers/NegociacaoController";

let controller = new NegociacaoController();
// Agora usando jQuery
$('.form').submit(controller.adiciona.bind(controller));
$('#botao-importa').click(controller.importaDados.bind(controller));