namespace Linkano.Domain.Common;

public sealed class Address : ValueObject
{
    private Address(string street, string city, string province, string country, string? postalCode)
    {
        Street = street;
        City = city;
        Province = province;
        Country = country;
        PostalCode = postalCode;
    }

    public string Street { get; }

    public string City { get; }

    public string Province { get; }

    public string Country { get; }

    public string? PostalCode { get; }

    public static Address Create(string street, string city, string province, string country, string? postalCode = null)
    {
        return new Address(street, city, province, country, postalCode);
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Street;
        yield return City;
        yield return Province;
        yield return Country;
        yield return PostalCode;
    }
}
