"use client"

import * as React from "react"
import {
    BookOpen,
    Code2,
    FileEdit,
    FileText,
    GitBranch,
    Home,
    ImageIcon,
    Info,
    Mail,
    Palette,
    Search,
    Settings,
    Share2,
    Workflow
} from "lucide-react"

import {CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command"
import {DialogTitle} from "@radix-ui/react-dialog";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

export function Command() {
    const [open, setOpen] = React.useState(false)
    const searchData = [
        {
            title: "Website",
            items: [
                {
                    name: "Home",
                    icon: <Home className="size-4"/>,
                    href: "/",
                },
                {
                    name: "Blog",
                    icon: <BookOpen className="size-4"/>,
                    href: "/blog",
                },
                {
                    name: "Document",
                    icon: <FileText className="size-4"/>,
                    href: "/docs",
                },
                {
                    name: "Media",
                    icon: <ImageIcon className="size-4"/>,
                    href: "/media",
                },
                {
                    name: "Tools",
                    icon: <Settings className="size-4"/>,
                    href: "/tools",
                },
                {
                    name: "Share",
                    icon: <Share2 className="size-4"/>,
                    href: "/share",
                },
                {
                    name: "Api",
                    icon: <Code2 className="size-4"/>,
                    href: "/api",
                },
                {
                    name: "About",
                    icon: <Info className="size-4"/>,
                    href: "/about",
                },
                {
                    name: "Contact",
                    icon: <Mail className="size-4"/>,
                    href: "/contact",
                },
            ],

        },
        {
            title: "Tools",
            items: [
                {
                    name: "Color Picker",
                    icon: <Palette className="size-4"/>,
                    href: "/tools/color-picker",
                },
                {
                    name: "Json Formatter",
                    icon: <Code2 className="size-4"/>,
                    href: "/tools/json-formatter",
                },
                {
                    name: "Markdown Editor",
                    icon: <FileEdit className="size-4"/>,
                    href: "/tools/markdown-editor",
                },
                {
                    name: "Mermaid",
                    icon: <Workflow className="size-4"/>,
                    href: "/tools/mermaid",
                },
                {
                    name: "Tree Converter",
                    icon: <GitBranch className="size-4"/>,
                    href: "/tools/tree-converter",
                },
            ],
        },

    ]


    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <>
            <p
                className="text-muted-foreground text-sm flex text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-white/5 cursor-pointer"
                onClick={() => setOpen((open) => !open)}
            >
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Search className="size-5"/>
                        </TooltipTrigger>
                        <TooltipContent className="bg-background text-white rounded-md border">
                            <p>
                                <kbd className="kbd">⌘K</kbd> or <kbd className="kbd">Ctrl+K</kbd> to open command dialog
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </p>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <DialogTitle></DialogTitle>
                <CommandInput placeholder="Type a command or search..."/>
                <CommandList>
                    {searchData.map((section) => (
                        <CommandGroup key={section.title} heading={section.title}>
                            {section.items.map((item) => (
                                <CommandItem key={item.name} onSelect={() => {
                                    setOpen(false)
                                    window.location.href = item.href
                                }}>
                                    {item.icon}
                                    <span className="ml-2">{item.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ))}
                </CommandList>
            </CommandDialog>
        </>
    )
}
