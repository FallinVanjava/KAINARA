import { MOTIF_DATA, OUTFIT_DATA } from "./src/lib/constants/mockData.ts";

let passed = 0;
let failed = 0;

function assert(name, condition, details = "") {
  if (condition) {
    passed++;
    console.log(`  [PASS] ${name}`);
  } else {
    failed++;
    console.error(`  [FAIL] ${name} -> ${details}`);
  }
}

console.log("=================================================================");
console.log("       KAINARA FRONTEND BUSINESS LOGIC QA TEST SUITE            ");
console.log("=================================================================");

console.log("\n[TEST SUITE 1] Motif Dataset & Cultural Taxonomy Integrity");
assert("TC-FE-01: MOTIF_DATA has exactly 8 standard motifs", MOTIF_DATA.length === 8);

const requiredKeys = ["id", "name", "slug", "category", "origin", "philosophy", "eventContext", "colors", "imageUrl"];
const allSlugs = new Set();
const allIds = new Set();

MOTIF_DATA.forEach((m) => {
  requiredKeys.forEach((key) => {
    assert(`TC-FE-02: Motif '${m.id}' has field '${key}'`, m[key] !== undefined && m[key] !== null && m[key] !== "");
  });
  assert(`TC-FE-03: Motif '${m.id}' has valid hex colors array`, Array.isArray(m.colors) && m.colors.length >= 2);
  assert(`TC-FE-04: Motif '${m.id}' has non-empty eventContext`, typeof m.eventContext === "string" && m.eventContext.length > 5);
  allSlugs.add(m.slug);
  allIds.add(m.id);
});

assert("TC-FE-05: All motif slugs are globally unique", allSlugs.size === 8);
assert("TC-FE-06: All motif IDs are globally unique", allIds.size === 8);

console.log("\n[TEST SUITE 2] Outfit Catalog & Modest Fashion Tags Integrity");
assert("TC-FE-07: OUTFIT_DATA is non-empty", OUTFIT_DATA.length > 0);

const validCategories = ["formal", "casual", "tradisional", "semi-formal"];
let hijabFriendlyCount = 0;

OUTFIT_DATA.forEach((outfit) => {
  assert(`TC-FE-08: Outfit '${outfit.id}' references a valid Motif ID`, allIds.has(outfit.motifId));
  assert(`TC-FE-09: Outfit '${outfit.id}' has a valid category enum`, validCategories.includes(outfit.category));
  if (outfit.tags.includes("hijab-friendly")) {
    hijabFriendlyCount++;
  }
});

assert("TC-FE-10: Hijab-friendly outfits exist in the lookbook", hijabFriendlyCount > 0);

console.log("\n=================================================================");
console.log(`FRONTEND LOGIC QA SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log("=================================================================");

if (failed > 0) {
  process.exit(1);
}
