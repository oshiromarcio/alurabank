import { logarTempoDeExecucao } from '../helpers/decorators/index';

export abstract class View<T> {
    
    private _elemento: JQuery;
    private _escapar: boolean;

    constructor(seletor: string, escapar: boolean = false) {
        this._elemento = $(seletor);
        this._escapar = escapar;
    }

    @logarTempoDeExecucao(true)
    update(model: T): void {
        let template = this.template(model);
        template = this._escapar ? template.replace(/<script>[\s\S]*?<\/script>/g, '') : template;
        this._elemento.html(template);
    }

    abstract template(model: T): string;

}