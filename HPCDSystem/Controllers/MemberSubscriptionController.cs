using HPCDSystem.Data;
using HPCDSystem.DTOs;
using HPCDSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HPCDSystem.Controllers;

[ApiController]
[Route("api/member-subscriptions")]
[Authorize]
public class MemberSubscriptionController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MemberSubscriptionController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberSubscriptionDto>>> GetAll()
    {
        var subs = await _context.MemberSubscriptions.ToListAsync();
        return Ok(subs.Select(MapToDto));
    }

    [HttpGet("member/{memberId}")]
    public async Task<ActionResult<MemberSubscriptionDto>> GetByMember(Guid memberId)
    {
        var sub = await _context.MemberSubscriptions
            .FirstOrDefaultAsync(s => s.MemberId == memberId);
        if (sub == null) return NotFound();
        return Ok(MapToDto(sub));
    }

    [HttpPost]
    public async Task<ActionResult<MemberSubscriptionDto>> Create(CreateMemberSubscriptionDto dto)
    {
        var sub = new MemberSubscription
        {
            Id = Guid.NewGuid(),
            MemberId = dto.MemberId,
            PlanId = dto.PlanId,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Status = dto.Status,
            PaymentStatus = dto.PaymentStatus
        };

        _context.MemberSubscriptions.Add(sub);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetByMember), new { memberId = sub.MemberId }, MapToDto(sub));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<MemberSubscriptionDto>> Update(Guid id, CreateMemberSubscriptionDto dto)
    {
        var sub = await _context.MemberSubscriptions.FindAsync(id);
        if (sub == null) return NotFound();

        sub.PlanId = dto.PlanId;
        sub.StartDate = dto.StartDate;
        sub.EndDate = dto.EndDate;
        sub.Status = dto.Status;
        sub.PaymentStatus = dto.PaymentStatus;

        await _context.SaveChangesAsync();
        return Ok(MapToDto(sub));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var sub = await _context.MemberSubscriptions.FindAsync(id);
        if (sub == null) return NotFound();

        _context.MemberSubscriptions.Remove(sub);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private static MemberSubscriptionDto MapToDto(MemberSubscription s) => new()
    {
        Id = s.Id,
        MemberId = s.MemberId,
        PlanId = s.PlanId,
        StartDate = s.StartDate,
        EndDate = s.EndDate,
        Status = s.Status,
        PaymentStatus = s.PaymentStatus
    };
}
