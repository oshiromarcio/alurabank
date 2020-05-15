export function domInject(seletor: string) {

    return function(target: any, key: string) {
        let elemento: JQuery;

        let getter = function() {
            if(!elemento) {
                console.log(`buscando ${seletor} para injetar em ${key}`);
                elemento = $(seletor);
            }

            return elemento;
        }

        Object.defineProperty(target, key, {
            get: getter
        });
    }

}