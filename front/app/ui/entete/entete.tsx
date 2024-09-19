import Image from "next/image";
import iconimageHand from "./icon-handball.png";
import React from "react";

export function Entete() {
    return <header className="bg-white dark:bg-gray-900">
        <nav className="bg-gradient-to-r from-orange-700 to-orange-300 pt-1">
            <div className="bg-white w-full">
                <div className="container flex items-center justify-between px-6 py-3 mx-auto w-full">
                    <Image className="w-auto h-10" src={iconimageHand} width={600} height={80} alt=""/>
                </div>
            </div>
        </nav>
    </header>;
}