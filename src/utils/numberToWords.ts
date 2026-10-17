const ones = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
const tens = ["", "ده", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
const teens = ["ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
const hundreds = ["", "صد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
const scales = ["", "هزار", "میلیون", "میلیارد", "هزار میلیارد", "کوادریلیون"];

function convertGroup(num: number): string {
  if (num === 0) return "";
  
  let result = [];
  
  const h = Math.floor(num / 100);
  const remainder = num % 100;
  
  if (h > 0) result.push(hundreds[h]);
  
  if (remainder >= 10 && remainder < 20) {
    result.push(teens[remainder - 10]);
  } else {
    const t = Math.floor(remainder / 10);
    const o = remainder % 10;
    if (t > 0) result.push(tens[t]);
    if (o > 0) result.push(ones[o]);
  }
  
  return result.join(" و ");
}

export function numberToPersianWords(num: number | string): string {
  if (!num) return "";
  
  let n = typeof num === 'string' ? parseInt(num.replace(/\D/g, ''), 10) : num;
  if (isNaN(n)) return "";
  if (n === 0) return "صفر";
  
  const parts = [];
  let scaleIndex = 0;
  
  while (n > 0) {
    const group = n % 1000;
    if (group > 0) {
      const groupStr = convertGroup(group);
      const scaleStr = scales[scaleIndex];
      parts.push(scaleStr ? `${groupStr} ${scaleStr}` : groupStr);
    }
    n = Math.floor(n / 1000);
    scaleIndex++;
  }
  
  return parts.reverse().join(" و ");
}
