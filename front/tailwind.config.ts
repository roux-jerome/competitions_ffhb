import type {Config} from "tailwindcss";
import tailwindForm from "@tailwindcss/forms"
import svgToDataUri from "mini-svg-data-uri";
// @ts-ignore
import {default as flattenColorPalette} from "tailwindcss/lib/util/flattenColorPalette";

/** @type {import('tailwindcss').Config} */
const config: Config = {
    darkMode: 'class',
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            transformOrigin: {
                0: "0%",
            },
            zIndex: {
                "-1": "-1",
            },
        },
    },
    plugins: [
        tailwindForm,
        addVariablesForColors,
        function ({matchUtilities, theme}: any) {
            matchUtilities(
                {
                    "bg-dot-thick": (value: any) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="2.5"></circle></svg>`
                        )}")`,
                    }),
                },
                {values: flattenColorPalette(theme("backgroundColor")), type: "color"}
            );
        }],
};

function addVariablesForColors({ addBase, theme }: any) {
    let allColors = flattenColorPalette(theme("colors"));
    let newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
    );

    addBase({
        ":root": newVars,
    });
}

export default config;
