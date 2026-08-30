using Linkano.Domain.Common;

namespace Linkano.Domain.Identity;

public sealed class DuplicatePhoneNumberException : DomainException
{
    public string PhoneNumber { get; }

    public DuplicatePhoneNumberException(string phoneNumber)
        : base($"User with phone number '{phoneNumber}' already exists.")
    {
        PhoneNumber = phoneNumber;
    }
}