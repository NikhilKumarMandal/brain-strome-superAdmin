import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, Loader2Icon } from "lucide-react";
import { sendMail } from "../http/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const sendBulkMail = async ({ subject, intro, outro }) => {
  const { data } = await sendMail(subject, intro, outro);
  return data;
};

function SendEmailPage() {
  const [subject, setSubject] = useState("");
  const [intro, setIntro] = useState("");
  const [outro, setOutro] = useState("");

  const { mutate, isPending } = useMutation({
    mutationKey: ["sendMail"],
    mutationFn: sendBulkMail,
    onSuccess: () => {
      toast.success("Emails sent successfully!");
      setSubject("");
      setIntro("");
      setOutro("");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.errors?.[0]?.msg ||
        "Something went wrong";

      toast.error(message);
    },
  });

  const handleSendMail = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !intro.trim() || !outro.trim()) {
      toast.error("Please fill in all fields before sending");
      return;
    }
    mutate({ subject, intro, outro });
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-gray-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Send Mails</h1>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl text-gray-800 flex items-center">
              <Send className="h-5 w-5 mr-2 text-gray-600" />
              New Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMail} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="subject"
                  className="text-sm font-medium text-gray-700"
                >
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Enter email subject..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="intro"
                  className="text-sm font-medium text-gray-700"
                >
                  intro
                </Label>
                <Textarea
                  id="intro"
                  placeholder="Write your email introduction here..."
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  rows={4}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 border-gray-200 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="outro"
                  className="text-sm font-medium text-gray-700"
                >
                  outro
                </Label>
                <Textarea
                  id="outro"
                  placeholder="Write your email conclusion here..."
                  value={outro}
                  onChange={(e) => setOutro(e.target.value)}
                  rows={4}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 border-gray-200 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r bg-primary text-white font-medium py-3 transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100"
              >
                {isPending ? (
                  <div className="p-3 rounded-lg mb-2 flex gap-2 items-center">
                    <Loader2Icon className="animate-spin" />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Your email will be processed securely
          </p>
        </div>
      </div>
    </div>
  );
}

export default SendEmailPage;
