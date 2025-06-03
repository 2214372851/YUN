/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: 'https://bybxbwg.fun',
    generateRobotsTxt: true,
    outDir: './out',
    generateIndexSitemap: false,
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api',
                    '/tools',
                    '/media'
                ]
            },
        ],
    },
}