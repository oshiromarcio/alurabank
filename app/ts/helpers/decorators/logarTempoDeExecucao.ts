export function logarTempoDeExecucao(resultadoEmSegundos: boolean = false) {

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let metodoOriginal = descriptor.value;
        descriptor.value = function(...args: any[]) {

            let unidade = 'ms';
            let divisor = 1;

            if(resultadoEmSegundos) {
                unidade = 's';
                divisor = 1000;
            }

            console.log('------------------');
            console.log(`parâmetros passados para o método ${propertyKey}: ${JSON.stringify(args)}`);
            let t1 = performance.now();
            let retorno = metodoOriginal.apply(this, args);
            let t2 = performance.now();
            console.log(`O retorno do método ${propertyKey} é ${JSON.stringify(retorno)}`);
            console.log(`O método ${propertyKey} demorou ${(t2 - t1)/divisor} ${unidade}`);
            return retorno;
        }

        return descriptor;
    }

}