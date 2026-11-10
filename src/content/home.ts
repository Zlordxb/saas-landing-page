/**
 * Copy for the home page, kept apart from the layout so another business can
 * reuse BookFlow by editing words, not components.
 * Reviews and numbers are fictional: the DemoNotice says so on every page.
 */

export const hero = {
  title: "Gentle dentistry, booked in under a minute",
  lead: "Check-ups, cleanings, fillings and whitening in a quiet studio by the Nile. Pick a free time online: no phone calls, no waiting on hold.",
  rating: { score: "4.9", count: 380 },
};

export const priceList = {
  title: "Treatments and prices",
  lead: "Every treatment shows how long it takes and what it costs, before you book. You pay at the clinic, after your visit.",
};

export const calmCare = {
  title: "Calm care, explained before we start",
  lead: "Most people arrive a little nervous. We plan every visit so nothing comes as a surprise: not the treatment, not the time, not the bill.",
};

export const benefits = [
  {
    icon: "receipt",
    title: "Prices in writing",
    text: "You get the plan and the total before we start. Nothing is added without asking you.",
  },
  {
    icon: "hand",
    title: "Pause any time",
    text: "Raise your hand and we stop. Numbing gel goes on before every injection.",
  },
  {
    icon: "shield",
    title: "Sterilized every time",
    text: "We keep 15 minutes between patients to sterilize every instrument. Sealed pouches open in front of you.",
  },
  {
    icon: "moon",
    title: "Evenings that fit your day",
    text: "Open until 10 PM, Saturday to Thursday. Book tonight’s time in under a minute.",
  },
] as const;

export const shadeGuide = {
  title: "How white can your teeth get?",
  lead: "Dentists match tooth colour against a shade guide like this one. Pick the shade closest to yours to see where in-clinic whitening usually lands.",
  note: "A typical result, not a promise. We measure your shade before and after.",
};

export const evenings = {
  title: "Open until 10 PM, six days a week",
  lead: "Most of our patients come after work, so evening times go first. These are the next free ones, straight from the booking calendar.",
};

export const steps = [
  {
    title: "Choose a treatment",
    text: "Every service shows its price and how long it takes, so you know what to expect.",
  },
  {
    title: "Pick a free time",
    text: "You only see times that are really free, up to 30 days ahead.",
  },
  {
    title: "Get a call to confirm",
    text: "The clinic calls you to confirm. You pay at your visit, not online.",
  },
];

export const doctor = {
  name: "Dr. Salma Nabil",
  intro:
    "Fifteen years of general and cosmetic dentistry, and a habit of explaining every step before she takes it.",
  quote:
    "Most people come to us nervous. My job is to make the next visit easier than the last one.",
  years: 15,
  credentials: [
    "BDS, MSc in restorative dentistry",
    "Speaks Arabic and English",
    "Treats adults and children from age 4",
  ],
};

export const studio = {
  title: "Inside the studio",
  lead: "One calm treatment room, a quiet waiting room, and instruments unsealed in front of you.",
};

export const testimonials = [
  {
    quote:
      "I put off my check-up for two years. Booking took a minute, and Dr. Salma explained everything before she started.",
    name: "Mona",
    area: "Dokki",
    treatment: "Check-up and consultation",
  },
  {
    quote:
      "I booked at 11 at night and had my cleaning the next evening. They were on time to the minute.",
    name: "Karim",
    area: "Maadi",
    treatment: "Scaling and polishing",
  },
  {
    quote: "The price on the website was the price I paid. That alone made me come back.",
    name: "Yasmin",
    area: "Zamalek",
    treatment: "Tooth-colored filling",
  },
  {
    quote:
      "My son was scared of dentists. He left asking when he can come back, and I didn't have to bribe him.",
    name: "Hoda",
    area: "Heliopolis",
    treatment: "Kids dental check-up",
  },
];

export const faqs = [
  {
    question: "Do I pay when I book?",
    answer: "No. Booking is free. You pay at the clinic after your visit, in cash or by card.",
  },
  {
    question: "What happens after I book?",
    answer:
      "Your request is saved right away and the time is held for you. The clinic calls to confirm, usually within two hours during opening hours.",
  },
  {
    question: "Can I change or cancel my appointment?",
    answer: "Yes. Call the clinic with your booking reference and we will move or cancel it.",
  },
  {
    question: "Does whitening hurt?",
    answer:
      "Some people feel mild sensitivity for a day or two. We apply a desensitizing gel after the session and tell you what to avoid for 48 hours.",
  },
  {
    question: "Do you treat children?",
    answer: "Yes, from age 4. Book a kids dental check-up and come 10 minutes early.",
  },
  {
    question: "Where do I park?",
    answer: "There is street parking on the next block and a garage two minutes away on foot.",
  },
];

export const visit = {
  title: "Visit us in Zamalek",
  lead: "On the island, a short walk from the Nile. Street parking on the next block and a garage two minutes away on foot.",
};
