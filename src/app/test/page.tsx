"use client";

import LoginPage from "@/app/test/login";
import SlideHorizontallyPage from "@/app/test/slide-horizontally";

function TestPage() {


    return (
        <div className="main pt-32">
            <div className="flex items-center justify-between mb-16">
                <h1 className="text-4xl font-bold">探索 · 测试</h1>
            </div>


            <div className="mt-2 text-3xl mb-10">Login Page</div>
            <div className="mt-2">
                <LoginPage/>
            </div>


            <div className="mt-2 text-3xl mb-10">横向滑动</div>
            <div className="mt-2">
                <SlideHorizontallyPage/>
            </div>
        </div>
    );
}

export default TestPage;