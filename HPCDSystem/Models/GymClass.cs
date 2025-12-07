namespace HPCDSystem.Models;

public class GymClass
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid InstructorId { get; set; }
    public string InstructorName { get; set; } = string.Empty;
    public Guid? FacilityId { get; set; }
    public string? FacilityName { get; set; }
    public int DayOfWeek { get; set; } // 0-6 (Sunday-Saturday)
    public string StartTime { get; set; } = string.Empty; // HH:mm
    public string EndTime { get; set; } = string.Empty; // HH:mm
    public int Capacity { get; set; }
    public int Enrolled { get; set; }
    public string Level { get; set; } = "All Levels"; // Beginner, Intermediate, Advanced, All Levels
    public string Category { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ClassRegistration
{
    public Guid Id { get; set; }
    public Guid ClassId { get; set; }
    public Guid MemberId { get; set; }
    public string MemberName { get; set; } = string.Empty;
    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Registered"; // Registered, Attended, NoShow, Cancelled
    
    public GymClass? GymClass { get; set; }
}
