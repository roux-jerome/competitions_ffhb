import {url_competitions} from "@/lib/configuration";
import {Match} from "@/app/lib/matchs-weekend";
import {Tags} from "@/app/ui/tags";

export function ListeMatchs({matchs}: { matchs: Match[] }) {
    return matchs.map(match => <div key={`${match.url}-${match.rencontre.equipe1Libelle}-${match.rencontre.equipe2Libelle}`}>
            <a className="w-full flex items-center justify-between pt-5 hover:bg-orange-100 duration-300 hover:rounded transition-colors mb-1 border-b-2 bt-6 "
               href={url_competitions + match.url + (match.numeroJournee > 0 ? `/journee-${match.numeroJournee}` : "")} target="_blank"
            >
                <div className="relative w-full">
                    <div className="flex flex-col text-center relative">
                        <div
                            className="absolute top-0 left-0 px-1 font-bold border-r-4 border-b-4 rounded-full border-orange-500 h-16 w-16 text-xl flex items-center justify-center">
                            {match.categorie}{match.type}
                        </div>
                        <h2 className="font-semibold text-gray-500">
                            {match.dateRencontre.isValid ? match.dateRencontre.toFormat('EEEE dd LLL', {locale: "fr"}) : " Non connue"}
                        </h2>
                        <h2 className="font-bold flex flex-col text-center text-3xl">
                            {match.dateRencontre.isValid ? match.dateRencontre.toFormat('HH:mm', {locale: "fr"}) : "-"}
                        </h2>
                        <div className="absolute top-1/2 right-0">
                            <svg className="w-3 h-3 rtl:rotate-180 stroke-orange-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                            </svg>
                        </div>
                    </div>
                    <div className="flex flex-col pt-2">
                        <div className="grid grid-cols-5 w-full gap-2">
                            <div className="col-span-2 text-xs break-words text-center place-self-center">
                                {match.rencontre.equipe1Libelle}
                            </div>
                            <div className="text-gray-500 text-center">
                                {match.rencontre.equipe1Score ? <>
                                        <p className="text-xs">
                                            Score
                                        </p>
                                        <p className="text-xl">
                                            {`${match.rencontre.equipe1Score} - ${match.rencontre.equipe2Score}`}
                                        </p>
                                    </>

                                    : "VS"
                                }
                            </div>

                            <div className="col-span-2 text-xs break-words text-center place-self-center">
                                {match.rencontre.equipe2Libelle}
                            </div>
                        </div>
                    </div>
                    <Tags tags={match.tags}/>
                </div>
            </a>
        </div>
    );
}