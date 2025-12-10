using System.ComponentModel.DataAnnotations;

namespace HPCDSystem.Models
{
    public class Member
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;
        
        [Required]
        public DateTime DateOfBirth { get; set; }
        
        [Required]
        [MaxLength(10)]
        public string Gender { get; set; } = string.Empty;
        
        [MaxLength(200)]
        public string Address { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string City { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string PostalCode { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(20)]
        public string MembershipStatus { get; set; } = "Active";
        
        public DateTime JoinDate { get; set; } = DateTime.UtcNow;
        
        public Guid? SubscriptionId { get; set; }
        
        public string? ProfileImage { get; set; }
        
        [MaxLength(100)]
        public string? EmergencyContact { get; set; }
        
        [MaxLength(20)]
        public string? EmergencyPhone { get; set; }
        
        [MaxLength(1000)]
        public string? Notes { get; set; }
    }
}
