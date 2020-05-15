import { Negociacao, Negociacoes } from "../models/index";
import { NegociacoesView, MensagemView } from "../views/index";
import { domInject } from "../helpers/decorators/domInject";

export class NegociacaoController {

    @domInject('#data')
    private _inputData: JQuery;
    @domInject('#quantidade')
    private _inputQuantidade: JQuery;
    @domInject('#valor')
    private _inputValor: JQuery;
    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView', true);
    private _mensagemView = new MensagemView('#mensagemView', true);

    constructor() {
        this._negociacoesView.update(this._negociacoes);
    }

    adiciona(evento: Event): void {
        evento.preventDefault();

        let data = new Date(this._inputData.val().replace(/-/g, '/'));
        if(!this._EDiaUtil(data)) {
            this._mensagemView.update('Data inválida, não é dia útil.');
            return;
        }

        let negociacao = new Negociacao(
            data,
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val()));

        this._negociacoes.adiciona(negociacao);
        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso');

        console.log(this._negociacoes.paraArray());
    }

    private _EDiaUtil(data: Date): boolean {
        return data.getDay()  != DiaDaSemana.Sabado && data.getDay() != DiaDaSemana.Domingo ? true : false;
    }

}

enum DiaDaSemana {
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado
}
