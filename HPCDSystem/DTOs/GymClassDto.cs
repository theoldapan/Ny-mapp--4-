using System.ComponentModel.DataAnnotations;

namespace HPCDSystem.DTOs;

public class GymClassDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid InstructorId { get; set; }
    public string InstructorName { get; set; } = string.Empty;
    public Guid? FacilityId { get; set; }
    public string? FacilityName { get; set; }
    public int DayOfWeek { get; set; }
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public int Enrolled { get; set; }
    public string Level { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateGymClassDto
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? InstructorId { get; set; }  // Changed from Guid to string?
    [Required]
    public string InstructorName { get; set; } = string.Empty;
    public Guid? FacilityId { get; set; }
    public string? FacilityName { get; set; }
    [Required, Range(0, 6)]
    public int DayOfWeek { get; set; }
    [Required]
    public string StartTime { get; set; } = string.Empty;
    [Required]
    public string EndTime { get; set; } = string.Empty;
    [Required, Range(1, 500)]
    public int Capacity { get; set; }
    public string Level { get; set; } = "All Levels";
    public string Category { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class UpdateGymClassDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public Guid? InstructorId { get; set; }
    public string? InstructorName { get; set; }
    public Guid? FacilityId { get; set; }
    public string? FacilityName { get; set; }
    public int? DayOfWeek { get; set; }
    public string? StartTime { get; set; }
    public string? EndTime { get; set; }
    public int? Capacity { get; set; }
    public string? Level { get; set; }
    public string? Category { get; set; }
    public bool? IsActive { get; set; }
}

public class ClassRegistrationDto
{
    public Guid Id { get; set; }
    public Guid ClassId { get; set; }
    public Guid MemberId { get; set; }
    public string MemberName { get; set; } = string.Empty;
    public DateTime RegisteredAt { get; set; }
    public string Status { get; set; } = string.Empty;
}
