"use client"
import {ListeMatchs} from "@/app/ui/matchs/liste-matchs";
import {useEffect, useState} from "react";
import {DateTime} from "luxon";
import {Match} from "@/app/lib/matchs-weekend";
import {FORMAT_COURT, LOCAL_FR} from "@/lib/configuration";
import {ChevronsLeft, ChevronsRight} from "lucide-react";
import {EquipeRencontre} from "@/app/lib/matchs-weekend2";


export function MatchsDuWeekEnd2({club}: { club: string }) {
    const [equipeRencontre, setEquipeRencontre] = useState<EquipeRencontre[]>([])
    const [decalage, setDecalage] = useState(0)
    const [matchs, setMatchs] = useState<Match[]>([])
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/matchs/${club}`)
            .then((res) => res.json())
            .then((data) => {
                setEquipeRencontre(data)
                metAJourMatch(data, decalage)
                setLoading(false)
            })
    }, [club, decalage])

    function metAJourMatch(equipeRencontres: EquipeRencontre[], decalage: number) {
        let weekend = DateTime.now().plus({week: decalage});
        const matchsTemporaire = equipeRencontres
            .filter(equipeRecontre => {
                const date = DateTime.fromSQL(equipeRecontre.recontre.date || "")
                if (date.isValid) {
                    return laDateEstDansLaMemeSemaineQuUneAutreDate(date, weekend)
                } else {
                    return Number(equipeRecontre.equipe.numeroJourneeCourante) + decalage === Number(equipeRecontre.recontre.journeeNumero)
                }
            })
            .map(equipeRecontre => new Match(
                equipeRecontre.recontre.phaseLibelle,
                equipeRecontre.equipe.urlPoule,
                equipeRecontre.equipe.nomEquipe,
                {date: equipeRecontre.recontre.date || "", equipe1Libelle: equipeRecontre.recontre.equipe1Libelle, equipe2Libelle: equipeRecontre.recontre.equipe2Libelle},
                Number(equipeRecontre.equipe.numeroJourneeCourante) + decalage,
            ))
            .sort((a, b) => a.dateRencontre.toMillis() - b.dateRencontre.toMillis())
        setMatchs(matchsTemporaire)
    }


    function calculeDate() {
        let dateMinimum: DateTime | undefined
        let dateMaximum: DateTime | undefined
        matchs.forEach(match => {
            if (!dateMinimum || dateMinimum > match.dateRencontre) {
                dateMinimum = match.dateRencontre
            }
            if (!dateMaximum || dateMaximum < match.dateRencontre) {
                dateMaximum = match.dateRencontre
            }
        })
        return dateMinimum && dateMaximum && <><p>du {dateMinimum.toFormat(FORMAT_COURT, LOCAL_FR)}</p><p> au {dateMaximum.toFormat(FORMAT_COURT, LOCAL_FR)}</p></>
    }


    function decalleLeWeekEnd(decalageAMetreAJour: number) {
        setDecalage(decalageAMetreAJour)
        metAJourMatch(equipeRencontre, decalageAMetreAJour)
    }

    return <>
        <h1 className="font-bold pt-10 text-2xl">Matchs</h1>
        <div className="flex">
            <div className="content-center mr-3 text-2xl">
                <button onClick={() => decalleLeWeekEnd(decalage - 1)} className="text-orange-500">
                    <ChevronsLeft className="h-12 w-12"/>
                </button>
            </div>
            <div className="text-center text-xl md:text-2xl">

                <h1 className="font-bold text-gray-500">
                    {isLoading && <div>Chargement...</div>}
                    {calculeDate()}
                </h1>
            </div>
            <div className="content-center text-2xl">
                <button onClick={() => decalleLeWeekEnd(decalage + 1)} className="text-orange-500">
                    <ChevronsRight className="h-12 w-12"/>
                </button>
            </div>
        </div>
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
                    <span className="inline-block w-32 h-1 bg-orange-500 rounded-full"></span>
                    <span className="inline-block w-3 h-1 ml-1 bg-orange-500 rounded-full"></span>
                    <span className="inline-block w-1 h-1 ml-1 bg-orange-500 rounded-full"></span>
                </div>
                {isLoading && <div>Chargement...</div>}
                <ListeMatchs matchs={matchs.filter(match => match.estADomicile)}/>
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
                    <span className="inline-block w-32 h-1 bg-orange-500 rounded-full"></span>
                    <span className="inline-block w-3 h-1 ml-1 bg-orange-500 rounded-full"></span>
                    <span className="inline-block w-1 h-1 ml-1 bg-orange-500 rounded-full"></span>
                </div>
                {isLoading && <div>Chargement...</div>}
                <ListeMatchs matchs={matchs.filter(match => !match.estADomicile)}/>
            </div>
        </div>
    </>;
}


function laDateEstDansLaMemeSemaineQuUneAutreDate(date: DateTime, autreDate: DateTime): boolean {
    return date.weekNumber === autreDate.weekNumber && date.year === autreDate.year;
}