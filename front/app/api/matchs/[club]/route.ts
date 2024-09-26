import {NextRequest} from "next/server";
import {DateTime} from "luxon";
import {recherche, Resultats} from "@/app/lib/recherche";
import {Poule} from "@/app/lib/poule";
import axios from "axios";
import {id_saison} from "@/lib/configuration";
import * as cheerio from "cheerio";

export async function GET(_: NextRequest, {params}: { params: { club: string } }) {
    let resultat = recherche(params.club, new Journees());

    const $ = await cheerio.fromURL('https://www.ffhandball.fr/');
    let dataCFK = $('body').attr('data-cfk');

    const details = await Promise.allSettled(resultat.laJourneeLaPlusProcheDeMaintenantDansLeFuture.equipes.map(equipe => {
        return recupereLesRecontres(equipe, dataCFK!!).then(resultat => resultat.rencontres.map(rencontre => new EquipeRencontre(equipe, rencontre)));
    }))
    details.filter(detail => detail.status === "rejected").forEach(console.error);
    return Response.json(details.filter(detail => detail.status === "fulfilled").flatMap(detail => detail.value))
}

export class EquipeRencontre {
    constructor(public readonly equipe: Equipe, public readonly recontre: RecontreFFHB) {
    }
}

class Equipe {

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

class Journee {

    public equipes: Equipe[] = []

    constructor(
        public debut: DateTime,
        public fin: DateTime
    ) {
    }

    public ajouteEquipe(equipe: Equipe) {
        this.equipes.push(equipe);
    }
}

class Journees implements Resultats {
    public journees: Journee[] = []

    ajoute(nomEquipe: string, poule: Poule) {
        const extEquipeId = poule.equipes?.find(equipe => equipe.libelle.toLowerCase() === nomEquipe)?.id
        if (extEquipeId) {
            let dateDebutJournee = DateTime.fromISO(poule.dateDebutJourneeSelectionee);
            let dateFinJournee = DateTime.fromISO(poule.dateFinJourneeSelectionee);

            let journeeAModifier = this.journees.find(
                journee =>
                    journee.debut.equals(dateDebutJournee)
                    || journee.debut.equals(dateDebutJournee.minus({days: 1}))
                    || journee.debut.equals(dateDebutJournee.plus({days: 1})))


            if (!journeeAModifier) {


                journeeAModifier = new Journee(
                    DateTime.fromISO(poule.dateDebutJourneeSelectionee),
                    DateTime.fromISO(poule.dateFinJourneeSelectionee),
                )
                this.journees.push(journeeAModifier)
            }
            journeeAModifier.ajouteEquipe(new Equipe(
                poule.url,
                nomEquipe,
                extEquipeId,
                `${poule.journeeCourante}`,
                poule.dateDebutJourneeSelectionee
            ))
            if (dateDebutJournee < journeeAModifier.debut) {
                journeeAModifier.debut = dateDebutJournee
            }
            if (dateFinJournee > journeeAModifier.fin) {
                journeeAModifier.fin = dateFinJournee
            }
        }

    }

    public get laJourneeLaPlusProcheDeMaintenantDansLeFuture() {
        let journeeLaPlusProcheDeMaintenant = this.journees[0]
        this.journees.forEach(journee => {
            if (Math.abs(journeeLaPlusProcheDeMaintenant.debut.diffNow().toMillis()) > Math.abs(journee.debut.diffNow().toMillis())) {
                journeeLaPlusProcheDeMaintenant = journee
            }
        })

        return journeeLaPlusProcheDeMaintenant
    }
}

async function recupereLesRecontres(equipe: Equipe, cfkKey: string): Promise<ResultatFFHB> {
    const {data} = await axios.request({
        url: 'https://www.ffhandball.fr/wp-json/competitions/v1/computeBlockAttributes',
        method: 'GET',
        params: {
            block: 'competitions---rencontre-list',
            ext_saison_id: id_saison,
            url_competition_type: equipe.typeCompetition,
            url_competition: equipe.idCompetition,
            ext_equipe_id: equipe.extEquipeId
        },
    })
    const str = Buffer.from(data, 'base64').toString()
    let result = ''
    const keyLen = cfkKey.length
    for (let i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ cfkKey.charCodeAt(i % keyLen))
    }
    return JSON.parse(result)
}

interface ResultatFFHB {

    rencontres: RecontreFFHB[]
}

interface RecontreFFHB {
    id: string
    ext_rencontreId: string
    pouleId: string
    equipe1Id: string
    equipe2Id: string
    equipe1Score: string
    equipe2Score: string
    equipe1ScoreMT: string
    equipe2ScoreMT: string
    date?: string
    fdmCode: string
    equipementId: string
    arbitre1: string
    arbitre1Id: string
    arbitre2: string
    arbitre2Id: string
    dateDernierUpdateEnfants: string
    journeeNumero: string
    equipe1Libelle: string
    equipe2Libelle: string
    equipe1ShowLogo: string
    equipe2ShowLogo: string
    structure1Logo: string
    structure2Logo: string
    phaseLibelle: string
    extPouleId: string
}