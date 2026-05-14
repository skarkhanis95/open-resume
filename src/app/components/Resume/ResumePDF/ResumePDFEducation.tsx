import { View } from "@react-pdf/renderer";
import {
  ResumePDFBulletList,
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeEducation } from "lib/redux/types";

export const ResumePDFEducation = ({
  heading,
  educations,
  themeColor,
  showBulletPoints,
}: {
  heading: string;
  educations: ResumeEducation[];
  themeColor: string;
  showBulletPoints: boolean;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {educations.map(
        ({ school, degree, date, gpa, descriptions = [] }, idx) => {
          const showDescriptions = descriptions.join("").trim() !== "";
          const degreeLine = gpa
            ? `${degree} — ${Number(gpa) ? `${gpa} GPA` : gpa}`
            : degree;

          const [firstBullet, ...restBullets] = descriptions;
          return (
            <View key={idx} style={{ marginBottom: spacing["2"] }}>
              <View wrap={false}>
                <View
                  style={{
                    ...styles.flexRowBetween,
                    alignItems: "flex-start",
                    gap: spacing["3"],
                  }}
                >
                  <View style={{ ...styles.flexCol, flex: 1 }}>
                    {degreeLine ? (
                      <ResumePDFText bold={true} style={{ fontSize: "11pt" }}>
                        {degreeLine}
                      </ResumePDFText>
                    ) : null}
                    {school ? (
                      <ResumePDFText style={{ color: "#444444" }}>
                        {school}
                      </ResumePDFText>
                    ) : null}
                  </View>
                  {date ? (
                    <ResumePDFText style={{ color: "#444444" }}>
                      {date}
                    </ResumePDFText>
                  ) : null}
                </View>
                {showDescriptions && firstBullet !== undefined && (
                  <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
                    <ResumePDFBulletList
                      items={[firstBullet]}
                      showBulletPoints={showBulletPoints}
                    />
                  </View>
                )}
              </View>
              {showDescriptions && restBullets.length > 0 && (
                <View style={{ ...styles.flexCol }}>
                  <ResumePDFBulletList
                    items={restBullets}
                    showBulletPoints={showBulletPoints}
                  />
                </View>
              )}
            </View>
          );
        }
      )}
    </ResumePDFSection>
  );
};
