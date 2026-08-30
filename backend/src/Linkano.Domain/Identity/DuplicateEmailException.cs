using Linkano.Domain.Common;

namespace Linkano.Domain.Identity;

public sealed class DuplicateEmailException : DomainException
{
    public string Email { get; }

    public DuplicateEmailException(string email)
        : base($"User with email '{email}' already exists.")
    {
        Email = email;
    }
}