"use client"

import * as React from "react"
import {FileText, Search,} from "lucide-react"
import MiniSearch from 'minisearch'

import {CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

export function Command() {
    const [open, setOpen] = React.useState(false)
    const [miniSearch, setMiniSearch] = React.useState<MiniSearch | null>(null)
    const [searchResults, setSearchResults] = React.useState<Array<{
        id: string;
        title: string;
        score: number;
        type: string;
        content: string;
    }>>([])
    const [query, setQuery] = React.useState('')

    // Initialize minisearch
    React.useEffect(() => {
        const loadSearchIndex = async () => {
            try {
                const response = await fetch('/index.json')
                if (response.ok) {
                    const data = await response.json()

                    const ms = new MiniSearch({
                        fields: ["title", "content"],
                        storeFields: ['id', 'title', 'content', 'type'], // Store all required fields
                    });
                    ms.addAll(data)
                    setMiniSearch(ms)
                }
            } catch (error) {
                console.error('Failed to load search index:', error)
            }
        }
        loadSearchIndex()
    }, [])

    // Execute search
    React.useEffect(() => {
        if (miniSearch && query.trim()) {
            const results = miniSearch.search(query, {
                prefix: true,
                fuzzy: 0.2
            }).slice(0, 10)

            // Ensure results contain required fields and add type information
            const formattedResults = results.map(result => {
                const id = result.id as string
                const title = (result.title as string) || id
                const type = result.type as string
                const content = (result.content as string) || ''

                return {
                    id,
                    title,
                    score: result.score,
                    type,
                    content
                }
            })

            setSearchResults(formattedResults)
        } else {
            setSearchResults([])
        }
    }, [miniSearch, query])

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

    // Generate link based on type and id
    const generateHref = (type: string, id: string) => {
        return `/${type}/${id}/`
    }

    // Get type display name
    const getTypeDisplayName = (type: string) => {
        switch (type) {
            case 'blog':
                return 'Blog'
            case 'docs':
                return 'Document'
            default:
                return type
        }
    }

    const highlightSearchTerms = (text: string, searchQuery: string) => {
        if (!searchQuery.trim()) return text

        const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
        const parts = text.split(regex)

        return parts.map((part, index) => {
            if (regex.test(part)) {
                return (
                    <mark key={index} className="bg-yellow-700 text-white px-1 rounded">
                        {part}
                    </mark>
                )
            }
            return part
        })
    }

    // Function to get content excerpt with highlighted search terms
    const getContentExcerpt = (content: string, searchQuery: string, maxLength: number = 100) => {
        if (!content) return ''

        // Find the position of the search term in content
        const lowerContent = content.toLowerCase()
        const lowerQuery = searchQuery.toLowerCase()
        const matchIndex = lowerContent.indexOf(lowerQuery)

        if (matchIndex === -1) {
            // If no direct match, return beginning of content
            return content.length > maxLength ? content.substring(0, maxLength) + '...' : content
        }

        // Calculate excerpt boundaries around the match
        const start = Math.max(0, matchIndex - 30)
        const end = Math.min(content.length, matchIndex + searchQuery.length + 30)

        let excerpt = content.substring(start, end)

        // Add ellipsis if needed
        if (start > 0) excerpt = '...' + excerpt
        if (end < content.length) excerpt = excerpt + '...'

        return excerpt
    }

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
                                <kbd className="kbd">⌘K</kbd> or <kbd className="kbd">Ctrl+K</kbd> to open command
                                dialog
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </p>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Search content..."
                    onValueChange={setQuery}
                    value={query}
                />
                <CommandList>
                    {/* Search results */}
                    {query && searchResults.length > 0 && (
                        <CommandGroup heading="Search Results">
                            {searchResults.map((result, index) => (
                                <CommandItem
                                    key={`${result.id}-${index}`}
                                    value={`${result.title} ${result.type} ${result.id}`}
                                    onSelect={() => {
                                        setOpen(false)
                                        window.location.href = generateHref(result.type, result.id)
                                    }}
                                >
                                    <FileText className="size-4 opacity-60"/>
                                    <div className="flex flex-col ml-2 w-full">
                                        <div className="flex justify-between w-full">
                                            <span>{result.title}</span>
                                            <span className="text-muted-foreground">{getTypeDisplayName(result.type)}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                             {highlightSearchTerms(getContentExcerpt(result.content, query), query)}
                                        </span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    {/* No search results - using fixed value to avoid dynamic change issues */}
                    {query && miniSearch && searchResults.length === 0 && (
                        <CommandGroup heading="Search Results">
                            <CommandItem disabled value="no-results-found">
                                <Search className="size-4 opacity-40"/>
                                <span className="ml-2 opacity-60">No content found containing "{query}"</span>
                            </CommandItem>
                        </CommandGroup>
                    )}

                    {/* Tips */}
                    {!query && (
                        <CommandGroup heading="Tips">
                            <CommandItem disabled value="search tip help">
                                <Search className="size-4 opacity-40"/>
                                <span className="ml-2 opacity-60">Enter keywords to search blog and documentation content</span>
                            </CommandItem>
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}
