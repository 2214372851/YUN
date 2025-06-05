type Announcement = {
    content: string
    link: string
    createdAt: Date
}

const announcements:  Announcement[] = [
    {
        content: "🎉 Yun Music MCP Officially Launched 🎉",
        link: "/blog/yun-music",
        createdAt: new Date("2025-6-5")
    }
]

export const getAnnouncement = () => {
    return announcements[0]
}