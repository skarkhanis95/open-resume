import { View } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import {
  ResumePDFLink,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import {
  ResumePDFIcon,
  type IconType,
} from "components/Resume/ResumePDF/common/ResumePDFIcon";
import type { ResumeProfile } from "lib/redux/types";

export const ResumePDFProfile = ({
  profile,
  themeColor,
  isPDF,
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
}) => {
  const { name, headline, email, phone, url, location } = profile;

  const getUrlIcon = (value: string): IconType => {
    if (value.includes("github")) return "url_github";
    if (value.includes("linkedin")) return "url_linkedin";
    return "url";
  };

  const contactItems: {
    key: string;
    icon: IconType;
    value: string;
    src?: string;
  }[] = [];
  if (email)
    contactItems.push({
      key: "email",
      icon: "email",
      value: email,
      src: `mailto:${email}`,
    });
  if (phone)
    contactItems.push({
      key: "phone",
      icon: "phone",
      value: phone,
      src: `tel:${phone.replace(/[^\d+]/g, "")}`,
    });
  if (location)
    contactItems.push({ key: "location", icon: "location", value: location });
  if (url)
    contactItems.push({
      key: "url",
      icon: getUrlIcon(url),
      value: url,
      src: url.startsWith("http") ? url : `https://${url}`,
    });

  return (
    <View
      style={{
        ...styles.flexRow,
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: spacing["6"],
      }}
    >
      <View style={{ ...styles.flexCol, flex: 1 }}>
        <ResumePDFText
          bold={true}
          themeColor={themeColor}
          style={{ fontSize: "22pt", lineHeight: 1.1 }}
        >
          {name}
        </ResumePDFText>
        {headline ? (
          <ResumePDFText
            bold={true}
            style={{
              fontSize: "11pt",
              lineHeight: 1.4,
              marginTop: spacing["2"],
              color: "#333333",
            }}
          >
            {headline}
          </ResumePDFText>
        ) : null}
      </View>
      {contactItems.length > 0 && (
        <View
          style={{
            ...styles.flexCol,
            width: "200pt",
            borderLeftWidth: "1pt",
            borderLeftStyle: "solid",
            borderLeftColor: themeColor || "#333333",
            paddingLeft: spacing["4"],
          }}
        >
          {contactItems.map(({ key, icon, value, src }) => {
            const text = (
              <ResumePDFText style={{ fontSize: "9.5pt", lineHeight: 1.5 }}>
                {value}
              </ResumePDFText>
            );
            return (
              <View
                key={key}
                style={{
                  ...styles.flexRow,
                  alignItems: "center",
                  gap: spacing["1"],
                  marginBottom: spacing["0.5"],
                }}
              >
                <ResumePDFIcon type={icon} isPDF={isPDF} />
                {src ? (
                  <ResumePDFLink src={src} isPDF={isPDF}>
                    {text}
                  </ResumePDFLink>
                ) : (
                  text
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};
