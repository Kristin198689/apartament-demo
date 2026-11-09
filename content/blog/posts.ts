import type { images } from "@/config/images";
import type { Locale } from "@/i18n/routing";

/*
 * Статьи блога (для SEO). Тексты общие, без фактов о конкретном объекте.
 * TODO: финальные SEO-тексты после ключевых слов и вычитки носителем.
 * Заголовки — без точки в конце.
 */
export type PostLocale = {
  title: string;
  description: string;
  intro: string;
  sections: { h: string; p: string }[];
};

export type Post = {
  slug: string;
  image: keyof typeof images;
  content: Record<Locale, PostLocale>;
};

export const posts: readonly Post[] = [
  {
    slug: "choose-accommodation-for-working-trip",
    image: "living",
    content: {
      en: {
        title: "How to choose accommodation for a working trip",
        description: "A short checklist for business travellers: kitchen, parking, beds, WiFi and check-in. What really matters when you stay for weeks.",
        intro: "A hotel room works for a night or two. For a project that lasts weeks, other things start to matter. This checklist helps you compare options quickly.",
        sections: [
          { h: "A kitchen saves money and energy", p: "Cooking yourself is cheaper than eating out every day, and it lets you eat when your shift ends. Check that the kitchen has a stove, fridge and basic cookware." },
          { h: "Parking and access", p: "If you drive a company vehicle, ask about parking before you book. Free parking close to the entrance and a safe place for tools make daily work easier." },
          { h: "Beds, WiFi and check-in", p: "Colleagues sharing an apartment need separate beds. Stable WiFi helps with reports and calls. Self check-in lets you arrive at any hour without waiting for anyone." },
        ],
      },
      de: {
        title: "So wählen Sie die richtige Unterkunft für die Dienstreise",
        description: "Eine kurze Checkliste für Geschäftsreisende: Küche, Parkplatz, Betten, WLAN und Check-in. Worauf es bei Aufenthalten über mehrere Wochen ankommt.",
        intro: "Ein Hotelzimmer reicht für ein oder zwei Nächte. Bei einem Projekt über mehrere Wochen zählen andere Dinge. Mit dieser Checkliste vergleichen Sie Angebote schnell.",
        sections: [
          { h: "Eine Küche spart Geld und Kraft", p: "Selbst kochen ist günstiger als jeden Tag auswärts zu essen und passt zum Feierabend. Prüfen Sie, ob Herd, Kühlschrank und Grundausstattung vorhanden sind." },
          { h: "Parkplatz und Zugang", p: "Wer mit einem Firmenfahrzeug anreist, fragt vor der Buchung nach Parkplätzen. Kostenlose Stellplätze am Haus und ein sicherer Platz für Werkzeug erleichtern den Alltag." },
          { h: "Betten, WLAN und Check-in", p: "Kollegen in einer gemeinsamen Wohnung brauchen getrennte Betten. Stabiles WLAN hilft bei Berichten und Telefonaten. Mit Self-Check-in reisen Sie zu jeder Uhrzeit an, ohne zu warten." },
        ],
      },
      ru: {
        title: "Как выбрать жильё для рабочей поездки",
        description: "Короткий чек-лист для командированных: кухня, парковка, кровати, Wi-Fi и заселение. На что смотреть, если вы живёте несколько недель.",
        intro: "Гостиничный номер подходит на день-два. Если проект длится недели, важными становятся другие вещи. Этот чек-лист поможет быстро сравнить варианты.",
        sections: [
          { h: "Кухня экономит деньги и силы", p: "Готовить самому дешевле, чем каждый день питаться вне дома, и можно поесть сразу после смены. Проверьте, есть ли плита, холодильник и базовая посуда." },
          { h: "Парковка и доступ", p: "Если вы приезжаете на рабочей машине, уточните парковку до бронирования. Бесплатное место у входа и безопасное хранение инструмента упрощают каждый день." },
          { h: "Кровати, Wi-Fi и заселение", p: "Коллегам в одной квартире нужны раздельные кровати. Стабильный Wi-Fi нужен для отчётов и звонков. Самостоятельное заселение позволяет приехать в любое время, никого не ожидая." },
        ],
      },
    },
  },
  {
    slug: "apartment-or-hotel-business-trip",
    image: "bedroom",
    content: {
      en: {
        title: "Furnished apartment or hotel for a longer business trip",
        description: "Compare a furnished apartment and a hotel for stays of one week or more: cost, space, privacy and flexibility.",
        intro: "Both options have their place. The right choice depends on how long you stay and how many people travel together.",
        sections: [
          { h: "Cost over time", p: "A hotel is simple for a short stay. For longer stays an apartment usually becomes cheaper per night, especially when several people share it and cook for themselves." },
          { h: "Space and privacy", p: "An apartment gives you a living area, a kitchen and a door that is yours. That makes it easier to rest after work and to keep a routine." },
          { h: "Flexibility", p: "Apartments often allow flexible arrival and longer stays at better rates. Ask about minimum stay and terms before you decide." },
        ],
      },
      de: {
        title: "Möbliertes Apartment oder Hotel bei längeren Dienstreisen",
        description: "Apartment und Hotel im Vergleich für Aufenthalte ab einer Woche: Kosten, Platz, Privatsphäre und Flexibilität.",
        intro: "Beides hat seine Berechtigung. Die richtige Wahl hängt davon ab, wie lange Sie bleiben und wie viele Personen gemeinsam reisen.",
        sections: [
          { h: "Kosten auf Dauer", p: "Ein Hotel ist bei kurzen Aufenthalten unkompliziert. Bei längeren Aufenthalten wird ein Apartment pro Nacht meist günstiger, besonders wenn mehrere Personen es teilen und selbst kochen." },
          { h: "Platz und Privatsphäre", p: "Ein Apartment bietet Wohnbereich, Küche und eine eigene Tür. So lässt sich nach der Arbeit besser abschalten und ein Alltag aufbauen." },
          { h: "Flexibilität", p: "Bei Apartments ist oft eine flexible Anreise möglich, und längere Aufenthalte sind günstiger. Fragen Sie vorab nach Mindestaufenthalt und Konditionen." },
        ],
      },
      ru: {
        title: "Меблированные апартаменты или отель для долгой командировки",
        description: "Сравнение апартаментов и отеля для проживания от недели: стоимость, пространство, приватность и гибкость.",
        intro: "У каждого варианта есть своё место. Выбор зависит от срока и от того, сколько человек едет вместе.",
        sections: [
          { h: "Стоимость на длинной дистанции", p: "Отель удобен на короткий срок. На длинный срок апартаменты обычно выходят дешевле за ночь, особенно если живут несколько человек и готовят сами." },
          { h: "Пространство и приватность", p: "В апартаментах есть гостиная, кухня и своя дверь. Так проще отдыхать после работы и держать привычный распорядок." },
          { h: "Гибкость", p: "В апартаментах чаще можно приехать в удобное время, а долгое проживание обходится дешевле. Заранее уточните минимальный срок и условия." },
        ],
      },
    },
  },
  {
    slug: "book-accommodation-for-team",
    image: "exterior",
    content: {
      en: {
        title: "Booking accommodation for a team: what companies should clarify",
        description: "Group size, invoices, stay length and deposit: the questions to settle before you book housing for employees.",
        intro: "Housing a team is easier when the important points are clear from the start. Here is what to ask.",
        sections: [
          { h: "Group size and layout", p: "Decide how many people will stay and who shares a room. Several apartments in one place keep the team together and simplify logistics." },
          { h: "Invoices and payment", p: "Ask whether the invoice can be issued to the company and which payment options are possible. This saves time for your accounting department." },
          { h: "Length of stay, deposit and terms", p: "Clarify the minimum stay, any deposit and the cancellation terms. For projects that last months, ask for a better rate." },
        ],
      },
      de: {
        title: "Unterkunft für ein Team buchen: Was Firmen vorab klären sollten",
        description: "Gruppengröße, Rechnung, Aufenthaltsdauer und Kaution: Diese Fragen sollten Sie vor der Buchung für Mitarbeiter klären.",
        intro: "Ein Team unterzubringen gelingt leichter, wenn die wichtigen Punkte von Anfang an klar sind. Das sollten Sie fragen.",
        sections: [
          { h: "Gruppengröße und Aufteilung", p: "Legen Sie fest, wie viele Personen bleiben und wer sich ein Zimmer teilt. Mehrere Apartments an einem Ort halten das Team zusammen und vereinfachen die Organisation." },
          { h: "Rechnung und Zahlung", p: "Fragen Sie, ob die Rechnung auf die Firma ausgestellt werden kann und welche Zahlungsarten möglich sind. Das spart Ihrer Buchhaltung Zeit." },
          { h: "Aufenthaltsdauer, Kaution und Konditionen", p: "Klären Sie Mindestaufenthalt, mögliche Kaution und Stornobedingungen. Bei Projekten über Monate lohnt die Frage nach einem besseren Preis." },
        ],
      },
      ru: {
        title: "Бронирование жилья для команды: что компании стоит уточнить заранее",
        description: "Размер группы, счета, срок проживания и залог: вопросы, которые нужно решить до бронирования жилья для сотрудников.",
        intro: "Расселить команду проще, когда важные моменты понятны с самого начала. Вот что стоит спросить.",
        sections: [
          { h: "Размер группы и расселение", p: "Определите, сколько человек поедет и кто живёт в одной комнате. Несколько апартаментов в одном месте позволяют команде жить рядом и упрощают организацию." },
          { h: "Счета и оплата", p: "Уточните, можно ли выставить счёт на компанию и какие способы оплаты доступны. Это сэкономит время вашей бухгалтерии." },
          { h: "Срок, залог и условия", p: "Выясните минимальный срок, возможный залог и условия отмены. Для проектов на месяцы попросите лучшую цену." },
        ],
      },
    },
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
