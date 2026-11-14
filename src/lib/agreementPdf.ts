import type { Agreement, CollabContent, Signature } from '@/content/collabModel';

/** Échappe le texte saisi avant de l'insérer dans le HTML du PDF */
const esc = (s: string) => s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);

/** N'accepte que des chemins de signature produits par le SignaturePad (M/L et nombres) */
const safePath = (d: string) => (/^[ML0-9.\s-]+$/.test(d) ? d : '');

function signatureBlock(role: string, s: Signature | undefined, dateFmt: (iso: string) => string, L: CollabContent) {
  if (!s) return `<div class="sig"><div class="role">${esc(role)}</div><div class="empty">${esc(L.pdf.notSigned)}</div></div>`;
  const paths = s.paths.map((d) => `<path d="${safePath(d)}" stroke="#1B1D1B" stroke-width="2.5" fill="none" stroke-linecap="round"/>`).join('');
  return `<div class="sig">
    <div class="role">${esc(role)}</div>
    <svg viewBox="0 0 360 150" width="100%" height="110">${paths}</svg>
    <div class="who">${esc(s.name)} — ${esc(dateFmt(s.at))}</div>
    <div class="mention">${esc(L.pdf.mention)}</div>
  </div>`;
}

/** HTML de l'accord pour expo-print (mise en page sobre, imprimable). */
export function agreementHtml(a: Agreement, dateFmt: (iso: string) => string, L: CollabContent): string {
  const sections = L.agreementSections(a)
    .map((s) => `<h2>${esc(s.title)}</h2><p>${esc(s.body).replace(/\n/g, '<br/>')}</p>`)
    .join('');
  return `<!DOCTYPE html><html lang="${L.pdf.lang}"><head><meta charset="utf-8"/>
  <style>
    @page { margin: 18mm 16mm; }
    body { font-family: Georgia, 'Times New Roman', serif; color: #1B1D1B; font-size: 11.5pt; line-height: 1.5; }
    h1 { font-size: 22pt; margin: 0 0 2mm; }
    .kicker { font-family: Helvetica, Arial, sans-serif; font-size: 8pt; letter-spacing: 2px; color: #3B5249; }
    h2 { font-family: Helvetica, Arial, sans-serif; font-size: 10pt; text-transform: uppercase; letter-spacing: 1px; color: #3B5249; margin: 6mm 0 1mm; }
    p { margin: 0; }
    .sigs { display: flex; gap: 8mm; margin-top: 8mm; }
    .sig { flex: 1; border: 1px solid #DCDCD5; border-radius: 6px; padding: 4mm; }
    .role { font-family: Helvetica, Arial, sans-serif; font-size: 8pt; letter-spacing: 1px; text-transform: uppercase; color: #5D615D; }
    .who { font-size: 10pt; }
    .mention { font-size: 8.5pt; color: #5D615D; font-style: italic; }
    .empty { color: #A6432B; padding: 8mm 0; }
    .disclaimer { margin-top: 8mm; font-size: 8pt; color: #5D615D; border-top: 1px solid #DCDCD5; padding-top: 3mm; }
  </style></head><body>
  <div class="kicker">${esc(L.pdf.kicker)}</div>
  <h1>${esc(L.pdf.title)}</h1>
  <div class="kicker">${esc(L.pdf.created(dateFmt(a.createdAt), a.id))}</div>
  ${sections}
  <div class="sigs">
    ${signatureBlock(L.pdf.photographer, a.signatures.photographer, dateFmt, L)}
    ${signatureBlock(L.pdf.model, a.signatures.model, dateFmt, L)}
  </div>
  <div class="disclaimer">${esc(L.disclaimer)}</div>
  </body></html>`;
}
