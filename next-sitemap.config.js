const baseUrl = 'https://bybxbwg.fun';

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
    exclude: ['/test', '/share'],
    additionalSitemaps: [
        `${baseUrl}/sitemap-0.xml`
    ]
};
