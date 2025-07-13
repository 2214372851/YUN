

function TestPage() {
    return (
        <div className="container pt-20 flex max-w-7xl mx-auto min-h-dvh bg-green-900 justify-center items-center">
            <div className="w-1/2 relative" style={{
                transformOrigin: 'bottom'

            }}>
                {/*<img src="/bg.png" alt="bg" className="w-full h-full object-cover"*/}
                {/*     style={{*/}
                {/*         transform: 'perspective(1000px) rotateX(30deg) skewX(20deg)',*/}
                {/*         transformOrigin: 'bottom'*/}
                {/*     }}*/}
                {/*     />*/}
                {/*<img src="/no-bg.png" alt="bg" className="w-full h-full object-cover absolute bottom-0"/>*/}
            </div>
        </div>
    );
}

export default TestPage;