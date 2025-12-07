using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HPCDSystem.Data;
using HPCDSystem.DTOs;
using HPCDSystem.Models;

namespace HPCDSystem.Controllers
{
    [ApiController]
    [Route("api/members")]
    [Authorize]
    public class MemberController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MemberController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/members
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetAll()
        {
            var members = await _context.Members
                .OrderByDescending(m => m.JoinDate)
                .ToListAsync();

            return Ok(members.Select(MapToDto));
        }

        // GET: api/members/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MemberDto>> GetById(Guid id)
        {
            var member = await _context.Members.FindAsync(id);

            if (member == null)
                return NotFound(new { message = "Member not found" });

            return Ok(MapToDto(member));
        }

        // POST: api/members
        [HttpPost]
        public async Task<ActionResult<MemberDto>> Create(CreateMemberDto dto)
        {
            // Check if email already exists
            if (await _context.Members.AnyAsync(m => m.Email == dto.Email))
                return BadRequest(new { message = "A member with this email already exists" });

            var member = new Member
            {
                Id = Guid.NewGuid(),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                DateOfBirth = dto.DateOfBirth,
                Gender = dto.Gender,
                Address = dto.Address,
                City = dto.City,
                PostalCode = dto.PostalCode,
                MembershipStatus = dto.MembershipStatus,
                JoinDate = DateTime.UtcNow,
                SubscriptionId = string.IsNullOrEmpty(dto.SubscriptionId) ? null : Guid.Parse(dto.SubscriptionId),
                ProfileImage = dto.ProfileImage,
                EmergencyContact = dto.EmergencyContact,
                EmergencyPhone = dto.EmergencyPhone,
                Notes = dto.Notes
            };

            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = member.Id }, MapToDto(member));
        }

        // PUT: api/members/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<MemberDto>> Update(Guid id, UpdateMemberDto dto)
        {
            var member = await _context.Members.FindAsync(id);

            if (member == null)
                return NotFound(new { message = "Member not found" });

            // Check email uniqueness if being updated
            if (dto.Email != null && dto.Email != member.Email)
            {
                if (await _context.Members.AnyAsync(m => m.Email == dto.Email))
                    return BadRequest(new { message = "A member with this email already exists" });
            }

            if (dto.FirstName != null) member.FirstName = dto.FirstName;
            if (dto.LastName != null) member.LastName = dto.LastName;
            if (dto.Email != null) member.Email = dto.Email;
            if (dto.Phone != null) member.Phone = dto.Phone;
            if (dto.DateOfBirth.HasValue) member.DateOfBirth = dto.DateOfBirth.Value;
            if (dto.Gender != null) member.Gender = dto.Gender;
            if (dto.Address != null) member.Address = dto.Address;
            if (dto.City != null) member.City = dto.City;
            if (dto.PostalCode != null) member.PostalCode = dto.PostalCode;
            if (dto.MembershipStatus != null) member.MembershipStatus = dto.MembershipStatus;
            if (dto.SubscriptionId != null) member.SubscriptionId = Guid.Parse(dto.SubscriptionId);
            if (dto.ProfileImage != null) member.ProfileImage = dto.ProfileImage;
            if (dto.EmergencyContact != null) member.EmergencyContact = dto.EmergencyContact;
            if (dto.EmergencyPhone != null) member.EmergencyPhone = dto.EmergencyPhone;
            if (dto.Notes != null) member.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            return Ok(MapToDto(member));
        }

        // DELETE: api/members/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var member = await _context.Members.FindAsync(id);

            if (member == null)
                return NotFound(new { message = "Member not found" });

            _context.Members.Remove(member);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static MemberDto MapToDto(Member member)
        {
            return new MemberDto
            {
                Id = member.Id.ToString(),
                FirstName = member.FirstName,
                LastName = member.LastName,
                Email = member.Email,
                Phone = member.Phone,
                DateOfBirth = member.DateOfBirth.ToString("yyyy-MM-dd"),
                Gender = member.Gender,
                Address = member.Address,
                City = member.City,
                PostalCode = member.PostalCode,
                MembershipStatus = member.MembershipStatus,
                JoinDate = member.JoinDate.ToString("o"),
                SubscriptionId = member.SubscriptionId?.ToString(),
                ProfileImage = member.ProfileImage,
                EmergencyContact = member.EmergencyContact,
                EmergencyPhone = member.EmergencyPhone,
                Notes = member.Notes
            };
        }
    }
}
