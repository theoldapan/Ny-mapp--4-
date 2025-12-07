using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HPCDSystem.Data;
using HPCDSystem.DTOs;
using HPCDSystem.Models;
using System.Security.Claims;


namespace HPCDSystem.Controllers
{
    [ApiController]
    [Route("api/blog")]
    [Authorize]
    public class BlogController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BlogController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/blog
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<BlogPostDto>>> GetAll()
        {
            var posts = await _context.BlogPosts
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(posts.Select(MapToDto));
        }

        // GET: api/blog/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<BlogPostDto>> GetById(Guid id)
        {
            var post = await _context.BlogPosts.FindAsync(id);

            if (post == null)
                return NotFound(new { message = "Blog post not found" });

            return Ok(MapToDto(post));
        }

        // POST: api/blog
        [HttpPost]
        public async Task<ActionResult<BlogPostDto>> Create(CreateBlogPostDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userName = User.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown";

            var post = new BlogPost
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Content = dto.Content,
                Excerpt = dto.Excerpt,
                Author = userName,
                AuthorId = Guid.TryParse(userId, out var authorGuid) ? authorGuid : Guid.Empty,
                Status = dto.Status,
                Category = dto.Category,
                Tags = string.Join(",", dto.Tags),
                FeaturedImage = dto.FeaturedImage,
                PublishedAt = dto.Status == "Published" ? DateTime.UtcNow : null,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = post.Id }, MapToDto(post));
        }

        // PUT: api/blog/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<BlogPostDto>> Update(Guid id, UpdateBlogPostDto dto)
        {
            var post = await _context.BlogPosts.FindAsync(id);

            if (post == null)
                return NotFound(new { message = "Blog post not found" });

            if (dto.Title != null) post.Title = dto.Title;
            if (dto.Content != null) post.Content = dto.Content;
            if (dto.Excerpt != null) post.Excerpt = dto.Excerpt;
            if (dto.Category != null) post.Category = dto.Category;
            if (dto.Tags != null) post.Tags = string.Join(",", dto.Tags);
            if (dto.FeaturedImage != null) post.FeaturedImage = dto.FeaturedImage;
            
            if (dto.Status != null)
            {
                // Set PublishedAt when first published
                if (dto.Status == "Published" && post.Status != "Published")
                {
                    post.PublishedAt = DateTime.UtcNow;
                }
                post.Status = dto.Status;
            }

            post.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(MapToDto(post));
        }

        // DELETE: api/blog/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var post = await _context.BlogPosts.FindAsync(id);

            if (post == null)
                return NotFound(new { message = "Blog post not found" });

            _context.BlogPosts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static BlogPostDto MapToDto(BlogPost post)
        {
            return new BlogPostDto
            {
                Id = post.Id.ToString(),
                Title = post.Title,
                Content = post.Content,
                Excerpt = post.Excerpt,
                Author = post.Author,
                AuthorId = post.AuthorId.ToString(),
                Status = post.Status,
                Category = post.Category,
                Tags = string.IsNullOrEmpty(post.Tags) 
                    ? Array.Empty<string>() 
                    : post.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries),
                FeaturedImage = post.FeaturedImage,
                PublishedAt = post.PublishedAt?.ToString("o"),
                CreatedAt = post.CreatedAt.ToString("o"),
                UpdatedAt = post.UpdatedAt.ToString("o")
            };
        }
    }
}
