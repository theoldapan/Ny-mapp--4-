using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HPCDSystem.Data;
using HPCDSystem.DTOs;

namespace HPCDSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<DashboardStatsDto>> GetStats()
        {
            var stats = new DashboardStatsDto
            {
                TotalMembers = await _context.Members.CountAsync(),
                ActiveMembers = await _context.Members
                    .CountAsync(m => m.MembershipStatus == "Active"),
                
                TotalSubscriptions = await _context.SubscriptionPlans.CountAsync(),
                ActiveSubscriptions = await _context.SubscriptionPlans
                    .CountAsync(s => s.IsActive),
                
                TotalFacilities = await _context.Facilities.CountAsync(),
                AvailableFacilities = await _context.Facilities
                    .CountAsync(f => f.Status == "Open"),
                
                TotalBlogPosts = await _context.BlogPosts.CountAsync(),
                PublishedPosts = await _context.BlogPosts
                    .CountAsync(b => b.Status == "Published"),
                
                TotalClasses = await _context.GymClasses.CountAsync(),
ActiveClasses = await _context.GymClasses
    .CountAsync(c => c.IsActive),

                
                RecentMembers = await _context.Members
    .OrderByDescending(m => m.JoinDate)
    .Take(5)
    .Select(m => new MemberDto
    {
        Id = m.Id.ToString(),
        FirstName = m.FirstName,
        LastName = m.LastName,
        Email = m.Email,
        Phone = m.Phone,
        MembershipStatus = m.MembershipStatus,
        JoinDate = m.JoinDate.ToString("o")
    })
    .ToListAsync(),

RecentPosts = await _context.BlogPosts
    .OrderByDescending(b => b.CreatedAt)
    .Take(5)
    .Select(b => new BlogPostDto
    {
        Id = b.Id.ToString(),
        Title = b.Title,
        Author = b.Author,
        Status = b.Status,
        Category = b.Category,
        CreatedAt = b.CreatedAt.ToString("o"),
        PublishedAt = b.PublishedAt == null ? null : b.PublishedAt.Value.ToString("o")
    })
    .ToListAsync()

            };

            return Ok(stats);
        }
    }
}
