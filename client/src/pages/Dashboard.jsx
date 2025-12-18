import { useEffect, useState } from "react"
import { dummyCreationData } from "../assets/assets";
import { Sparkle } from "lucide-react";
import CreationItems from "../components/CreationItems";
import { getEnv } from "../helper/getEnv";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function Dashboard(){

    const [creations,setCreations] = useState([]);
    const [loading,setLoading] = useState(false)
    const user = useSelector((state)=>state.user)
    const getDashboardData = async()=>{
        try{
            setLoading(true)
            const response = await fetch(`${getEnv("VITE_BASE_API_URL")}/activity/get-user-creation/${user.user._id}`,{
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
            setCreations(data.creations);
        }catch(err){
            return toast.error(err.message);
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        getDashboardData();
    },[])

    return(
        <div className="h-full overflow-y-scroll p-6">
            <div className="flex justify-start gap-4 flex-wrap">

                {/* total creations */}
                <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200 ">
                    <div className="text-salte-600">
                        <p className="text-sm">Total Creations</p>
                        <h2 className="text-xl font-semibold">{creations.length}</h2>
                    </div>
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center">
                    <Sparkle className="w-5 text-w"/>
                </div>
                </div>

            </div>

            {
                loading ? (
                    <div className="flex justify-center items-center h-3/4">
                        <div className="animate-spin rounded-full h-11 w-11 border-3 border-purple-600 border-t-transparent"></div>
                    </div>
                ):(
                    <div className="space-y-3">
                <p className="mt-6 mb-4">Recent Creations</p>
                {
                    creations.map((items)=> <CreationItems key={items._id} items={items}/>)
                }
            </div>
                )
            }
            
        </div>
    )
}