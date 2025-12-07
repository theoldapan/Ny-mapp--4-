namespace HPCDSystem.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalMembers { get; set; }
        public int ActiveMembers { get; set; }
        public int TotalSubscriptions { get; set; }
        public int ActiveSubscriptions { get; set; }
        public int TotalFacilities { get; set; }
        public int AvailableFacilities { get; set; }
        public int TotalBlogPosts { get; set; }
        public int PublishedPosts { get; set; }
        public int TotalClasses { get; set; }
        public int ActiveClasses { get; set; }
        public List<MemberDto> RecentMembers { get; set; } = new();
        public List<BlogPostDto> RecentPosts { get; set; } = new();
    }
}
