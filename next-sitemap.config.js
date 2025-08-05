const baseUrl = 'https://www.yhnotes.com';

/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: baseUrl,
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
    sitemapSize: 5000,
    changefreq: 'weekly',
    priority: 0.7,
    exclude: ['/test', '/test/*', '/share', '/share/*', '/docs', '/docs/*'],
};
