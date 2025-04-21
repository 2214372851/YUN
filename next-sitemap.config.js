/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: 'https://bybxbwg.fun',
    generateRobotsTxt: true,
    outDir: './out',
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: ['/blog', '/docs'],
                disallow: '/', // 先 disallow 所有路径
            },
        ],
    },
}