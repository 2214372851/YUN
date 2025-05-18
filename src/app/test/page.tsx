function MenuItem() {
    return (
        <div className="p-2 h-16 bg-card rounded-lg border border-white/5 hover:border-white/20">
            <h3>Status API</h3>
            <span className="text-white/40">/aapx/index.html</span>
        </div>
    )
}

function TestPage() {
    return (
        <div className="container bg-red-300 pt-20 flex max-w-7xl mx-auto">
            <div
                className=" w-60 gap-3 space-y-2 border border-transparent border-r-white/5 transition-colors overflow-hidden p-1 h-full">

                <MenuItem/>
                <MenuItem/>
                <MenuItem/>
                <MenuItem/>
                <MenuItem/>
                <MenuItem/>

            </div>
            test
        </div>
    );
}

export default TestPage;