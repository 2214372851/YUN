module.exports = {
    extends: 'next/core-web-vitals',
    rules: {
        // 关闭 Next.js 针对 <Image> 的警告
        '@next/next/no-img-element': 'off'
    }
}