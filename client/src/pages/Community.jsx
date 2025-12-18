import { useEffect, useState } from "react"
import { assets, dummyPublishedCreationData } from "../assets/assets";
import { useSelector } from "react-redux";
import { Heart, Images } from "lucide-react";
import { getEnv } from "../helper/getEnv";
import toast from "react-hot-toast";

export default function Community(){

    const user = useSelector((state)=> state.user)
 
    const [creations,setCreations] = useState([]);
    const [loading,setLoading] = useState(false)

    const fetchCreations = async()=>{
       try{
        setLoading(true)
        const response = await fetch(`${getEnv("VITE_BASE_API_URL")}/activity/get-published-creation`,{
            method:"GET",
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            }
        })

        const data = await response.json()

        if(!response.ok){
           return toast.error(data.message)
        }
       
        setCreations(data.creations)
       }catch(err){
        toast.error(err.message)
       }finally{
        setLoading(false)
       }
    }

    const imageLikeToggle = async(id)=>{
        try{
            const response = await fetch(`${getEnv("VITE_BASE_API_URL")}/activity/toggle-like-creation`,{
                method:"POST",
                credentials:"include",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({id})
            })

            const data =  await response.json()
            
            if(!response.ok){
                return toast.error(data.message)
            }
            await fetchCreations()
        }catch(err){
            return toast.error(err.message)
        }
    }

    useEffect(()=>{
       if (user?.user?._id) {

            fetchCreations()
        }
    },[user?.user?._id])
    return(
        <div className="flex-1 h-full flex flex-col gap-4 p-6">
            <h1 className="text-2xl font-medium flex items-center gap-2"><Images className="text-[#8E37EB]"/> Creations</h1>
            <div className="bg-white w-full h-full rounded-lg overflow-y-scroll">
                {
                    creations.map((creation,index)=>{
                          const isLiked = creation.likes?.some(
                          likeId => likeId.toString() === user.id);
                       return(
                        <div key={index} className="relative group inline-block pl-3 pt-3 w-full sm:w-1/2 lg:w-1/3">
                            <img src={creation.content} alt="images" className="w-full h-full object-cover rounded-lg"/>
                           
                            <div className="absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-linear-to-b from-transparent to-black/80 text-white rounded-lg ">
                                <p className="text-sm hidden group-hover:block ">{creation.prompt}</p>
                                <div className="flex gap-1 items-center">
                                    <p>{creation.likes.length}</p>
                                <Heart onClick={()=> imageLikeToggle(creation._id)} className={`min-w-5 h-5 hover:scale-100 cursor-pointer ${isLiked ? "fill-red-500 text-red-600":"text-white"}`}/>
                                </div>
                            </div>

                        </div>)
})
                }
            </div>
        </div>
    )
}