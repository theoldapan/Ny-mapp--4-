using HPCDSystem.Data;
using HPCDSystem.DTOs;
using HPCDSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HPCDSystem.Controllers;

[ApiController]
[Route("api/facilities")]
[Authorize]
public class FacilityController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FacilityController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FacilityDto>>> GetAll()
    {
        var facilities = await _context.Facilities.ToListAsync();
        return Ok(facilities.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FacilityDto>> GetById(Guid id)
    {
        var facility = await _context.Facilities.FindAsync(id);
        if (facility == null) return NotFound();
        return Ok(MapToDto(facility));
    }

    [HttpPost]
    public async Task<ActionResult<FacilityDto>> Create(CreateFacilityDto dto)
    {
        var facility = new Facility
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description,
            City = dto.City,
            Address = dto.Address,
            PostalCode = dto.PostalCode,
            Phone = dto.Phone,
            Email = dto.Email,
            Status = dto.Status,
            OpeningHours = dto.OpeningHours,
            MemberCount = 0,
            ManagerId = dto.ManagerId,
            ManagerName = dto.ManagerName,
            Image = dto.Image
        };

        _context.Facilities.Add(facility);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = facility.Id }, MapToDto(facility));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<FacilityDto>> Update(Guid id, UpdateFacilityDto dto)
    {
        var facility = await _context.Facilities.FindAsync(id);
        if (facility == null) return NotFound();

        if (dto.Name != null) facility.Name = dto.Name;
        if (dto.Description != null) facility.Description = dto.Description;
        if (dto.City != null) facility.City = dto.City;
        if (dto.Address != null) facility.Address = dto.Address;
        if (dto.PostalCode != null) facility.PostalCode = dto.PostalCode;
        if (dto.Phone != null) facility.Phone = dto.Phone;
        if (dto.Email != null) facility.Email = dto.Email;
        if (dto.Status != null) facility.Status = dto.Status;
        if (dto.OpeningHours != null) facility.OpeningHours = dto.OpeningHours;
        if (dto.ManagerId.HasValue) facility.ManagerId = dto.ManagerId;
        if (dto.ManagerName != null) facility.ManagerName = dto.ManagerName;
        if (dto.Image != null) facility.Image = dto.Image;

        await _context.SaveChangesAsync();
        return Ok(MapToDto(facility));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var facility = await _context.Facilities.FindAsync(id);
        if (facility == null) return NotFound();

        _context.Facilities.Remove(facility);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private static FacilityDto MapToDto(Facility f) => new()
    {
        Id = f.Id,
        Name = f.Name,
        Description = f.Description,
        City = f.City,
        Address = f.Address,
        PostalCode = f.PostalCode,
        Phone = f.Phone,
        Email = f.Email,
        Status = f.Status,
        OpeningHours = f.OpeningHours,
        MemberCount = f.MemberCount,
        ManagerId = f.ManagerId,
        ManagerName = f.ManagerName,
        Image = f.Image
    };
}
