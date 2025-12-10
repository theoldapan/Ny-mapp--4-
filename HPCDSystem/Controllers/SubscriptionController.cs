using HPCDSystem.Data;
using HPCDSystem.DTOs;
using HPCDSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HPCDSystem.Controllers;

[ApiController]
[Route("api/subscriptions")]
[Authorize]
public class SubscriptionController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SubscriptionController(ApplicationDbContext context)
    {
        _context = context;
    }

    
    [HttpGet("plans")]
    public async Task<ActionResult<IEnumerable<SubscriptionPlanDto>>> GetPlans()
    {
        var plans = await _context.SubscriptionPlans.ToListAsync();
        return Ok(plans.Select(MapToDto));
    }

    
    [HttpGet("plans/{id}")]
    public async Task<ActionResult<SubscriptionPlanDto>> GetPlan(Guid id)
    {
        var plan = await _context.SubscriptionPlans.FindAsync(id);
        if (plan == null) return NotFound();
        return Ok(MapToDto(plan));
    }

   
    [HttpPost("plans")]
    public async Task<ActionResult<SubscriptionPlanDto>> CreatePlan(CreateSubscriptionPlanDto dto)
    {
        var plan = new SubscriptionPlan
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Duration = dto.Duration,
            Features = dto.Features,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _context.SubscriptionPlans.Add(plan);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPlan), new { id = plan.Id }, MapToDto(plan));
    }

    
    [HttpPut("plans/{id}")]
    public async Task<ActionResult<SubscriptionPlanDto>> UpdatePlan(Guid id, UpdateSubscriptionPlanDto dto)
    {
        var plan = await _context.SubscriptionPlans.FindAsync(id);
        if (plan == null) return NotFound();

        if (dto.Name != null) plan.Name = dto.Name;
        if (dto.Description != null) plan.Description = dto.Description;
        if (dto.Price.HasValue) plan.Price = dto.Price.Value;
        if (dto.Duration.HasValue) plan.Duration = dto.Duration.Value;
        if (dto.Features != null) plan.Features = dto.Features;
        if (dto.IsActive.HasValue) plan.IsActive = dto.IsActive.Value;

        await _context.SaveChangesAsync();
        return Ok(MapToDto(plan));
    }

   
    [HttpDelete("plans/{id}")]
    public async Task<IActionResult> DeletePlan(Guid id)
    {
        var plan = await _context.SubscriptionPlans.FindAsync(id);
        if (plan == null) return NotFound();

        _context.SubscriptionPlans.Remove(plan);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private static SubscriptionPlanDto MapToDto(SubscriptionPlan plan) => new()
    {
        Id = plan.Id,
        Name = plan.Name,
        Description = plan.Description,
        Price = plan.Price,
        Duration = plan.Duration,
        Features = plan.Features,
        IsActive = plan.IsActive,
        CreatedAt = plan.CreatedAt
    };
}
