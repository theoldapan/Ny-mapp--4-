using HPCDSystem.Data;
using HPCDSystem.DTOs;
using HPCDSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HPCDSystem.Controllers
{
    [ApiController]
    [Route("api/members")]
    public class MembersAuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public MembersAuthController(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] MemberLoginDto dto)
        {
            var member = await _context.Members
                .FirstOrDefaultAsync(m => m.Email == dto.Email);

            if (member == null)
                return Unauthorized(new { message = "Invalid email or password" });

            
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, member.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("id", member.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, member.Id.ToString()),
                new Claim(ClaimTypes.Email, member.Email),
                new Claim(ClaimTypes.GivenName, member.FirstName),
                new Claim(ClaimTypes.Surname, member.LastName),
                new Claim(ClaimTypes.Role, "Member")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(30),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                member = new
                {
                    id = member.Id.ToString(),
                    email = member.Email,
                    firstName = member.FirstName,
                    lastName = member.LastName,
                    phone = member.Phone,
                    dateOfBirth = member.DateOfBirth.ToString("yyyy-MM-dd"),
                    gender = member.Gender,
                    address = member.Address,
                    city = member.City,
                    postalCode = member.PostalCode,
                    membershipStatus = member.MembershipStatus,
                    joinDate = member.JoinDate.ToString("o"),
                    subscriptionId = member.SubscriptionId?.ToString(),
                    profileImage = member.ProfileImage,
                    emergencyContact = member.EmergencyContact,
                    emergencyPhone = member.EmergencyPhone,
                    notes = member.Notes
                },
                token = jwt
            });
        }

        
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] MemberRegisterDto dto)
        {
            
            if (await _context.Members.AnyAsync(m => m.Email == dto.Email))
                return BadRequest(new { message = "Email already exists" });

            
            if (dto.DateOfBirth >= DateTime.UtcNow)
                return BadRequest(new { message = "Date of birth must be in the past" });

            

            var member = new Member
            {
                Id = Guid.NewGuid(),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                DateOfBirth = dto.DateOfBirth,
                Gender = dto.Gender,
                Address = dto.Address ?? "",
                City = dto.City ?? "",
                PostalCode = dto.PostalCode ?? "",
                MembershipStatus = "Active",
                JoinDate = DateTime.UtcNow
            };

            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, member.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("id", member.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, member.Id.ToString()),
                new Claim(ClaimTypes.Email, member.Email),
                new Claim(ClaimTypes.GivenName, member.FirstName),
                new Claim(ClaimTypes.Surname, member.LastName),
                new Claim(ClaimTypes.Role, "Member")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(30),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                member = new
                {
                    id = member.Id.ToString(),
                    email = member.Email,
                    firstName = member.FirstName,
                    lastName = member.LastName,
                    phone = member.Phone,
                    dateOfBirth = member.DateOfBirth.ToString("yyyy-MM-dd"),
                    gender = member.Gender,
                    address = member.Address,
                    city = member.City,
                    postalCode = member.PostalCode,
                    membershipStatus = member.MembershipStatus,
                    joinDate = member.JoinDate.ToString("o"),
                    subscriptionId = member.SubscriptionId?.ToString(),
                    profileImage = member.ProfileImage,
                    emergencyContact = member.EmergencyContact,
                    emergencyPhone = member.EmergencyPhone,
                    notes = member.Notes
                },
                token = jwt
            });
        }
    }

    
    public class MemberLoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class MemberRegisterDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? PostalCode { get; set; }
    }
}