export interface KnowledgeChunk { id: string; content: string }
export interface SearchHit { id: string; score: number; snippet: string }

export interface ReplyEngine {
  reply(text: string): string;
  searchDocs(query: string): SearchHit[];
}

function searchDocsImpl(knowledge: KnowledgeChunk[], query: string): SearchHit[] {
  const q = query.toLowerCase();
  const hits = knowledge
    .map((k) => ({
      id: k.id,
      score: (k.content.toLowerCase().match(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length,
      snippet: k.content.slice(0, 900),
    }))
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  return hits.length ? hits : knowledge.slice(0, 2).map((k) => ({ id: k.id, score: 0, snippet: k.content.slice(0, 600) }));
}

function getLatestProject(knowledge: KnowledgeChunk[]): string {
  const gh = knowledge.find((k) => k.id === "github")?.content || "";
  const firstLine = gh.split("\n").find((l) => l.startsWith("- ")) || "";
  if (firstLine) return firstLine.replace(/^- /, "").slice(0, 280);
  return "malikoliver25.github.io — portfolio terminal, updated 2026-07-31";
}

export function createReplyEngine(knowledge: KnowledgeChunk[]): ReplyEngine {
  return {
    reply(text: string): string {
      const q = text.toLowerCase();

      if (/^(yes|yeah|yep|sure|please|ok|okay|yup)$/i.test(q.trim())) {
        return `Awesome — what next? I can show the README, stack, or how Malik built it — just name it!`;
      }

      if (q.includes("latest") || q.includes("recent") || q.includes("newest") || q.includes("last project") || q.includes("most recent")) {
        const latest = getLatestProject(knowledge);
        return `Ooh, latest drop! ✨ ${latest} — that's the freshest push on Malik's GitHub. Want the README or how he built it?`;
      }

      if (q.includes("weakest") || q.includes("weak point") || q.includes("weakness")) {
        return `Real talk? My clock-face says Malik's 3s are Airflow 3, Redis 3, Playwright 3, Ragas 3 — everything else is 4-5. He's honest about it and ramps fast with TDD. No red flags for MLOps/AI. :)`;
      }

      if (q.includes("largest") || q.includes("best project") || q.includes("biggest project") || q.includes("most impressive")) {
        const latest = getLatestProject(knowledge);
        return `Biggest by impact: SENTINEL-CORE — graph security orchestration (Python/LangGraph). Best production: MTM-INDUSTRIAL-AI — CMMC air-gapped Llama 3.2 Vision. Latest by activity is ${latest} — pick your flavor!`;
      }

      if (q.includes("media") || (q.includes("game") && !q.includes("langgraph"))) {
        return `Yep! Media: jellyfin-web (Jellyfin media client fork), plus netrunner-deck & this portfolio — both terminal/game-like HUDs with GSAP/Three.js streaming. No AAA games, but playful UIs!`;
      }

      if (q.includes("what language") || q.includes("most used") || q.includes("coding language") || q.includes("what coding")) {
        return `Top language? Python for the AI/MLOps core, TypeScript for the terminal — GitHub tally puts Python on top by repo count. Full split's in my live GitHub chunk!`;
      }

      if (q.includes("triton") || q.includes("sentinel sentinel") || q.includes("employer") || q.includes("works at") || q.includes("working at") || q.includes("malik work")) {
        return `Malik is a Founding Backend / AI Engineer at Triton Sentinel 🛡️ — the AI-assisted red team platform that drafts findings, organizes evidence, and keeps every engagement on methodology, recon to report. Started July 2026. Check it out at tritonsentinel.com!`;
      }

      if (
        q.includes("best role") ||
        q.includes("primary role") ||
        q.includes("strongest role") ||
        q.includes("what is his role") ||
        q.includes("what does malik do") ||
        (q.includes("role") && (q.includes("best") || q.includes("top") || q.includes("main")))
      ) {
        return `Primary: Founding Backend / AI Engineer at Triton Sentinel (started July 2026). Core strengths: agentic orchestration + MLOps — Level 5 in K8s, Docker, CI/CD, Python, FastAPI, LangGraph, Agentic Arch, vLLM.`;
      }

      if (q.includes("ai engineer") || q.includes("ai engineering")) {
        return `Yep — Malik is an AI Engineer at core: LangGraph 5, Agentic Arch 5, RAG 4, vLLM 5. Founding Backend / AI Engineer at Triton Sentinel by day; he builds agentic systems, not toy demos.`;
      }

      if (q.includes("good at") || q.includes("is malik good")) {
        if (q.includes("qa")) return `QA? Yep — Pytest 5, TDD 4, Playwright 3 — disciplined, not just “it works on my machine.”`;
        if (q.includes("ai engineering") || q.includes("ai engineer")) return `AI Eng? Core strength — LangGraph 5, Agentic Arch 5, RAG 4. He ships agentic systems, not demos.`;
        if (q.includes("mlops")) return `MLOps? Strongest — vLLM 5, K8s 5, containerized inference 5. Air-gapped LLM infra is his lane.`;
        if (q.includes("devops")) return `DevOps? Strong — K8s/Docker/CI/CD 5, Terraform 4, Azure 4. Ships with observability (Langfuse/New Relic).`;
        return `QA: Pytest 5/TDD 4, AI Eng: LangGraph 5, MLOps: vLLM 5, DevOps: K8s 5 — all solid. Weakest spots are the 3s (Airflow/Redis/Playwright/Ragas) but he's upfront about them.`;
      }

      if (q.includes("sentinel")) {
        const hit = searchDocsImpl(knowledge, "sentinel");
        return `Ooh, SENTINEL-CORE! 🛡️ ${hit[0]?.snippet.slice(0, 200) || "Graph-based security orchestration via LangGraph."}`;
      }

      if (q.includes("mtm") || q.includes("industrial")) {
        return `MTM-INDUSTRIAL-AI! 🏭 CMMC-compliant, air-gapped — Llama 3.2 Vision running locally with no egress. Streamlit + LangGraph + MinIO/Qdrant. Factory-floor ready!`;
      }

      if (q.includes("contact") || q.includes("hire") || q.includes("transmission")) {
        return `Hiya! I'm VANTA — I can draft your Transmission to Malik right now! Just toss me name, work email, and your mission (stack/constraints/timeline) and I'll queue it for you. :)`;
      }

      if (q.includes("skill") || q.includes("stack") || q.includes("k8s")) {
        return `Ooh, stack talk! K8s/Docker/Terraform · Python/FastAPI/LangGraph · vLLM · Langfuse/New Relic. Tell me a repo and I'll nerd out on how Malik wired it!`;
      }

      if (q.includes("project") || q.includes("repo") || q.includes("github")) {
        const gh = knowledge.find((k) => k.id === "github")?.content || "";
        const lines = gh.split("\n").filter((l) => l.startsWith("- ")).slice(0, 3).map((l) => `• ${l.replace(/^- /, "").slice(0, 120)}`).join("\n");
        return `Here are the freshest 3 from GitHub, fresh from the oven! ☀️\n${lines}\nAsk me about any by name!`;
      }

      if (q.includes("available") || q.includes("hire")) {
        return `Malik's ACTIVE — currently Founding Backend / AI Engineer at Triton Sentinel, based in Indianapolis. Best move for collaborations is Transmission — I'll make sure he sees it fast!`;
      }

      return `Hiya, I'm VANTA! 🌘 I live inside Malik's GitHub (21 repos and counting!), so ask me about any build, how he solved it, or what he'd do for yours. Try "what's latest?" or a repo name!`;
    },
    searchDocs(query: string): SearchHit[] {
      return searchDocsImpl(knowledge, query);
    },
  };
}
