import {  Edit, Sparkles } from "lucide-react";
import { useState } from "react";
import { getEnv } from "../helper/getEnv";
import Markdown from 'react-markdown'
import toast from "react-hot-toast";

export default function WriteArticle(){

    const articleLength = [
        {length:900, text: "short(500-900 words)"},
        {length:1100, text: "Medium(900-1100 words)"},
        {length:1500, text: "Long(1100+  words)"},
    ]

    const [selectedLength,setSelectedLength] = useState(articleLength[0])
    const [input ,setInput] = useState("")
    const [loading,setLoading] =useState(false);
    const [content,setContent]= useState("");


    const onSubmitHandle = async(e)=>{
        e.preventDefault();

        try{
            setLoading(true)
           const prompt = `Write a well-structured article about ${input} in ${selectedLength.length} words. Include an introduction, main points with examples, causes and effects (if applicable), solutions or measures, and a clear conclusion. Use simple and formal language.`;

            const response = await fetch(`${getEnv("VITE_BASE_API_URL")}/ai/generate-article`,{
                method:"POST",
                credentials:"include",
                headers:{
                    "Content-Type":"application/json",
                    
                },
                body:JSON.stringify({prompt,length:selectedLength.length})
            })

            const data = await response.json()

            if(!response.ok){
               
               return toast.error(data.message)
            }
            toast.success("this you response ")
            
            setContent(data.content)
        }catch(err){
           
            toast.error(err.message);
        }
        setLoading(false)
    }

    return(
        <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
            {/* left col */}
            <form onSubmit={onSubmitHandle} className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 ">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-6 text-[#A47Aff]"/>
                    <h1 className="text-xl font-semibold">The Article</h1>
                </div>
                <p className="mt-6 text-sm font-medium">Article Topic</p>

                <input type="text" onChange={(e)=> setInput(e.target.value)} value={input} className="w-full p-2 px-3 mt-2 text-sm rounded-md outline-none border border-gray-300 " placeholder="Start generating...." required/>
                <p className="mt-3 font-medium text-sm">Article Length</p>

                <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
                    {
                        articleLength.map((items,index)=>(
                            <span onClick={()=>setSelectedLength(items)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedLength.text === items.text ? "bg-blue-50 text-bluu-700 border-blue-500":"bg-gray-50 border-gray-300 text-gary-700"}`} key={index}>{items.text}</span>
                        ))
                    }
                </div>
                <button disabled={loading} className="w-full flex justify-center items-center bg-linear-to-r from-[#226BFF] to-[#65ADFF]  text-white px-4 py-2 mt-6 gap-2 text-sm rounded-md cursor-pointer">
                    {
                        loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span> :<Edit className="w-5"/>
                    }
                    Genrate Article</button>

            </form>
            {/* right col */}
            <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
                <div className="flex items-center gap-3">
                    <Edit className="w-5 h-5 text-[#4A7AFF]"/>
                    <h1 className="text-xl font-semibold">Genrateted Article</h1>

                </div>
                {!content ?(   <div className="flex-1 flex justify-center items-center">
                    <div className="text-sm flex flex-col items-center gap-5 text-gray-500">
                        <Edit className="w-9 h-9"/>
                        <p>Enter a topic and click "Genrate article" to get started</p>
                    </div>
                </div>) :(
                    <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
                        <div className="reset-tw"><Markdown>{content}</Markdown></div>
                    </div>
                ) }
             

            </div>
        </div> 
    )
}