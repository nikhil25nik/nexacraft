import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { auth, authProvider } from "../helper/firebase";
import { getEnv } from "../helper/getEnv";
import {useNavigate} from "react-router-dom"
import { useDispatch } from "react-redux";
import { setUser } from "../redux/user/user.slice";


export default function GoogleLogin(){

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleLogin = async()=>{
        let googleResponse = await signInWithPopup(auth,authProvider);
        console.log(googleResponse);
        const user = googleResponse.user;
        const resBody = {
            name:user.displayName,
            email:user.email,
            avatar:user.photoURL
        }

        try{
            const response = await fetch(`${getEnv("VITE_BASE_API_URL")}/auth/google-login`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials:"include",
                body:JSON.stringify(resBody)
            })
            const data = await response.json();

            if(!response.ok){
              return  console.log("Error",data.message);
            }
            console.log("Success",data.message);
            dispatch(setUser(data.user))
            navigate("/")
        }catch(err){
            console.log(err.message);
        }
    }
    return(
        <>
        
        <button  className="flex gap-2 items-center mx-auto p-2 border rounded-md hover:bg-gray-100 cursor-pointer"  onClick={handleLogin}>
            
            <FcGoogle />
            Continoue With Google
        </button>
        <p className="text-center mt-4 font-semibold">OR</p>
        </>
    )
}