/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: 'https://bybxbwg.fun',
    generateRobotsTxt: true,
    outDir: './out',
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