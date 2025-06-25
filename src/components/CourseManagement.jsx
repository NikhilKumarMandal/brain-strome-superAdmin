import React, { useState } from "react";
import { BookOpen, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getAllCourses, updateTeamSize } from "../http/api";
import { useMutation, useQuery } from "@tanstack/react-query";

const courses = async () => {
  const { data } = await getAllCourses();
  return data.data;
};

const updateTeam = async ({ courseId, newSize }) => {
  console.log("Sending:", { courseId, newSize });
  const { data } = await updateTeamSize(courseId, newSize);
  return data;
};

const CourseManagement = () => {
  // const [courses, setCourses] = useState();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [newTeamSize, setNewTeamSize] = useState("");

  const { data: courseData } = useQuery({
    queryKey: ["course"],
    queryFn: courses,
    staleTime: 600_000,
    cacheTime: 600_000,
  });

  console.log("he", courseData);

  const { mutate } = useMutation({
    mutationKey: ["updateTeam"],
    mutationFn: updateTeam,
    onSuccess: () => {
      toast.success("Team Size Update");
    },
  });

  const handleUpdateTeamSize = () => {
    if (!selectedCourse || !newTeamSize) {
      toast({
        title: "Missing Information",
        description: "Please select a course and enter a team size.",
        variant: "destructive",
      });
      return;
    }

    const newSize = parseInt(newTeamSize);

    mutate({ courseId: selectedCourse, newSize });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Course & Team Management</span>
          </CardTitle>
          <CardDescription>update team sizes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />

          <div className="space-y-4">
            <label className="text-sm font-medium">
              Update Course Team Size
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" className="text-black">
                  Select Course
                </option>
                {courseData?.map((course) => (
                  <option
                    key={course?.id}
                    value={course?.id}
                    className="text-black"
                  >
                    {course?.name}
                  </option>
                ))}
              </select>

              <Input
                type="number"
                placeholder="Team size"
                value={newTeamSize}
                onChange={(e) => setNewTeamSize(e.target.value)}
                min="1"
                max="20"
              />

              <Button onClick={handleUpdateTeamSize} className="bg-primary">
                <Edit className="h-4 w-4 mr-2" />
                Update Size
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseManagement;
