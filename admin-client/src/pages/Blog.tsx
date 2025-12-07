import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { SearchInput } from '@/components/shared/SearchInput';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { blogService } from '@/services/blogService';
import { BlogPost } from '@/types';
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, Send, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'News',
    tags: '',
    status: 'Draft' as BlogPost['status'],
  });

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.category.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [posts, search]);

  const loadPosts = async () => {
    try {
      const data = await blogService.getAll();
      setPosts(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load blog posts', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        status: formData.status,
        author: user ? `${user.firstName} ${user.lastName}` : 'Admin',
        authorId: user?.id || '1',
        publishedAt: formData.status === 'Published' ? new Date().toISOString() : undefined,
      };

      if (editingPost) {
        const updated = await blogService.update(editingPost.id, postData);
        setPosts(posts.map(p => p.id === editingPost.id ? updated : p));
        toast({ title: 'Success', description: 'Post updated successfully' });
      } else {
        const newPost = await blogService.create(postData);
        setPosts([newPost, ...posts]);
        toast({ title: 'Success', description: 'Post created successfully' });
      }
      closeDialog();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save post', variant: 'destructive' });
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const updated = await blogService.publish(id);
      setPosts(posts.map(p => p.id === id ? updated : p));
      toast({ title: 'Success', description: 'Post published successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to publish post', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await blogService.delete(id);
      setPosts(posts.filter(p => p.id !== id));
      toast({ title: 'Success', description: 'Post deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete post', variant: 'destructive' });
    }
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags.join(', '),
      status: post.status,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingPost(null);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'News',
      tags: '',
      status: 'Draft',
    });
  };

  const columns = [
    {
      key: 'title',
      header: 'Post',
      render: (post: BlogPost) => (
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{post.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (post: BlogPost) => (
        <Badge variant="secondary">{post.category}</Badge>
      ),
    },
    { key: 'author', header: 'Author' },
    {
      key: 'date',
      header: 'Date',
      render: (post: BlogPost) => (
        <span className="text-sm text-muted-foreground">
          {new Date(post.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (post: BlogPost) => <StatusBadge status={post.status} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      render: (post: BlogPost) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onClick={() => { setSelectedPost(post); setIsViewDialogOpen(true); }}>
              <Eye className="mr-2 h-4 w-4" /> Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEditDialog(post)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            {post.status === 'Draft' && (
              <DropdownMenuItem onClick={() => handlePublish(post.id)}>
                <Send className="mr-2 h-4 w-4" /> Publish
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(post.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AdminLayout title="Blog" description="Manage blog posts and content">
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Search posts..." className="w-full sm:w-80" />
        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); else setIsDialogOpen(true); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
              <DialogDescription>Write and manage your blog content.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter post title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Brief summary of the post" rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Write your post content here..." rows={8} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="News">News</SelectItem>
                      <SelectItem value="Health Tips">Health Tips</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="Nutrition">Nutrition</SelectItem>
                      <SelectItem value="Events">Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as BlogPost['status'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="fitness, health, tips" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button onClick={handleSubmit}>{editingPost ? 'Update' : 'Create'} Post</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={filteredPosts} isLoading={isLoading} emptyMessage="No blog posts found" />

      {/* Preview Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post Preview</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <article className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedPost.category}</Badge>
                <StatusBadge status={selectedPost.status} />
              </div>
              <h2 className="text-2xl font-bold">{selectedPost.title}</h2>
              <p className="text-muted-foreground">{selectedPost.excerpt}</p>
              <div className="text-sm text-muted-foreground">
                By {selectedPost.author} • {new Date(selectedPost.updatedAt).toLocaleDateString()}
              </div>
              <hr className="border-border" />
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
              <div className="flex flex-wrap gap-1">
                {selectedPost.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </article>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
