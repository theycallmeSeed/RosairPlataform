using Linkano.Domain.Common;

namespace Linkano.Domain.Identity;

public sealed class User : AggregateRoot
{
    private User(
        Guid id,
        string email,
        string phoneNumber,
        string passwordHash,
        UserRole role,
        string fullName,
        string? companyName,
        UserStatus status)
        : base(id)
    {
        Email = email;
        PhoneNumber = phoneNumber;
        PasswordHash = passwordHash;
        Role = role;
        FullName = fullName;
        CompanyName = companyName;
        Status = status;
    }

    public string Email { get; private set; }

    public string PhoneNumber { get; private set; }

    public string PasswordHash { get; private set; }

    public UserRole Role { get; private set; }

    public string FullName { get; private set; }

    public string? CompanyName { get; private set; }

    public UserStatus Status { get; private set; }

    public static User Create(
        string email,
        string phoneNumber,
        string passwordHash,
        UserRole role,
        string fullName,
        UserStatus status,
        string? companyName = null)
    {
        return new User(Guid.NewGuid(), email, phoneNumber, passwordHash, role, fullName, companyName, status);
    }

    public void UpdateProfile(string fullName, string? companyName)
    {
        FullName = fullName;
        CompanyName = companyName;
        SetUpdatedNow();
    }

    public void UpdateContactInfo(string email, string phoneNumber)
    {
        Email = email;
        PhoneNumber = phoneNumber;
        SetUpdatedNow();
    }

    public void ChangePasswordHash(string passwordHash)
    {
        PasswordHash = passwordHash;
        SetUpdatedNow();
    }

    public void ChangeStatus(UserStatus status)
    {
        Status = status;
        SetUpdatedNow();
    }
}
