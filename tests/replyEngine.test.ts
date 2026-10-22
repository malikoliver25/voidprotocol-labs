import { describe, it, expect } from "vitest";
import { createReplyEngine } from "@/lib/replyEngine";
import knowledge from "@/data/agent-knowledge.json";

describe("replyEngine", () => {
  const engine = createReplyEngine(knowledge.knowledge);

  it("answers latest-project questions", () => {
    const reply = engine.reply("what's the latest project?");
    expect(reply).toContain("latest");
    expect(reply.length).toBeGreaterThan(0);
  });

  it("answers weakest-skill questions", () => {
    const reply = engine.reply("what is malik's weakest point?");
    expect(reply.toLowerCase()).toContain("3");
    expect(reply.toLowerCase()).toContain("airflow");
  });

  it("answers contact/transmission questions", () => {
    const reply = engine.reply("how do I contact malik?");
    expect(reply.toLowerCase()).toContain("transmission");
  });

  it("answers stack questions", () => {
    const reply = engine.reply("what's the stack?");
    expect(reply.toLowerCase()).toContain("k8s");
  });

  it("returns greeting for unknown input", () => {
    const reply = engine.reply("blorp glorp");
    expect(reply.toLowerCase()).toContain("vanta");
  });

  it("searchDocs finds sentinel", () => {
    const hits = engine.searchDocs("sentinel");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((h) => h.id.toLowerCase().includes("sentinel") || h.snippet.toLowerCase().includes("sentinel"))).toBe(true);
  });

  it("searchDocs returns fallback for nonsense", () => {
    const hits = engine.searchDocs("qwop xyzzy");
    expect(hits.length).toBeGreaterThan(0);
  });
});
