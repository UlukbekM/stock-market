"use client"
import Link from "next/link";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import { FaChartColumn } from "react-icons/fa6";
import MobileHeader from '../MobileHeader/MobileHeader';
import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const supabase = createClientComponentClient<Database>()
    const [image, setImage] = useState<File | null>(null);
    const [imagePath,setImagePath] = useState<string>("")
    const [email,setEmail] = useState<string>("")
    const [userId,setUserId] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [newUsername, setNewUsername] = useState<string>("")
    const { push } = useRouter();

    useEffect(() => {
        getUser()
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewUsername(e.target.value);
    };

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
        } finally {
            setImage(null)
            const fileInput = document.querySelector('.file-input') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
        }
    };

    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        // console.log(user)

        if(user && user.email) {
            const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id);
            // console.log(data)
            if(data && data[0].username) {
                setUsername(data[0].username)
            }
            setUserId(user.id)
            setEmail(user.email)
            getImage(user.id)
        }
    }

    const getImage = async (id:string) => {
        const { data, error } = await supabase.storage.from('profile').list(id + '/');

        if(data && data.length > 0) {
            if(data[0].name === ".emptyFolderPlaceholder") {
                if(data[1]) {
                    setImagePath(data[1].name)
                }
            } else{
                setImagePath(data[0].name)
            }
        }
    }

    const updateUser = async () => {
        if(newUsername) {
            const { data, error } = await supabase
            .from('profiles')
            .update({ username: newUsername })
            .eq('id', userId)
            .select()
    
            if(data) {
                setUsername(newUsername)
                setNewUsername("")
            } else {
                console.log(error)
            }
            
        }
    }

    const openModal = () => { 
        const modalElement = document.getElementById('my_modal_1') as HTMLDialogElement | null;
        modalElement?.show();
    }

    const deleteUserValue = async () => {
        let { data: user, error } = await supabase
        .from('User Value')
        .select('*')
        .eq('user_id', userId)

        if(user) {
            const rowIds = user.map((userData) => userData.id);

            const { data, error } = await supabase
                .from('User Value')
                .delete()
                .in('id', rowIds);
                if(error) {
                    console.log(error)
                    return
                }
        }
    }

    const deleteUserStocks = async () => {
        let { data: user, error } = await supabase
        .from('stock')
        .select('*')
        .eq('user_id', userId)

        if(user) {
            const rowIds = user.map((userData) => userData.id);

            const { data, error } = await supabase
                .from('stock')
                .delete()
                .in('id', rowIds);
                if(error) {
                    console.log(error)
                    return
                }
        }
    }

    const restartAccount = async () => {
        deleteUserValue()
        deleteUserStocks()
        const { error } = await supabase
        .from('profiles')
        .update({ balance: 10000 })
        .eq('id', userId)
        
        localStorage.removeItem('savedDate');

        const modalElement = document.getElementById('my_modal_1') as HTMLDialogElement | null;
        modalElement?.close();
        push('/dashboard');
    }

    return(
    <div className="flex flex-row bg-[#1B2627] w-full text-white h-full min-h-screen">
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


        <div className='p-3 flex flex-col mt-16 lg:mt-0 flex-1'>
            <div className="bg-secondary p-5 rounded-lg m-2 flex flex-col md:flex-grow">
                <h1 className='text-3xl font-bold my-2'>
                    Settings
                </h1>

                <div className="flex items-center flex-col">
                    <h1 className="text-xl my-3">Account Details</h1>
                    <div className="flex items-center">
                        {imagePath ? 
                            <div className="avatar m-3">
                                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={process.env.NEXT_PUBLIC_SUPABASE_IMAGE+imagePath} />
                                </div>
                            </div>
                            :
                            <div className="avatar placeholder m-3">
                                <div className="bg-primary text-neutral-content rounded-full w-24 ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <span className="text-3xl">{username[0]}</span>
                                </div>
                            </div> 
                        }
                        
                        <div className="flex flex-col m-3">
                            <h1 className="text-2xl m-2">Avatar</h1>
                            <div className="flex flex-col md:flex-row">
                                {/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}
                                <input type="file" className="file-input file-input-bordered w-full max-w-xs m-2" accept="image/jpeg, image/png" onChange={handleImageChange} />
                                <button className="btn btn-active btn-primary m-2" onClick={handleUpload} disabled={!image}>Upload</button>
                                {/* <button onClick={handleUpload}>Upload Image</button> */}
                            </div>
                        </div>
                    </div>

                    <h1 className="text-xl my-3">Personal Details</h1>
                    <div className="flex flex-col my-2">
                        <div className="flex flex-col">
                            <div className="label">
                                {/* <span className="label-text">Username</span> */}
                                Username
                            </div>
                            <div className="flex">
                                <input type="text" placeholder={username} className="input input-bordered w-full max-w-xs" value={newUsername} onChange={handleInputChange} maxLength={15}/>
                                <button className="btn btn-active btn-primary mx-2 my-auto" onClick={updateUser} disabled={newUsername.length < 3}>Save</button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col my-2">
                            <div className="label">
                                {/* <span className="label-text">Email</span> */}
                                Email Address
                            </div>
                            <div className="flex">
                                <input type="text" placeholder={email} className="input input-bordered w-full max-w-xs" disabled/>
                            </div>
                        </div>
                    </div>

                    <button className="btn  mx-2 my-auto" onClick={()=>openModal()}>Restart Account</button>
                    <dialog id="my_modal_1" className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Please confirm</h3>
                            <p className="py-4">Are you sure you want to restart your account?</p>
                            <p className="py-4">This action cannot be reverted.</p>
                            <div className="modal-action flex justify-between">
                                <button className="btn btn-warning" onClick={()=>restartAccount()}>Confirm</button>
                                <form method="dialog">
                                    <button className="btn ">Cancel</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </div>
            </div>
        </div>
    </div>
)
}
