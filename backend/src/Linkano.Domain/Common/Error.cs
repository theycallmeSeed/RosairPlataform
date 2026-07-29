namespace Linkano.Domain.Common;

public sealed class Error : IEquatable<Error>
{
    public static readonly Error None = new(string.Empty, string.Empty);

    public string Code { get; }

    public string Message { get; }

    public Error(string code, string message)
    {
        Code = code;
        Message = message;
    }

    public bool Equals(Error? other)
    {
        if (other is null)
        {
            return false;
        }

        return Code == other.Code && Message == other.Message;
    }

    public override bool Equals(object? obj) => Equals(obj as Error);

    public override int GetHashCode() => HashCode.Combine(Code, Message);

    public static bool operator ==(Error? left, Error? right)
    {
        if (left is null && right is null)
        {
            return true;
        }

        if (left is null || right is null)
        {
            return false;
        }

        return left.Equals(right);
    }

    public static bool operator !=(Error? left, Error? right) => !(left == right);
}
