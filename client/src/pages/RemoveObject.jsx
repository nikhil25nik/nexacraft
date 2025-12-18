import { Download,  Scissors, Sparkles } from "lucide-react";
import { useState } from "react";
import { getEnv } from "../helper/getEnv";
import toast from "react-hot-toast";
import { handleDownload } from "../helper/handelDownload.js";

export default function RemoveObjects(){

    
       
        const [input ,setInput] = useState("")
        const [object,setObject] = useState('')
        const [loading,setLoading] = useState(false)
        const [content,setContent] = useState("")
    
        const onSubmitHandle = async(e)=>{
            e.preventDefault();
            
            
            try{
                setLoading(true)
                if(object.split(" ").length > 1){
                    return toast.error("Please enter only one object")
                }

                const formData = new FormData();
                formData.append("image",input)
                formData.append("object",object)
                
                const response = await fetch(`${getEnv("VITE_BASE_API_URL")}/ai/remove-image-object`,{
                    method:"POST",
                    credentials:"include",
                    body:formData
                })

                const data = await response.json()

                if(!response.ok){
                    return toast.error(data.message)
                }

                setContent(data.content);

            }catch(err){
                toast.error(err.message);
            }
            setLoading(false)
        }
    return(
         <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
            {/* right col */}
            <form onSubmit={onSubmitHandle} className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 ">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-6 text-[#A47Aff]"/>
                    <h1 className="text-xl font-semibold">Remove Object</h1>
                </div>
                <p className="mt-6 text-sm font-medium">Upload Image</p>

                <input type="file" accept="image/*" onChange={(e)=> setInput(e.target.files[0])} className="w-full p-2 px-3 mt-2 text-sm rounded-md outline-none border border-gray-300 text-gray-600 "  required/>

                <p className="mt-3 font-medium text-sm">Describe Object  to remove</p>
                 <textarea onChange={(e)=> setObject(e.target.value)} value={object} rows={4} className="w-full p-2 px-3 mt-2 text-sm rounded-md outline-none border border-gray-300 " placeholder="Start generating...." required/>

              
                <button disabled={loading} className="w-full flex justify-center items-center bg-linear-to-r from-[#226BFF] to-[#65ADFF]  text-white px-4 py-2 mt-6 gap-2 text-sm rounded-md cursor-pointer"> 
                    {
                        loading ?  (
                            <span className="h-4 w-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
                        ) :(<Scissors className="w-5"/>)
                    }
                    Remove Object</button>

            </form>
            {/* left col */}
            <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
                <div className="flex items-center gap-3">
                    <Scissors className="w-5 h-5 text-[#4A7AFF]"/>
                    <h1 className="text-xl font-semibold">Processed Image</h1>

                </div>
                {!content ? (<div className="flex-1 flex justify-center items-center">
                    <div className="text-sm flex flex-col items-center gap-5 text-gray-500">
                        <Scissors className="w-9 h-9"/>
                        <p>Upload image and describe what to remove</p>
                    </div>
                </div>)
                :
                (
                    <div className="mt-3 h-full">
                        <img src={content} alt="image" className="h-full w-full" />

                        <button
    onClick={handleDownload(content)}
    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md"
  >
    <Download className="w-4 h-4" />
    Download Image
  </button>
                    </div>
                )
            }
                

            </div>
        </div> 
    )
}