import {Match} from "@/app/lib/matchs-weekend";

export function ListeMatchs({matchs}: { matchs: Match[] }) {
    return matchs.map(match =>

        <a key={`${match.rencontre.equipe1Libelle}-${match.rencontre.equipe2Libelle}`}
           className="flex items-center justify-between px-1 hover:bg-blue-100 duration-300 hover:rounded transition-colors pb-4 mb-1 border-b-2 bt-6 "
           href={"https://www.ffhandball.fr/competitions/saison-2023-2024-19/" + match.url} target="_blank"
        >
            <div className="grid grid-cols-2 w-full">
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
            <svg className="w-3 h-3 rtl:rotate-180 mt-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
        </a>
    );
}