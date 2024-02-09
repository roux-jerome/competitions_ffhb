'use client'

import LiensFfhb from "@/app/liens-ffhb";
import {useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import index from './index.json';
import lunr from 'lunr'
import Result = lunr.Index.Result;
import Image from "next/image";

export default function Home() {
    const [recherche, setRecherche] = useState("");
    const [competitions, setEquipes] = useState([]);
    const [debouncedRecherche] = useDebounce(recherche, 500);
    const idx = lunr.Index.load(index)
    useEffect(() => {
        if(debouncedRecherche){
            let resultat = idx.search(`*${debouncedRecherche}*`);
            console.log(resultat)
        }
    })


    return (
        <>
            <header className="bg-white dark:bg-gray-900">
                <nav className="border-t-4 border-blue-500">
                    <div className="container flex items-center justify-between px-6 py-3 mx-auto">
                        <a href="#">
                            <Image className="w-auto h-6 sm:h-7" src="/icon-handball.png" alt=""/>
                        </a>

                        <LiensFfhb></LiensFfhb>

                    </div>
                </nav>

                <div className="container px-6 py-16 mx-auto">
                    <div className="items-center lg:flex">
                        <div className="w-full lg:w-1/2">
                            <div className="lg:max-w-lg">
                                <h1 className="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">Recherche ton club sur <span
                                    className="text-blue-500">FFHandball</span></h1>

                                <p className="mt-3 text-gray-600 dark:text-gray-400">Toi aussi tu n&apos;en peux plus de rechercher sur le site de la Fédération française de
                                    handball. <span
                                        className="font-medium text-blue-500">Alors cet outils est fait pour toi</span></p>

                                <div className="flex flex-col mt-6 space-y-3 lg:space-y-0 lg:flex-row">
                                    <div className="relative w-full z-0">
                                        <input id="club" type="text"
                                               onChange={(e) => setRecherche(e.target.value)}
                                               className="block p-3 text-lg w-full bg-transparent text-gray-700 border rounded-full focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                                               placeholder=" "/>
                                        <label htmlFor="club"
                                               className="absolute top-0 p-4 origin-0 duration-300 -z-1 bg-white text-gray-500">Saisie ton club</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
                            <Image className="w-full h-full max-w-md" src="/hand.png" alt="email illustration vector art"/>
                        </div>
                    </div>
                </div>
            </header>
            <section className="bg-white dark:bg-gray-900">
                <div className="container px-6 py-10 mx-auto">
                    <div className="flex py-4 mt-4 overflow-x-auto overflow-y-hidden md:justify-center dark:border-gray-700">
                        <button
                            className="h-12 px-8 py-2 -mb-px text-sm text-center text-blue-600 bg-transparent border-b-2 border-blue-500 sm:text-base dark:border-blue-400 dark:text-blue-300 whitespace-nowrap focus:outline-none">
                            Animation
                        </button>

                        <button
                            className="h-12 px-8 py-2 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-gray-200 sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none dark:border-gray-700 dark:hover:border-gray-400 hover:border-gray-400">
                            Web design
                        </button>

                        <button
                            className="h-12 px-8 py-2 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-gray-200 sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none dark:border-gray-700 dark:hover:border-gray-400 hover:border-gray-400">
                            App design
                        </button>

                        <button
                            className="h-12 px-8 py-2 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-gray-200 sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none dark:border-gray-700 dark:hover:border-gray-400 hover:border-gray-400">
                            Branding
                        </button>
                    </div>

                    <section className="bg-white dark:bg-gray-900">
                        <div className="container px-6 py-12 mx-auto">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">


                                <div className="max-w-2xl px-8 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-light text-gray-600 dark:text-gray-400">Mar 10, 2019</span>
                                        <a className="px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform bg-gray-600 rounded cursor-pointer hover:bg-gray-500"
                                           tabIndex={0} role="button">Design</a>
                                    </div>

                                    <div className="mt-2">
                                        <p className="mt-2 text-gray-600 dark:text-gray-300">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam
                                            aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione
                                            libero!</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline" tabIndex={0} role="link">Ouvrir </a>


                                    </div>
                                </div>


                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </>
    );
}
