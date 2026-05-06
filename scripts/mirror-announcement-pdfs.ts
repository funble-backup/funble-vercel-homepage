/**
 * Download PDF attachments from remote URLs in announcements.file_url JSON,
 * save under public/announcements-pdfs/{id}/, and update DB to use local paths.
 *
 * Usage: npx tsx scripts/mirror-announcement-pdfs.ts
 */

import dotenv from "dotenv";
import { queryAll, execute } from "../src/lib/db";
import {
  downloadMissingPdfsAndLocalize,
  type AnnouncementFileItem,
} from "../src/lib/announcement-pdf-local";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

async function main() {
  const rows = await queryAll<{ id: number; file_url: string }>(
    `SELECT id, file_url FROM announcements
     WHERE file_url IS NOT NULL AND trim(file_url) != ''`
  );

  let updatedRows = 0;

  for (const row of rows) {
    let items: AnnouncementFileItem[];
    try {
      items = JSON.parse(row.file_url) as AnnouncementFileItem[];
      if (!Array.isArray(items)) continue;
    } catch {
      continue;
    }

    const before = JSON.stringify(items);
    const next = await downloadMissingPdfsAndLocalize(row.id, items);
    const after = JSON.stringify(next);

    if (after !== before) {
      await execute(
        "UPDATE announcements SET file_url = ? WHERE id = ?",
        after,
        row.id
      );
      updatedRows++;
    }
  }

  console.log(
    JSON.stringify(
      {
        announcementsScanned: rows.length,
        rowsUpdated: updatedRows,
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
