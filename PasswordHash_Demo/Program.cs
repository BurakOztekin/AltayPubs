/*********************************************************************
 * Safe Password Hashing
 * Written by: Mustafa Tütüncü, June 2024
 * Used hashing algorithm: PBKDF2
 * Alternative safe algorithms: BCrypt/SCrypt, Argon2
*********************************************************************/

using System.Security.Cryptography;
using System.Text;

namespace PasswordHash_Demo
{
    internal class Program
    {
        const string password = "Sivaslı58*?";
        const int keySize = 32;
        const int iterations = 35000;
        static readonly HashAlgorithmName hashAlgorithm = HashAlgorithmName.SHA512;

        static void Main(string[] args)
        {
            // We must not hold clear password on Database
            // Instead, hashHex and saltHex values (64 byte long = 2*keySize) will be stored with Username on Database
            var hashHex = CalculateHashFromPasword(password, out var salt, iterations, hashAlgorithm, keySize);
            var saltHex = Convert.ToHexString(salt);
            Console.WriteLine($"Password hash: {hashHex}");
            Console.WriteLine($"Password hash length: {hashHex.Length}");
            Console.WriteLine($"Generated salt (HexString): {saltHex}");
            Console.WriteLine($"Generated salt length (HexString): {saltHex.Length}");
            //Console.WriteLine($"Generated salt (Base64String): {Convert.ToBase64String(salt)}");
            //Console.WriteLine($"Generated salt length (Base64String): {(Convert.ToBase64String(salt)).Length}");
            var result1 = VerifyPassword(password, hashHex, Convert.FromHexString(saltHex), iterations, hashAlgorithm, keySize);
            Console.WriteLine($"Same password verification: {result1}");
            var result2 = VerifyPassword(password + "0", hashHex, Convert.FromHexString(saltHex), iterations, hashAlgorithm, keySize);
            Console.WriteLine($"Different password verification: {result2}");
        }

        static string CalculateHashFromPasword(string password, out byte[] salt, int iterations, HashAlgorithmName hashAlgorithm, int keySize)
        {
            salt = RandomNumberGenerator.GetBytes(keySize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(password),
                salt,
                iterations,
                hashAlgorithm,
                keySize);
            return Convert.ToHexString(hash);
        }

        static bool VerifyPassword(string password, string hashHex, byte[] salt, int iterations, HashAlgorithmName hashAlgorithm, int keySize)
        {
            var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, hashAlgorithm, keySize);
            return CryptographicOperations.FixedTimeEquals(hashToCompare, Convert.FromHexString(hashHex));
        }

    }
}
