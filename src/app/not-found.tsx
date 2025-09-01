import {Link} from "next-view-transitions"
import {Button} from "@/components/ui/button";

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col">
            <div className="flex-1 pt-32 pb-24 px-4 flex justify-center items-start">
                <div className="text-center max-w-md">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <h2 className="text-2xl mb-4">页面未找到</h2>
                    <p className="text-muted-foreground mb-8">
                        抱歉，您访问的页面不存在或已被移除。
                    </p>
                    <Button asChild>
                        <Link href="/">返回首页</Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}
