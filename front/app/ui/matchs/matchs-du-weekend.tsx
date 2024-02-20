import {rechercheMatchsDuWeekend} from "@/app/lib/matchs-weekend";
import {ListeMatchs} from "@/app/ui/matchs/liste-matchs";

export async function MatchsDuWeekEnd({club}: { club: string }) {
    const resultatRecherche = rechercheMatchsDuWeekend(club)
    return <>
        <small className="text-gray-500">
            {resultatRecherche.date}
        </small>
        <div className="container grid md:grid-cols-2 md:gap-20">
            <div className="container flex flex-col justify-start">
                <div className="flex items-center mt-6">
                    <svg className="w-6 h-6 text-gray-800" xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24">
                        <path
                            d="M23.121,9.069,15.536,1.483a5.008,5.008,0,0,0-7.072,0L.879,9.069A2.978,2.978,0,0,0,0,11.19v9.817a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V11.19A2.978,2.978,0,0,0,23.121,9.069ZM15,22.007H9V18.073a3,3,0,0,1,6,0Zm7-1a1,1,0,0,1-1,1H17V18.073a5,5,0,0,0-10,0v3.934H3a1,1,0,0,1-1-1V11.19a1.008,1.008,0,0,1,.293-.707L9.878,2.9a3.008,3.008,0,0,1,4.244,0l7.585,7.586A1.008,1.008,0,0,1,22,11.19Z"/>
                    </svg>
                    <h2 className="font-semibold px-2 pt-2">

                        A domicile
                    </h2>
                </div>
                <div className="">
                    <span className="inline-block w-32 h-1 bg-blue-500 rounded-full"></span>
                    <span className="inline-block w-3 h-1 ml-1 bg-blue-500 rounded-full"></span>
                    <span className="inline-block w-1 h-1 ml-1 bg-blue-500 rounded-full"></span>
                </div>
                <ListeMatchs matchs={resultatRecherche.matchs.domicile}/>
            </div>
            <div className="container flex flex-col justify-start">
                <div className="flex items-center mt-6">
                    <svg className="w-6 h-6 text-gray-800" xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24">
                        <path
                            d="M10.689,24a2.688,2.688,0,0,1-2.546-3.547L10.083,15H6.158l-1.08,1.646A2.993,2.993,0,0,1,2.569,18h0a2.556,2.556,0,0,1-2.4-3.434L1.1,12,.159,9.44A2.555,2.555,0,0,1,.46,7.1a2.811,2.811,0,0,1,4.6.247L6.155,9h3.928L8.147,3.563a2.7,2.7,0,0,1,.359-2.442,2.883,2.883,0,0,1,4.817.442L17.58,9h3.313a3.084,3.084,0,0,1,3.067,2.5A3,3,0,0,1,21,15H17.58l-4.267,7.454A2.989,2.989,0,0,1,10.689,24ZM5.618,13H11.5a1.006,1.006,0,0,1,.942,1.335l-2.41,6.773a.676.676,0,0,0,.1.605.9.9,0,0,0,1.437-.234L16.132,13.5A1,1,0,0,1,17,13h4a1,1,0,0,0,.985-1.175A1.083,1.083,0,0,0,20.893,11H17a1,1,0,0,1-.868-.5L11.577,2.539a.894.894,0,0,0-1.447-.252.684.684,0,0,0-.093.621l2.4,6.757A1.006,1.006,0,0,1,11.5,11H5.618a1,1,0,0,1-.834-.448l-1.393-2.1c-.228-.421-1.034-.637-1.29-.21a.541.541,0,0,0-.065.51l1.072,2.906a1,1,0,0,1,0,.69l-1.066,2.91A.556.556,0,0,0,2.564,16h0a1,1,0,0,0,.837-.452l1.376-2.1A1,1,0,0,1,5.618,13Z"/>
                    </svg>
                    <h2 className="font-semibold px-2 pt-2">

                        A l&lsquo;extérieur
                    </h2>
                </div>
                <div className="">
                    <span className="inline-block w-32 h-1 bg-blue-500 rounded-full"></span>
                    <span className="inline-block w-3 h-1 ml-1 bg-blue-500 rounded-full"></span>
                    <span className="inline-block w-1 h-1 ml-1 bg-blue-500 rounded-full"></span>
                </div>
                <ListeMatchs matchs={resultatRecherche.matchs.exterieur}/>
            </div>
        </div>
    </>;
}