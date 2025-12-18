import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom";
import { getEnv } from "../helper/getEnv.js";
import GoogleLogin from "../components/GoogleLogin.jsx";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/user/user.slice.js";

export default function Signin() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const formSchema = z
    .object({
      email: z.string().email("Invalid email"),
      password: z.string().min(8, "Password must be at least 8 characters"),
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
   
    }
  });

 async function onSubmit(values) {

    try{
      const response = await fetch(`${getEnv("VITE_BASE_API_URL")}/auth/login`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        credentials:"include",
        body:JSON.stringify(values)
      })

      const data = await response.json();


      if(!response.ok){
      return  console.log("error ",data.message);
      }

      dispatch(setUser(data.user))
      navigate("/")
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white shadow-lg p-8 rounded-2xl w-full max-w-sm space-y-4"
      >
        <div>
            <GoogleLogin/>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-4">Log into Account</h2>

        <input
          {...form.register("email")}
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg"
        />
        <p className="text-red-500 text-sm">{form.formState.errors.email?.message}</p>

        <input
          {...form.register("password")}
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg"
        />
        <p className="text-red-500 text-sm">{form.formState.errors.password?.message}</p>

    
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Sign In
        </button>
        <p className="text-center">I don't have account <a href="/sign-up" className="text-blue-500 "> Sign Up</a></p>
      </form>
    </div>
  );
}
