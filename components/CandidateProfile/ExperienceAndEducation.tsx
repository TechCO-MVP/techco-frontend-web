import { Briefcase, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { HiringProcess } from "@/types";

export const ExperienceAndEducation = ({
  hiringProcess,
}: {
  hiringProcess: HiringProcess;
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Experience Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Briefcase className="h-6 w-6 text-teal-500" />
            <span>Experiencia</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hiringProcess?.profile.experience?.map((experience, idx) => {
            return (
              <div key={idx} className="flex items-start space-x-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-100">
                  <Briefcase className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {experience.company}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {experience.start_date} - {experience.end_date}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Education Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl">
            <GraduationCap className="h-6 w-6 text-teal-500" />
            <span>Educación</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hiringProcess?.profile.education?.map((education, idx) => {
            return (
              <div key={idx} className="flex items-start space-x-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-100">
                  <GraduationCap className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {education.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {education.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    {education.start_year} - {education.end_year}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
