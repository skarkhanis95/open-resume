import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeProject } from "lib/redux/types";

export const ResumePDFProject = ({
  heading,
  projects,
  themeColor,
}: {
  heading: string;
  projects: ResumeProject[];
  themeColor: string;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {projects.map(({ project, date, descriptions }, idx) => {
        const [firstBullet, ...restBullets] = descriptions;
        return (
          <View key={idx} style={{ marginBottom: spacing["3"] }}>
            <View wrap={false}>
              <View
                style={{
                  ...styles.flexRowBetween,
                  alignItems: "flex-start",
                  gap: spacing["3"],
                }}
              >
                {project ? (
                  <ResumePDFText bold={true} style={{ fontSize: "11pt", flex: 1 }}>
                    {project}
                  </ResumePDFText>
                ) : (
                  <View style={{ flex: 1 }} />
                )}
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
