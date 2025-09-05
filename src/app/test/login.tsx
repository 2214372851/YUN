import Image from "next/image";
import {STORAGE_HOST} from "@/data/baseUrl";
import {Airplay} from "lucide-react";

export default function LoginPage() {
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="w-[32rem]">
                <div className="w-full flex flex-col items-center space-y-4 mb-4">
                    <Image
                        src={`${STORAGE_HOST}/docs/Avatar.webp`}
                        alt="Avatar"
                        width={50}
                        height={50}
                    />
                </div>
                <div className="bg-white/5 rounded-lg py-10 px-6">
                    <form className="flex flex-col space-y-4 p-4">
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full p-2 bg-black rounded border border-white/20 focus:outline-none focus:ring-1 focus:ring-white/90"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-2 bg-black rounded border border-white/20 focus:outline-none focus:ring-1 focus:ring-white/90"
                        />
                        <button
                            type="submit"
                            className="w-full p-2 bg-white rounded text-black hover:bg-white/90 transition"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="flex items-center my-4 mx-4">
                        <div className="flex-grow border-t border-white/20"></div>
                        <span className="text-white/80">OR</span>
                        <div className="flex-grow border-t border-white/20"></div>
                    </div>

                {/*    Google Login*/}
                    <div className="flex space-y-4 flex-col">
                        <LoginButton provider="Google" onClick={() => {
                            alert('Google Login Clicked');
                        }}/>
                        <LoginButton provider="Google" onClick={() => {
                            alert('Google Login Clicked');
                        }}/>
                        <LoginButton provider="Google" onClick={() => {
                            alert('Google Login Clicked');
                        }}/>

                        <div className="text-[14px] text-white/50 text-center mt-4">
                            Don’t have an account? <a href="#" className="text-blue-400/90 hover:underline">Sign up</a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function LoginButton({provider, onClick}: { provider: string, onClick: () => void }) {
    return (
        <div className="px-4 flex justify-center items-center">
            <button
                onClick={onClick}
                className="w-full p-2 bg-black rounded text-white border border-white/20 hover:border-white/90 transition flex items-center justify-center space-x-2"
            >
                <Airplay size={18} />
                <span>Sign in with {provider}</span>
            </button>
        </div>
    )
}