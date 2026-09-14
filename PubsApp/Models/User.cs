using System.ComponentModel.DataAnnotations;

namespace PubsApp.Models
{
    public partial class User
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public byte[] PasswordHash { get; set; } = null!;
        public byte[] PasswordSalt { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
}