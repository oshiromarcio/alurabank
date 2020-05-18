import { Negociacao, Negociacoes } from "../models/index";
import { NegociacoesView, MensagemView } from "../views/index";
import { domInject, throttle } from "../helpers/decorators/index";
import { NegociacaoService } from "../services/index";

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
    private _service = new NegociacaoService();

    constructor() {
        this._negociacoesView.update(this._negociacoes);
    }

    @throttle()
    adiciona(): void {

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

    @throttle(500)
    importaDados() {

        function isOk(res: Response): Response {
            if(res.ok) {
                return res;
            }
            else {
                throw new Error(res.statusText);
            }
        }

        this._service
            .obterNegociacoes(isOk)
            .then((negociacoes: Negociacao[]) => {
                negociacoes.forEach((negociacao: Negociacao) => this._negociacoes.adiciona(negociacao));

                this._negociacoesView.update(this._negociacoes);
            });
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
