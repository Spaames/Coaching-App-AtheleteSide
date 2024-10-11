"use client";
import React from "react";
// import Navbar from "@/app/components/Navbar";
import {ReduxProvider} from "@/app/redux/provider";
import {ChakraProvider} from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import {usePathname} from "next/navigation";

export default function RootLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }) {

    const path = usePathname();
    const showNavBar = path !== "/login" && path !== "/register";

    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <title>ReMuscles</title>
        </head>
        <body>
        <ReduxProvider>
            <ChakraProvider>
                {/*<Navbar />*/}
                <Box as="main" ml={showNavBar ? { base: "0", md: "180px" }: "0"} p="4">
                    {children}
                </Box>
            </ChakraProvider>
        </ReduxProvider>
        </body>
        </html>
    )
}