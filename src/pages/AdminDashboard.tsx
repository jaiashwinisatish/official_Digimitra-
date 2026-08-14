import { motion } from "framer-motion";
import { Plus, Edit, Trash2, LayoutDashboard, BookOpen } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/services/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AdminDashboard = () => {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin_courses"],
    queryFn: async () => {
      const { data } = await API.get("/courses");
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newCourse: any) => {
      return await API.post("/courses", newCourse);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_courses"] });
      toast.success("Course created successfully!");
      setIsCreateOpen(false);
    },
  });

  const [formData, setFormData] = useState({
    titleEn: "",
    titleMr: "",
    descEn: "",
    descMr: "",
    categoryEn: "",
    categoryMr: "",
    thumbnail: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title: { en: formData.titleEn, mr: formData.titleMr },
      description: { en: formData.descEn, mr: formData.descMr },
      category: { en: formData.categoryEn, mr: formData.categoryMr },
      thumbnail: formData.thumbnail,
      lessons: [],
    });
  };

  if (isLoading) return <div className="container py-20 text-center">Loading...</div>;

  return (
    <div className="container py-10 md:py-16 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LayoutDashboard className="text-primary" /> Admin Panel
          </h1>
          <p className="text-muted-foreground mt-1">Manage your courses and learning content.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4 mr-2" /> Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title (English)</Label>
                  <Input required value={formData.titleEn} onChange={e => setFormData({...formData, titleEn: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Title (Marathi)</Label>
                  <Input required value={formData.titleMr} onChange={e => setFormData({...formData, titleMr: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Description (English)</Label>
                  <Textarea required value={formData.descEn} onChange={e => setFormData({...formData, descEn: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Description (Marathi)</Label>
                  <Textarea required value={formData.descMr} onChange={e => setFormData({...formData, descMr: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category (English)</Label>
                  <Input required value={formData.categoryEn} onChange={e => setFormData({...formData, categoryEn: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Category (Marathi)</Label>
                  <Input required value={formData.categoryMr} onChange={e => setFormData({...formData, categoryMr: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Thumbnail URL</Label>
                <Input required value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} />
              </div>
              <Button type="submit" className="w-full h-12" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Course"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {courses.map((course: any) => (
          <motion.div
            key={course._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-5 rounded-2xl bg-card border border-border shadow-card flex items-center gap-6"
          >
            <img src={course.thumbnail} className="h-16 w-16 rounded-xl object-cover" />
            <div className="flex-1">
              <h3 className="font-bold">{course.title[language]}</h3>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.lessons?.length || 0} Lessons</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{course.category[language]}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
