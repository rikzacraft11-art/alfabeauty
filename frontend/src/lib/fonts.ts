import localFont from "next/font/local";

export const fontSans = localFont({
    src: "../styles/fonts/Montserrat-Variable.ttf",
    variable: "--font-body",
    display: "swap",
});

// Alias Serif to Sans (Montserrat) as users requested mostly Montserrat for digital.
// We must declare it separately to assign the "--font-display" variable required by globals.css
export const fontSerif = localFont({
    src: "../styles/fonts/Montserrat-Variable.ttf",
    variable: "--font-display",
    display: "swap",
});
