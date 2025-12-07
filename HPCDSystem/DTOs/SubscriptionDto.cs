using System.ComponentModel.DataAnnotations;

namespace HPCDSystem.DTOs;

public class SubscriptionPlanDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Duration { get; set; }
    public List<string> Features { get; set; } = new();
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateSubscriptionPlanDto
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    [Required, Range(0, 100000)]
    public decimal Price { get; set; }
    [Required, Range(1, 3650)]
    public int Duration { get; set; }
    public List<string> Features { get; set; } = new();
    public bool IsActive { get; set; } = true;
}

public class UpdateSubscriptionPlanDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public int? Duration { get; set; }
    public List<string>? Features { get; set; }
    public bool? IsActive { get; set; }
}

public class MemberSubscriptionDto
{
    public Guid Id { get; set; }
    public Guid MemberId { get; set; }
    public Guid PlanId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
}

public class CreateMemberSubscriptionDto
{
    [Required]
    public Guid MemberId { get; set; }
    [Required]
    public Guid PlanId { get; set; }
    [Required]
    public DateTime StartDate { get; set; }
    [Required]
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = "Active";
    public string PaymentStatus { get; set; } = "Pending";
}
