import {Competitions} from "@/app/lib/competitions";
import {Poule} from '@/app/lib/poule';

type Parametres = { competitions: Competitions }
export default function CartesCompetitions({competitions}: Parametres) {
    return <section className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-12 mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

                {competitions.liste.map(
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
                                        <h1 className="px-2 text-sm"> {competition.equipe.toUpperCase()}</h1>
                                    </div>
                                    <div className="flex items-center mt-4 text-gray-700 dark:text-gray-200">
                                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                             viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2"
                                                  d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3a2.5 2.5 0 1 1 2-4.5M19.5 17h.5c.6 0 1-.4 1-1a3 3 0 0 0-3-3h-1m0-3a2.5 2.5 0 1 0-2-4.5m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3c0 .6-.4 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
                                        </svg>
                                        <h1 className="px-2 text-sm">  {competition.dernierePoule.phase.toLowerCase()} - {competition.dernierePoule.nom.toLowerCase()}</h1>
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

function SousTitreCompetition({sousTitreCompetition}: { sousTitreCompetition: string }) {
    if (sousTitreCompetition && sousTitreCompetition !== "") {
        return <div className="flex items-center mt-4 text-gray-700 dark:text-gray-200">
            <svg aria-label="location pin icon" className="w-6 h-6 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M16.2721 10.2721C16.2721 12.4813 14.4813 14.2721 12.2721 14.2721C10.063 14.2721 8.27214 12.4813 8.27214 10.2721C8.27214 8.063 10.063 6.27214 12.2721 6.27214C14.4813 6.27214 16.2721 8.063 16.2721 10.2721ZM14.2721 10.2721C14.2721 11.3767 13.3767 12.2721 12.2721 12.2721C11.1676 12.2721 10.2721 11.3767 10.2721 10.2721C10.2721 9.16757 11.1676 8.27214 12.2721 8.27214C13.3767 8.27214 14.2721 9.16757 14.2721 10.2721Z"/>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M5.79417 16.5183C2.19424 13.0909 2.05438 7.3941 5.48178 3.79418C8.90918 0.194258 14.6059 0.0543983 18.2059 3.48179C21.8058 6.90919 21.9457 12.606 18.5183 16.2059L12.3124 22.7241L5.79417 16.5183ZM17.0698 14.8268L12.243 19.8965L7.17324 15.0698C4.3733 12.404 4.26452 7.9732 6.93028 5.17326C9.59603 2.37332 14.0268 2.26454 16.8268 4.93029C19.6267 7.59604 19.7355 12.0269 17.0698 14.8268Z"/>
            </svg>
            <h1 className="px-2 text-sm">{sousTitreCompetition}</h1>
        </div>;
    }
    return null;
}

function AnciennesPoules({anciennesPoules}: { anciennesPoules: Poule[] }) {
    if (anciennesPoules.length != 0) {
        return <>
            <hr className="my-6 border-gray-200 dark:border-gray-700 mr-6"/>
            <small className="font-bold">anciennes poules</small>
            {anciennesPoules.map(
                poule =>

                    <a key={poule.url} className="text-sm text-gray-500 dark:text-gray-300 md:text-sm"
                       href={"https://www.ffhandball.fr/competitions/saison-2023-2024-19/" + poule.url} target="_blank" role="link">
                        {poule.phase.toLowerCase()} - {poule.nom.toLowerCase()}
                    </a>
            )}
        </>
    }
    return null
}