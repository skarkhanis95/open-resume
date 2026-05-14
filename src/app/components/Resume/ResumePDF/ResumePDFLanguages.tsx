import {
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { spacing } from "components/Resume/ResumePDF/styles";

export const ResumePDFLanguages = ({
  languages,
  themeColor,
}: {
  languages: string;
  themeColor: string;
}) => {
  const trimmed = languages.trim();
  if (!trimmed) return null;

  return (
    <ResumePDFSection themeColor={themeColor} heading="Languages">
      <ResumePDFText style={{ lineHeight: 1.6, marginTop: spacing["0.5"] }}>
        {trimmed}
      </ResumePDFText>
    </ResumePDFSection>
  );
};
