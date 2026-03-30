import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "funble.db");
const HTML_PATH = "/tmp/funble_faq.html";

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const html = fs.readFileSync(HTML_PATH, "utf-8");

// Category mapping: id in HTML → code in DB
const CATEGORY_MAP: Record<string, { code: string; name: string }> = {
  faq_requency: { code: "FUNBLE_PLATFORM", name: "자주묻는질문" },
  faq_service: { code: "MEMBER_ACCOUNT", name: "서비스 이용" },
  faq_user: { code: "DEPOSIT_WITHDRAWAL", name: "가입/회원정보" },
  faq_simcert: { code: "INVEST_TENDENCY", name: "간편인증" },
  faq_deposit: { code: "SUBSCRIBE", name: "입출금" },
  faq_trade: { code: "DEAL", name: "청약/매매" },
  faq_tax: { code: "DIVIDEND", name: "배당/세금" },
  faq_committee: { code: "TAX", name: "수익자 총회" },
};

interface FaqItem {
  question: string;
  answer: string;
}

function extractFaqsFromCategory(categoryId: string): FaqItem[] {
  // Find the <ul> block for this category
  const ulRegex = new RegExp(
    `<ul[^>]*id="${categoryId}"[^>]*>([\\s\\S]*?)(?=<ul[^>]*id="faq_|$)`,
    "i"
  );
  const ulMatch = html.match(ulRegex);
  if (!ulMatch) return [];

  const block = ulMatch[1];

  // Extract all <li> items with Q and A
  const items: FaqItem[] = [];
  const liRegex = /<a[^>]*class="q"[^>]*>([\s\S]*?)<\/a>\s*<div class="a">([\s\S]*?)<\/div>/gi;

  let match;
  while ((match = liRegex.exec(block)) !== null) {
    let question = match[1]
      .replace(/<span[^>]*>.*?<\/span>/gi, "") // remove <span class="bul">
      .replace(/<[^>]+>/g, "") // remove remaining tags
      .trim();

    let answer = match[2].trim();

    // Clean up answer: keep HTML but normalize
    // Replace </br> with <br/>
    answer = answer.replace(/<\/br>/gi, "<br/>");
    // Remove excessive whitespace between tags
    answer = answer.replace(/\n\t+/g, "\n");
    answer = answer.trim();

    if (question) {
      items.push({ question, answer });
    }
  }

  return items;
}

function main() {
  console.log("=== Parse FAQ from original HTML ===\n");

  // Clear existing FAQ data
  db.exec("DELETE FROM faqs; DELETE FROM faq_categories;");

  const catStmt = db.prepare(
    "INSERT OR REPLACE INTO faq_categories (name, code, sort_order) VALUES (?, ?, ?)"
  );
  const getCatId = db.prepare("SELECT id FROM faq_categories WHERE code = ?");
  const faqStmt = db.prepare(
    "INSERT INTO faqs (category_id, question, answer, sort_order) VALUES (?, ?, ?, ?)"
  );

  let catOrder = 0;
  let totalFaqs = 0;

  for (const [htmlId, catInfo] of Object.entries(CATEGORY_MAP)) {
    catStmt.run(catInfo.name, catInfo.code, catOrder++);

    const items = extractFaqsFromCategory(htmlId);
    const catRow = getCatId.get(catInfo.code) as { id: number };

    for (let i = 0; i < items.length; i++) {
      faqStmt.run(catRow.id, items[i].question, items[i].answer, i);
    }

    console.log(`${catInfo.name} (${htmlId}): ${items.length} FAQs`);
    totalFaqs += items.length;
  }

  console.log(`\nTotal: ${totalFaqs} FAQs inserted`);

  // Verify first Q&A
  const firstFaq = db.prepare(
    "SELECT question, answer FROM faqs ORDER BY id LIMIT 1"
  ).get() as { question: string; answer: string };
  console.log(`\n--- First FAQ verification ---`);
  console.log(`Q: ${firstFaq.question}`);
  console.log(`A (first 200 chars): ${firstFaq.answer.substring(0, 200)}...`);

  db.close();
}

main();
