import {Equipe, Poule} from "@/app/lib/poule";
import {recherche, Resultats} from "@/app/lib/recherche";

export const simplifieLeNomDUnClub = (nom: string) => nom.toUpperCase().replace(/ [0-9]+$/, '').trim()
export const simplifieLeNomDUneEquipe = (equipe: Equipe) => simplifieLeNomDUnClub(equipe.libelle)

export class ResultatsClubs implements Resultats {
    private _clubs = new Map<string, Equipe>();
    public ajoute = (nomEquipe: string, poule: Poule) => {
        let equipeFormatee = nomEquipe.replaceAll("_", " ").trim()

        let nomDuClub = simplifieLeNomDUnClub(equipeFormatee)

        if (!this._clubs.has(nomDuClub)) {
            let equipe = poule.equipes
                ?.map(equipe => ({
                        libelle: simplifieLeNomDUneEquipe(equipe),
                        logo: equipe.logo
                    } as Equipe)
                )
                .find(equipe => {
                    return equipe.libelle === nomDuClub
                })
            if (equipe) {
                this._clubs.set(nomDuClub, equipe)
            }
        }
    }

    public get clubs() {
        return Array.from(this._clubs.values())
    }
}

export function rechercheClubs(requete: string) {
    return recherche(requete, new ResultatsClubs())
}