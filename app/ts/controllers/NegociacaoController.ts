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
    async importaDados() {

        function isOk(res: Response): Response {
            if(res.ok) {
                return res;
            }
            else {
                throw new Error(res.statusText);
            }
        }

        try {
            let negociacoesParaImportar = await this._service.obterNegociacoes(isOk);

            let negociacoesJaImportadas = this._negociacoes.paraArray();

            negociacoesParaImportar
                .filter(negociacao => !negociacoesJaImportadas
                    .some(jaImportada => negociacao.isEqual(jaImportada)))
                .forEach((negociacao: Negociacao) => this._negociacoes.adiciona(negociacao));
    
            this._negociacoesView.update(this._negociacoes);
        }
        catch(err) {
            this._mensagemView.update(err.message);
        }
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
