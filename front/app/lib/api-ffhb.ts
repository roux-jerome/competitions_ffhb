import {id_saison} from "@/lib/configuration";
import * as cheerio from "cheerio";

export async function recupereLaCleCFK() {
    let response = await fetch('https://www.ffhandball.fr/', {
        method: 'GET',
        next: {revalidate: 28800}
    });
    let contenu = await response.text();
    const $ = cheerio.load(contenu);
    return $('body').attr('data-cfk')!!;
}

export async function recupereLesRecontres(typeCompetition: string, idCompetition: string, extEquipeId: string, cfkKey: string): Promise<ResultatFFHB> {
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append("block", 'competitions---rencontre-list')
    urlSearchParams.append("ext_saison_id", id_saison)
    urlSearchParams.append("url_competition_type", typeCompetition)
    urlSearchParams.append("url_competition", idCompetition)
    urlSearchParams.append("ext_equipe_id", extEquipeId)
    const response = await fetch(`https://www.ffhandball.fr/wp-json/competitions/v1/computeBlockAttributes?${urlSearchParams.toString()}`, {
        method: 'GET',
        next: {revalidate: 28800}
    })
    let data = await response.text();
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
    poule: { journees: string }
}

export interface JourneeFFHB {
    "journee_numero": number,
    "date_debut": string,
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