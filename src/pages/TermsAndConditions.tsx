import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  Shield,
  AlertTriangle,
  FileText,
  Eye,
  Lock,
  Gavel,
  Globe,
  Ban,
  CreditCard,
  UserX,
  Server,
  Copyright,
  Scale,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Skull
} from 'lucide-react';

interface TermsAndConditionsProps {
  role?: 'student' | 'teacher';
}

const sections = [
  {
    id: 'acceptance',
    icon: Gavel,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    title: '1. Acceptance of Terms',
    content: `By accessing, registering, or using this Learning Management System ("Platform"), you unconditionally agree to be legally bound by these Terms and Conditions. IF YOU DO NOT AGREE TO EVERY PROVISION OF THESE TERMS, YOUR SOLE AND EXCLUSIVE REMEDY IS TO IMMEDIATELY CEASE ALL USE OF THE PLATFORM.

These Terms constitute a legally binding agreement between you and the Platform operators. Violation of any section may result in immediate account suspension, permanent termination, legal action, or all of the above without prior notice. This agreement is effective from the moment of your first access.`,
  },
  {
    id: 'eligibility',
    icon: UserX,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    title: '2. Eligibility & Registration',
    content: `You must be at least 18 years of age or the legal age of majority in your jurisdiction to use this Platform. By using this Platform you represent and warrant that:

• You are legally capable of entering into binding contracts
• You have not been suspended or removed from the Platform previously
• Your registration information is truthful, accurate, and complete
• You will maintain the accuracy of your account information at all times

The Platform reserves the absolute right to refuse service, terminate accounts, or cancel course enrollments at its sole discretion, without obligation to provide any explanation or compensation.`,
  },
  {
    id: 'conduct',
    icon: Ban,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    title: '3. Prohibited Conduct',
    content: `You are STRICTLY PROHIBITED from engaging in any of the following activities. Violations will result in immediate and permanent account termination and may be reported to law enforcement:

• Recording, reproducing, distributing, or sharing any course content without explicit written permission
• Attempting to bypass, hack, or undermine any security mechanism of the Platform
• Sharing account credentials with any third party for any purpose whatsoever
• Using automated tools, bots, scrapers, or scripts to access Platform content
• Harassing, defaming, or threatening instructors, students, or Platform staff
• Uploading malicious code, viruses, or any content that may harm the Platform
• Misrepresenting your identity, qualifications, or affiliation
• Engaging in fraudulent payment activities or chargebacks without valid cause
• Reverse engineering or attempting to extract source code of the Platform
• Using Platform content for competitive intelligence or commercial exploitation`,
  },
  {
    id: 'intellectual',
    icon: Copyright,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    title: '4. Intellectual Property',
    content: `ALL content on this Platform — including but not limited to course videos, lecture materials, assessments, certificates, code samples, graphics, text, and software — is protected by international intellectual property laws and conventions.

For Instructors: By uploading content to this Platform, you grant the Platform a worldwide, royalty-free, non-exclusive, perpetual license to host, display, reproduce, and distribute your content for the purposes of operating the Platform.

For Students: Your enrollment grants you a limited, personal, non-transferable, non-sublicensable license to access course materials for personal educational purposes only. This license expires upon account termination or course expiration.

ANY unauthorized reproduction or distribution of Platform content constitutes copyright infringement and may result in civil liability or criminal prosecution.`,
  },
  {
    id: 'payments',
    icon: CreditCard,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    title: '5. Payments, Refunds & Billing',
    content: `All purchases made on this Platform are subject to the following strict policies:

• ALL SALES ARE FINAL unless a refund is explicitly approved under our Refund Policy
• Refund requests must be submitted within 7 days of purchase and are subject to review
• Fraudulent chargebacks or disputes will result in immediate account suspension and may be referred to payment processors for fraud reporting
• Course prices may change at any time without prior notice
• Promotional prices apply only during the specified promotional period
• Currency conversion fees are the sole responsibility of the purchaser
• Instructor payouts are processed according to the Platform's internal payout schedule and may be withheld pending fraud investigations`,
  },
  {
    id: 'privacy',
    icon: Eye,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    title: '6. Privacy & Data Collection',
    content: `By using this Platform, you explicitly consent to the collection, processing, and storage of your personal data in accordance with our Privacy Policy. This includes:

• Personal identification information (name, email, date of birth)
• Learning activity, course progress, and engagement metrics
• Payment and billing information processed via secure third-party providers
• Device information, IP addresses, and browser fingerprints
• Communications made through the Platform
• Behavioral analytics and usage patterns

Data may be shared with third-party service providers strictly for operational purposes. The Platform implements industry-standard security measures but CANNOT guarantee absolute security of your data.`,
  },
  {
    id: 'termination',
    icon: Skull,
    color: 'text-red-600',
    bg: 'bg-red-600/10',
    border: 'border-red-600/20',
    title: '7. Account Termination',
    content: `The Platform reserves the ABSOLUTE AND UNCONDITIONAL RIGHT to suspend or permanently terminate your account for any reason, including but not limited to:

• Any violation of these Terms and Conditions
• Suspected fraudulent, abusive, or illegal activity
• Extended periods of inactivity (greater than 12 months)
• Non-payment of applicable fees
• Conduct deemed harmful to the Platform, its users, or its reputation
• Court order or regulatory requirement

Upon termination: Access to all course materials is IMMEDIATELY revoked. No refunds will be issued for prepaid subscriptions or course purchases. All data may be permanently deleted. The Platform bears no liability for any loss of data or access resulting from termination.`,
  },
  {
    id: 'liability',
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    title: '8. Limitation of Liability',
    content: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE PLATFORM AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY:

• Indirect, incidental, special, consequential, or punitive damages
• Loss of profits, data, goodwill, or business opportunities
• Damages resulting from unauthorized access to your account
• Technical failures, service interruptions, or data loss
• Inaccuracies in course content or instructor qualifications
• Third-party conduct or services linked through the Platform

IN NO EVENT SHALL THE PLATFORM'S TOTAL LIABILITY TO YOU EXCEED THE AMOUNTS PAID BY YOU TO THE PLATFORM IN THE 3 MONTHS PRECEDING THE CLAIM.`,
  },
  {
    id: 'security',
    icon: Lock,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    title: '9. Security Obligations',
    content: `You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must:

• Use a strong, unique password and never share it with anyone
• Enable multi-factor authentication if available
• Immediately notify the Platform of any unauthorized access or security breach
• Log out from shared or public devices after each session
• Not access the Platform through unsecured or public networks without a VPN

The Platform is not responsible for any damages arising from your failure to comply with these security obligations. Security breaches resulting from your negligence are entirely your liability.`,
  },
  {
    id: 'server',
    icon: Server,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    title: '10. Service Availability',
    content: `The Platform does not guarantee uninterrupted, error-free, or permanently available service. The Platform reserves the right to:

• Suspend the service for maintenance without prior notice
• Permanently discontinue the Platform or any of its features at any time
• Modify, restrict, or remove course content without notice
• Change Platform features and functionality unilaterally

No compensation or refund will be issued for service downtime, content removal, or feature deprecation. Your continued use of the Platform following any changes constitutes acceptance of those changes.`,
  },
  {
    id: 'governing',
    icon: Scale,
    color: 'text-slate-500',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    title: '11. Governing Law & Disputes',
    content: `These Terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction, without regard to conflict of law provisions.

Any dispute arising from these Terms or your use of the Platform shall be resolved exclusively through binding arbitration. You WAIVE YOUR RIGHT to participate in class action lawsuits against the Platform.

If arbitration is not permitted in your jurisdiction, you agree to submit to the exclusive jurisdiction of courts in the Platform's registered jurisdiction. The prevailing party in any dispute shall be entitled to recover reasonable attorney's fees.`,
  },
  {
    id: 'changes',
    icon: Globe,
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    title: '12. Modifications to Terms',
    content: `The Platform reserves the right to modify, update, or replace any portion of these Terms at any time with or without notice. Changes become effective immediately upon posting to the Platform.

Your continued use of the Platform after any modification constitutes your acceptance of the new Terms. If you do not agree to the modified Terms, you must immediately cease using the Platform.

It is YOUR RESPONSIBILITY to review these Terms periodically. Ignorance of changes does not exempt you from compliance.`,
  },
];

export default function TermsAndConditions({ role = 'student' }: TermsAndConditionsProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['acceptance']));
  const [agreed, setAgreed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const progress = scrollHeight > clientHeight ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 100;
      setScrollProgress(Math.min(100, progress));
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-section]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full h-full flex flex-col" ref={containerRef} style={{ overflowY: 'auto', maxHeight: '100%' }}>
      {/* Sticky progress bar */}
      <div className={`sticky top-0 z-20 h-0.5 ${isLight ? 'bg-slate-100' : 'bg-slate-900'}`}>
        <div
          className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-red-600 transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="w-full pb-16 space-y-0">
        {/* Hero Header */}
        <div className={`relative overflow-hidden px-6 py-12 md:px-10 ${
          isLight
            ? 'bg-gradient-to-br from-red-50 via-slate-50 to-orange-50'
            : 'bg-gradient-to-br from-red-950/30 via-[#0b0c10] to-orange-950/20'
        }`}>
          {/* Animated background blobs */}
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-red-600/5 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-orange-600/5 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-32 bg-red-500/3 blur-[80px] pointer-events-none" />

          {/* Dot grid decoration */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle, ${isLight ? '#000' : '#fff'} 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }} />

          <div className="relative z-10 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/30">
                  <Gavel className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <span className={`text-[9px] font-black uppercase tracking-[0.25em] block ${isLight ? 'text-red-600' : 'text-red-500'}`}>
                  Legal Agreement
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  {role === 'teacher' ? 'Instructor Platform' : 'Student Platform'} · LMS
                </span>
              </div>
            </div>

            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Terms &<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                Conditions
              </span>
            </h1>

            <p className={`text-sm font-semibold leading-relaxed max-w-2xl mb-6 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              This is a legally binding agreement. Read every section carefully.
              Non-compliance constitutes a breach of contract and may result in immediate account termination and legal action.
            </p>

            {/* Warning banner */}
            <div className={`inline-flex items-start gap-3 px-4 py-3 rounded-2xl border text-sm font-bold ${
              isLight ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-950/40 border-red-800/60 text-red-400'
            }`}>
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 animate-pulse" />
              <span>
                LAST UPDATED: July 22, 2026 &nbsp;|&nbsp; Effective immediately upon account creation &nbsp;|&nbsp; Violation = Termination
              </span>
            </div>
          </div>
        </div>

        {/* Quick Nav */}
        <div className={`border-b px-6 md:px-10 py-4 ${isLight ? 'bg-white border-slate-100' : 'bg-[#0f111a] border-slate-900'}`}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[9px] font-black uppercase tracking-wider mr-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Jump to:</span>
            {sections.slice(0, 6).map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setExpandedSections(prev => new Set([...prev, s.id]));
                }}
                className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all hover:scale-105 ${
                  isLight ? 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {s.title.split('. ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className={`px-6 md:px-10 py-6 space-y-3 ${isLight ? 'bg-slate-50' : 'bg-[#0b0c10]'}`}>
          {sections.map((section, idx) => {
            const isOpen = expandedSections.has(section.id);
            const Icon = section.icon;
            const isVisible = visibleSections.has(section.id);

            return (
              <div
                key={section.id}
                id={section.id}
                data-section
                className={`rounded-2xl border overflow-hidden transition-all duration-500 ${
                  isOpen ? 'shadow-lg' : ''
                } ${isLight ? `bg-white ${section.border}` : `bg-[#0f111a] ${section.border}`} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${idx * 30}ms` }}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all group ${
                    isOpen
                      ? isLight ? 'bg-gradient-to-r from-slate-50 to-white' : 'bg-gradient-to-r from-slate-900/80 to-[#0f111a]'
                      : isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-900/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${section.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-4.5 w-4.5 ${section.color}`} />
                    </div>
                    <div>
                      <span className={`text-[9px] font-black uppercase tracking-widest block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                        Section {idx + 1} of {sections.length}
                      </span>
                      <h3 className={`text-sm font-black leading-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
                        {section.title}
                      </h3>
                    </div>
                  </div>
                  <div className={`p-1.5 rounded-lg transition-all ${isOpen ? `${section.bg} ${section.color}` : isLight ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className={`px-5 pb-5 pt-1 border-t ${isLight ? 'border-slate-100' : 'border-slate-900/60'}`}>
                    <div className={`mt-4 p-4 rounded-xl border ${isLight ? `${section.bg} ${section.border}` : `${section.bg} ${section.border}`}`}>
                      <p className={`text-xs leading-relaxed font-medium whitespace-pre-line ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        {section.content}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Agreement Footer */}
        <div className={`px-6 md:px-10 pb-10 ${isLight ? 'bg-slate-50' : 'bg-[#0b0c10]'}`}>
          <div className={`rounded-3xl border p-6 md:p-8 relative overflow-hidden ${
            isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f111a] border-slate-800'
          }`}>
            {/* Background decoration */}
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${isLight ? 'bg-red-500/5' : 'bg-red-500/5'}`} />
            <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl pointer-events-none ${isLight ? 'bg-orange-500/5' : 'bg-orange-500/5'}`} />

            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Agreement Acknowledgment</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Legally Binding Declaration</p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-red-50 border-red-100' : 'bg-red-950/20 border-red-900/40'}`}>
                <p className={`text-xs font-semibold leading-relaxed ${isLight ? 'text-red-700' : 'text-red-400'}`}>
                  <strong>WARNING:</strong> By using this Platform, you have already acknowledged and agreed to all terms above. This document represents the entire agreement between you and the Platform. No verbal or informal agreements shall override or modify these Terms. These Terms supersede all prior agreements.
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                  agreed
                    ? 'bg-red-600 border-red-600'
                    : isLight ? 'border-slate-300 group-hover:border-red-500' : 'border-slate-700 group-hover:border-red-500'
                }`} onClick={() => setAgreed(!agreed)}>
                  {agreed && <span className="text-white text-[10px] font-black">✓</span>}
                </div>
                <input type="checkbox" className="sr-only" checked={agreed} onChange={() => setAgreed(!agreed)} />
                <span className={`text-xs font-semibold leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  I confirm that I have read, understood, and agree to be legally bound by these Terms and Conditions, Privacy Policy, and all applicable Platform policies. I acknowledge that violation of any term may result in immediate account termination and legal action.
                </span>
              </label>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  disabled={!agreed}
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                    agreed
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg shadow-red-500/20 hover:scale-[1.01]'
                      : isLight ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  I Accept These Terms & Conditions
                </button>
                <a
                  href="mailto:legal@lms.com"
                  className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-black border transition-all hover:scale-[1.01] ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Contact Legal Team
                </a>
              </div>

              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center pt-1">
                Last Updated: July 22, 2026 &nbsp;·&nbsp; Version 3.1.0 &nbsp;·&nbsp; © 2026 LMS Platform. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
