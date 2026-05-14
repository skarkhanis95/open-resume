import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeWorkExperience } from "lib/redux/types";

export const ResumePDFWorkExperience = ({
  heading,
  workExperiences,
  themeColor,
}: {
  heading: string;
  workExperiences: ResumeWorkExperience[];
  themeColor: string;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const [firstBullet, ...restBullets] = descriptions;
        return (
          <View key={idx} style={{ marginBottom: spacing["3"] }}>
            {/* Header sticks with the first bullet so a header doesn't strand alone */}
            <View wrap={false}>
              <View
                style={{
                  ...styles.flexRowBetween,
                  alignItems: "flex-start",
                  gap: spacing["3"],
                }}
              >
                <View style={{ ...styles.flexCol, flex: 1 }}>
                  {company ? (
                    <ResumePDFText bold={true} style={{ fontSize: "11pt" }}>
                      {company}
                    </ResumePDFText>
                  ) : null}
                  {jobTitle ? (
                    <ResumePDFText style={{ color: "#444444" }}>
                      {jobTitle}
                    </ResumePDFText>
                  ) : null}
                </View>
                {date ? (
                  <ResumePDFText style={{ color: "#444444" }}>{date}</ResumePDFText>
                ) : null}
              </View>
              {firstBullet !== undefined && (
                <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
                  <ResumePDFBulletList items={[firstBullet]} />
                </View>
              )}
            </View>
            {restBullets.length > 0 && (
              <View style={{ ...styles.flexCol }}>
                <ResumePDFBulletList items={restBullets} />
              </View>
            )}
          </View>
        );
      })}
    </ResumePDFSection>
  );
};
