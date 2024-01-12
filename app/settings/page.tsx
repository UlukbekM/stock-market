"use client"
import Link from "next/link";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import { FaChartColumn } from "react-icons/fa6";
import MobileHeader from '../MobileHeader/MobileHeader';
import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export default function Dashboard() {
    const supabase = createClientComponentClient<Database>()
    const [image, setImage] = useState<File | null>(null);
    const [imagePath,setImagePath] = useState<string>("")
    const [email,setEmail] = useState<string>("")
    const [userId,setUserId] = useState<string>("")

    useEffect(() => {
        getUser()
    }, [])


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!image) {
            console.error('No image selected');
            return;
        }
    
        try {
            if(imagePath) {
                await supabase.storage.from('profile').remove([`${userId}/${imagePath}`]);
            }

            const { data,error } = await supabase.storage
            .from('profile')
            .upload(userId + "/" + image.name, image);
    
            if (error) {
                console.error('Error uploading image:', error.message);
                return;
            }
            if(data) {
                getImage(userId)
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if(user?.email) {
            setUserId(user.id)
            setEmail(user.email)
            getImage(user.id)
        }
    }

    const getImage = async (id:string) => {
        const { data, error } = await supabase.storage.from('profile').list(id + '/', {
            limit: 10,
            offset: 0, 
            sortBy: {
                column: 'name', order: 'asc'
            }
        })

        if(data) {
            // console.log(data)
            setImagePath(data[0].name)
        } else {
            console.log(error)
        }
    }

    return(
    <div className="flex flex-row bg-[#1B2627] w-full text-white h-full">
        <MobileHeader/>
        <div className='hidden lg:flex flex-col p-2 justify-between h-screen sticky top-0'>
            <div>
                <div className='pb-5 font-bold text-2xl'>
                    Virtual Stock Market
                </div>
                
                <Link href={"dashboard"}>
                    <div className='text-xl px-4 py-2 flex cursor-pointer hover:bg-gray-200 hover:bg-opacity-20 rounded-xl'>
                        <FaChartColumn className='my-auto mx-3'/>Dashboard
                    </div>
                </Link>
            </div>

            <div className='my-3 text-xl text-[#B2B6B6] font-semibold'>
                <div className='flex py-2 px-4 cursor-pointer bg-gray-200 bg-opacity-20 rounded-xl my-1'>
                    <FaGear className='my-auto mx-3'/>Settings
                </div>

                <form action="/auth/signout" method="post" className='my-1'>
                    <button className="flex py-2 px-4 button w-full hover:bg-red-500 hover:bg-opacity-20 rounded-xl" type="submit">
                        <FaArrowRightFromBracket className='my-auto mx-3'/> Sign out
                    </button>
                </form>
            </div>
        </div>


        <div className='flex-1 p-3 flex flex-col   mt-16 md:mt-0'>
            <div className="bg-secondary p-5 rounded-lg m-2 flex-grow flex flex-col">
                <h1 className='text-3xl font-bold'>
                    Settings
                </h1>

                <div className="m-5">
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    <button onClick={handleUpload}>Upload Image</button>
                </div>

                {imagePath && 
                <div className="avatar">
                    <div className="w-20 rounded-full">
                        <img src={`https://yiunghnvgmuatnrhjxla.supabase.co/storage/v1/object/public/profile/fccdde01-93e6-49af-b73a-ac5ee63c4610/${imagePath}`} />
                    </div>
                </div>
                // <img src={`https://yiunghnvgmuatnrhjxla.supabase.co/storage/v1/object/public/profile/fccdde01-93e6-49af-b73a-ac5ee63c4610/${imagePath}`}/>
                }
            </div>
        </div>
    </div>
)
}
