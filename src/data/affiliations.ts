import type { Affiliation } from "@/types";

export const affiliations: Affiliation[] = [
  {
    name: "Triton Sentinel",
    role: "Founding Backend / AI Engineer",
    url: "https://tritonsentinel.com/",
    logo: `${import.meta.env.BASE_URL}img/triton.png`,
    current: true,
  },
  {
    name: "Askable",
    role: "AI Engineer",
    url: "https://www.askable.com/",
    logo: `${import.meta.env.BASE_URL}img/askable.svg`,
    current: true,
  },
  {
    name: "Outlier AI",
    role: "AI Quality Assurance Specialist",
    url: "https://outlier.ai/",
    logo: `${import.meta.env.BASE_URL}img/outlier.svg`,
    current: false,
  },
];
