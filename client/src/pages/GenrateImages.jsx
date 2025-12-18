import { Download, Edit, Hash, Image, Sparkles } from "lucide-react";
import { useState } from "react";
import { getEnv } from "../helper/getEnv";
import toast from "react-hot-toast";
import { handleDownload } from "../helper/handelDownload.js";

export default function GenrateImages(){

      const styles = [
               "Realistic","Ghibli","Anime",
               "Cartoon","Watecolor Painting","Comic Book ",
               "Pencil Art","Digital Art"
            ]
        
            const [style,setStyle] = useState(styles[0])
            const [input ,setInput] = useState("")
            const [publish,setPublish] = useState(false)
            const [loading,setLoading] = useState(false)
            const [content,setContent] = useState("");

        
            const onSubmitHandle = async(e)=>{
                e.preventDefault();

                setLoading(true)
                try{
                    const prompt = `Generate an image of ${input} in the style ${style}`

                    const response = await fetch(`${getEnv("VITE_BASE_API_URL")}/ai/generate-image`,{
                        method:"POST",
                        credentials:"include",
                        headers:{
                            "Content-Type":"application/json"
                        },
                        body: JSON.stringify({prompt ,publish})
                    })
                    //  toast.loading("wait until generate image");

                    const data = await response.json()
                    
                    if(!response.ok){
                      return  toast.error(data.message)
                    }
                    setContent(data.secure_url);
                    toast.success("Generate image....");

                    console.log(data)
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
                    <Sparkles className="w-6 text-[#00AD25]"/>
                    <h1 className="text-xl font-semibold">Image Generator</h1>
                </div>
                <p className="mt-6 text-sm font-medium">Describe Your Image</p>

                <textarea rows={4} onChange={(e)=> setInput(e.target.value)} value={input} className="w-full p-2 px-3 mt-2 text-sm rounded-md outline-none border border-gray-300 " placeholder="Start generating...." required/>
                <p className="mt-3 font-medium text-sm">Style</p>

                <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
                    {
                        styles.map((items,index)=>(
                            <span onClick={()=>setStyle(items)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${style === items ? "bg-blue-50 text-bluu-700 border-blue-500":"bg-gray-50 border-gray-300 text-gary-700"}`} key={index}>{items}</span>
                        ))
                    }
                </div>

                <div  className="my-6 flex gap-3 items-center">
                    <label className="relative cursor-pointer">
                        <input type="checkbox"  onChange={(e)=>setPublish(e.target.checked)} checked={publish}
                       className="sr-only peer" />

                       <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>
                       <span className="absolute bg-white left-1 top-1 h-3 w-3 rounded-full transition peer-checked:translate-x-4"></span>
                    </label>

                    <p className="text-sm">Make this image public</p>

                </div>
                <button disabled={loading} className="w-full flex justify-center items-center bg-linear-to-r from-[#C341F6] to-[#8E37EB]  text-white px-4 py-2 mt-6 gap-2 text-sm rounded-md cursor-pointer">
                    {
                        loading ? (
                            <span className="h-4 w-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
                        ):(
                            <Image className="w-5"/>
                        )
                    }
                    Genrate Image</button>

            </form>
            {/* left col */}
            <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
                <div className="flex items-center gap-3">
                    <Image className="w-5 h-5 text-[#8E37EB]"/>
                    <h1 className="text-xl font-semibold">Generated Image</h1>

                </div>
                {
                    !content ? (<div className="flex-1 flex justify-center items-center">
                    <div className="text-sm flex flex-col items-center gap-5 text-gray-500">
                        <Image className="w-9 h-9"/>
                        <p>Describe your image and click "Generate Image" to get started</p>
                    </div>
                </div>) :(
                    <div className="mt-3 h-full">
                        <img src={content} alt="image" className="w-full h-full" />

                        <button
    onClick={handleDownload(content)}
    className="flex items-center justify-center gap-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md"
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