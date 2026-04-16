// utils/formatPayload.ts

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const formatPayload = (data: any) => ({
  ...data,

  // ✅ single image
  image: isValidUrl(data.image) ? data.image : undefined,

  // ✅ multiple images
  images: (data.images || []).filter(
    (url: string) => url && isValidUrl(url)
  ),

  benefits: (data.benefits || [])
    .map((b: any) => ({ benefits: b?.benefits?.trim() }))
    .filter((b: any) => b.benefits),

  postTreatmentCare: (data.postTreatmentCare || [])
    .map((c: any) => ({ tips: c?.tips?.trim() }))
    .filter((c: any) => c.tips),

  faq: (data.faq || [])
    .map((f: any) => ({
      question: f?.question?.trim(),
      answer: f?.answer?.trim(),
    }))
    .filter((f: any) => f.question || f.answer),

  sections: (data.sections || [])
    .map((s: any) => ({
      key: s.key,
      label: s.label,
      html: s.html,
    }))
    .filter((s: any) => s.html),

  tags: (data.tags || []).filter(Boolean),
});