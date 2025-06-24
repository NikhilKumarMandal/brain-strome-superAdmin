import React, { useState } from 'react';
import { Search, Users, BookOpen, } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserManagement from '../components/UserManagement';
import TeamManagement from '../components/TeamManagement';
import CourseManagement from '../components/CourseManagement';

function ControlPage() {
    const [activeTab, setActiveTab] = useState('users');

  return (
    <div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-lg p-1 shadow-sm">
            <TabsTrigger 
              value="users" 
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Search className="h-4 w-4" />
              <span>User Management</span>
            </TabsTrigger>
            <TabsTrigger 
              value="teams"
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Users className="h-4 w-4" />
              <span>Team Management</span>
            </TabsTrigger>
            <TabsTrigger 
              value="courses"
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <BookOpen className="h-4 w-4" />
              <span>Course Management</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="teams" className="space-y-6">
            <TeamManagement />
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-6">
            <CourseManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ControlPage