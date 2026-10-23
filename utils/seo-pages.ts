import type { SeoPage } from './seo';
import { SITE_SEO } from './seo';

const pages: Record<string, SeoPage> = {
  '/': {
    title: 'ritsu | 视觉设计、安全研究与编程笔记',
    description: SITE_SEO.description,
    type: 'website',
  },
  '/about': {
    title: '关于我',
    description: '了解 ritsu 的视觉设计、编程实践与安全研究兴趣，查看 Behance 作品、GitHub 项目和联系方式。',
    type: 'website',
  },
  '/des': {
    title: '视觉设计作品集',
    description: '浏览 ritsu 的视觉设计作品，以交互画廊查看作品细节、创作年份与项目信息，并访问完整设计项目。',
    type: 'website',
    section: '视觉设计',
  },
  '/book': {
    title: '书架与阅读笔记',
    description: 'ritsu 的个人书架，收录计算机技术、设计与文学等阅读和学习笔记，记录阅读进度与值得留下的知识。',
    type: 'website',
    section: '阅读与学习',
  },
  '/sec': {
    title: '安全研究与漏洞报告',
    description: 'ritsu 的独立安全研究档案，汇集漏洞分析、负责任披露记录与研究报告，按平台和时间浏览研究成果。',
    type: 'website',
    section: '安全研究',
  },
  '/plan': {
    title: '学习计划与项目进度',
    description: '查看 ritsu 的编程、安全研究、开源贡献与生活计划，跟踪各项目的目标、当前进度和阶段性记录。',
    type: 'website',
  },
  '/link': {
    title: '友情链接',
    description: 'ritsu 的友情链接，发现朋友们的个人网站、技术博客与创作空间，继续探索有趣的作品和记录。',
    type: 'website',
    section: '友情链接',
  },
  '/tools/color': {
    title: 'ARGB 与 HEX 颜色转换器',
    description: '在线转换 ARGB 与 HEX 十六进制颜色，查看 RGB 色值和 Alpha 透明度，并实时预览颜色与透明效果。',
    type: 'website',
  },
  '/tools/kcal': {
    title: '食物热量与能量计算器',
    description: '根据食物每 100 克的千焦能量和实际重量计算千卡热量，记录当日计算结果并汇总今日总能量。',
    type: 'website',
  },
  '/tools/money': {
    title: '资金分配与银行卡余额记录',
    description: '记录银行卡余额，按应急现金、稳定底仓与权益投资分配资金，整理产品收益明细并导出资金分配表。',
    type: 'website',
  },
  '/test/qc': {
    title: '二维码海报生成测试',
    description: 'ritsu 的二维码海报生成测试页面，将页面链接与图片合成为可下载的海报。',
    type: 'website',
    noindex: true,
  },
};

/** Resolve route defaults before an article supplies its own metadata. */
export function routeSeo(path: string): SeoPage {
  const normalizedPath = `/${path.split(/[?#]/, 1)[0].replace(/^\/+|\/+$/g, '')}`;
  const page = pages[normalizedPath];
  if (page) return { ...page };

  let slug = normalizedPath.split('/').filter(Boolean).at(-1) || SITE_SEO.name;
  try {
    slug = decodeURIComponent(slug);
  } catch {
    // Keep the readable path when a malformed escape reaches the fallback.
  }
  const title = slug.replace(/[-_]+/g, ' ').trim() || SITE_SEO.name;

  return {
    title,
    description: `${title}，收录于 ${SITE_SEO.name} 的个人网站，分享相关内容、学习笔记与实践记录。`,
    type: 'website',
    noindex: normalizedPath === '/test' || normalizedPath.startsWith('/test/'),
  };
}
