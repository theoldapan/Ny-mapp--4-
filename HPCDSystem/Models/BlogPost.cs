using System.ComponentModel.DataAnnotations;

namespace HPCDSystem.Models
{
    public class BlogPost
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string Excerpt { get; set; } = string.Empty;
        
        [Required]
        public string Author { get; set; } = string.Empty;
        
        [Required]
        public Guid AuthorId { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Draft";
        
        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;
        
        public string Tags { get; set; } = string.Empty;
        
        public string? FeaturedImage { get; set; }
        
        public DateTime? PublishedAt { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
