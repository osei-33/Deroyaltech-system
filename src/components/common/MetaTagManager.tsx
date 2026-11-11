import React, { useEffect } from 'react';
import { useSite } from '../../context/SiteContext.tsx';

interface PageMetadata {
  title: string;
  description: string;
  ogType?: string;
  keywords?: string;
}

const PAGE_METADATA_MAP: Record<string, PageMetadata> = {
  home: {
    title: 'Deroyal Technologies | Enterprise Infrastructure, Cloud & Hardware Engineering',
    description: "Ghana & West Africa's foremost IT infrastructure, custom engineering, and mission-critical cloud solutions partner. High-availability computing and optical networking.",
    keywords: 'enterprise IT, cloud architecture, hardware engineering, data centers, networking, Deroyal Technologies, Ghana IT solutions',
  },
  services: {
    title: 'Enterprise IT Solutions & Cloud Architecture | Deroyal Technologies',
    description: 'Explore end-to-end enterprise IT solutions: Hybrid Cloud Architectures, Edge Computing, DevSecOps automation, and certified hardware procurement.',
    keywords: 'cloud migration, edge computing, cybersecurity, infrastructure, SLA delivery, systems integration',
  },
  workflow: {
    title: 'Engineering Methodology & SLA Delivery Lifecycle | Deroyal Technologies',
    description: 'Our 4-phase agile engineering lifecycle ensuring 99.999% uptime, strict SLA guarantees, automated CI/CD pipelines, and enterprise security compliance.',
    keywords: 'engineering methodology, IT SLA, uptime guarantee, agile deployment, IT consulting',
  },
  projects: {
    title: 'Portfolio of Enterprise Deployments & Case Studies | Deroyal Technologies',
    description: 'Proven track record of high-availability data centers, government microservices, banking security frameworks, and industrial IoT clusters across West Africa.',
    keywords: 'case studies, enterprise portfolio, tech case studies, cloud deployments, client success',
  },
  hardware: {
    title: 'Enterprise Hardware Catalog & Instant Spec Quotations | Deroyal Technologies',
    description: 'Tier-1 enterprise servers, 100G optical networking gear, edge appliances, and precision workstations with certified OEM warranty and direct procurement.',
    keywords: 'servers, networking switches, workstations, enterprise hardware catalog, hardware procurement',
  },
  estimator: {
    title: 'Interactive Project Budget & Cloud Cost Estimator | Deroyal Technologies',
    description: 'Calculate your enterprise cloud migration, infrastructure procurement, and ongoing engineering retainers with instantaneous real-time cost projections.',
    keywords: 'cost calculator, project estimator, cloud budget, infrastructure pricing, quote generator',
  },
  tracker: {
    title: 'Live Project Milestone & Consultation Hub | Deroyal Technologies',
    description: 'Real-time deployment milestone tracker and enterprise architecture consultation booking portal with live audit trails and engineer dispatch.',
    keywords: 'track project, milestone tracking, client portal, architecture consultation, project status',
  },
  consultation: {
    title: 'Schedule Architecture Consultation | Deroyal Technologies',
    description: 'Schedule a high-impact architectural roadmap consultation with Deroyal principal systems engineers. Custom cloud scoping and SLA guarantees.',
    keywords: 'book consultation, technical architecture, IT audit, systems consultation',
  },
  knowledge: {
    title: 'Knowledge Base, Technical Documentation & Guides | Deroyal Technologies',
    description: 'Explore deep architectural documentation, whitepapers, troubleshooting protocols, and engineering runbooks authored by senior infrastructure specialists.',
    keywords: 'technical knowledge base, runbooks, documentation, IT whitepapers, tutorials',
  },
  verify: {
    title: 'Official Document & Letter Verification Registry | Deroyal Technologies',
    description: 'Cryptographically verify official Deroyal Technologies letters, proposals, contracts, MOUs, and corporate attestations using unique reference tokens.',
    keywords: 'verify letter, document verification, reference check, official correspondence, authenticity',
  },
  contact: {
    title: 'Contact Enterprise Engineering Team | Deroyal Technologies',
    description: 'Get in touch with Deroyal Technologies systems architects in Accra, Ghana. 24/7 mission-critical emergency dispatch and enterprise support.',
    keywords: 'contact IT support, Accra Ghana tech company, Deroyal office, support hotline',
  },
  inquiries: {
    title: 'Inquiries Management Console | Deroyal Technologies Admin',
    description: 'Authorized administrative inquiry and tender dispatch console for Deroyal Technologies management.',
    keywords: 'admin console, inquiries, client tenders',
  },
};

export const MetaTagManager: React.FC = () => {
  const { currentPage, config } = useSite();

  useEffect(() => {
    const meta = PAGE_METADATA_MAP[currentPage] || {
      title: `${config.letterhead?.companyName || 'Deroyal Technologies'} | Enterprise Technology Solutions`,
      description: config.letterhead?.tagline || config.heroSubtitle || 'Mission-critical enterprise cloud, infrastructure, and hardware engineering.',
      keywords: 'enterprise IT, infrastructure, cloud engineering',
    };

    // Update document.title
    document.title = meta.title;

    // Helper to update or create <meta> tags
    const updateMetaTag = (selector: string, attrName: string, attrValue: string, contentValue: string) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // Helper to update or create <link rel="...">
    const updateLinkTag = (rel: string, href: string) => {
      let link = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://deroyaltech.com';

    // Standard SEO Meta Tags
    updateMetaTag('meta[name="description"]', 'name', 'description', meta.description);
    if (meta.keywords) {
      updateMetaTag('meta[name="keywords"]', 'name', 'keywords', meta.keywords);
    }

    // Open Graph / Facebook Meta Tags
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.description);
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl);
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', meta.ogType || 'website');
    updateMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', config.letterhead?.companyName || 'Deroyal Technologies');

    // Twitter Card Meta Tags
    updateMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description);

    // Canonical Link
    updateLinkTag('canonical', currentUrl);

  }, [currentPage, config]);

  return null; // Headless component
};
