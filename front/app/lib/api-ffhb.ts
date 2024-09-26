import axios from "axios";
import {id_saison} from "@/lib/configuration";
import * as cheerio from "cheerio";

export async function recupereLaCleCFK() {
    const $ = await cheerio.fromURL('https://www.ffhandball.fr/');
    return $('body').attr('data-cfk')!!;
}

export async function recupereLesRecontres(typeCompetition: string, idCompetition: string, extEquipeId: string, cfkKey: string): Promise<ResultatFFHB> {
    const {data} = await axios.request({
        url: 'https://www.ffhandball.fr/wp-json/competitions/v1/computeBlockAttributes',
        method: 'GET',
        params: {
            block: 'competitions---rencontre-list',
            ext_saison_id: id_saison,
            url_competition_type: typeCompetition,
            url_competition: idCompetition,
            ext_equipe_id: extEquipeId
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