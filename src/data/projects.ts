import type { Project } from "@/types";

export const projects: Project[] = [
  {
    codename: "SENTINEL-CORE",
    name: "Sentinel Core",
    description:
      "A security tool that reads network scan results and explains, in plain language, how an attacker could get in and what to fix first. Graph-based orchestration engine ingesting Nmap/OpenVAS scans (Pydantic-validated), synthesizing attack-path reports that surface CVSS > 8.0 exploit-available paths first.",
    url: "https://github.com/malikoliver25/sentinel-core",
    techStack: ["Python", "LangGraph", "Nmap", "OpenVAS", "Pydantic"],
    status: "ACTIVE",
  },
  {
    codename: "MTM-INDUSTRIAL-AI",
    name: "MTM Industrial AI Portal",
    description:
      "An AI help-desk for a machine shop: workers ask equipment questions in plain English, answered from company manuals with no internet required. LangGraph orchestration over Qdrant vector retrieval with MySQL audit ledger, MinIO artifact storage, and Langfuse observability. Enforced AS9100 traceability with immutable audit logs, Argon2-hashed RBAC, and a confidence gateway routing low-certainty answers to human review.",
    url: "https://github.com/malikoliver25/mtm-industrial-ai-portal",
    techStack: ["Python", "Streamlit", "LangGraph", "Qdrant", "MySQL", "MinIO", "Langfuse"],
    status: "ACTIVE",
  },
  {
    codename: "PORTFOLIO-ASSISTANT",
    name: "Agentic Orchestration Microservice",
    description:
      "Asynchronous orchestration microservice built with Python and FastAPI featuring deterministic context routing and prompt validation optimized for low-latency LLM reasoning.",
    url: "https://github.com/malikoliver25/portfolio-assistant-api",
    techStack: ["Python", "FastAPI", "Async", "LLM Routing"],
    status: "ACTIVE",
  },
  {
    codename: "NETRUNNER-DECK",
    name: "Interactive Engineer Terminal HUD",
    description:
      "Responsive, production-ready interactive terminal interface optimized for asynchronous streaming responses and client-side interactions.",
    url: "https://github.com/malikoliver25/malikoliver25.github.io",
    techStack: ["React", "TypeScript", "Terminal UI", "Streaming"],
    status: "DEPLOYED",
  },
];
