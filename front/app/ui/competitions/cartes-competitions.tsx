import {SousTitreCompetition} from "@/app/ui/competitions/sous-titre-competition";
import {AnciennesPoules} from "@/app/ui/competitions/anciennes-poules";

import {rechercheCompetitions} from "@/app/lib/competitions";

export default async function CartesCompetitions({recherche}: { recherche: string }) {
    const resultatRecherche = rechercheCompetitions(recherche)

    return <section className="">
        <div className="container py-12 mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

                {resultatRecherche.competitions.map(
                    competition =>
                        <div key={competition.dernierePoule.url}
                             className="max-w-2xl pl-8 pr-1 py-2 shadow-orange-100 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,.0)] flex flex-col justify-between">
                            <a
                                href={"https://www.ffhandball.fr/competitions/saison-saison-2024-2025-20/" + competition.dernierePoule.url}
                                tabIndex={0}
                                role="link" target="_blank"
                                className="group not-prose">

                                <div className="mt-2">
                                    <span className="flex text-left items-start text-base text-gray-800">

                                        {competition.libelleCompetition}
                                        <svg viewBox="0 0 24 24"
                                             className="stroke-orange-600 size-5 stroke-[3px] fill-none duration-300 ease-in-out">
                                            <line x1="5" y1="12" x2="19" y2="12"
                                                  className="scale-x-0 translate-x-[10px] group-hover:translate-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"/>
                                            <polyline points="12 5 19 12 12 19" className="-translate-x-2 group-hover:translate-x-0 transition-transform duration-300 ease-in-out"/>
                                        </svg>


                                    </span>

                                    <SousTitreCompetition sousTitreCompetition={competition.sousTitreCompetition}/>
                                    <div className="flex items-center mt-4 text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                             strokeLinecap="round" strokeLinejoin="round" width="24" height="24" className="flex-shrink-0 lucide lucide-castle">
                                            <path d="M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"/>
                                            <path d="M18 11V4H6v7"/>
                                            <path d="M15 22v-4a3 3 0 0 0-3-3a3 3 0 0 0-3 3v4"/>
                                            <path d="M22 11V9"/>
                                            <path d="M2 11V9"/>
                                            <path d="M6 4V2"/>
                                            <path d="M18 4V2"/>
                                            <path d="M10 4V2"/>
                                            <path d="M14 4V2"/>
                                        </svg>
                                        <h3 className="px-2 text-sm"> {competition.equipe.toUpperCase()}</h3>
                                    </div>
                                    <div className="flex items-center mt-4 text-gray-600">
                                        <svg width="26px" height="26px" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                             viewBox="0 0 24 24" className="flex-shrink-0">
                                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2"
                                                  d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3a2.5 2.5 0 1 1 2-4.5M19.5 17h.5c.6 0 1-.4 1-1a3 3 0 0 0-3-3h-1m0-3a2.5 2.5 0 1 0-2-4.5m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3c0 .6-.4 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
                                        </svg>
                                        <h3 className="px-2 text-left text-sm">  {competition.dernierePoule.phase.toLowerCase()} - {competition.dernierePoule.nom.toLowerCase()}</h3>
                                    </div>
                                </div>
                            </a>
                            <div className="flex flex-col">
                                <AnciennesPoules anciennesPoules={competition.anciennesPoules}/>
                            </div>
                            <div className="flex justify-end pt-5 text-xs font-light text-gray-500">
                                {
                                    competition.tags.map(tag =>
                                        <a key={tag}
                                           className="ml-3 inline-flex items-center px-2.5 py-0.5 focus:outline-none focus:ring-2 focus:ring-orange-200  focus:ring-ring focus:ring-offset-2 hover:cursor-default"
                                           tabIndex={0} role="button">{tag}</a>
                                    )
                                }
                            </div>


                        </div>
                )}


            </div>
        </div>
    </section>
}

