import { Edit, Hash, Sparkles } from "lucide-react";
import { useState } from "react";
import { getEnv } from "../helper/getEnv";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

export default function BlogTitles(){

     const category = [
           "General","Technoloy","Business","Health","Lifestyle","Education",
           "Travel","Food"
        ]
    
        const [selectCategory,setSelectCategory] = useState(category[0])
        const [input ,setInput] = useState("")

        const [loading,setLoading] = useState(false)
        const [content,setContent] = useState("");
    
        const onSubmitHandle = async(e)=>{
            e.preventDefault();
            try{
                setLoading(true)
                const prompt = `Generate the blog title for the ${input} in the category ${selectCategory}.give in bullte points`
                
                const response = await fetch(`${getEnv("VITE_BASE_API_URL")}/ai/generate-blog-title`,{
                    method:"POST",
                    credentials:"include",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({prompt})

                })

                const data = await response.json()

                if(!response.ok){
                    toast.error(data.message);
                }
                setContent(data.content)
                toast.success(data.message);

            }catch(err){
                toast.error(err.message)
            }
            setLoading(false);
        }
    return(
        <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
            {/* right col */}
            <form onSubmit={onSubmitHandle} className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 ">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-6 text-[#8E37EB]"/>
                    <h1 className="text-xl font-semibold">Blog Title Genrator</h1>
                </div>
                <p className="mt-6 text-sm font-medium">Keyword</p>

                <input type="text" onChange={(e)=> setInput(e.target.value)} value={input} className="w-full p-2 px-3 mt-2 text-sm rounded-md outline-none border border-gray-300 " placeholder="Start generating...." required/>
                <p className="mt-3 font-medium text-sm">Select Category</p>

                <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
                    {
                        category.map((items,index)=>(
                            <span onClick={()=>setSelectCategory(items)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectCategory === items ? "bg-blue-50 text-bluu-700 border-blue-500":"bg-gray-50 border-gray-300 text-gary-700"}`} key={index}>{items}</span>
                        ))
                    }
                </div>
                <button disabled={loading} className="w-full flex justify-center items-center bg-linear-to-r from-[#C341F6] to-[#8E37EB]  text-white px-4 py-2 mt-6 gap-2 text-sm rounded-md cursor-pointer">
                    {
                        loading ? <span className="h-4 w-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span> : <Edit className="w-5"/>
                    }Generate Title</button>

            </form>
            {/* left col */}
            <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
                <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-[#8E37EB]"/>
                    <h1 className="text-xl font-semibold">Generated Title</h1>

                </div>
                {
                    !content ? (<div className="flex-1 flex justify-center items-center">
                    <div className="text-sm flex flex-col items-center gap-5 text-gray-500">
                        <Hash className="w-9 h-9"/>
                        <p>Enter a topic and click "Genrate Title" to get started</p>
                    </div>
                </div>) : (
                    <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
                        <div className="reset-tw"><Markdown>{content}</Markdown></div>

                    </div>
                )
                }
                

            </div>
        </div> 
    )
}