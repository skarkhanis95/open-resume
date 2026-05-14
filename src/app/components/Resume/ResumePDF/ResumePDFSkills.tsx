import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeSkills } from "lib/redux/types";

export const ResumePDFSkills = ({
  heading,
  skills,
  themeColor,
}: {
  heading: string;
  skills: ResumeSkills;
  themeColor: string;
  showBulletPoints: boolean;
}) => {
  const visibleCategories = skills.filter(
    ({ name, skills }) => name.trim() || skills.trim()
  );

  if (visibleCategories.length === 0) return null;

  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      <View
        style={{
          ...styles.flexCol,
          gap: spacing["2"],
          marginTop: spacing["0.5"],
        }}
      >
        {visibleCategories.map(({ name, skills }, idx) => (
          <View
            key={idx}
            style={{ ...styles.flexRow, alignItems: "flex-start" }}
            wrap={false}
          >
            {name.trim() ? (
              <ResumePDFText
                bold={true}
                style={{
                  width: "120pt",
                  paddingRight: spacing["2"],
                  lineHeight: 1.5,
                }}
              >
                {name.trim()}
              </ResumePDFText>
            ) : null}
            <ResumePDFText
              style={{ flexGrow: 1, flexBasis: 0, lineHeight: 1.5 }}
            >
              {skills.trim()}
            </ResumePDFText>
          </View>
        ))}
      </View>
    </ResumePDFSection>
  );
};
