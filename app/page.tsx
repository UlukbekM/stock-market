import Link from "next/link"
// https://supabase.com/docs/guides/auth/auth-helpers/nextjs?language=ts

export default function Index() {

    return (
        <div className="w-screen h-screen items-center">
            <div className="text-white p-2 flex justify-between items-center">
                <div className="m-auto">
                    <h1 className="text-2xl font-bold">Virtual Stock Market</h1>
                </div>
                <div className="m-auto">
                    <Link href={"register"} className="py-2 px-4 mx-2 hover:bg-gray-900 rounded-lg font-medium">Register</Link>
                    <Link href={"login"}  className="py-2 px-4 mx-2 hover:bg-gray-900 rounded-lg font-medium" data-modal-target="defaultModal" data-modal-toggle="defaultModal" type="button">Login</Link>
                </div>
            </div>


        </div>
    )
}
