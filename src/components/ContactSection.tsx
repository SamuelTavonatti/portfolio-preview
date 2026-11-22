import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  FileDown,
  Mail,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CONTACT_INFO, UI_COPY } from '../data/content';
import type {
  ContactFormErrors,
  ContactFormState,
  LegalTab,
} from '../types/portfolio';
import { downloadExecutiveCvPdf } from '../utils/cvPdf';
import { ScrollReveal } from './ScrollReveal';

interface ContactSectionProps {
  onOpenLegal: (tab: LegalTab) => void;
}

const MAX_NAME = 80;
const MAX_EMAIL = 120;
const MAX_SUBJECT = 120;
const MAX_MESSAGE = 1500;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function stripCrlf(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function sanitizeMessage(value: string): string {
  return value.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
}

const INITIAL_FORM: ContactFormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
  privacyAccepted: false,
};

export function ContactSection({ onOpenLegal }: ContactSectionProps) {
  const { locale } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preparedPayload, setPreparedPayload] = useState<{
    mailtoHref: string;
    plainText: string;
  } | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [cvDownloaded, setCvDownloaded] = useState(false);

  const handleDownloadCv = () => {
    downloadExecutiveCvPdf(locale);
    setCvDownloaded(true);
    window.setTimeout(() => setCvDownloaded(false), 2600);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_INFO.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2400);
    } catch {
      const input = document.createElement('input');
      input.value = CONTACT_INFO.email;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2400);
    }
  };

  const validate = (state: ContactFormState): ContactFormErrors => {
    const nextErrors: ContactFormErrors = {};
    const t = UI_COPY.contact.form.errors;

    const cleanName = stripCrlf(state.name);
    const cleanEmail = stripCrlf(state.email);
    const cleanSubject = stripCrlf(state.subject);
    const cleanMessage = sanitizeMessage(state.message);

    if (!cleanName) {
      nextErrors.name = t.nameRequired[locale];
    } else if (cleanName.length > MAX_NAME) {
      nextErrors.name = t.nameTooLong[locale];
    }

    if (!cleanEmail) {
      nextErrors.email = t.emailRequired[locale];
    } else if (cleanEmail.length > MAX_EMAIL) {
      nextErrors.email = t.emailTooLong[locale];
    } else if (!EMAIL_PATTERN.test(cleanEmail)) {
      nextErrors.email = t.emailInvalid[locale];
    }

    if (!cleanSubject) {
      nextErrors.subject = t.subjectRequired[locale];
    } else if (cleanSubject.length > MAX_SUBJECT) {
      nextErrors.subject = t.subjectTooLong[locale];
    }

    if (cleanMessage.length < 12) {
      nextErrors.message = t.messageRequired[locale];
    } else if (cleanMessage.length > MAX_MESSAGE) {
      nextErrors.message = t.messageTooLong[locale];
    }

    if (!state.privacyAccepted) {
      nextErrors.privacyAccepted = t.privacyRequired[locale];
    }

    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    const safeName = stripCrlf(form.name);
    const safeEmail = stripCrlf(form.email);
    const safeSubject = stripCrlf(form.subject);
    const safeMessage = sanitizeMessage(form.message);

    const bodyLines = [
      `${locale === 'it' ? 'Da' : 'From'}: ${safeName} <${safeEmail}>`,
      '',
      safeMessage,
    ].join('\n');

    const mailtoHref = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(
      safeSubject
    )}&body=${encodeURIComponent(bodyLines)}`;

    const plainText = [
      `To: ${CONTACT_INFO.email}`,
      `Subject: ${safeSubject}`,
      `From: ${safeName} (${safeEmail})`,
      '',
      safeMessage,
    ].join('\n');

    window.setTimeout(() => {
      setIsSubmitting(false);
      setPreparedPayload({ mailtoHref, plainText });
    }, 280);
  };

  const handleCopyPayload = async () => {
    if (!preparedPayload) return;
    try {
      await navigator.clipboard.writeText(preparedPayload.plainText);
      setCopiedPayload(true);
      window.setTimeout(() => setCopiedPayload(false), 2400);
    } catch {
      setCopiedPayload(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setPreparedPayload(null);
    setCopiedPayload(false);
  };

  const f = UI_COPY.contact.form;

  return (
    <section
      id="contatti"
      aria-labelledby="contact-heading"
      className="relative z-10 scroll-mt-20 border-t border-white/[0.08] bg-[#0B0A09] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Editorial Column */}
          <ScrollReveal duration={0.85} className="lg:col-span-5">
            <div className="flex flex-col justify-between gap-10">
              <div className="space-y-4">
                <p className="font-mono-num text-[11px] font-medium uppercase tracking-[0.2em] text-[#D0A243]">
                  04 — {locale === 'it' ? 'Contatti' : 'Contact'}
                </p>
                <h2
                  id="contact-heading"
                  className="font-display text-4xl font-medium tracking-[-0.03em] text-[#EBE4D4] sm:text-5xl"
                >
                  {UI_COPY.contact.heading[locale]}
                </h2>
                <p className="max-w-[38ch] text-sm leading-relaxed text-[#BDB6AD] sm:text-base">
                  {locale === 'it'
                    ? 'Disponibile per collaborazioni selettive e ruoli UX/UI & Front-End a Trento o da remoto.'
                    : 'Available for selective collaborations and UX/UI & Front-End roles in Trento or remote.'}
                </p>
              </div>

              {/* Direct Email Row with Subtle Copy Action */}
              <div className="space-y-2.5 border-t border-white/[0.08] pt-6">
                <p className="font-mono-num text-[10.5px] uppercase tracking-[0.16em] text-[#867F70]">
                  {UI_COPY.contact.directEmailLabel[locale]}
                </p>
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.10] pb-3">
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="min-w-0 truncate font-mono-num text-xs text-[#EBE4D4] transition-colors hover:text-[#D0A243] sm:text-sm"
                  >
                    {CONTACT_INFO.email}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 font-mono-num text-[11px] uppercase tracking-[0.12em] text-[#BDB6AD] transition-colors duration-200 hover:text-[#D0A243] whitespace-nowrap"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#97A78C]" aria-hidden="true" />
                        <span className="text-[#97A78C]">
                          {locale === 'it' ? 'Copiata' : 'Copied'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{locale === 'it' ? 'Copia' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
                <span className="sr-only" role="status" aria-live="polite">
                  {copiedEmail ? UI_COPY.contact.copiedEmail[locale] : ''}
                </span>
              </div>

              {/* CV Download & Understated Social Links */}
              <div className="space-y-6">
                <div>
                  <button
                    type="button"
                    onClick={handleDownloadCv}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#D0A243]/50 bg-transparent px-5 font-display text-xs font-medium text-[#EBE4D4] transition-colors duration-200 hover:border-[#D0A243] hover:bg-[#D0A243]/10 hover:text-[#D0A243] whitespace-nowrap sm:text-sm"
                  >
                    {cvDownloaded ? (
                      <>
                        <Check className="h-4 w-4 text-[#97A78C]" aria-hidden="true" />
                        <span className="text-[#97A78C]">{locale === 'it' ? 'CV scaricato' : 'CV downloaded'}</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="h-4 w-4 text-[#D0A243]" aria-hidden="true" />
                        <span>
                          {locale === 'it' ? 'Scarica CV (PDF)' : 'Download CV (PDF)'}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.08] pt-6">
                  {[
                    { label: 'LinkedIn', href: CONTACT_INFO.linkedin },
                    { label: 'GitHub', href: CONTACT_INFO.github },
                    { label: 'Instagram', href: CONTACT_INFO.instagram },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-[38px] items-center gap-1 font-display text-xs font-medium text-[#BDB6AD] transition-colors duration-200 hover:text-[#EBE4D4] sm:text-sm"
                    >
                      <span>{social.label}</span>
                      <ArrowUpRight
                        className="h-3.5 w-3.5 text-[#867F70] transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#D0A243]"
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </div>

                <p className="font-mono-num text-[11px] leading-relaxed text-[#867F70]">
                  {locale === 'it'
                    ? 'Zero cookie di profilazione · Privacy GDPR-first.'
                    : 'Zero tracking cookies · GDPR-first privacy.'}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Architectural Form Surface (Zero Sci-Fi Telemetry Headers) */}
          <ScrollReveal delay={0.1} duration={0.85} className="lg:col-span-7">
            <div className="rounded-lg border border-white/[0.08] bg-[#131210] p-7 sm:p-9">
              {preparedPayload ? (
                <div className="space-y-6 py-2" role="status" aria-live="polite">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#D0A243]/40 bg-[#D0A243]/10 text-[#D0A243]">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-xl font-medium text-[#EBE4D4]">
                      {f.successTitle[locale]}
                    </h3>
                  </div>

                  <p className="text-sm leading-relaxed text-[#BDB6AD]">
                    {f.successBody[locale]}
                  </p>

                  <pre className="overflow-x-auto whitespace-pre-wrap rounded-md border border-white/[0.08] bg-[#0B0A09] p-4 font-mono-num text-xs leading-relaxed text-[#BDB6AD]">
                    {preparedPayload.plainText}
                  </pre>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={preparedPayload.mailtoHref}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#D0A243] px-5 font-display text-sm font-semibold text-[#0B0A09] transition-colors hover:bg-[#DEB252] whitespace-nowrap shadow-[0_4px_16px_rgba(208,162,67,0.2)]"
                    >
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      <span>{f.openMailClient[locale]}</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyPayload}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-white/[0.12] bg-[#0B0A09] px-4 font-display text-sm font-medium text-[#EBE4D4] transition-colors hover:border-[#D0A243]/60 hover:text-[#D0A243] whitespace-nowrap"
                    >
                      {copiedPayload ? (
                        <>
                          <Check className="h-4 w-4 text-[#97A78C]" aria-hidden="true" />
                          <span className="text-[#97A78C]">{f.copiedFormatted[locale]}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 text-[#BDB6AD]" aria-hidden="true" />
                          <span>{f.copyFormatted[locale]}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex min-h-[44px] items-center px-3 font-display text-sm font-medium text-[#BDB6AD] transition-colors hover:text-[#EBE4D4]"
                    >
                      {f.resetForm[locale]}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Name */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <label
                          htmlFor="contact-name"
                          className="text-xs font-medium text-[#BDB6AD]"
                        >
                          {f.nameLabel[locale]}
                        </label>
                        <span className="font-mono-num text-[11px] text-[#867F70]">
                          {form.name.length}/{MAX_NAME}
                        </span>
                      </div>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        maxLength={MAX_NAME}
                        required
                        value={form.name}
                        onChange={(e) => {
                          setForm((prev) => ({
                            ...prev,
                            name: e.target.value.replace(/[\r\n]/g, ''),
                          }));
                          if (errors.name) {
                            setErrors((prev) => ({ ...prev, name: undefined }));
                          }
                        }}
                        placeholder={f.namePlaceholder[locale]}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'contact-name-error' : undefined}
                        className={`mt-2 min-h-[46px] w-full rounded-md border bg-[#0B0A09] px-3.5 text-sm text-[#EBE4D4] placeholder:text-[#867F70] transition-colors ${
                          errors.name
                            ? 'border-[#E07A7A]'
                            : 'border-white/[0.10] focus:border-[#D0A243]'
                        }`}
                      />
                      {errors.name ? (
                        <p
                          id="contact-name-error"
                          className="mt-1.5 flex items-center gap-1.5 text-xs text-[#E07A7A]"
                        >
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span>{errors.name}</span>
                        </p>
                      ) : null}
                    </div>

                    {/* Email */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <label
                          htmlFor="contact-email"
                          className="text-xs font-medium text-[#BDB6AD]"
                        >
                          {f.emailLabel[locale]}
                        </label>
                        <span className="font-mono-num text-[11px] text-[#867F70]">
                          {form.email.length}/{MAX_EMAIL}
                        </span>
                      </div>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        maxLength={MAX_EMAIL}
                        required
                        value={form.email}
                        onChange={(e) => {
                          setForm((prev) => ({
                            ...prev,
                            email: e.target.value.replace(/[\r\n]/g, ''),
                          }));
                          if (errors.email) {
                            setErrors((prev) => ({ ...prev, email: undefined }));
                          }
                        }}
                        placeholder={f.emailPlaceholder[locale]}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'contact-email-error' : undefined}
                        className={`mt-2 min-h-[46px] w-full rounded-md border bg-[#0B0A09] px-3.5 text-sm text-[#EBE4D4] placeholder:text-[#867F70] transition-colors ${
                          errors.email
                            ? 'border-[#E07A7A]'
                            : 'border-white/[0.10] focus:border-[#D0A243]'
                        }`}
                      />
                      {errors.email ? (
                        <p
                          id="contact-email-error"
                          className="mt-1.5 flex items-center gap-1.5 text-xs text-[#E07A7A]"
                        >
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span>{errors.email}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <label
                        htmlFor="contact-subject"
                        className="text-xs font-medium text-[#BDB6AD]"
                      >
                        {f.subjectLabel[locale]}
                      </label>
                      <span className="font-mono-num text-[11px] text-[#867F70]">
                        {form.subject.length}/{MAX_SUBJECT}
                      </span>
                    </div>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      maxLength={MAX_SUBJECT}
                      required
                      value={form.subject}
                      onChange={(e) => {
                        setForm((prev) => ({
                          ...prev,
                          subject: e.target.value.replace(/[\r\n]/g, ''),
                        }));
                        if (errors.subject) {
                          setErrors((prev) => ({ ...prev, subject: undefined }));
                        }
                      }}
                      placeholder={f.subjectPlaceholder[locale]}
                      aria-invalid={Boolean(errors.subject)}
                      aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                      className={`mt-2 min-h-[46px] w-full rounded-md border bg-[#0B0A09] px-3.5 text-sm text-[#EBE4D4] placeholder:text-[#867F70] transition-colors ${
                        errors.subject
                          ? 'border-[#E07A7A]'
                          : 'border-white/[0.10] focus:border-[#D0A243]'
                      }`}
                    />
                    {errors.subject ? (
                      <p
                        id="contact-subject-error"
                        className="mt-1.5 flex items-center gap-1.5 text-xs text-[#E07A7A]"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.subject}</span>
                      </p>
                    ) : null}
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <label
                        htmlFor="contact-message"
                        className="text-xs font-medium text-[#BDB6AD]"
                      >
                        {f.messageLabel[locale]}
                      </label>
                      <span className="font-mono-num text-[11px] text-[#867F70]">
                        {form.message.length}/{MAX_MESSAGE}
                      </span>
                    </div>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      maxLength={MAX_MESSAGE}
                      required
                      value={form.message}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, message: e.target.value }));
                        if (errors.message) {
                          setErrors((prev) => ({ ...prev, message: undefined }));
                        }
                      }}
                      placeholder={f.messagePlaceholder[locale]}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      className={`mt-2 w-full rounded-md border bg-[#0B0A09] px-3.5 py-3 text-sm leading-relaxed text-[#EBE4D4] placeholder:text-[#867F70] transition-colors ${
                        errors.message
                          ? 'border-[#E07A7A]'
                          : 'border-white/[0.10] focus:border-[#D0A243]'
                      }`}
                    />
                    {errors.message ? (
                      <p
                        id="contact-message-error"
                        className="mt-1.5 flex items-center gap-1.5 text-xs text-[#E07A7A]"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.message}</span>
                      </p>
                    ) : null}
                  </div>

                  {/* Unchecked-by-default GDPR Privacy Checkbox */}
                  <div className="pt-1">
                    <div className="flex items-start gap-3">
                      <input
                        id="contact-privacy"
                        name="privacyAccepted"
                        type="checkbox"
                        checked={form.privacyAccepted}
                        onChange={(e) => {
                          setForm((prev) => ({
                            ...prev,
                            privacyAccepted: e.target.checked,
                          }));
                          if (errors.privacyAccepted) {
                            setErrors((prev) => ({
                              ...prev,
                              privacyAccepted: undefined,
                            }));
                          }
                        }}
                        aria-invalid={Boolean(errors.privacyAccepted)}
                        aria-describedby={
                          errors.privacyAccepted ? 'contact-privacy-error' : undefined
                        }
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-white/25 bg-[#0B0A09] accent-[#D0A243]"
                      />
                      <label
                        htmlFor="contact-privacy"
                        className="text-xs leading-relaxed text-[#BDB6AD]"
                      >
                        {f.privacyPrefix[locale]}
                        <button
                          type="button"
                          onClick={() => onOpenLegal('privacy')}
                          className="font-medium text-[#D0A243] underline underline-offset-4 hover:text-[#EBE4D4]"
                        >
                          {f.privacyLink[locale]}
                        </button>
                        {f.privacySuffix[locale]}
                      </label>
                    </div>
                    {errors.privacyAccepted ? (
                      <p
                        id="contact-privacy-error"
                        className="mt-2 flex items-center gap-1.5 text-xs text-[#E07A7A]"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.privacyAccepted}</span>
                      </p>
                    ) : null}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group inline-flex min-h-[46px] w-full items-center justify-center gap-2.5 rounded-md bg-[#D0A243] px-6 font-display text-sm font-semibold text-[#0B0A09] transition-colors duration-200 hover:bg-[#DEB252] disabled:opacity-60 sm:w-auto shadow-[0_4px_16px_rgba(208,162,67,0.2)]"
                    >
                      <span>
                        {isSubmitting
                          ? f.submitting[locale]
                          : locale === 'it'
                            ? 'Invia messaggio'
                            : 'Send message'}
                      </span>
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
