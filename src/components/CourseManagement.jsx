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

const CourseManagement = () => {
  const [courses, setCourses] = useState([
    {
      id: "1",
      title: "React Advanced Concepts",
      description:
        "Deep dive into advanced React patterns, hooks, and performance optimization techniques.",
      duration: "8 weeks",
      difficulty: "Advanced",
      maxTeamSize: 6,
      enrolledTeams: 3,
      category: "Frontend Development",
      createdDate: "2024-06-01",
      status: "active",
    },
    {
      id: "2",
      title: "Node.js Backend Development",
      description:
        "Complete guide to building scalable backend applications with Node.js and Express.",
      duration: "10 weeks",
      difficulty: "Intermediate",
      maxTeamSize: 8,
      enrolledTeams: 5,
      category: "Backend Development",
      createdDate: "2024-05-15",
      status: "active",
    },
  ]);

  const [courseTitle, setCourseTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [newTeamSize, setNewTeamSize] = useState("");

  const handleCreateCourse = () => {
    if (!courseTitle.trim()) {
      toast({
        title: "Course Title Required",
        description: "Please enter a course title.",
        variant: "destructive",
      });
      return;
    }

    const course = {
      id: Date.now().toString(),
      title: courseTitle,
      description: "Course created by admin",
      duration: "4 weeks",
      difficulty: "Beginner",
      maxTeamSize: 5,
      enrolledTeams: 0,
      category: "General",
      createdDate: new Date().toISOString().split("T")[0],
      status: "draft",
    };

    setCourses([...courses, course]);
    setCourseTitle("");

    toast({
      title: "Course Created",
      description: `Successfully created course: ${course.title}`,
    });
  };

  const handleUpdateTeamSize = () => {
    if (!selectedCourse || !newTeamSize) {
      toast({
        title: "Missing Information",
        description: "Please select a course and enter a team size.",
        variant: "destructive",
      });
      return;
    }

    const teamSizeNum = parseInt(newTeamSize);
    if (isNaN(teamSizeNum) || teamSizeNum < 1) {
      toast({
        title: "Invalid Team Size",
        description: "Please enter a valid team size (minimum 1).",
        variant: "destructive",
      });
      return;
    }

    setCourses(
      courses.map((course) =>
        course.id === selectedCourse
          ? { ...course, maxTeamSize: teamSizeNum }
          : course
      )
    );

    const course = courses.find((c) => c.id === selectedCourse);
    setSelectedCourse("");
    setNewTeamSize("");

    toast({
      title: "Team Size Updated",
      description: `Updated team size for "${course?.title}" to ${teamSizeNum} members`,
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
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

              <Button
                onClick={handleUpdateTeamSize}
                className="bg-green-600 hover:bg-green-700"
              >
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
