import {Match} from "@/app/lib/matchs-weekend";

export function ListeMatchs({matchs}: { matchs: Match[] }) {
    return matchs.map(match =>

        <div key={`${match.rencontre.equipe1Libelle}-${match.rencontre.equipe2Libelle}`} className="pt-6 pb-2 border-b-2 grid grid-cols-2">
            <div>
                <span className="block font-bold">{match.categorie}{match.type}</span>
                <small className="block text-xs text-gray-500">{match.estADomicile ? match.rencontre.equipe1Libelle : match.rencontre.equipe2Libelle}</small>
                <small className="block text-xs text-gray-500">{match.libelle}</small>
            </div>
            <div>
                <span className="block text-center">
                {match.dateRencontre.isValid ? match.dateRencontre.toFormat('EEEE dd LLL  à HH:mm', {locale: "fr"}) : " Non connue"}
                </span>
                <span className="block text-gray-500 text-center">
                    {match.estADomicile ? match.rencontre.equipe2Libelle : match.rencontre.equipe1Libelle}
                </span>
            </div>
        </div>
    );
}