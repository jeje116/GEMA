import { useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageProvider';

interface MetaProps {
  title: string;
  description?: string;
  canonicalPath?: string;
}

export function useDocumentMeta({ title, description, canonicalPath }: MetaProps) {
  const { language } = useLanguage();

  useEffect(() => {
    // Set title
    const fullTitle = `${title} | GEMA Restaurant & Societiet`;
    document.title = fullTitle;

    // Set open graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    // Set description
    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', description);
      
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);
    }

    // Set canonical link
    if (canonicalPath) {
      let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      // Placeholder base URL for demo
      link.href = `https://gema-demo.com${canonicalPath}`;
    }

  }, [title, description, canonicalPath, language]); // re-run if language changes
}
