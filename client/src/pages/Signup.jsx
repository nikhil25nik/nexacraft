import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom";
import { getEnv } from "../helper/getEnv.js";
import GoogleLogin from "../components/GoogleLogin.jsx";
import toast from "react-hot-toast";

export default function Signup() {

  const navigate = useNavigate()

  const formSchema = z
    .object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      email: z.string().email("Invalid email"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters"),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
      if (password !== confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Passwords do not match",
        });
      }
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

 async function onSubmit(values) {

    try{
      const response = await fetch(`${getEnv("VITE_BASE_API_URL")}/auth/register`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(values)
      })

      const data = await response.json();


      if(!response.ok){
      return  toast.error(data.message)
      }

      navigate("/")
    }catch(err){
     toast.error(err.message)
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
        <h2 className="text-2xl font-semibold text-center mb-4">Create Account</h2>

        <input
          {...form.register("name")}
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-2 border rounded-lg"
        />
        <p className="text-red-500 text-sm">{form.formState.errors.name?.message}</p>

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

        <input
          {...form.register("confirmPassword")}
          type="password"
          placeholder="Confirm Password"
          className="w-full px-4 py-2 border rounded-lg"
        />
        <p className="text-red-500 text-sm">{form.formState.errors.confirmPassword?.message}</p>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
         <p className="text-center">Already have a Account<a href="/sign-in" className="text-blue-500 "> Sign In</a></p>
      </form>
    </div>
  );
}
