using HPCDSystem.Data;
using HPCDSystem.DTOs;
using HPCDSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HPCDSystem.Controllers;

[ApiController]
[Route("api/classes")]
[Authorize]
public class ClassController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ClassController(ApplicationDbContext context)
    {
        _context = context;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<GymClassDto>>> GetAll()
    {
        var classes = await _context.GymClasses.ToListAsync();
        return Ok(classes.Select(MapToDto));
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<GymClassDto>> GetById(Guid id)
    {
        var gymClass = await _context.GymClasses.FindAsync(id);
        if (gymClass == null) return NotFound();
        return Ok(MapToDto(gymClass));
    }


    [HttpPost]
    public async Task<ActionResult<GymClassDto>> Create(CreateGymClassDto dto)
    {

        Guid instructorId = Guid.Empty;
        if (!string.IsNullOrEmpty(dto.InstructorId) && Guid.TryParse(dto.InstructorId, out var parsedId))
        {
            instructorId = parsedId;
        }

        var gymClass = new GymClass
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description ?? string.Empty,
            InstructorId = instructorId,
            InstructorName = dto.InstructorName,
            FacilityId = dto.FacilityId,
            FacilityName = dto.FacilityName ?? string.Empty,
            DayOfWeek = dto.DayOfWeek,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Capacity = dto.Capacity,
            Enrolled = 0,
            Level = dto.Level,
            Category = dto.Category,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _context.GymClasses.Add(gymClass);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = gymClass.Id }, MapToDto(gymClass));
    }


    [HttpPut("{id}")]
    public async Task<ActionResult<GymClassDto>> Update(Guid id, UpdateGymClassDto dto)
    {
        var gymClass = await _context.GymClasses.FindAsync(id);
        if (gymClass == null) return NotFound();

        if (dto.Name != null) gymClass.Name = dto.Name;
        if (dto.Description != null) gymClass.Description = dto.Description;
        if (dto.InstructorId.HasValue) gymClass.InstructorId = dto.InstructorId.Value;
        if (dto.InstructorName != null) gymClass.InstructorName = dto.InstructorName;
        if (dto.FacilityId.HasValue) gymClass.FacilityId = dto.FacilityId;
        if (dto.FacilityName != null) gymClass.FacilityName = dto.FacilityName;
        if (dto.DayOfWeek.HasValue) gymClass.DayOfWeek = dto.DayOfWeek.Value;
        if (dto.StartTime != null) gymClass.StartTime = dto.StartTime;
        if (dto.EndTime != null) gymClass.EndTime = dto.EndTime;
        if (dto.Capacity.HasValue) gymClass.Capacity = dto.Capacity.Value;
        if (dto.Level != null) gymClass.Level = dto.Level;
        if (dto.Category != null) gymClass.Category = dto.Category;
        if (dto.IsActive.HasValue) gymClass.IsActive = dto.IsActive.Value;

        await _context.SaveChangesAsync();
        return Ok(MapToDto(gymClass));
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var gymClass = await _context.GymClasses.FindAsync(id);
        if (gymClass == null) return NotFound();

        _context.GymClasses.Remove(gymClass);
        await _context.SaveChangesAsync();
        return NoContent();
    }


    [HttpGet("{classId}/registrations")]
    public async Task<ActionResult<IEnumerable<ClassRegistrationDto>>> GetRegistrations(Guid classId)
    {
        var registrations = await _context.ClassRegistrations
            .Where(r => r.ClassId == classId)
            .ToListAsync();

        return Ok(registrations.Select(r => new ClassRegistrationDto
        {
            Id = r.Id,
            ClassId = r.ClassId,
            MemberId = r.MemberId,
            MemberName = r.MemberName,
            RegisteredAt = r.RegisteredAt,
            Status = r.Status
        }));
    }

    private static GymClassDto MapToDto(GymClass c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Description = c.Description,
        InstructorId = c.InstructorId,
        InstructorName = c.InstructorName,
        FacilityId = c.FacilityId,
        FacilityName = c.FacilityName,
        DayOfWeek = c.DayOfWeek,
        StartTime = c.StartTime,
        EndTime = c.EndTime,
        Capacity = c.Capacity,
        Enrolled = c.Enrolled,
        Level = c.Level,
        Category = c.Category,
        IsActive = c.IsActive,
        CreatedAt = c.CreatedAt
    };
}