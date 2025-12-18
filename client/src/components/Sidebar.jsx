import { useDispatch, useSelector } from "react-redux"
import userIcon from "../assets/user_icon.png"
import { Eraser, FileText, Hash, House, icons, Image, LogOut, Scissors, SquarePen, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { getEnv } from "../helper/getEnv";
import { removeUser } from "../redux/user/user.slice";

const navItems = [
    {to:"/ai",label:"Dashboard", Icon: House},
    {to:"/ai/write-article",label:"Write Article", Icon: SquarePen},
    {to:"/ai/blog-titles",label:"Blog Titles", Icon: Hash},
    {to:"/ai/generate-images",label:"Genrate Images", Icon: Image},    
    {to:"/ai/remove-background",label:"Remove Background", Icon: Eraser},    
    {to:"/ai/remove-object",label:"Remove Objects", Icon: Scissors },    
    {to:"/ai/review-resume",label:"Review Resume", Icon: FileText },    
    {to:"/ai/community",label:"Community", Icon: Users },    

]

export default function Sidebar({sidebar,setSidebar}){

    const user = useSelector((state)=> state.user);
    const dispatch = useDispatch()
    const navigate = useNavigate();

     const handleLogout = async()=>{
        try{
          const response = await fetch(`${getEnv("VITE_BASE_API_URL")}/auth/logout`,{
            method:"GET",
            credentials:"include"
          })
          const data = await response.json();
    
          if(!response.ok){
            console.log("this is a an error" , data.message)
          }
          dispatch(removeUser())
          navigate("/")
        }catch(err){
          console.log(err.message);
        }
      }

    return(
        <div className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"} transition-all duration-300 ease-in-out z-50`}>
            <div className="my-7 w-full">
                <img src={user.user.avatar || userIcon} alt="user avatar" className="w-13 rounded-full mx-auto" />
                <h1 className="mt-2 text-center">{user.user.name}</h1>

                <div className="px-5 mt-5 text-sm text-gray-600 font-medium">
                    {navItems.map(({to,label,Icon})=>(
                        <NavLink key={to} to={to} end={to === "/ai"} onClick={()=> setSidebar(false)} className={({isActive}) => `px-3.5 py-2.5 flex items-center gap-3 rounded ${isActive ? "bg-linear-to-r from-[#3C81F6] to-[#9234EA] text-white" : ""}`}>
                            {({isActive})=>(
                                <>
                                <Icon className={`w-4 h-4 ${isActive ? "text-white" : ""}`}/>
                                {label}
                                </>
                            )}

                        </NavLink>
                    ))}
                </div>
            </div>

            {/* logout */}
            <div onClick={handleLogout} className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-baseline">
                <div className="flex gap-2 items-center cursor-pointer">
                    <img src={user.user.avatar || userIcon} className="w-8 rounded-full" alt="" />
                    <div>
                        <h1 className="text-sm font-medium">{user.user.name}</h1>
                    </div>
                </div>
                <LogOut className="w-4.5 ml-1.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"/>
            </div>
        </div>
    )
}