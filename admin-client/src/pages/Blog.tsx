import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { blogService } from "@/services/blogService";
import { BlogPost } from "@/types";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Send,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "News",
    tags: "",
    status: "Draft" as BlogPost["status"],
  });

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
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
      toast({
        title: "Fel",
        description: "Kunde inte ladda blogginlägg",
        variant: "destructive",
      });
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
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        status: formData.status,
        author: user ? `${user.firstName} ${user.lastName}` : "Admin",
        authorId: user?.id || "1",
        publishedAt:
          formData.status === "Published"
            ? new Date().toISOString()
            : undefined,
      };

      if (editingPost) {
        const updated = await blogService.update(editingPost.id, postData);
        setPosts(posts.map((p) => (p.id === editingPost.id ? updated : p)));
        toast({ title: "Klart", description: "Inlägg uppdaterat" });
      } else {
        const newPost = await blogService.create(postData);
        setPosts([newPost, ...posts]);
        toast({ title: "Klart", description: "Inlägg skapat" });
      }
      closeDialog();
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte spara inlägg",
        variant: "destructive",
      });
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const updated = await blogService.publish(id);
      setPosts(posts.map((p) => (p.id === id ? updated : p)));
      toast({ title: "Klart", description: "Inlägg publicerat" });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte publicera inlägg",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await blogService.delete(id);
      setPosts(posts.filter((p) => p.id !== id));
      toast({ title: "Klart", description: "Inlägg borttaget" });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte ta bort inlägg",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags.join(", "),
      status: post.status,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingPost(null);
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category: "News",
      tags: "",
      status: "Draft",
    });
  };

  const columns = [
    {
      key: "title",
      header: "Inlägg",
      render: (post: BlogPost) => (
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{post.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {post.excerpt}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      render: (post: BlogPost) => (
        <Badge variant="secondary">{post.category}</Badge>
      ),
    },
    { key: "author", header: "Författare" },
    {
      key: "date",
      header: "Datum",
      render: (post: BlogPost) => (
        <span className="text-sm text-muted-foreground">
          {new Date(post.updatedAt).toLocaleDateString("sv-SE")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (post: BlogPost) => <StatusBadge status={post.status} />,
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      render: (post: BlogPost) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem
              onClick={() => {
                setSelectedPost(post);
                setIsViewDialogOpen(true);
              }}
            >
              <Eye className="mr-2 h-4 w-4" /> Förhandsgranska
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEditDialog(post)}>
              <Pencil className="mr-2 h-4 w-4" /> Redigera
            </DropdownMenuItem>
            {post.status === "Draft" && (
              <DropdownMenuItem onClick={() => handlePublish(post.id)}>
                <Send className="mr-2 h-4 w-4" /> Publicera
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(post.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Ta bort
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AdminLayout title="Blogg" description="Hantera blogginlägg och innehåll">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Sök inlägg..."
          className="w-full sm:w-80"
        />
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) closeDialog();
            else setIsDialogOpen(true);
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Nytt Inlägg
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? "Redigera Inlägg" : "Skapa Nytt Inlägg"}
              </DialogTitle>
              <DialogDescription>
                Skriv och hantera ditt blogginnehåll.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ange inläggets titel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Sammanfattning</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Kort sammanfattning av inlägget"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Innehåll</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Skriv ditt inlägg här..."
                  rows={8}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="News">Nyheter</SelectItem>
                      <SelectItem value="Health Tips">Hälsotips</SelectItem>
                      <SelectItem value="Training">Träning</SelectItem>
                      <SelectItem value="Nutrition">Kost</SelectItem>
                      <SelectItem value="Events">Evenemang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value as BlogPost["status"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Utkast</SelectItem>
                      <SelectItem value="Published">Publicerad</SelectItem>
                      <SelectItem value="Archived">Arkiverad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Taggar (kommaseparerade)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="fitness, hälsa, tips"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeDialog}>
                Avbryt
              </Button>
              <Button onClick={handleSubmit}>
                {editingPost ? "Uppdatera" : "Skapa"} Inlägg
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={filteredPosts}
        isLoading={isLoading}
        emptyMessage="Inga blogginlägg hittades"
      />

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Förhandsgranskning</DialogTitle>
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
                Av {selectedPost.author} •{" "}
                {new Date(selectedPost.updatedAt).toLocaleDateString("sv-SE")}
              </div>
              <hr className="border-border" />
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
              <div className="flex flex-wrap gap-1">
                {selectedPost.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </article>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
