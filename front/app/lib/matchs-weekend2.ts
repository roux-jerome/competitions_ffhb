export class EquipeRencontreJournee {
    constructor(public readonly equipe: Equipe, public readonly recontre: Rencontre, public readonly journeeRencontre?: JourneeRencontre) {
    }
}

export class Equipe {

    public readonly typeCompetition: string
    public readonly idCompetition: string

    constructor(public urlPoule: string,
                public nomEquipe: string,
                public readonly extEquipeId: string,
                public readonly numeroJourneeCourante: string,
                public readonly dateJourneeCourante: string,
    ) {
        let urlPouleSplit = urlPoule.split("/");
        this.typeCompetition = urlPouleSplit[0]
        this.idCompetition = urlPouleSplit[1]
    }
}

export interface JourneeRencontre {
    "journee_numero": number,
    "date_debut": string,
}

export interface Rencontre {
    equipe2Libelle: string;
    equipe1Libelle: string;
    phaseLibelle: string;
    journeeNumero: string;
    date?: string;

}