// src/app/media/page.tsx
"use client";

import React from 'react';
import {getAllMediaItems} from '@/data/media';
import type {MediaItem} from '@/types/media';
import Image from 'next/image'
import TransitionLink from "@/components/TransitionLink";

interface MediaCardProps {
    item: MediaItem;
}

function MediaCard({item}: MediaCardProps) {
    const {title, imageUrl, author} = item;

    const cardContent = (
        <div
            className="block rounded-lg border border-white/5 bg-card hover:bg-[hsl(var(--linear-gray))/0.1] group-hover:border-white/20 transition-colors overflow-hidden p-1 h-full w-full">
            <div
                className="aspect-square rounded-md overflow-hidden flex items-center justify-center mb-4 bg-[hsl(var(--linear-gray))/0.1]">
                <Image
                    src={imageUrl}
                    alt={title}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"/>
            </div>
            <div className="p-4">
                <div className="text-sm text-muted-foreground mb-2">{author}</div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
            </div>
        </div>
    );

    return (
        <TransitionLink href={`/media/${item.id}`} className="h-full group">
            {cardContent}
        </TransitionLink>
    );
}

const MediaPage = () => {
    const musicItems = getAllMediaItems();

    return (
        <main className="min-h-screen flex flex-col">
            <div className="flex-1 pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 container max-w-7xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 px-2 sm:px-0">音乐</h1>

                <div
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 justify-items-center px-2 sm:px-0">
                    {musicItems.length > 0 ? (
                        musicItems.map((item) => (
                            <div className="h-full w-full" key={item.id}>
                                <MediaCard item={item}/>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-muted-foreground">暂无音乐内容。</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default MediaPage;
