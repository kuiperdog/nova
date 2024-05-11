import { Collection, Objekt } from "../../model";

export function formatObjekt(collection: Collection, objekt: Objekt | null = null): string {
    return collection.member + ' ' + collection.season.charAt(0) + collection.number.substring(0, 3) + (objekt ? ` #${objekt.serial}` : '');
}
