import './globals.css'

export const metadata = {
    title: 'Virtual Stock Market',
    description: 'Generated by create next app',
}

// https://coolors.co/1b2627-202c2d-b2f35f-ffffff-b2b6b6

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="shortcut icon" href="/favicon.ico" />
            </head>
            <body>
                <main className="min-h-screen bg-background flex flex-col items-center ">
                    {children}
                </main>
                <script src="./node_modules/preline/dist/preline.js"></script>
            </body>
        </html>
    )
}
