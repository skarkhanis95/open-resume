import type { ResumeSkills } from "lib/redux/types";
import type { ResumeSectionToLines } from "lib/parse-resume-from-pdf/types";
import { getSectionLinesByKeywords } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/get-section-lines";
import {
  getBulletPointsFromLines,
  getDescriptionsLineIdx,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/bullet-points";

export const extractSkills = (sections: ResumeSectionToLines) => {
  const lines = getSectionLinesByKeywords(sections, ["skill"]);
  const descriptionsLineIdx = getDescriptionsLineIdx(lines) ?? 0;
  const descriptionsLines = lines.slice(descriptionsLineIdx);
  const descriptions = getBulletPointsFromLines(descriptionsLines);

  // The new template uses grouped skills (category → comma-separated items).
  // PDF extraction can't reliably infer the user's category structure, so we
  // drop everything into a single uncategorized group and let the user
  // organize it from the form.
  const joined = descriptions
    .map((d) => d.trim())
    .filter(Boolean)
    .join(", ");

  const skills: ResumeSkills = joined
    ? [{ name: "", skills: joined }]
    : [{ name: "", skills: "" }];

  return { skills };
};
