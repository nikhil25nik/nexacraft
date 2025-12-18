import { useState } from "react";
import { Menu, User, LogOut, Settings } from "lucide-react";
import { getEnv } from "../helper/getEnv";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../redux/user/user.slice";
import { useNavigate } from "react-router-dom";
import userIcon from "../assets/user_icon.png"
import toast from "react-hot-toast";
export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const user = useSelector((state)=>state.user)
  const handleLogout = async()=>{
    try{
      const response = await fetch(`${getEnv("VITE_BASE_API_URL")}/auth/logout`,{
        method:"GET",
        credentials:"include"
      })
      const data = await response.json();

      if(!response.ok){
        return toast.error(data.message)
      }
      dispatch(removeUser())
      navigate("/")
    }catch(err){
      toast.error(err.message)
    }
  }

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
      >
        <img
          src={user.user.avatar || userIcon}
          alt="Profile"
          className="w-9 h-9 rounded-full"
        />
        <Menu className="w-5 h-5" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 shadow-xl rounded-xl p-2 border border-gray-200 dark:border-gray-800">
          <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <User className="w-4 h-4" />
            Profile
          </button>

          <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Settings className="w-4 h-4" />
            Settings
          </button>

          <hr className="my-2 border-gray-300 dark:border-gray-700" />

          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
