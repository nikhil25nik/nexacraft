import { Edit, FileText, Sparkles } from "lucide-react";
import { useState } from "react";
import { getEnv } from "../helper/getEnv";
import toast from "react-hot-toast";
import Markdown from 'react-markdown'

export default function ReviewResume(){
    
        
       
        const [input ,setInput] = useState("")
        const [loading,setLoading] = useState(false)
        const [content,setContent] = useState("")
        
    
        const onSubmitHandle = async(e)=>{
            e.preventDefault();

            

            try{
                setLoading(true);
                const formData = new FormData()
                formData.append("resume",input);
               
                const response = await fetch(`${getEnv("VITE_BASE_API_URL")}/ai/review-resume`,{
                    method:"POST",
                    credentials:"include",
                    body:formData
                })
                const data = await response.json();

                if(!response.ok){
                    return toast.error(data.message)
                }
                setContent(data.content)
            }catch(err){
                toast.error(err.message)
            }finally{

                setLoading(false);
            }
        }
    return(
           <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
            {/* right col */}
            <form onSubmit={onSubmitHandle} className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 ">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-6 text-[#A47Aff]"/>
                    <h1 className="text-xl font-semibold">Review Resume</h1>
                </div>
                <p className="mt-6 text-sm font-medium">Upload Resume</p>

                <input type="file" accept="application/pdf" onChange={(e)=> setInput(e.target.files[0])}  className="w-full p-2 px-3 mt-2 text-sm rounded-md outline-none border border-gray-300 "  required/>
               

               
                <button disabled={loading} className="w-full flex justify-center items-center bg-linear-to-r from-[#226BFF] to-[#65ADFF]  text-white px-4 py-2 mt-6 gap-2 text-sm rounded-md cursor-pointer">
                    {
                        loading ? (
                            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
                        ) : (<FileText className="w-5"/>)
                    }
                    Review Resume</button>

            </form>
            {/* left col */}
            <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#4A7AFF]"/>
                    <h1 className="text-xl font-semibold">Analysis Result</h1>

                </div>

                {!content ? ( <div className="flex-1 flex justify-center items-center">
                    <div className="text-sm flex flex-col items-center gap-5 text-gray-500">
                        <FileText className="w-9 h-9"/>
                        <p>Upload a file an click "Review Resume" to get started</p>
                    </div>
                </div>) : (
                    <div >
                         <Markdown className="reset-tw">{content}</Markdown> 
                    </div>
                )}
               

            </div>
        </div> 
    )
}