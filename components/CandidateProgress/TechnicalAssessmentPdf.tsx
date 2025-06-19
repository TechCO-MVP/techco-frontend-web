import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { TechnicalAssessment } from "@/types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 20,
  },
  skillTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  skillDesc: {
    marginBottom: 10,
  },
  dimensionBlock: {
    marginBottom: 10,
    paddingLeft: 10,
    borderLeft: "2px solid #ccc",
  },
  question: {
    marginBottom: 2,
  },
  answer: {
    fontStyle: "italic",
  },
});

type Props = {
  technicalAssessment: TechnicalAssessment;
  response: string;
};

export const TechnicalAssessmentPdf = ({
  technicalAssessment,
  response,
}: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.skillTitle}>
          {technicalAssessment.business_case_title}
        </Text>
      </View>
      <View style={styles.section}>
        <View style={styles.dimensionBlock}>
          <Text style={styles.question}>
            <Text style={{ fontWeight: "bold" }}>Objetivo:</Text>
            {technicalAssessment.assesment_goal}
          </Text>
          <View style={{ height: 12 }} />
          <Text style={styles.question}>
            <Text style={{ fontWeight: "bold" }}>El Reto:</Text>
            {technicalAssessment.challenge}
          </Text>
          <View style={{ height: 12 }} />
          <Text style={styles.question}>
            <Text style={{ fontWeight: "bold" }}>Misión:</Text>
            {technicalAssessment.your_mission}
          </Text>
          <View style={{ height: 12 }} />

          <Text style={styles.answer}>
            Respuesta del candidato:
            {response || "[Sin respuesta]"}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);
