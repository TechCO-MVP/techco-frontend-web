// app/pdf/CulturalAssessmentPdf.tsx

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { AssessmentSoftSkill } from "@/types";

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
  softSkills: AssessmentSoftSkill[];
  responses: Record<string, Record<string, string>>;
};

export const CulturalAssessmentPdf = ({ softSkills, responses }: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {softSkills.map((skill, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.skillTitle}>Habidad: {skill.name}</Text>

          {skill.dimensions.map((dimension, dimIndex) => (
            <View key={dimIndex} style={styles.dimensionBlock}>
              <Text style={styles.question}>
                <Text style={{ fontWeight: "bold" }}>Dimensión:</Text>
                {dimension.name}
              </Text>
              <Text style={styles.question}>
                Pregunta: {dimension.question}
              </Text>
              <Text style={styles.answer}>
                Respuesta del candidato:
                {responses[skill.name]?.[dimension.name] || "[Sin respuesta]"}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);
