import {SousTitreCompetition} from "@/app/ui/competitions/sous-titre-competition";
import {AnciennesPoules} from "@/app/ui/competitions/anciennes-poules";

import {rechercheCompetitions, ResultatsCompetitions} from "@/app/lib/competitions";

export default async function CartesCompetitions({recherche}: { recherche: string }, resultatsCompetitions: ResultatsCompetitions = rechercheCompetitions(recherche)) {
    const resultatRecherche = resultatsCompetitions

    return <section className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-12 mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

                {resultatRecherche.competitions.map(
                    competition =>
                        <div key={competition.dernierePoule.url}
                             className="max-w-2xl pl-8 pr-1 py-2 bg-white rounded-xl shadow-md border dark:bg-gray-800 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-end text-gray-700 dark:text-gray-200">
                                    {
                                        competition.tags.map(tag =>
                                            <a key={tag}
                                               className="px-1 text-sm  font-light text-gray-600 transition-colors duration-300 transform cursor-pointer hover:text-blue-500"
                                               tabIndex={0} role="button">#{tag}</a>
                                        )
                                    }
                                </div>
                                <div className="mt-2">
                                    <a href={"https://www.ffhandball.fr/competitions/saison-2023-2024-19/" + competition.dernierePoule.url}
                                       className="flex items-center text-l font-bold text-blue-500 dark:text-white dark:hover:text-gray-200 hover:underline"
                                       tabIndex={0}
                                       role="link" target="_blank">

                                        {competition.libelleCompetition} {">"}

                                    </a>

                                    <SousTitreCompetition sousTitreCompetition={competition.sousTitreCompetition}/>
                                    <div className="flex items-center mt-4 text-gray-700 dark:text-gray-200">
                                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                             viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a9 9 0 0 0 5-1.5 4 4 0 0 0-4-3.5h-2a4 4 0 0 0-4 3.5 9 9 0 0 0 5 1.5Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                        </svg>
                                        <h3 className="px-2 text-sm"> {competition.equipe.toUpperCase()}</h3>
                                    </div>
                                    <div className="flex items-center mt-4 text-gray-700 dark:text-gray-200">
                                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                             viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2"
                                                  d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3a2.5 2.5 0 1 1 2-4.5M19.5 17h.5c.6 0 1-.4 1-1a3 3 0 0 0-3-3h-1m0-3a2.5 2.5 0 1 0-2-4.5m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3c0 .6-.4 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
                                        </svg>
                                        <h3 className="px-2 text-sm">  {competition.dernierePoule.phase.toLowerCase()} - {competition.dernierePoule.nom.toLowerCase()}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <AnciennesPoules anciennesPoules={competition.anciennesPoules}/>
                            </div>


                        </div>
                )}


            </div>
        </div>
    </section>
}

