import { Igualavel } from "./Igualavel";
import { Imprimivel } from "./imprimivel";

export interface MeuObjeto<T> extends Igualavel<T>, Imprimivel {

}