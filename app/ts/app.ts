let controller = new NegociacaoController();
// Agora usando jQuery
$('.form').submit(controller.adiciona.bind(controller));