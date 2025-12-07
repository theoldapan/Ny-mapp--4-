using HPCDSystem.Data;
using HPCDSystem.DTOs;
using HPCDSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HPCDSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            var result = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new UserDto
                {
                    Id = user.Id,
                    Email = user.Email ?? "",
                    PhoneNumber = user.PhoneNumber,
                    FirstName = user.FirstName ?? "",
                    LastName = user.LastName ?? "",
                    Gender = user.Gender,
                    DateOfBirth = user.DateOfBirth,
                    Role = roles.FirstOrDefault() ?? "User",
                    IsEmailConfirmed = user.EmailConfirmed,
                    CreatedAt = user.CreatedAt,
                    LastLogin = user.LastLogin,
                    Address = user.StreetAddress,
                    City = user.City,
                    ZipCode = user.ZipCode,
                    Country = user.Country
                });
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("Email is required.");

            if (string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Password is required.");

            if (await _userManager.FindByEmailAsync(dto.Email) != null)
                return BadRequest("Email is already in use.");

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Gender = dto.Gender,
                DateOfBirth = dto.DateOfBirth,
                StreetAddress = dto.Address,
                City = dto.City,
                ZipCode = dto.ZipCode,
                Country = dto.Country,
                CreatedAt = DateTime.UtcNow,
                EmailConfirmed = dto.IsEmailConfirmed
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e => e.Description));

            if (!await _roleManager.RoleExistsAsync(dto.Role))
                await _roleManager.CreateAsync(new IdentityRole(dto.Role));

            await _userManager.AddToRoleAsync(user, dto.Role);
            return Ok(new UserDto {
    Id = user.Id,
    Email = user.Email,
    FirstName = user.FirstName,
    LastName = user.LastName,
    Role = user.Role,
    CreatedAt = user.CreatedAt
});


        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("User not found.");

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Email = dto.Email;
            user.UserName = dto.Email;
            user.PhoneNumber = dto.PhoneNumber;
            user.StreetAddress = dto.Address;
            user.City = dto.City;
            user.ZipCode = dto.ZipCode;
            user.Country = dto.Country;
            user.Gender = dto.Gender;
            user.DateOfBirth = dto.DateOfBirth;


            if (!string.IsNullOrEmpty(dto.CurrentPassword) && !string.IsNullOrEmpty(dto.NewPassword))
            {
                var passwordResult = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
                if (!passwordResult.Succeeded)
                    return BadRequest(passwordResult.Errors.Select(e => e.Description));
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e => e.Description));

            var currentRoles = await _userManager.GetRolesAsync(user);
            if (!currentRoles.Contains(dto.Role))
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
                await _userManager.AddToRoleAsync(user, dto.Role);
            }

var roles = await _userManager.GetRolesAsync(user);
return Ok(new UserDto {
    Id = user.Id,
    Email = user.Email,
    FirstName = user.FirstName,
    LastName = user.LastName,
    Role = user.Role,
    CreatedAt = user.CreatedAt
});


        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            await _userManager.DeleteAsync(user);
            return NoContent();
        }
    }
}
