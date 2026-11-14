export interface TripFaq {
  id: number;
  question: string;
  answer: string;
}

/** Accept active public FAQs without letting malformed entries hide the trip page. */
export function tripFaqsFromApi(value: unknown): TripFaq[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item, index) => {
    if (typeof item !== 'object' || item === null) return [];
    const faq = item as Record<string, unknown>;
    if (
      typeof faq.id !== 'number' || !Number.isInteger(faq.id) || faq.id <= 0 ||
      typeof faq.question !== 'string' || !faq.question.trim() ||
      typeof faq.answer !== 'string' || !faq.answer.trim() ||
      (faq.is_active !== undefined && faq.is_active !== true && faq.is_active !== 1)
    ) return [];

    return [{
      id: faq.id,
      question: faq.question.trim(),
      answer: faq.answer.trim(),
      order: typeof faq.sort_order === 'number' && Number.isFinite(faq.sort_order) ? faq.sort_order : index,
    }];
  }).sort((a, b) => a.order - b.order)
    .filter((faq, index, all) => all.findIndex(item => item.id === faq.id) === index)
    .map(({ id, question, answer }) => ({ id, question, answer }));
}
