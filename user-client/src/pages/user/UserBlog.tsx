import { useEffect, useState } from "react";
import { UserLayout } from "@/components/user/UserLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { blogService } from "@/services/blogService";
import { BlogPost } from "../../types";
import { Newspaper, Search, Calendar, User, Flame } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export default function UserBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await blogService.getAll();
        const published = data.filter((p) => p.status === "Published");
        setPosts(published);
        setFilteredPosts(published);
      } catch (error) {
        console.error("Failed to load blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }
    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, posts]);

  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <UserLayout>
      <div className="gym-gradient text-primary-foreground">
        <div className="container py-16">
          <div className="flex items-center gap-3 mb-4">
            <Flame className="h-8 w-8" />
            <Badge
              variant="secondary"
              className="bg-primary-foreground/20 text-primary-foreground border-0 uppercase tracking-wide font-bold"
            >
              Artiklar
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
            Bloggen
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-xl">
            Håll dig uppdaterad med de senaste hälsotipsen, träningsråden och
            nyheterna från Hälsoprofilen.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök artiklar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer uppercase font-bold"
              onClick={() => setSelectedCategory(null)}
            >
              Alla
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer uppercase font-bold"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-bold uppercase">
                Inga artiklar hittades
              </p>
              <p className="text-muted-foreground">
                Prova att justera din sökning eller filter.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer group border-0 shadow-lg"
              >
                <div className="h-48 gym-gradient flex items-center justify-center group-hover:from-primary/30 transition-colors">
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Newspaper className="h-16 w-16 text-primary-foreground/20" />
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="uppercase font-bold text-xs">
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold uppercase tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                    {post.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(post.publishedAt), "d MMM yyyy", {
                          locale: sv,
                        })}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
