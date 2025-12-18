import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

export default function Hero() {

    const navigate = useNavigate();
  return (
    <div className="px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen">

      <div className="text-center mb-6">

      <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]">Create amazing content with <br /> <span className="text-primary">AI Tools</span></h1>
      <p className="mt-5    m-auto  max-sm:text-xs text-gray-600">Create stunning content faster than ever with AI-powered writing, image generation, and smart editing tools.Whether you're a creator, student, or professional, your productivity leaps forward instantly.</p>

      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs">
        <button onClick={()=>navigate("/ai")} className="bg-primary text-white px-10 py-3 rounded-1g
hover:scale-102 active:scale-95 transition cursor-pointer rounded-full">Start Creating Now</button>


      </div>
              <div className="flex items-center gap-4 mt-8 mx-auto text-gray-600">
                <img src={assets.user_group} alt="" className="h-8"/> Trusted By Best people
              </div>
    </div>
  );
}
