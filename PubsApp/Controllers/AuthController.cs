using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PubsApp.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace PubsApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly PubsContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(PubsContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register-admin")]
        public IActionResult RegisterAdmin()
        {
            if (_context.Users.Any(u => u.Username == "admin"))
                return BadRequest("Admin user already exists.");

            CreatePasswordHash("Adm2025!", out byte[] passwordHash, out byte[] passwordSalt);

            var user = new User
            {
                Username = "admin",
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                Role = "Admin"
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("Admin user created successfully.");
        }

        [HttpPost("register-user")]
        public IActionResult RegisterUser()
        {
            if (_context.Users.Any(u => u.Username == "standartuser"))
                return BadRequest("User already exists.");

            using var hmac = new System.Security.Cryptography.HMACSHA512();
            var user = new User
            {
                Username = "standartuser",
                PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes("User2025!")),
                PasswordSalt = hmac.Key,
                Role = "User"
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("Standard user created successfully.");
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            var users = _context.Users
                .Select(u => new { u.Id, u.Username, u.Role })
                .ToList();

            return Ok(users);
        }
      
        [HttpPost("login")]
        public IActionResult Login(UserLoginDto request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == request.Username);
            if (user == null)
                return BadRequest("User not found.");

            if (!VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
                return BadRequest("Invalid password.");

            string token = CreateToken(user);
            return Ok(new { Token = token, Role = user.Role });
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            passwordSalt = System.Security.Cryptography.RandomNumberGenerator.GetBytes(16);

            using (var pbkdf2 = new System.Security.Cryptography.Rfc2898DeriveBytes(password, passwordSalt, 35000, System.Security.Cryptography.HashAlgorithmName.SHA512))
            {
                passwordHash = pbkdf2.GetBytes(32);
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var pbkdf2 = new System.Security.Cryptography.Rfc2898DeriveBytes(password, passwordSalt, 35000, System.Security.Cryptography.HashAlgorithmName.SHA512))
            {
                var computedHash = pbkdf2.GetBytes(32);
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        private string CreateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class UserLoginDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}