namespace HPCDSystem.Models;

public class SubscriptionPlan
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Duration { get; set; }
    public List<string> Features { get; set; } = new();
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class MemberSubscription
{
    public Guid Id { get; set; }
    public Guid MemberId { get; set; }
    public Guid PlanId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = "Active";
    public string PaymentStatus { get; set; } = "Pending";
    
    public Member? Member { get; set; }
    public SubscriptionPlan? Plan { get; set; }
}
