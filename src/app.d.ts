import { Subsquid } from "$lib/data/apis"

declare global {
    namespace App {
        interface PageState {
            collection: Subsquid.Collection | null,
            objekt: Subsquid.Objekt | null,
            previous: string | null
        }
    }
    
    declare const __VERSION__: string;
}