import {Competition} from "@/app/competition";

type Parametres = { competitions: Array<Competition> }
export default function Resultats({competitions}: Parametres) {
    return <section className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-12 mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

                {competitions.map(
                    competition =>
                        <div key={competition.lien} className="max-w-2xl pl-8 pr-1 py-2 bg-white rounded-xl shadow-md border dark:bg-gray-800 flex flex-col justify-around">
                            <div className="flex justify-end text-gray-700 dark:text-gray-200">
                                {
                                    competition.tags.map(tag =>
                                        <a key={tag}
                                           className="px-1 text-sm  font-light text-gray-600 transition-colors duration-300 transform cursor-pointer hover:text-blue-500"
                                           tabIndex={0} role="button">#{tag}</a>
                                    )
                                }
                            </div>
                            <div className="mt-2 text-center">
                                <a href={"https://www.ffhandball.fr/competitions/saison-2023-2024-19/" + competition.lien} className="text-xl font-bold text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:underline" tabIndex={0}
                                   role="link">{competition.description}</a>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">
                                    {competition.equipes}
                                </p>
                            </div>


                            <a href={"https://www.ffhandball.fr/competitions/saison-2023-2024-19/" + competition.lien}
                               target="_blank"
                               className="inline-flex items-center -mx-1 text-sm text-blue-500 capitalize transition-colors duration-300 transform dark:text-blue-400 hover:underline hover:text-blue-600 dark:hover:text-blue-500"
                               tabIndex={0} role="link">
                                <span className="mx-1">Voir le détail</span>
                                <svg className="w-4 h-4 mx-1 rtl:-scale-x-100" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                          clipRule="evenodd"></path>
                                </svg>
                            </a>


                        </div>
                )}


            </div>
        </div>
    </section>
}