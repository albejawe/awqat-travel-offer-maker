import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Upload, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  min_price?: string;
  created_at: string;
}

interface CategoryManagerProps {
  user: any;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ user }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    min_price: '',
    image: null as File | null
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل الفئات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الفئة",
        variant: "destructive",
      });
      return;
    }

    try {
      let imageUrl = editingCategory?.image_url || null;

      // Upload image if provided
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `category_${Date.now()}.${fileExt}`;
        const filePath = `categories/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('offer-images')
          .upload(filePath, formData.image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('offer-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const categoryData = {
        name: formData.name,
        description: formData.description || null,
        min_price: formData.min_price || null,
        image_url: imageUrl,
        user_id: user.id
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update({ ...categoryData, updated_at: new Date().toISOString() })
          .eq('id', editingCategory.id);

        if (error) throw error;

        toast({
          title: "تم التحديث",
          description: "تم تحديث الفئة بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert(categoryData);

        if (error) throw error;

        toast({
          title: "تم الحفظ",
          description: "تم إنشاء الفئة بنجاح",
        });
      }

      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', min_price: '', image: null });
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      min_price: category.min_price || '',
      image: null
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف الفئة بنجاح",
      });
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "خطأ في الحذف",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleNewCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', min_price: '', image: null });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">جارٍ تحميل الفئات...</div>;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">إدارة الفئات</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewCategory} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              إضافة فئة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">اسم الفئة</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: رحلات أوروبا"
                  required
                  dir="rtl"
                />
              </div>

              <div>
                <Label htmlFor="description">الوصف (اختياري)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف مختصر للفئة"
                  dir="rtl"
                />
              </div>

              <div>
                <Label htmlFor="min_price">أقل سعر (اختياري)</Label>
                <Input
                  id="min_price"
                  value={formData.min_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_price: e.target.value }))}
                  placeholder="مثال: 200 د.ك"
                  dir="rtl"
                />
              </div>

              <div>
                <Label htmlFor="image">صورة الفئة</Label>
                <div className="mt-1 flex items-center justify-center w-full">
                  <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">اضغط لرفع صورة</span>
                      </p>
                    </div>
                    <input
                      id="image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
                    />
                  </label>
                </div>
                {formData.image && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ تم اختيار {formData.image.name}
                  </p>
                )}
                {editingCategory?.image_url && !formData.image && (
                  <p className="text-sm text-blue-600 mt-2">
                    ✓ صورة محفوظة مسبقاً
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingCategory ? 'تحديث' : 'حفظ'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">لا توجد فئات محفوظة</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              {category.image_url && (
                <div className="h-32 overflow-hidden">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{category.name}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {category.description && (
                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                )}
                {category.min_price && (
                  <p className="text-sm font-semibold text-green-600">
                    يبدأ من: {category.min_price}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  تاريخ الإنشاء: {new Date(category.created_at).toLocaleDateString('ar')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};