/**
 * "Collaborate with trust" area — English texts. Translation of the French version, which prevails.
 * ⚠️ Templates written with care, NOT legal advice. Have them reviewed by a lawyer.
 */

import { EDITOR_EN as EDITOR } from '@/config/editor';
import type { Agreement, CollabContent } from '@/content/collabModel';

const list = (items: string[]) => (items.length ? items.map((i) => `• ${i}`).join('\n') : '• (none)');

const projectTypes: CollabContent['projectTypes'] = {
  portrait: 'Portrait',
  mode: 'Fashion / styling',
  lingerie: 'Lingerie',
  nu: 'Artistic nude',
  autre: 'Other',
};

const allowances: CollabContent['allowances'] = {
  habille: 'Fully clothed',
  stylisme: 'Styled outfits',
  maillot: 'Swimwear',
  lingerie: 'Lingerie',
  implicite: 'Implied nude (nothing visible)',
  nu: 'Artistic nude',
};

const diffusions: CollabContent['diffusions'] = {
  book: 'Personal portfolio (website, PDF, print)',
  socialPhotographer: 'Photographer’s social media',
  socialModel: 'Model’s social media',
  contests: 'Photo contests (non-commercial)',
  exhibition: 'Non-commercial exhibition',
};

function agreementSections(a: Agreement) {
  const type = a.projectType === 'autre' ? a.projectOther || projectTypes.autre : projectTypes[a.projectType];
  return [
    {
      title: '1. The parties',
      body: `Photographer: ${a.photographer || '…'}\nModel: ${a.model || '…'}\nBoth parties solemnly declare that they are adults and act freely.`,
    },
    {
      title: '2. The project',
      body: `“${type}” shoot on ${a.date || '…'}, at: ${a.place || '…'}.\nThis is a free collaboration (TFP): no payment or financial compensation, on either side.`,
    },
    {
      title: '3. The limits',
      body: `Accepted outfits and level of exposure:\n${list(a.allowed.map((x) => allowances[x]))}\n\nSpecific limits: ${a.forbidden.trim() || 'none beyond the above.'}\n\nAnything not listed above is refused by default. Either party may stop the shoot at any time, without having to justify it.`,
    },
    {
      title: '4. Delivery',
      body: `The photographer delivers at least ${a.deliveryCount} edited photo(s) to the model within ${a.deliveryDays} day(s) after the shoot.`,
    },
    {
      title: '5. Allowed uses',
      body: `${list(a.diffusion.map((x) => diffusions[x]))}\n${a.credit ? 'Each publication credits the other party’s name or nickname.\n' : ''}\nStrictly forbidden, for both parties:\n• any sale, commercial or advertising use;\n• any publication on a pornographic or adults-only website or service;\n• any edit that distorts the image (compositing, artificial intelligence…) without a new written agreement.`,
    },
    {
      title: '6. Rights',
      body: `The model authorises the use of their image only for the uses listed in clause 5, for ${a.durationYears} year(s), online and on the media listed.\nThe photographer authorises the model to use the delivered photos for the same uses, without altering them or removing the credit.\nAny other use requires a new written agreement.`,
    },
    {
      title: '7. Right of withdrawal',
      body: 'If the model asks, the photographer removes a photo from their publications within 7 days, without discussion. The same rule applies the other way round.',
    },
    {
      title: '8. Keeping a copy',
      body: 'This agreement is created on a phone and is not sent anywhere by Déclic. Each party keeps a copy (PDF).',
    },
  ];
}

export const enCollab: CollabContent = {
  faq: [
    {
      id: 'vrai-tfp',
      icon: '🤝',
      question: 'What is real TFP?',
      short: '100% free, 100% artistic.',
      body: [
        'TFP stands for “Time For Prints”: an exchange. The model gives their time; the photographer gives their time, gear and editing. Nobody pays anybody.',
        'It is open to everyone, amateurs and professionals alike.',
        'Between private individuals, for a one-off project with no financial compensation at all, no particular status is required (in France).',
        'As soon as money, a valuable gift, a commission or commercial use of the photos is involved, it is no longer TFP: see “The legal framework”.',
      ],
    },
    {
      id: 'regle-commande',
      icon: '🧾',
      question: 'Who pays whom?',
      short: 'Whoever commissions pays the other.',
      body: [
        'The model commissions a custom project (a portfolio, photos for their own use): it is a service by the photographer, so it is paid.',
        'The photographer has an idea, an artistic direction, and looks for a model: it is either a free collaboration on both sides (TFP), or paid work for the model, in a professional framework.',
        'If in doubt, ask before the shoot and write the answer in the agreement.',
      ],
    },
    {
      id: 'ecrit',
      icon: '✍️',
      question: 'A written agreement, even for free?',
      short: 'Yes. Always. Even between friends.',
      body: [
        'A written agreement sets the limits before the shoot: the style, the outfits (clothed, lingerie, nude), the place, the number of photos, the deadline, and where the photos may be published.',
        'It protects everyone: against misunderstandings, things going too far during the shoot, and regrets afterwards.',
        'Image rights: nobody may publish a person’s image without their consent. And the photographer’s copyright can only be transferred in writing, use by use.',
        'Déclic’s Quick Agreement helps you do it in a few minutes.',
      ],
    },
    {
      id: 'cadre-legal',
      icon: '⚖️',
      question: 'What if I want to be paid?',
      short: 'No grey area: declare it.',
      body: [
        'Charging for shoots, even occasionally, is an activity to declare (in France, for example as a micro-enterprise). Undeclared work is illegal.',
        'For models: in France, a person paid to pose is in principle considered an employee. Look into it before accepting or offering payment.',
        'Official websites explain the steps (French government sites).',
      ],
      links: [
        { label: 'Service-Public.fr', url: 'https://www.service-public.fr' },
        { label: 'URSSAF', url: 'https://www.urssaf.fr' },
      ],
    },
  ],

  charter: [
    { title: 'Consent', body: 'Nothing happens without clear agreement. Anyone can say stop at any time, without justifying it.' },
    { title: 'Adults only', body: 'Lingerie and artistic nude: only between adults. No exceptions.' },
    { title: 'Writing first', body: 'An agreement before every shoot, even between friends.' },
    { title: 'No hidden money', body: 'TFP stays free on both sides. Otherwise, it is a professional framework.' },
    { title: 'Respectful sharing', body: 'Only where agreed. Never sold, never on adult websites.' },
    { title: 'Safety', body: 'Someone close knows where and when the shoot takes place. Bringing a chaperone is always accepted.' },
    { title: 'Promises kept', body: 'The promised photos are delivered, on time.' },
  ],

  projectTypes,
  allowances,
  diffusions,
  moodStyles: {
    naturel: 'Natural portrait',
    'noir-blanc': 'Black & white',
    mode: 'Fashion',
    studio: 'Studio',
    exterieur: 'Outdoors',
    urbain: 'Urban',
    'fine-art': 'Fine art',
    boudoir: 'Boudoir',
  },

  agreementSections,

  disclaimer:
    'Simplified agreement template provided by Déclic for guidance only. It does not replace legal advice. The signature drawn on screen is a simple electronic signature: it shows agreement, without the strength of a certified signature.',

  pdf: {
    lang: 'en',
    kicker: 'DÉCLIC · QUICK AGREEMENT',
    title: 'Photo collaboration agreement (TFP)',
    created: (date, ref) => `Created on ${date} · Ref. ${ref}`,
    photographer: 'The photographer',
    model: 'The model',
    notSigned: 'Not signed',
    mention: '“Read and approved. I solemnly declare that I am an adult.”',
  },

  legalDocs: [
    {
      id: 'mentions',
      title: 'Legal notice',
      sections: [
        { title: 'Publisher', body: `${EDITOR.name}\n${EDITOR.status}\n${EDITOR.address}\nContact: ${EDITOR.email}` },
        { title: 'Director of publication', body: EDITOR.publicationDirector },
        { title: 'Host', body: EDITOR.hosting },
        { title: 'Distribution', body: EDITOR.distribution },
        {
          title: 'Data hosting',
          body: 'Déclic does not host any of its users’ data: progress, photos, agreements and profile stay on each person’s phone. The publisher has no access to them.',
        },
        {
          title: 'Intellectual property',
          body: 'Déclic’s code is published under the free MIT licence. Texts and drawings belong to the publisher unless stated otherwise. Photos taken by users remain their exclusive property.',
        },
        { title: 'Last updated', body: EDITOR.lastUpdate },
      ],
    },
    {
      id: 'confidentialite',
      title: 'Privacy policy',
      sections: [
        {
          title: 'In short',
          body: 'Your data stays on your phone. We don’t receive it, we don’t see it, we don’t sell it. No account, no ads, no trackers, no audience measurement.',
        },
        { title: 'Controller', body: `${EDITOR.name} — ${EDITOR.email}` },
        {
          title: 'Data concerned',
          body: '• Your usage profile (photographer / model) and your age declaration;\n• your identity if you fill it in (nickname, first name, last name — all optional);\n• your progress (lessons, challenges, XP, achievements, avatar);\n• the photos you add to the journal;\n• your collaboration agreements (Quick Agreement) and your moodboard.',
        },
        {
          title: 'Where is it stored?',
          body: 'Only in the app’s private storage, on your phone. None of it is sent to the publisher or to any third party. Journal photos are copied into a folder reserved for the app, which other apps cannot access. Android automatic backup (to Google Drive) is disabled for Déclic: only a backup you export yourself lets you recover your data.',
        },
        {
          title: 'What is it used for?',
          body: 'Only to make the app work: show your content, compute your XP and ranks, pre-fill your agreements. Nothing else.',
        },
        {
          title: 'Phone permissions',
          body: 'The camera is only requested when you take a photo for the journal. For the gallery, Déclic uses the phone’s photo picker: the app only receives the photos you choose, never access to your whole library. The microphone is never used.',
        },
        {
          title: 'Sharing',
          body: 'Nothing is shared automatically. When you export a backup or an agreement as a PDF, you choose where to send it.',
        },
        {
          title: 'Retention',
          body: 'As long as the app is installed, or until you erase your data. Uninstalling the app erases everything.',
        },
        {
          title: 'Your rights',
          body: '• Erasure: Profile > “Erase all my data”, in one tap, permanently.\n• Portability: Profile > Backup > Export.\n• Access and rectification: everything is visible and editable in the app.\nFor any question, write to the address above. You can also contact the French data protection authority, the CNIL (cnil.fr).',
        },
        { title: 'Last updated', body: EDITOR.lastUpdate },
      ],
    },
    {
      id: 'conditions',
      title: 'Terms of use',
      sections: [
        {
          title: 'Purpose',
          body: 'Déclic is a free app for learning photography, with an area that helps photographers and models collaborate.',
        },
        {
          title: 'Age',
          body: 'Lessons and challenges are open to everyone. The “Collaborate with trust” area is for adults only: access requires a solemn declaration that you are 18 or older. Any false declaration is the sole responsibility of its author.',
        },
        {
          title: 'Responsible use',
          body: 'The Quick Agreement is a template for guidance. Each user remains solely responsible for the shoots they organise, the agreements they sign and the photos they publish. They undertake to respect image rights, everyone’s consent and the law.',
        },
        {
          title: 'Forbidden content',
          body: 'It is strictly forbidden to use Déclic to organise or document a shoot involving a minor in a lingerie or nude context, or a person who has not given their consent.',
        },
        {
          title: 'Report abuse',
          body: 'You can report any abusive or non-consensual use related to Déclic to the publisher from Profile > “Report abuse”. Today, the app does not publish any content between users. If a community feature is added, a report button will be available on every piece of content, with prompt removal of manifestly illegal content, as required by law.',
        },
        {
          title: 'Liability',
          body: 'The publisher provides the app as is, without warranty. They cannot be held liable for the use made of generated agreements or for relationships between users.',
        },
        { title: 'Last updated', body: EDITOR.lastUpdate },
      ],
    },
  ],

  lightQuiz: [
    { scene: 'face-front', choices: ['From the front', 'From the side', 'From above', 'From behind'], answer: 0, explain: 'Front light: few shadows, the face looks flatter but very readable. Flattering for the skin.' },
    { scene: 'face-side', choices: ['From the side', 'From the front', 'From below', 'From behind'], answer: 0, explain: 'Side light: half of the face in shadow. It sculpts volumes, cheekbones, the jawline. Very dramatic.' },
    { scene: 'face-top', choices: ['From above', 'From the side', 'From the front', 'From below'], answer: 0, explain: 'Light from above (midday sun): eyes in shadow, a shadow under the nose. Lift your chin a little or look for shade.' },
    { scene: 'face-back', choices: ['From behind (backlight)', 'From the front', 'From above', 'From the side'], answer: 0, explain: 'Backlight: a bright rim outlines the silhouette and hair. The face is dark unless the photographer compensates.' },
    { scene: 'face-below', choices: ['From below', 'From above', 'From the front', 'From behind'], answer: 0, explain: 'Light from below: shadows go upwards, the “torch under the chin” effect. Rarely flattering… unless intended.' },
    { scene: 'face-soft', choices: ['Soft and diffused', 'Hard and direct', 'From behind', 'From below'], answer: 0, explain: 'Soft light (overcast sky, window, large diffuser): light, gradual shadows. The easiest to pose in.' },
  ],
};
