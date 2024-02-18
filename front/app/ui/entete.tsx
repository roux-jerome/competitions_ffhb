import Image from "next/image";
import iconimageHand from "./icon-handball.png";
import LiensFfhb from "@/app/ui/liens-ffhb";
import Link from "next/link";

export function Entete() {
    return <header className="bg-white dark:bg-gray-900">
        <nav className="border-t-4 border-blue-500">
            <div className="container flex items-center justify-between px-6 py-3 mx-auto">
                <Link href="/">
                    <Image className="w-auto h-6 sm:h-7" src={iconimageHand} width={450}
                           height={64} alt=""/>
                </Link>

                <LiensFfhb></LiensFfhb>

            </div>
        </nav>
    </header>;
}